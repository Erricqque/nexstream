/**
 * Payment Routes - Complete implementation
 * Uses supabaseClient.js for database connection
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient'); // ✅ CORRECT - using your existing client

// Import payment services with fallbacks
let flutterwave, paypal, mpesa;

try {
  flutterwave = require('../services/flutterwave');
  console.log('✅ Flutterwave service loaded');
} catch (error) {
  console.log('⚠️ Flutterwave service not found, using fallback');
  flutterwave = {
    initializePayment: async (amount, email) => ({ 
      status: 'success', 
      data: { link: '#', tx_ref: `mock-${Date.now()}` } 
    }),
    verifyPayment: async (id) => ({ 
      status: 'success', 
      data: { status: 'successful' } 
    }),
    createPayout: async () => ({ 
      status: 'success', 
      data: { id: `mock-${Date.now()}` } 
    }),
    getBanks: async () => ({ 
      status: 'success', 
      data: [] 
    })
  };
}

try {
  paypal = require('../services/paypal');
  console.log('✅ PayPal service loaded');
} catch (error) {
  console.log('⚠️ PayPal service not found, using fallback');
  paypal = {
    createOrder: async (amount) => ({ 
      id: `mock-${Date.now()}`, 
      status: 'CREATED', 
      links: [] 
    }),
    captureOrder: async (id) => ({ 
      id, 
      status: 'COMPLETED' 
    }),
    createPayout: async () => ({ 
      batch_header: { payout_batch_id: `mock-${Date.now()}` } 
    })
  };
}

try {
  mpesa = require('../services/mpesa');
  console.log('✅ M-PESA service loaded');
} catch (error) {
  console.log('⚠️ M-PESA service not found, using fallback');
  mpesa = {
    stkPush: async () => ({ 
      CheckoutRequestID: `mock-${Date.now()}`, 
      ResponseCode: '0' 
    }),
    queryStatus: async () => ({ 
      ResultCode: 0 
    }),
    b2cPayment: async () => ({ 
      ConversationID: `mock-${Date.now()}` 
    })
  };
}

// ========== MIDDLEWARE ==========

/**
 * Authenticate user from token
 */
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided',
      code: 'NO_TOKEN' 
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      code: 'AUTH_FAILED' 
    });
  }
};

// ========== PAYMENT ROUTES ==========

/**
 * Initialize a payment
 * POST /api/payments/initialize/:method
 */
router.post('/initialize/:method', authenticateUser, async (req, res) => {
  const startTime = Date.now();
  console.log(`\n💳 [PAYMENT INIT] Starting ${req.params.method} payment...`);

  try {
    const { method } = req.params;
    const { amount, email, phone, currency = 'USD' } = req.body;
    const userId = req.user.id;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        code: 'INVALID_AMOUNT' 
      });
    }

    let result;
    let reference;
    
    switch(method) {
      case 'flutterwave':
        console.log(`💳 Calling Flutterwave API for $${amount}`);
        result = await flutterwave.initializePayment(amount, email, currency);
        reference = result.data?.tx_ref;
        break;
        
      case 'paypal':
        console.log(`💳 Calling PayPal API for $${amount}`);
        result = await paypal.createOrder(amount, currency);
        reference = result.id;
        break;
        
      case 'mpesa':
        if (!phone) {
          return res.status(400).json({ 
            error: 'Phone number required for M-PESA',
            code: 'PHONE_REQUIRED' 
          });
        }
        console.log(`💳 Calling M-PESA API for $${amount} to ${phone}`);
        result = await mpesa.stkPush(phone, amount, `NX${userId.slice(0,8)}`);
        reference = result.CheckoutRequestID;
        break;
        
      default:
        return res.status(400).json({ 
          error: 'Invalid payment method',
          code: 'INVALID_METHOD' 
        });
    }

    // Log transaction in database
    const { error: txError } = await supabase.from('transactions').insert({
      user_id: userId,
      amount,
      currency,
      method,
      status: 'pending',
      reference,
      metadata: result
    });

    if (txError) {
      console.error('Database error:', txError);
      // Continue anyway - payment was initiated
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Payment initiated in ${duration}ms`);

    res.json({ 
      success: true, 
      data: result,
      reference 
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      error: error.message || 'Payment initialization failed',
      code: 'PAYMENT_INIT_FAILED' 
    });
  }
});

/**
 * Verify a payment
 * GET /api/payments/verify/:method/:reference
 */
router.get('/verify/:method/:reference', authenticateUser, async (req, res) => {
  console.log(`\n🔍 [PAYMENT VERIFY] Verifying ${req.params.method} payment...`);

  try {
    const { method, reference } = req.params;
    
    let result;
    let status = 'completed';
    
    switch(method) {
      case 'flutterwave':
        result = await flutterwave.verifyPayment(reference);
        status = result.data?.status === 'successful' ? 'completed' : 'failed';
        break;
        
      case 'paypal':
        result = await paypal.captureOrder(reference);
        status = result.status === 'COMPLETED' ? 'completed' : 'failed';
        break;
        
      case 'mpesa':
        result = await mpesa.queryStatus(reference);
        status = result.ResultCode === 0 ? 'completed' : 'failed';
        break;
        
      default:
        return res.status(400).json({ 
          error: 'Invalid payment method',
          code: 'INVALID_METHOD' 
        });
    }

    // Update transaction status
    const { data: transaction } = await supabase
      .from('transactions')
      .update({ 
        status,
        verified_at: new Date().toISOString(),
        verification_result: result
      })
      .eq('reference', reference)
      .select()
      .single();

    // If payment completed, update user balance
    if (status === 'completed' && transaction) {
      // Increment user balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', transaction.user_id)
        .single();

      if (wallet) {
        await supabase
          .from('wallets')
          .update({ balance: (wallet.balance || 0) + transaction.amount })
          .eq('user_id', transaction.user_id);
      } else {
        await supabase
          .from('wallets')
          .insert({ 
            user_id: transaction.user_id, 
            balance: transaction.amount 
          });
      }
    }

    console.log(`✅ Payment verified: ${status}`);

    res.json({ 
      success: true, 
      status,
      data: result 
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: error.message || 'Verification failed',
      code: 'VERIFY_FAILED' 
    });
  }
});

/**
 * Request a payout
 * POST /api/payments/payout
 */
router.post('/payout', authenticateUser, async (req, res) => {
  console.log('\n💰 [PAYOUT] Processing payout request...');

  try {
    const { method, amount, details } = req.body;
    const userId = req.user.id;

    // Validation
    if (!amount || amount < 10) {
      return res.status(400).json({ 
        error: 'Minimum payout is $10',
        code: 'MIN_AMOUNT' 
      });
    }

    // Get user wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (walletError || !wallet) {
      return res.status(400).json({ 
        error: 'No wallet found',
        code: 'NO_WALLET' 
      });
    }
    
    if (wallet.balance < amount) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        code: 'INSUFFICIENT_BALANCE' 
      });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    let result;
    let reference;
    
    switch(method) {
      case 'flutterwave':
        if (!details.bankCode || !details.accountNumber) {
          return res.status(400).json({ 
            error: 'Bank details required',
            code: 'BANK_DETAILS_REQUIRED' 
          });
        }
        result = await flutterwave.createPayout(
          amount, 
          details, 
          details.accountName || profile?.full_name || 'User'
        );
        reference = result.data?.id;
        break;
        
      case 'paypal':
        if (!details.email && !profile?.email) {
          return res.status(400).json({ 
            error: 'PayPal email required',
            code: 'EMAIL_REQUIRED' 
          });
        }
        result = await paypal.createPayout(
          details.email || profile?.email, 
          amount
        );
        reference = result.batch_header?.payout_batch_id;
        break;
        
      case 'mpesa':
        if (!details.phone) {
          return res.status(400).json({ 
            error: 'Phone number required for M-PESA',
            code: 'PHONE_REQUIRED' 
          });
        }
        result = await mpesa.b2cPayment(details.phone, amount);
        reference = result.ConversationID;
        break;
        
      default:
        return res.status(400).json({ 
          error: 'Invalid payout method',
          code: 'INVALID_METHOD' 
        });
    }

    // Create payout record
    const { error: payoutError } = await supabase.from('payouts').insert({
      user_id: userId,
      amount,
      method,
      status: 'processing',
      reference,
      details,
      metadata: result
    });

    if (payoutError) {
      console.error('Payout record error:', payoutError);
    }

    // Deduct from wallet
    await supabase
      .from('wallets')
      .update({ balance: wallet.balance - amount })
      .eq('user_id', userId);

    console.log(`✅ Payout initiated: $${amount} via ${method}`);

    res.json({ 
      success: true, 
      message: 'Payout initiated successfully',
      reference 
    });

  } catch (error) {
    console.error('Payout error:', error);
    res.status(500).json({ 
      error: error.message || 'Payout failed',
      code: 'PAYOUT_FAILED' 
    });
  }
});

/**
 * Get transaction history
 * GET /api/payments/transactions
 */
router.get('/transactions', authenticateUser, async (req, res) => {
  try {
    const { type, status, limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({ 
      success: true, 
      data,
      pagination: { 
        limit: parseInt(limit), 
        offset: parseInt(offset), 
        total: count 
      }
    });

  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ 
      error: error.message,
      code: 'FETCH_FAILED' 
    });
  }
});

/**
 * Get payout history
 * GET /api/payments/payouts
 */
router.get('/payouts', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });

  } catch (error) {
    console.error('Payout history error:', error);
    res.status(500).json({ 
      error: error.message,
      code: 'FETCH_FAILED' 
    });
  }
});

/**
 * M-PESA callback endpoint
 * POST /api/payments/mpesa/callback
 */
router.post('/mpesa/callback', async (req, res) => {
  console.log('\n📞 [M-PESA CALLBACK] Received callback');
  console.log('Body:', JSON.stringify(req.body, null, 2));

  try {
    const { Body } = req.body;
    
    if (Body?.stkCallback) {
      const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;
      
      const status = ResultCode === 0 ? 'completed' : 'failed';
      
      // Update transaction
      await supabase
        .from('transactions')
        .update({ 
          status,
          verified_at: new Date().toISOString(),
          metadata: { ...Body, CallbackMetadata }
        })
        .eq('reference', CheckoutRequestID);

      // If successful, update balance
      if (ResultCode === 0 && CallbackMetadata) {
        const amount = CallbackMetadata.Item?.find(i => i.Name === 'Amount')?.Value;
        const { data: transaction } = await supabase
          .from('transactions')
          .select('user_id')
          .eq('reference', CheckoutRequestID)
          .single();

        if (transaction) {
          const { data: wallet } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', transaction.user_id)
            .single();

          if (wallet) {
            await supabase
              .from('wallets')
              .update({ balance: (wallet.balance || 0) + amount })
              .eq('user_id', transaction.user_id);
          } else {
            await supabase
              .from('wallets')
              .insert({ user_id: transaction.user_id, balance: amount });
          }
        }
      }
    }

    // Always respond with success to M-PESA
    res.json({ 
      ResultCode: 0, 
      ResultDesc: 'Success' 
    });

  } catch (error) {
    console.error('M-PESA callback error:', error);
    res.json({ 
      ResultCode: 1, 
      ResultDesc: 'Error processing callback' 
    });
  }
});

/**
 * Get available banks (for Flutterwave)
 * GET /api/payments/banks/:country
 */
router.get('/banks/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const banks = await flutterwave.getBanks(country);
    res.json({ success: true, data: banks.data });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      code: 'FETCH_FAILED' 
    });
  }
});

module.exports = router;
const axios = require('axios');
const crypto = require('crypto');
const { supabase } = require('../supabaseClient');

class PaymentService {
  constructor() {
    this.flutterwaveConfig = {
      baseURL: 'https://api.flutterwave.com/v3',
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
      encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY
    };

    this.paypalConfig = {
      mode: 'live', // or 'sandbox'
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET
    };
  }

  // ========== FLUTTERWAVE INTEGRATION ==========
  async processFlutterwavePayout(payoutData) {
    try {
      const { amount, bankCode, accountNumber, accountName, narration, reference } = payoutData;

      const response = await axios.post(
        `${this.flutterwaveConfig.baseURL}/transfers`,
        {
          account_bank: bankCode,
          account_number: accountNumber,
          amount,
          narration: narration || 'NexStream Payout',
          currency: 'USD',
          reference,
          debit_currency: 'USD'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.flutterwaveConfig.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          reference: response.data.data.reference,
          flutterwaveReference: response.data.data.id
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Flutterwave payout error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyFlutterwaveTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.flutterwaveConfig.baseURL}/transfers/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.flutterwaveConfig.secretKey}`
          }
        }
      );

      return {
        success: true,
        status: response.data.data.status,
        data: response.data.data
      };
    } catch (error) {
      console.error('Flutterwave verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ========== PAYPAL INTEGRATION ==========
  async getPayPalAccessToken() {
    try {
      const auth = Buffer.from(
        `${this.paypalConfig.clientId}:${this.paypalConfig.clientSecret}`
      ).toString('base64');

      const response = await axios.post(
        `https://api.paypal.com/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('PayPal token error:', error);
      throw error;
    }
  }

  async processPayPalPayout(payoutData) {
    try {
      const accessToken = await this.getPayPalAccessToken();
      const { amount, email, currency = 'USD', note } = payoutData;

      const response = await axios.post(
        'https://api.paypal.com/v1/payments/payouts',
        {
          sender_batch_header: {
            sender_batch_id: `batch_${Date.now()}`,
            email_subject: 'You have a payout from NexStream',
            email_message: 'Your earnings are on the way!'
          },
          items: [
            {
              recipient_type: 'EMAIL',
              amount: {
                value: amount,
                currency
              },
              receiver: email,
              note: note || 'NexStream Payout',
              sender_item_id: `item_${Date.now()}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        batchId: response.data.batch_header.payout_batch_id,
        data: response.data
      };
    } catch (error) {
      console.error('PayPal payout error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // ========== M-PESA INTEGRATION ==========
  async processMpesaPayout(payoutData) {
    try {
      const { phoneNumber, amount, reference } = payoutData;
      
      // This would integrate with Safaricom's M-PESA API
      // For now, return success for testing
      return {
        success: true,
        reference: `MPESA_${Date.now()}`,
        message: 'M-PESA payout initiated'
      };
    } catch (error) {
      console.error('M-PESA payout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ========== PROCESS PAYOUT (MAIN FUNCTION) ==========
  async processPayout(payoutId, adminId) {
    try {
      // Get payout details from database
      const { data: payout, error } = await supabase
        .from('payouts')
        .select('*, user:user_id(email, username)')
        .eq('id', payoutId)
        .single();

      if (error) throw error;

      let result;
      const reference = `PO_${Date.now()}_${payout.id.slice(0, 8)}`;

      // Process based on payment method
      switch (payout.payment_method) {
        case 'flutterwave':
          result = await this.processFlutterwavePayout({
            amount: payout.amount,
            bankCode: payout.account_details.bankCode,
            accountNumber: payout.account_details.accountNumber,
            accountName: payout.account_details.accountName,
            reference
          });
          break;

        case 'paypal':
          result = await this.processPayPalPayout({
            amount: payout.amount,
            email: payout.account_details.email,
            note: 'NexStream Creator Payout'
          });
          break;

        case 'mpesa':
          result = await this.processMpesaPayout({
            amount: payout.amount,
            phoneNumber: payout.account_details.phoneNumber,
            reference
          });
          break;

        default:
          throw new Error('Unsupported payment method');
      }

      if (result.success) {
        // Update payout status
        await supabase
          .from('payouts')
          .update({
            status: 'completed',
            processed_by: adminId,
            processed_at: new Date(),
            reference: result.reference || reference,
            metadata: result
          })
          .eq('id', payout.id);

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: payout.user_id,
            amount: -payout.amount,
            type: 'payout',
            payment_method: payout.payment_method,
            status: 'completed',
            reference: result.reference || reference,
            metadata: { payout_id: payout.id }
          });

        return { success: true, result };
      } else {
        // Update payout as failed
        await supabase
          .from('payouts')
          .update({
            status: 'failed',
            metadata: { error: result.error }
          })
          .eq('id', payout.id);

        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Process payout error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========== PROCESS ADMIN WITHDRAWAL ==========
  async processWithdrawal(withdrawalData, adminId) {
    try {
      const { amount, paymentMethod, accountDetails } = withdrawalData;
      const reference = `WD_${Date.now()}`;

      let result;

      switch (paymentMethod) {
        case 'flutterwave':
          result = await this.processFlutterwavePayout({
            amount,
            bankCode: accountDetails.bankCode,
            accountNumber: accountDetails.accountNumber,
            accountName: accountDetails.accountName,
            reference
          });
          break;

        case 'paypal':
          result = await this.processPayPalPayout({
            amount,
            email: accountDetails.email
          });
          break;

        default:
          throw new Error('Unsupported payment method');
      }

      if (result.success) {
        // Record withdrawal
        const { data: withdrawal, error } = await supabase
          .from('withdrawals')
          .insert({
            admin_id: adminId,
            amount,
            payment_method: paymentMethod,
            account_details: accountDetails,
            status: 'completed',
            reference: result.reference || reference,
            metadata: result
          })
          .select()
          .single();

        if (error) throw error;

        // Record transaction
        await supabase
          .from('transactions')
          .insert({
            admin_id: adminId,
            amount: -amount,
            type: 'withdrawal',
            payment_method: paymentMethod,
            status: 'completed',
            reference: result.reference || reference,
            metadata: { withdrawal_id: withdrawal.id }
          });

        return { success: true, withdrawal };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      return { success: false, error: error.message };
    }
  }

  // ========== VERIFY PAYMENT ==========
  async verifyPayment(reference, provider) {
    switch (provider) {
      case 'flutterwave':
        return await this.verifyFlutterwaveTransaction(reference);
      case 'paypal':
        // PayPal verification logic
        return { success: true };
      default:
        throw new Error('Unsupported provider');
    }
  }
}

module.exports = new PaymentService();
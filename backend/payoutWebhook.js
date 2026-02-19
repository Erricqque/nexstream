// payoutWebhook.js - Handle payout callbacks from Flutterwave and PayPal
const { supabase } = require('./supabaseClient');

// Handle Flutterwave webhook events
async function handleFlutterwaveWebhook(req, res) {
  const event = req.body;
  console.log('📨 Flutterwave webhook received:', event.event);

  try {
    // Handle different webhook events
    switch (event.event) {
      case 'transfer.completed':
        const transfer = event.data;
        
        // Update withdrawal status in database
        const { error } = await supabase
          .from('withdrawals')
          .update({ 
            status: 'completed',
            transaction_id: transfer.id,
            completed_at: new Date().toISOString()
          })
          .eq('reference', transfer.reference);

        if (error) {
          console.error('❌ Database update error:', error);
        } else {
          console.log(`✅ Withdrawal ${transfer.reference} completed`);
        }
        break;

      case 'transfer.failed':
        const failedTransfer = event.data;
        
        await supabase
          .from('withdrawals')
          .update({ 
            status: 'failed',
            error: failedTransfer.complete_message || 'Transfer failed',
            failed_at: new Date().toISOString()
          })
          .eq('reference', failedTransfer.reference);
        
        console.log(`❌ Withdrawal ${failedTransfer.reference} failed`);
        break;

      default:
        console.log('ℹ️ Unhandled Flutterwave event:', event.event);
    }

    // Always acknowledge receipt
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('❌ Flutterwave webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Handle PayPal webhook events
async function handlePayPalWebhook(req, res) {
  const event = req.body;
  console.log('📨 PayPal webhook received:', event.event_type);

  try {
    // Handle different PayPal events
    if (event.event_type === 'PAYMENT.PAYOUTSBATCH.SUCCESS' ||
        event.event_type === 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED') {
      
      const batchId = event.resource?.batch_header?.payout_batch_id;
      
      if (batchId) {
        await supabase
          .from('withdrawals')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('reference', batchId);
        
        console.log(`✅ PayPal payout ${batchId} completed`);
      }
    }

    if (event.event_type === 'PAYMENT.PAYOUTSBATCH.DENIED' ||
        event.event_type === 'PAYMENT.PAYOUTS-ITEM.FAILED') {
      
      const batchId = event.resource?.batch_header?.payout_batch_id;
      
      if (batchId) {
        await supabase
          .from('withdrawals')
          .update({ 
            status: 'failed',
            failed_at: new Date().toISOString()
          })
          .eq('reference', batchId);
        
        console.log(`❌ PayPal payout ${batchId} failed`);
      }
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('❌ PayPal webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}

// Test webhook endpoint (for manual testing)
async function testWebhook(req, res) {
  console.log('🧪 Test webhook received:', req.body);
  res.status(200).json({ 
    status: 'success', 
    message: 'Webhook test successful',
    received: req.body 
  });
}

// Export all functions
module.exports = { 
  handleFlutterwaveWebhook, 
  handlePayPalWebhook,
  testWebhook 
};
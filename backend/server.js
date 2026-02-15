const express = require('express');
const aiChatRouter = require('./ai-chat');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/ai', aiChatRouter);

// Your secret hash from Flutterwave dashboard
// CHANGE THIS to whatever you set in Flutterwave
const SECRET_HASH = 'MyNexStreamSecret123';

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'NexStream Webhook Server is running',
    time: new Date().toISOString()
  });
});

// Webhook endpoint for Flutterwave
app.post('/api/webhook/flutterwave', (req, res) => {
  console.log('\n🔔 Webhook received at:', new Date().toISOString());
  
  // Get signature from headers
  const signature = req.headers['verif-hash'];
  
  console.log('Signature:', signature);
  
  // Verify it's from Flutterwave
  if (!signature || signature !== SECRET_HASH) {
    console.log('❌ Invalid signature');
    return res.status(401).json({ 
      status: 'error', 
      message: 'Unauthorized' 
    });
  }

  // Get the webhook data
  const event = req.body;
  console.log('✅ Valid webhook!');
  console.log('Event type:', event.event);
  
  // Handle different event types
  if (event.event === 'charge.completed') {
    const tx = event.data;
    console.log('💰 PAYMENT SUCCESSFUL!');
    console.log('Transaction ID:', tx.id);
    console.log('Amount:', tx.amount, tx.currency);
    console.log('Customer:', tx.customer?.email);
    console.log('Reference:', tx.tx_ref);
    
    // TODO: Update your database here
    // You would update Supabase that this user purchased the content
  }

  // Always acknowledge receipt
  res.status(200).json({ status: 'success' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook Server running on port ${PORT}`);
  console.log(`📍 Webhook URL: http://localhost:${PORT}/api/webhook/flutterwave`);
});
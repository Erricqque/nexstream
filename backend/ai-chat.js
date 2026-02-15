const express = require('express');
const router = express.Router();

// Mock responses for NexStream platform
const knowledgeBase = {
  'create channel': 'To create a channel, go to your Dashboard and click "Create Channel". Fill in your channel name, description, and category. Once created, you can start uploading content immediately!',
  'upload content': 'You can upload content by going to the Upload page. You can upload videos, music, games, or even record directly from your camera. Supported formats: MP4, MOV, MP3, JPG (Max 500MB).',
  'earn money': 'Creators earn money through: 1️⃣ Content sales (you set the price) 2️⃣ Subscriptions 3️⃣ Tips from fans 4️⃣ MLM commissions from referrals. You keep 70% of all revenue!',
  'commission': 'Our MLM system pays commissions on 3 levels:\n• Level 1 (direct referrals): 10%\n• Level 2 (referrals of referrals): 5%\n• Level 3: 2.5%\nCommissions are paid automatically when your referrals make purchases.',
  'payment': 'We use Flutterwave for payments. Supported methods:\n• International Cards (Visa/Mastercard/Amex)\n• M-Pesa (Tanzania/Kenya)\n• Tigo Pesa\n• Airtel Money\n• Bank transfers\nPayouts are processed weekly.',
  'sub-admin': 'Sub-admins are channel managers who can:\n• Set content prices\n• Approve content\n• Manage channel settings\n• View analytics\nContact super admin to become a sub-admin.',
  'verified creator': 'Verified creators get:\n• Verified badge on your channel\n• Higher revenue share (75% instead of 70%)\n• Priority support\n• Featured in trending sections\nApply through your Dashboard.',
  'hello': '👋 Hello! How can I help you with NexStream today?',
  'help': 'I can help you with:\n• Creating channels\n• Uploading content\n• Earnings and commissions\n• Payment processing\n• Becoming a creator\n• MLM network marketing\nWhat would you like to know?',
  'mlm': 'Our MLM (Multi-Level Marketing) system allows you to earn from referrals:\n\n💰 Level 1 (direct referrals): 10% of their earnings\n💰 Level 2: 5% of their referrals\' earnings\n💰 Level 3: 2.5% of their referrals\' referrals\' earnings\n\nCommissions are automatically calculated and added to your wallet!',
  'channel': 'Channels are your space on NexStream. You can:\n• Customize with logo and banner\n• Upload content\n• Gain subscribers\n• Track analytics\n• Set content prices\nCreate your channel from the Dashboard!',
  'content': 'Content types supported:\n🎬 Videos (MP4, MOV, AVI)\n🎵 Music (MP3, WAV, FLAC)\n🎮 Games (HTML5, ZIP)\n📸 Images (JPG, PNG)\nYou can upload from device or record directly in browser!',
  'withdraw': 'To withdraw your earnings:\n1️⃣ Go to your Dashboard\n2️⃣ Click "Wallet" or "Earnings"\n3️⃣ Click "Withdraw"\n4️⃣ Choose your payment method\n5️⃣ Enter amount (minimum $50)\nFunds arrive within 1-3 business days!',
  'referral': 'Referral program benefits:\n• Earn 10% from direct referrals\n• Earn 5% from level 2 referrals\n• Earn 2.5% from level 3 referrals\n• No limit on earnings\n• Share your unique referral link anywhere!'
};

// Chat endpoint
router.post('/chat/nexstream', (req, res) => {
  try {
    const { userMessage } = req.body;
    const lowerMessage = userMessage.toLowerCase();
    
    console.log('📝 User asked:', userMessage);
    
    // Find matching response
    let response = '';
    let matchedKey = '';
    
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerMessage.includes(key)) {
        response = value;
        matchedKey = key;
        break;
      }
    }
    
    // If no match found, generate helpful response
    if (!response) {
      response = `I understand you're asking about "${userMessage}". ` +
        `I'm your NexStream AI assistant and I can help with:\n\n` +
        `📌 **Platform Features:**\n` +
        `• Creating and managing channels\n` +
        `• Uploading videos, music, and games\n` +
        `• Earning money from content\n` +
        `• MLM commissions and referrals\n` +
        `• Payment methods and withdrawals\n\n` +
        `📌 **Try asking me:**\n` +
        `• "How do I create a channel?"\n` +
        `• "How much can I earn?"\n` +
        `• "What is the MLM commission?"\n` +
        `• "How do I withdraw money?"\n` +
        `• "Tell me about referrals"\n\n` +
        `What specific information are you looking for?`;
    }
    
    // Simulate AI thinking time
    setTimeout(() => {
      res.json({
        success: true,
        message: response,
        matched: matchedKey || 'general',
        usage: { total_tokens: 150 }
      });
    }, 800);
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ NexStream AI chat endpoint is working!',
    note: 'Mock AI assistant (no OpenAI required)',
    endpoints: {
      chat: 'POST /api/ai/chat/nexstream',
      test: 'GET /api/ai/test'
    }
  });
});

// Get list of topics
router.get('/topics', (req, res) => {
  const topics = Object.keys(knowledgeBase).map(key => ({
    topic: key,
    description: knowledgeBase[key].substring(0, 50) + '...'
  }));
  
  res.json({
    success: true,
    topics: topics
  });
});

module.exports = router;
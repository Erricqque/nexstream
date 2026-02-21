const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI with your provided key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    console.log('Received chat request with messages:', messages);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are NexStream AI Assistant, a helpful guide for the NexStream platform. 
          NexStream is a content creation platform where users can:
          - Upload and monetize videos, music, and games
          - Earn money through views, subscriptions, and tips
          - Build a business with MLM (Multi-Level Marketing) opportunities
          - Withdraw earnings via Flutterwave, PayPal, or M-Pesa
          - Connect with other creators in communities
          - Create playlists and manage content
          
          Be friendly, professional, and helpful. Provide specific information about NexStream features.
          If asked about topics outside NexStream, politely redirect to platform features.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('OpenAI response received');
    res.json({ 
      response: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'AI service error',
      details: error.message 
    });
  }
});

module.exports = router;
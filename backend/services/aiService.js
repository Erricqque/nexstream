const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { supabase } = require('../supabaseClient');

// Middleware to authenticate and get user
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Professional chat endpoint with RAG and caching
router.post('/chat', authenticateUser, async (req, res) => {
  try {
    const { message, options } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await aiService.generateResponse(
      req.user.id,
      message,
      options || {}
    );

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'AI service error',
      message: error.message 
    });
  }
});

// Professional streaming endpoint
router.post('/chat-stream', authenticateUser, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await aiService.generateStreamingResponse(req.user.id, message, res);

  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Get AI metrics (admin only)
router.get('/metrics', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const metrics = aiService.getMetrics();
    res.json(metrics);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear user cache
router.post('/clear-cache', authenticateUser, async (req, res) => {
  try {
    await aiService.clearUserCache(req.user.id);
    res.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get personalized tips
router.get('/tips', authenticateUser, async (req, res) => {
  try {
    const { category } = req.query;
    
    const result = await aiService.generateResponse(
      req.user.id,
      `Give me 5 quick ${category || 'general'} tips for NexStream. Keep them short and actionable.`,
      { skipCache: true }
    );

    // Parse into array
    const tips = result.response
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);

    res.json({
      success: true,
      tips,
      category: category || 'general'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  const metrics = aiService.getMetrics();
  res.json({
    status: 'healthy',
    ai: 'professional',
    metrics,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
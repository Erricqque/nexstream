// server.js - Main Backend Server for NexStream
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 5000;

// Import services
const payoutService = require('./payoutService');
const { supabase } = require('./supabaseClient');
const { handleFlutterwaveWebhook, handlePayPalWebhook, testWebhook } = require('./payoutWebhook');


// Import routes
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

// ========== SECURITY MIDDLEWARE ==========

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://nexstream.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
app.use('/api/admin', adminRoutes);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ========== REQUEST LOGGING ==========
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ========== API ROUTES ==========

// AI Assistant Routes
app.use('/api/ai', aiRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// Payout Webhook Routes
app.post('/api/webhook/flutterwave', handleFlutterwaveWebhook);
app.post('/api/webhook/paypal', handlePayPalWebhook);
app.get('/api/webhook/test', testWebhook);

// Payout Routes
app.post('/api/payout/request', async (req, res) => {
  try {
    const { userId, amount, method, accountDetails } = req.body;
    
    // Validate request
    if (!userId || !amount || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process payout using payoutService
    const result = await payoutService.processPayout(userId, amount, method, accountDetails);
    
    // Log the action
    await supabase
      .from('system_logs')
      .insert({
        log_type: 'info',
        source: 'payout',
        message: `Payout requested: $${amount} for user ${userId}`,
        details: { userId, amount, method }
      });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Payout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Earnings Routes
app.get('/api/earnings/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('earnings')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MLM Network Routes
app.get('/api/mlm/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mlm_network')
      .select(`
        *,
        downline:mlm_network!referrer_id(*)
      `)
      .eq('user_id', req.params.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wallet Routes
app.get('/api/wallet/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', req.params.userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      // Create wallet if doesn't exist
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert([{ user_id: req.params.userId, balance: 0 }])
        .select()
        .single();

      if (createError) throw createError;
      return res.json(newWallet);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Content Routes
app.get('/api/content', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/content/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url,
          bio
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    // Increment view count
    await supabase
      .from('content')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', req.params.id);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Profile Routes
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.userId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { username, full_name, bio, website, location } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username,
        full_name,
        bio,
        website,
        location,
        updated_at: new Date()
      })
      .eq('id', req.params.userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Log error to database
  supabase
    .from('system_logs')
    .insert({
      log_type: 'error',
      source: 'server',
      message: err.message,
      details: { stack: err.stack }
    })
    .then()
    .catch(console.error);

  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========== START SERVER ==========
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI routes: http://localhost:${PORT}/api/ai`);
  console.log(`🔧 Admin routes: http://localhost:${PORT}/api/admin`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
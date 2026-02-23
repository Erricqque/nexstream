// server.js - Main Backend Server for NexStream
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 5001;

// Import services
const payoutService = require('./payoutService');
const { supabase } = require('./supabaseClient');
const { handleFlutterwaveWebhook, handlePayPalWebhook, testWebhook } = require('./payoutWebhook');

// Import routes
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const viralRoutes = require('./routes/viral'); // ✅ ADDED VIRAL ROUTES

// ========== MULTER CONFIGURATION FOR FILE UPLOADS ==========
const storage = multer.memoryStorage();

// File filter with detailed validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];
  
  const extname = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only 1 file at a time
  },
  fileFilter: fileFilter
});

// ========== SECURITY MIDDLEWARE ==========

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://nexstream.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id']
}));

// Rate limiting with different limits for different routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later.' },
  skipSuccessfulRequests: true,
});

// Apply rate limiting
app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== PROFESSIONAL LOGGING ==========
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown'
    };
    
    // Color-coded console output
    const statusColor = res.statusCode >= 500 ? '\x1b[31m' : // Red
                       res.statusCode >= 400 ? '\x1b[33m' : // Yellow
                       res.statusCode >= 300 ? '\x1b[36m' : // Cyan
                       '\x1b[32m'; // Green
    
    console.log(
      `${logEntry.timestamp} - ` +
      `${statusColor}${logEntry.method} ${logEntry.path} ${logEntry.status}\x1b[0m - ` +
      `${logEntry.duration}`
    );
    
    // Log to file in production
    if (process.env.NODE_ENV === 'production') {
      fs.appendFileSync('access.log', JSON.stringify(logEntry) + '\n');
    }
  });
  
  next();
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// ========== API ROUTES ==========

// AI Assistant Routes
app.use('/api/ai', aiRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// PAYMENT ROUTES
app.use('/api/payments', paymentRoutes);

// VIRAL FEATURES ROUTES (TikTok Feed, Challenges, Mystery Box, Leaderboard)
app.use('/api/viral', viralRoutes);

// Payout Webhook Routes
app.post('/api/webhook/flutterwave', handleFlutterwaveWebhook);
app.post('/api/webhook/paypal', handlePayPalWebhook);
app.get('/api/webhook/test', testWebhook);

// Payout Routes
app.post('/api/payout/request', async (req, res) => {
  try {
    const { userId, amount, method, accountDetails } = req.body;
    
    if (!userId || !amount || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await payoutService.processPayout(userId, amount, method, accountDetails);
    
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

// ========== WALLET ROUTES ==========

// Get user wallet balance
app.get('/api/wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`💰 Fetching wallet for user: ${userId}`);

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Wallet fetch error:', error);
      throw error;
    }
    
    if (!data) {
      // Create wallet if doesn't exist
      console.log(`Creating new wallet for user: ${userId}`);
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert([{ 
          user_id: userId, 
          balance: 0,
          currency: 'USD',
          pending_payouts: 0,
          total_earned: 0,
          total_withdrawn: 0
        }])
        .select()
        .single();

      if (createError) {
        console.error('Wallet creation error:', createError);
        return res.json({
          balance: 0,
          pending_payouts: 0,
          currency: 'USD',
          total_earned: 0,
          total_withdrawn: 0
        });
      }

      return res.json(newWallet);
    }

    res.json(data);
  } catch (error) {
    console.error('Wallet route error:', error);
    res.json({
      balance: 0,
      pending_payouts: 0,
      currency: 'USD',
      total_earned: 0,
      total_withdrawn: 0
    });
  }
});

// Update wallet balance
app.post('/api/wallet/:userId/update', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, type } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ error: 'Amount and type required' });
    }

    const { data: wallet, error: fetchError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    let newBalance = wallet.balance;
    if (type === 'add') {
      newBalance += amount;
    } else if (type === 'subtract') {
      newBalance -= amount;
    }

    const { data, error } = await supabase
      .from('wallets')
      .update({ 
        balance: newBalance,
        updated_at: new Date()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, wallet: data });
  } catch (error) {
    console.error('Wallet update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add transaction
app.post('/api/wallet/:userId/transaction', async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, type, description, status = 'completed' } = req.body;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        amount,
        type,
        description,
        status,
        created_at: new Date()
      }])
      .select();

    if (error) throw error;

    res.json({ success: true, transaction: data[0] });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user transactions
app.get('/api/wallet/:userId/transactions', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

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
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== CONTENT ROUTES ==========
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
    
    await supabase
      .from('content')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', req.params.id);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== USER PROFILE ROUTES ==========

// Get user profile
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

// Update user profile
app.put('/api/profile/:userId', async (req, res) => {
  try {
    const { 
      username, 
      full_name, 
      bio, 
      website, 
      location,
      twitter,
      instagram,
      facebook,
      youtube,
      tiktok,
      soundcloud,
      spotify,
      thoughts,
      avatar_url,
      banner_url
    } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username,
        full_name,
        bio,
        website,
        location,
        twitter,
        instagram,
        facebook,
        youtube,
        tiktok,
        soundcloud,
        spotify,
        thoughts,
        avatar_url,
        banner_url,
        updated_at: new Date()
      })
      .eq('id', req.params.userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== AVATAR UPLOAD ==========
app.post('/api/profile/avatar', upload.single('avatar'), async (req, res) => {
  const startTime = Date.now();
  console.log('\n📸 [AVATAR UPLOAD] ===== START =====');
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded',
        code: 'NO_FILE'
      });
    }

    console.log(`✅ File received: ${req.file.originalname} (${(req.file.size / 1024).toFixed(2)}KB)`);

    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID required',
        code: 'NO_USER_ID'
      });
    }

    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const cleanFileName = req.file.originalname
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 20);
    const fileName = `avatars/${userId}/${timestamp}-${randomString}-${cleanFileName}${fileExt}`;

    console.log('☁️ Uploading to Supabase Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError);
      return res.status(500).json({ 
        success: false,
        error: uploadError.message,
        code: 'UPLOAD_ERROR'
      });
    }

    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);
    
    const publicUrl = `${urlData.publicUrl}?t=${timestamp}`;
    console.log('🔗 Public URL:', publicUrl);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      await supabase.storage.from('profiles').remove([fileName]);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update profile',
        code: 'DB_UPDATE_ERROR'
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✨ [COMPLETE] Upload finished in ${duration}ms`);
    console.log('================================\n');

    res.json({ 
      success: true, 
      url: publicUrl,
      message: 'Avatar uploaded successfully'
    });
    
  } catch (error) {
    console.error('❌ [FATAL ERROR]', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// ========== BANNER UPLOAD ==========
app.post('/api/profile/banner', upload.single('banner'), async (req, res) => {
  const startTime = Date.now();
  console.log('\n🖼️ [BANNER UPLOAD] ===== START =====');
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded',
        code: 'NO_FILE'
      });
    }

    console.log(`✅ File received: ${req.file.originalname} (${(req.file.size / 1024).toFixed(2)}KB)`);

    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'User ID required',
        code: 'NO_USER_ID'
      });
    }

    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const cleanFileName = req.file.originalname
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 20);
    const fileName = `banners/${userId}/${timestamp}-${randomString}-${cleanFileName}${fileExt}`;

    console.log('☁️ Uploading to Supabase Storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return res.status(500).json({ 
        success: false,
        error: uploadError.message,
        code: 'UPLOAD_ERROR'
      });
    }

    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);
    
    const publicUrl = `${urlData.publicUrl}?t=${timestamp}`;
    console.log('🔗 Public URL:', publicUrl);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        banner_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      await supabase.storage.from('profiles').remove([fileName]);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update profile',
        code: 'DB_UPDATE_ERROR'
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✨ [COMPLETE] Upload finished in ${duration}ms`);
    console.log('================================\n');

    res.json({ 
      success: true, 
      url: publicUrl,
      message: 'Banner uploaded successfully'
    });
    
  } catch (error) {
    console.error('❌ [FATAL ERROR]', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Get user balance
app.get('/api/user/balance', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    res.json({ success: true, balance: data?.balance || 0 });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== ERROR HANDLING ==========
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  // Handle specific error types
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.',
        code: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({ 
      error: 'File upload error: ' + err.message,
      code: 'UPLOAD_ERROR'
    });
  }
  
  // Log error to database (non-blocking)
  supabase
    .from('system_logs')
    .insert({
      log_type: 'error',
      source: 'server',
      message: err.message,
      details: { 
        stack: err.stack,
        timestamp: new Date().toISOString()
      }
    })
    .then()
    .catch(console.error);

  // Send appropriate response
  const statusCode = err.statusCode || 500;
  const response = { 
    error: 'Internal server error',
    code: 'SERVER_ERROR'
  };
  
  // Add details in development
  if (process.env.NODE_ENV === 'development') {
    response.message = err.message;
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
});

// ========== START SERVER ==========
const server = app.listen(PORT, () => {
  console.log('\n🚀 ==================================');
  console.log(`✅ NexStream Server v${process.env.npm_package_version || '1.0.0'}`);
  console.log(`📡 Running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI routes: http://localhost:${PORT}/api/ai`);
  console.log(`🔧 Admin routes: http://localhost:${PORT}/api/admin`);
  console.log(`💳 Payment routes: http://localhost:${PORT}/api/payments`);
  console.log(`🎬 Viral routes: http://localhost:${PORT}/api/viral`);
  console.log(`   ├─ /feed - TikTok Feed`);
  console.log(`   ├─ /challenges - Viral Challenges`);
  console.log(`   ├─ /mystery-box - Mystery Boxes`);
  console.log(`   └─ /leaderboard - Rankings`);
  console.log(`💰 Wallet routes: http://localhost:${PORT}/api/wallet/:userId`);
  console.log(`📝 Transactions: http://localhost:${PORT}/api/wallet/:userId/transactions`);
  console.log(`👤 Profile routes: http://localhost:${PORT}/api/profile/:userId`);
  console.log(`📸 Avatar upload: http://localhost:${PORT}/api/profile/avatar`);
  console.log(`🖼️ Banner upload: http://localhost:${PORT}/api/profile/banner`);
  console.log('=================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📥 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📥 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  supabase
    .from('system_logs')
    .insert({
      log_type: 'error',
      source: 'uncaughtException',
      message: err.message,
      details: { stack: err.stack }
    })
    .then()
    .catch(console.error);
  
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  supabase
    .from('system_logs')
    .insert({
      log_type: 'error',
      source: 'unhandledRejection',
      message: reason?.message || 'Unknown rejection',
      details: { reason }
    })
    .then()
    .catch(console.error);
});

module.exports = app;
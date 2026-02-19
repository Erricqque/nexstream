// server.js - Main Backend Server for NexStream
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = 5000;

// Import services
const payoutService = require('./payoutService');
const { supabase } = require('./supabaseClient');
const { handleFlutterwaveWebhook, handlePayPalWebhook, testWebhook } = require('./payoutWebhook');

// ========== SECURITY MIDDLEWARE ==========

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Global rate limiter - prevents DoS attacks
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: { 
    error: 'Too many requests from this IP, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// Email endpoint specific limiter - stricter limits
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 email requests
  message: { 
    error: 'Too many email requests, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ========== EMAIL INPUT VALIDATION ==========
const validateEmailInput = (req, res, next) => {
  const emailFields = ['to', 'from', 'cc', 'bcc', 'replyTo'];
  
  for (const field of emailFields) {
    if (req.body[field]) {
      const value = req.body[field];
      
      // Type check
      if (typeof value !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid email format - must be string' 
        });
      }
      
      // Check for excessive colons (DoS protection)
      const colonCount = (value.match(/:/g) || []).length;
      if (colonCount > 10) {
        return res.status(400).json({ 
          error: 'Invalid email format - too many colons' 
        });
      }
      
      // Check for nested groups pattern (CVE-2025-14874 protection)
      if (value.includes(':')) {
        const parts = value.split(':');
        if (parts.length > 5) {
          return res.status(400).json({ 
            error: 'Invalid email format - nested groups detected' 
          });
        }
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return res.status(400).json({ 
          error: 'Invalid email format' 
        });
      }
      
      // Check for quoted local-part attacks (CVE-2025-13033 protection)
      if (value.includes('"@')) {
        const parts = value.split('"@');
        if (parts.length > 2) {
          return res.status(400).json({ 
            error: 'Invalid email format - quoted part detected' 
          });
        }
        
        // Verify the quoted part doesn't contain external domains
        const quoted = parts[0].replace(/"/g, '');
        if (quoted.includes('@')) {
          return res.status(400).json({ 
            error: 'Invalid email format - embedded domain in quoted part' 
          });
        }
      }
    }
  }
  next();
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== BASIC ROUTES ==========
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 NexStream API is running!',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ========== USER API ENDPOINTS ==========
app.get('/api/user/profile', (req, res) => {
  res.json({
    id: '123',
    name: 'Test User',
    email: 'user@example.com',
    joined: '2024-01-01'
  });
});

app.get('/api/user/stats', (req, res) => {
  res.json({
    earnings: 1250.50,
    referrals: 23,
    content: 5,
    views: 12345
  });
});

// ========== CONTENT API ENDPOINTS ==========
app.get('/api/content/trending', (req, res) => {
  res.json({
    results: [
      { id: 1, title: 'Popular Movie 1', views: 15000 },
      { id: 2, title: 'Popular Movie 2', views: 12000 },
      { id: 3, title: 'Popular Movie 3', views: 10000 }
    ]
  });
});

// ========== NETWORK MARKETING API ==========
app.get('/api/network/referrals', (req, res) => {
  res.json({
    referrals: [
      { id: 1, name: 'John Doe', level: 1, joined: '2024-01-15', status: 'active' },
      { id: 2, name: 'Jane Smith', level: 2, joined: '2024-01-20', status: 'active' }
    ]
  });
});

app.get('/api/network/earnings', (req, res) => {
  res.json({
    level1: 45.50,
    level2: 23.20,
    level3: 8.75,
    total: 77.45
  });
});

// ========== WALLET API ==========
app.get('/api/wallet/balance', (req, res) => {
  res.json({ balance: 1250.50 });
});

app.get('/api/wallet/transactions', (req, res) => {
  res.json({
    transactions: [
      { id: 1, type: 'earning', amount: 25.50, date: '2024-02-15', status: 'completed' },
      { id: 2, type: 'withdrawal', amount: -50.00, date: '2024-02-10', status: 'completed' }
    ]
  });
});

app.post('/api/wallet/withdraw', (req, res) => {
  res.json({ success: true, message: 'Withdrawal request received' });
});

// ========== CHAT API ==========
app.get('/api/chat/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Alice', online: true },
      { id: 2, name: 'Bob', online: false }
    ]
  });
});

// ========== BUSINESS API ==========
app.get('/api/business/products', (req, res) => {
  res.json({
    products: [
      { id: 1, title: 'Product 1', price: 19.99, sales: 5 },
      { id: 2, title: 'Product 2', price: 29.99, sales: 3 }
    ]
  });
});

app.post('/api/business/products', (req, res) => {
  res.json({ success: true, message: 'Product added' });
});

// ========== ADMIN API ==========
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: 15432,
    totalCreators: 2345,
    totalContent: 9823,
    totalEarnings: 1234567
  });
});

// ========== EMAIL API (PROTECTED) ==========
app.post('/api/send-email', emailLimiter, validateEmailInput, async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Import email service dynamically to avoid startup errors
    const emailService = require('./emailService');
    
    const result = await emailService.sendVerificationEmail(to, '123456', 'User');
    
    if (result.success) {
      res.json({ success: true, message: 'Email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Email service error' });
  }
});

// ========== PAYOUT WEBHOOK ENDPOINTS ==========
app.post('/api/webhook/flutterwave-payout', handleFlutterwaveWebhook);
app.post('/api/webhook/paypal-payout', handlePayPalWebhook);
app.post('/api/webhook/test', testWebhook);

// ========== PAYOUT TEST ENDPOINTS ==========
app.get('/api/test/paypal', async (req, res) => {
  try {
    console.log('📨 PayPal test endpoint called');
    const token = await payoutService.getPayPalAccessToken();
    res.json({ 
      success: true, 
      message: '✅ PayPal connected successfully',
      token_preview: token.substring(0, 30) + '...',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ PayPal test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/test/flutterwave', async (req, res) => {
  try {
    console.log('📨 Flutterwave test endpoint called');
    const result = await payoutService.testFlutterwaveConnection();
    res.json(result);
  } catch (error) {
    console.error('❌ Flutterwave test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========== PROCESS PENDING WITHDRAWALS (ADMIN) ==========
app.post('/api/admin/process-withdrawal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }
    
    const result = await payoutService.processPayout(withdrawal);
    
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({ 
        status: result.status,
        transaction_id: result.transactionId || result.batchId,
        reference: result.reference,
        processed_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (updateError) {
      console.error('Database update error:', updateError);
    }
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('❌ Error processing withdrawal:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== FALLBACK FOR ANY OTHER API ROUTES ==========
app.get('/api/*path', (req, res) => {
  const path = req.params.path || '';
  console.log(`⚠️ Unhandled API GET request: /${path}`);
  res.json({ 
    success: true, 
    message: `API endpoint placeholder for /${path}`,
    note: 'This is a mock response - implement actual logic'
  });
});

app.post('/api/*path', (req, res) => {
  const path = req.params.path || '';
  console.log(`⚠️ Unhandled API POST request: /${path}`);
  res.json({ 
    success: true, 
    message: 'POST endpoint placeholder',
    data: req.body,
    note: 'This is a mock response - implement actual logic'
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: message
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 Test PayPal: http://localhost:${PORT}/api/test/paypal`);
  console.log(`📍 Test Flutterwave: http://localhost:${PORT}/api/test/flutterwave`);
  console.log(`📍 Webhook test: http://localhost:${PORT}/api/webhook/test`);
  console.log(`🛡️ Security: Rate limiting enabled, input validation active`);
});
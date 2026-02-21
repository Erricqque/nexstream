const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const paymentService = require('../services/paymentService');

// Middleware to verify admin access
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminData) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = adminData;
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ========== DASHBOARD STATS (REAL DATA) ==========
router.get('/dashboard/stats', verifyAdmin, async (req, res) => {
  try {
    // Real-time counts
    const [usersCount, contentCount, reportsCount, earningsTotal, payoutsPending] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('content').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('earnings').select('sum(amount)'),
      supabase.from('payouts').select('sum(amount)').eq('status', 'pending')
    ]);

    // Today's new users
    const today = new Date().toISOString().split('T')[0];
    const { count: newUsersToday } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    // Today's revenue
    const { data: todayEarnings } = await supabase
      .from('earnings')
      .select('amount')
      .gte('created_at', today);

    const todayRevenue = todayEarnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    // This week's revenue
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: weekEarnings } = await supabase
      .from('earnings')
      .select('amount')
      .gte('created_at', weekAgo);

    const weekRevenue = weekEarnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    // This month's revenue
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: monthEarnings } = await supabase
      .from('earnings')
      .select('amount')
      .gte('created_at', monthAgo);

    const monthRevenue = monthEarnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

    res.json({
      totalUsers: usersCount.count || 0,
      totalContent: contentCount.count || 0,
      pendingReports: reportsCount.count || 0,
      totalEarnings: earningsTotal.data?.[0]?.sum || 0,
      pendingPayouts: payoutsPending.data?.[0]?.sum || 0,
      newUsersToday: newUsersToday || 0,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== USER MANAGEMENT (REAL DATA) ==========
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const [profile, content, earnings] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', req.params.userId).single(),
      supabase.from('content').select('*').eq('user_id', req.params.userId),
      supabase.from('earnings').select('*').eq('user_id', req.params.userId)
    ]);

    res.json({
      profile: profile.data,
      content: content.data || [],
      earnings: earnings.data || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/:userId/suspend', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'suspended', suspended_at: new Date() })
      .eq('id', req.params.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users/:userId/unsuspend', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'active', suspended_at: null })
      .eq('id', req.params.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CONTENT MANAGEMENT (REAL DATA) ==========
router.get('/content', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*, profiles:user_id(username, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/content/:contentId', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', req.params.contentId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== REPORTS MANAGEMENT (REAL DATA) ==========
router.get('/reports', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, reporter:reporter_id(username, email), content:content_id(*), reported_user:user_id(username, email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reports/:reportId/approve', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('reports')
      .update({ status: 'reviewed', reviewed_at: new Date() })
      .eq('id', req.params.reportId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PAYOUT MANAGEMENT (REAL DATA) ==========
router.get('/payouts', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payouts')
      .select('*, user:user_id(username, email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payouts/:payoutId/approve', verifyAdmin, async (req, res) => {
  try {
    const result = await paymentService.processPayout(req.params.payoutId, req.admin.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/payouts/:payoutId/reject', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('payouts')
      .update({ 
        status: 'cancelled',
        metadata: { reason: req.body.reason }
      })
      .eq('id', req.params.payoutId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== WITHDRAWAL MANAGEMENT (REAL DATA) ==========
router.get('/withdrawals', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*, admin:admin_id(role)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/withdrawals', verifyAdmin, async (req, res) => {
  try {
    const result = await paymentService.processWithdrawal(req.body, req.admin.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== TRANSACTIONS (REAL DATA) ==========
router.get('/transactions', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, user:user_id(username, email), admin:admin_id(role)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== EARNINGS (REAL DATA) ==========
router.get('/earnings', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('earnings')
      .select('*, user:user_id(username, email)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ANALYTICS (REAL DATA) ==========
router.get('/analytics/user-growth', verifyAdmin, async (req, res) => {
  try {
    const days = 30;
    const result = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', date.toISOString())
        .lt('created_at', nextDate.toISOString());

      result.push({
        date: date.toISOString().split('T')[0],
        count: count || 0
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics/content-distribution', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('content_type, count');

    if (error) throw error;

    const distribution = {};
    data?.forEach(item => {
      distribution[item.content_type] = (distribution[item.content_type] || 0) + 1;
    });

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== SETTINGS (REAL DATA) ==========
router.get('/settings', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');

    if (error) throw error;
    
    const settings = {};
    data?.forEach(item => {
      settings[item.key] = item.value;
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', verifyAdmin, async (req, res) => {
  try {
    const updates = Object.entries(req.body).map(([key, value]) => ({
      key,
      value,
      updated_by: req.admin.id,
      updated_at: new Date()
    }));

    for (const update of updates) {
      await supabase
        .from('system_settings')
        .upsert(update, { onConflict: 'key' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
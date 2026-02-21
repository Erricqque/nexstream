const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

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

    // Check if user is admin
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

// Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const [users, content, reports] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('content').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    res.json({
      totalUsers: users.count || 0,
      totalContent: content.count || 0,
      pendingReports: reports.count || 0,
      totalEarnings: 45231.89,
      todayViews: 1234,
      pendingPayouts: 3456.78
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all content
router.get('/content', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*, profiles:user_id(username)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending reports
router.get('/reports', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, reporter:reporter_id(username), content:content_id(title)')
      .eq('status', 'pending')
      .limit(20);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suspend user
router.post('/users/:userId/suspend', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'suspended' })
      .eq('id', req.params.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unsuspend user
router.post('/users/:userId/unsuspend', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'active' })
      .eq('id', req.params.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete content
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

// Approve report
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

module.exports = router;
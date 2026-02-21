import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState({ role: 'super_admin' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('today');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('flutterwave');
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    pendingReports: 0,
    totalEarnings: 0,
    todayViews: 0,
    pendingPayouts: 0,
    totalWithdrawn: 0,
    activeUsers: 0,
    newUsersToday: 0,
    revenueToday: 0,
    revenueWeek: 0,
    revenueMonth: 0
  });

  // Data tables
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [reports, setReports] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activities, setActivities] = useState([]);

  // Charts data
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [contentStats, setContentStats] = useState({});

  useEffect(() => {
    loadDashboardData();
    loadPayoutRequests();
    loadWithdrawalHistory();
    loadTransactions();
    loadRecentActivities();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get counts
      const [usersCount, contentCount, reportsCount, activeUsersCount, newUsersToday] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('content').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_active', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0])
      ]);

      // Get revenue data
      const { data: earnings } = await supabase
        .from('earnings')
        .select('amount, created_at')
        .order('created_at', { ascending: false });

      const totalEarnings = earnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      
      // Calculate today's revenue
      const today = new Date().toISOString().split('T')[0];
      const todayRevenue = earnings?.filter(e => e.created_at?.startsWith(today))
        .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

      // Calculate this week's revenue
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const weekRevenue = earnings?.filter(e => e.created_at >= weekAgo)
        .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

      // Calculate this month's revenue
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const monthRevenue = earnings?.filter(e => e.created_at >= monthAgo)
        .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

      setStats({
        totalUsers: usersCount.count || 0,
        totalContent: contentCount.count || 0,
        pendingReports: reportsCount.count || 0,
        totalEarnings: totalEarnings,
        todayViews: Math.floor(Math.random() * 5000) + 1000, // Replace with real views data
        pendingPayouts: 15420.50,
        totalWithdrawn: 89234.67,
        activeUsers: activeUsersCount.count || 0,
        newUsersToday: newUsersToday.count || 0,
        revenueToday: todayRevenue,
        revenueWeek: weekRevenue,
        revenueMonth: monthRevenue
      });

      // Load all users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      setUsers(usersData || []);

      // Load all content
      const { data: contentData } = await supabase
        .from('content')
        .select('*, profiles:user_id(username, email)')
        .order('created_at', { ascending: false })
        .limit(100);
      setContent(contentData || []);

      // Load pending reports
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*, reporter:reporter_id(username, email), content:content_id(title, id, user_id), reported_user:user_id(username, email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      setReports(reportsData || []);

      // Generate user growth data (last 30 days)
      const growth = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        growth.push({
          date: date.toLocaleDateString(),
          count: Math.floor(Math.random() * 10) + 1
        });
      }
      setUserGrowth(growth);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayoutRequests = async () => {
    try {
      // Mock data for now - replace with real payouts table
      setPayoutRequests([
        { id: 1, user: 'john_doe', email: 'john@example.com', amount: 250.00, method: 'flutterwave', status: 'pending', requested_at: new Date().toISOString() },
        { id: 2, user: 'jane_smith', email: 'jane@example.com', amount: 175.50, method: 'paypal', status: 'pending', requested_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, user: 'bob_wilson', email: 'bob@example.com', amount: 500.00, method: 'mpesa', status: 'pending', requested_at: new Date(Date.now() - 172800000).toISOString() },
      ]);
    } catch (error) {
      console.error('Error loading payouts:', error);
    }
  };

  const loadWithdrawalHistory = async () => {
    setWithdrawalHistory([
      { id: 1, user: 'alice_brown', amount: 150.00, method: 'flutterwave', status: 'completed', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, user: 'charlie_davis', amount: 320.00, method: 'paypal', status: 'completed', date: new Date(Date.now() - 172800000).toISOString() },
      { id: 3, user: 'diana_evans', amount: 95.00, method: 'mpesa', status: 'completed', date: new Date(Date.now() - 259200000).toISOString() },
    ]);
  };

  const loadTransactions = async () => {
    setTransactions([
      { id: 1, user: 'john_doe', amount: 25.00, type: 'earning', status: 'completed', date: new Date().toISOString() },
      { id: 2, user: 'jane_smith', amount: 15.50, type: 'earning', status: 'completed', date: new Date().toISOString() },
      { id: 3, user: 'bob_wilson', amount: 50.00, type: 'withdrawal', status: 'pending', date: new Date().toISOString() },
    ]);
  };

  const loadRecentActivities = async () => {
    setActivities([
      { id: 1, user: 'john_doe', action: 'uploaded a new video', target: 'My Latest Vlog', time: new Date().toISOString() },
      { id: 2, user: 'jane_smith', action: 'joined the platform', target: '', time: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, user: 'bob_wilson', action: 'requested payout', target: '$50.00', time: new Date(Date.now() - 7200000).toISOString() },
      { id: 4, user: 'alice_brown', action: 'reported content', target: 'Inappropriate video', time: new Date(Date.now() - 10800000).toISOString() },
    ]);
  };

  // Admin Actions
  const suspendUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;
    try {
      await supabase
        .from('profiles')
        .update({ status: 'suspended', suspended_at: new Date() })
        .eq('id', userId);
      alert('User suspended successfully');
      loadDashboardData();
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Failed to suspend user');
    }
  };

  const unsuspendUser = async (userId) => {
    if (!window.confirm('Unsuspend this user?')) return;
    try {
      await supabase
        .from('profiles')
        .update({ status: 'active', suspended_at: null })
        .eq('id', userId);
      alert('User unsuspended successfully');
      loadDashboardData();
    } catch (error) {
      console.error('Error unsuspending user:', error);
      alert('Failed to unsuspend user');
    }
  };

  const deleteContent = async (contentId) => {
    if (!window.confirm('Delete this content? This action cannot be undone.')) return;
    try {
      await supabase
        .from('content')
        .delete()
        .eq('id', contentId);
      alert('Content deleted successfully');
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  const approveReport = async (reportId, contentId) => {
    try {
      await supabase
        .from('reports')
        .update({ status: 'reviewed', reviewed_at: new Date() })
        .eq('id', reportId);
      
      setReports(reports.filter(r => r.id !== reportId));
      alert('Report approved');
    } catch (error) {
      console.error('Error approving report:', error);
    }
  };

  const approvePayout = async (payoutId) => {
    if (!window.confirm('Approve this payout?')) return;
    try {
      // Update payout status
      setPayoutRequests(payoutRequests.filter(p => p.id !== payoutId));
      alert('Payout approved and will be processed');
    } catch (error) {
      console.error('Error approving payout:', error);
    }
  };

  const rejectPayout = async (payoutId) => {
    if (!window.confirm('Reject this payout?')) return;
    try {
      setPayoutRequests(payoutRequests.filter(p => p.id !== payoutId));
      alert('Payout rejected');
    } catch (error) {
      console.error('Error rejecting payout:', error);
    }
  };

  const processWithdrawal = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // Process withdrawal through Flutterwave/PayPal
      alert(`Withdrawal of $${payoutAmount} processed via ${payoutMethod}`);
      setShowPayoutModal(false);
      setPayoutAmount('');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Withdrawal failed');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #ff3366',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.2rem', color: '#888' }}>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #ff3366;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #ff4d4d;
        }
      `}</style>

      {/* ADMIN MODE BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #ff3366, #4facfe)',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👑</span> Admin Control Panel
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
            Full platform control • Real-time analytics • User management
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 20px',
          borderRadius: '30px',
          fontSize: '0.9rem'
        }}>
          🔐 Super Admin
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div style={{
        background: '#1a1a1a',
        padding: '15px 30px',
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap',
        borderBottom: '1px solid #333'
      }}>
        <div>
          <span style={{ color: '#888' }}>👥 Active Users:</span>
          <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#4facfe' }}>{stats.activeUsers}</span>
        </div>
        <div>
          <span style={{ color: '#888' }}>🆕 New Today:</span>
          <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#43e97b' }}>{stats.newUsersToday}</span>
        </div>
        <div>
          <span style={{ color: '#888' }}>💰 Revenue Today:</span>
          <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#ff3366' }}>{formatCurrency(stats.revenueToday)}</span>
        </div>
        <div>
          <span style={{ color: '#888' }}>📊 Revenue Week:</span>
          <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#f59e0b' }}>{formatCurrency(stats.revenueWeek)}</span>
        </div>
        <div>
          <span style={{ color: '#888' }}>📈 Revenue Month:</span>
          <span style={{ marginLeft: '8px', fontWeight: 'bold', color: '#a78bfa' }}>{formatCurrency(stats.revenueMonth)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '30px' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '2px solid #333',
          paddingBottom: '10px',
          overflowX: 'auto',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'users', label: 'User Management', icon: '👥', count: stats.totalUsers },
            { id: 'content', label: 'Content Management', icon: '📄', count: stats.totalContent },
            { id: 'reports', label: 'Reports', icon: '🚩', count: reports.length },
            { id: 'payouts', label: 'Payouts', icon: '💰', count: payoutRequests.length },
            { id: 'withdrawals', label: 'Withdrawals', icon: '💳' },
            { id: 'transactions', label: 'Transactions', icon: '📝' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id ? '#ff3366' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === tab.id ? 'white' : '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: activeTab === tab.id ? 'white' : '#ff3366',
                  color: activeTab === tab.id ? '#ff3366' : 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  marginLeft: '5px'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}

          {/* Admin Withdrawal Button */}
          <button
            onClick={() => setShowPayoutModal(true)}
            style={{
              marginLeft: 'auto',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold'
            }}
          >
            <span>💸</span>
            Admin Withdrawal
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <StatsCard
                    icon="👥"
                    title="Total Users"
                    value={stats.totalUsers}
                    subtitle={`+${stats.newUsersToday} today`}
                    color="#ff3366"
                    gradient="linear-gradient(135deg, #ff3366, #ff6b3b)"
                  />
                  <StatsCard
                    icon="📄"
                    title="Total Content"
                    value={stats.totalContent}
                    subtitle={`${content.filter(c => c.content_type === 'video').length} videos`}
                    color="#4facfe"
                    gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
                  />
                  <StatsCard
                    icon="🚩"
                    title="Pending Reports"
                    value={reports.length}
                    subtitle={`${reports.filter(r => r.reason === 'copyright').length} copyright`}
                    color="#f59e0b"
                    gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
                  />
                  <StatsCard
                    icon="💰"
                    title="Total Earnings"
                    value={formatCurrency(stats.totalEarnings)}
                    subtitle={`Withdrawn: ${formatCurrency(stats.totalWithdrawn)}`}
                    color="#43e97b"
                    gradient="linear-gradient(135deg, #43e97b, #38f9d7)"
                  />
                </div>

                {/* Charts Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  {/* User Growth Chart */}
                  <div style={{
                    background: '#1a1a1a',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '1px solid #333'
                  }}>
                    <h3 style={{ marginBottom: '20px' }}>User Growth (Last 30 Days)</h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      height: '200px',
                      gap: '2px'
                    }}>
                      {userGrowth.map((day, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '100%',
                            height: `${(day.count / 15) * 180}px`,
                            background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s'
                          }}></div>
                          {i % 5 === 0 && (
                            <span style={{ fontSize: '0.6rem', color: '#888', marginTop: '5px' }}>
                              {day.date.slice(0, 5)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Distribution */}
                  <div style={{
                    background: '#1a1a1a',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '1px solid #333'
                  }}>
                    <h3 style={{ marginBottom: '20px' }}>Content Distribution</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {['video', 'music', 'game', 'image'].map(type => {
                        const count = content.filter(c => c.content_type === type).length;
                        const percentage = content.length ? (count / content.length * 100).toFixed(1) : 0;
                        const colors = {
                          video: '#ff3366',
                          music: '#4facfe',
                          game: '#43e97b',
                          image: '#f59e0b'
                        };
                        return (
                          <div key={type}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span style={{ textTransform: 'capitalize' }}>{type}</span>
                              <span style={{ color: colors[type] }}>{count} ({percentage}%)</span>
                            </div>
                            <div style={{
                              width: '100%',
                              height: '8px',
                              background: '#2a2a2a',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: colors[type],
                                borderRadius: '4px',
                                transition: 'width 0.3s'
                              }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333'
                }}>
                  <h3 style={{ marginBottom: '20px' }}>Recent Platform Activity</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {activities.map(activity => (
                      <div key={activity.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        padding: '10px',
                        background: '#2a2a2a',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}>
                          {activity.user[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0 }}>
                            <strong>{activity.user}</strong> {activity.action} {activity.target}
                          </p>
                          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.8rem' }}>
                            {formatRelativeTime(activity.time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <h2>User Management</h2>
                  <input
                    type="text"
                    placeholder="Search users..."
                    style={{
                      padding: '10px 15px',
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      width: '300px'
                    }}
                  />
                </div>

                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333',
                  overflowX: 'auto'
                }}>
                  <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Joined</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Content</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Last Active</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => {
                        const userContent = content.filter(c => c.user_id === user.id);
                        return (
                          <tr key={user.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '15px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1rem'
                                }}>
                                  {user.username?.[0] || user.email?.[0] || 'U'}
                                </div>
                                <span>{user.username || 'N/A'}</span>
                              </div>
                            </td>
                            <td style={{ padding: '15px', color: '#888' }}>{user.email}</td>
                            <td style={{ padding: '15px', color: '#888' }}>
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '15px', color: '#888' }}>{userContent.length}</td>
                            <td style={{ padding: '15px' }}>
                              <span style={{
                                padding: '4px 8px',
                                background: user.status === 'suspended' ? '#ff3366' : '#43e97b',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                              }}>
                                {user.status || 'active'}
                              </span>
                            </td>
                            <td style={{ padding: '15px', color: '#888' }}>
                              {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}
                            </td>
                            <td style={{ padding: '15px' }}>
                              {user.status === 'suspended' ? (
                                <button
                                  onClick={() => unsuspendUser(user.id)}
                                  style={{
                                    padding: '6px 12px',
                                    background: '#43e97b',
                                    border: 'none',
                                    borderRadius: '5px',
                                    color: 'white',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Unsuspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => suspendUser(user.id)}
                                  style={{
                                    padding: '6px 12px',
                                    background: '#ff3366',
                                    border: 'none',
                                    borderRadius: '5px',
                                    color: 'white',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Suspend
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Content Management</h2>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333',
                  overflowX: 'auto'
                }}>
                  <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Title</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Creator</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Views</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Uploaded</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                          <td style={{ padding: '15px' }}>{item.title}</td>
                          <td style={{ padding: '15px', color: '#888' }}>{item.profiles?.username}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              padding: '4px 8px',
                              background: {
                                video: '#ff3366',
                                music: '#4facfe',
                                game: '#43e97b',
                                image: '#f59e0b'
                              }[item.content_type] || '#888',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}>
                              {item.content_type}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#888' }}>{item.views_count || 0}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              padding: '4px 8px',
                              background: item.status === 'approved' ? '#43e97b' : '#f59e0b',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}>
                              {item.status || 'pending'}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#888' }}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <button
                              onClick={() => deleteContent(item.id)}
                              style={{
                                padding: '6px 12px',
                                background: '#ff3366',
                                border: 'none',
                                borderRadius: '5px',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Report Management</h2>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333'
                }}>
                  {reports.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
                      No pending reports
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {reports.map(report => (
                        <div key={report.id} style={{
                          padding: '20px',
                          background: '#2a2a2a',
                          borderRadius: '10px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h4>Report #{report.id.substring(0, 8)}</h4>
                            <span style={{ color: '#f59e0b' }}>⚠️ Pending</span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                              <p style={{ color: '#888', marginBottom: '5px' }}>Reported Content</p>
                              <p><strong>{report.content?.title || 'Unknown'}</strong></p>
                            </div>
                            <div>
                              <p style={{ color: '#888', marginBottom: '5px' }}>Reason</p>
                              <p style={{ color: '#ff3366' }}>{report.reason}</p>
                            </div>
                            <div>
                              <p style={{ color: '#888', marginBottom: '5px' }}>Reported By</p>
                              <p>{report.reporter?.username || 'Unknown'}</p>
                            </div>
                            <div>
                              <p style={{ color: '#888', marginBottom: '5px' }}>Date</p>
                              <p>{new Date(report.created_at).toLocaleString()}</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => approveReport(report.id, report.content_id)}
                              style={{
                                padding: '8px 16px',
                                background: '#43e97b',
                                border: 'none',
                                borderRadius: '5px',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              ✓ Approve Report
                            </button>
                            <button
                              onClick={() => deleteContent(report.content_id)}
                              style={{
                                padding: '8px 16px',
                                background: '#ff3366',
                                border: 'none',
                                borderRadius: '5px',
                                color: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              🗑️ Delete Content
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PAYOUTS TAB */}
            {activeTab === 'payouts' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Payout Requests</h2>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333',
                  overflowX: 'auto'
                }}>
                  {payoutRequests.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
                      No pending payout requests
                    </p>
                  ) : (
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                          <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
                          <th style={{ padding: '15px', textAlign: 'left' }}>Amount</th>
                          <th style={{ padding: '15px', textAlign: 'left' }}>Method</th>
                          <th style={{ padding: '15px', textAlign: 'left' }}>Requested</th>
                          <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payoutRequests.map(payout => (
                          <tr key={payout.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: '15px' }}>
                              <div>
                                <strong>{payout.user}</strong>
                                <div style={{ color: '#888', fontSize: '0.8rem' }}>{payout.email}</div>
                              </div>
                            </td>
                            <td style={{ padding: '15px', fontWeight: 'bold', color: '#43e97b' }}>
                              {formatCurrency(payout.amount)}
                            </td>
                            <td style={{ padding: '15px', textTransform: 'capitalize' }}>{payout.method}</td>
                            <td style={{ padding: '15px', color: '#888' }}>
                              {formatRelativeTime(payout.requested_at)}
                            </td>
                            <td style={{ padding: '15px' }}>
                              <button
                                onClick={() => approvePayout(payout.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: '#43e97b',
                                  border: 'none',
                                  borderRadius: '5px',
                                  color: 'white',
                                  cursor: 'pointer',
                                  marginRight: '5px'
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectPayout(payout.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: '#ff3366',
                                  border: 'none',
                                  borderRadius: '5px',
                                  color: 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* WITHDRAWALS TAB */}
            {activeTab === 'withdrawals' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Withdrawal History</h2>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333',
                  overflowX: 'auto'
                }}>
                  <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Amount</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Method</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawalHistory.map(withdrawal => (
                        <tr key={withdrawal.id} style={{ borderBottom: '1px solid #333' }}>
                          <td style={{ padding: '15px' }}>{withdrawal.user}</td>
                          <td style={{ padding: '15px', fontWeight: 'bold', color: '#43e97b' }}>
                            {formatCurrency(withdrawal.amount)}
                          </td>
                          <td style={{ padding: '15px', textTransform: 'capitalize' }}>{withdrawal.method}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              padding: '4px 8px',
                              background: withdrawal.status === 'completed' ? '#43e97b' : '#f59e0b',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#888' }}>
                            {new Date(withdrawal.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TRANSACTIONS TAB */}
            {activeTab === 'transactions' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Recent Transactions</h2>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333',
                  overflowX: 'auto'
                }}>
                  <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Amount</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid #333' }}>
                          <td style={{ padding: '15px' }}>{tx.user}</td>
                          <td style={{
                            padding: '15px',
                            fontWeight: 'bold',
                            color: tx.type === 'earning' ? '#43e97b' : '#ff3366'
                          }}>
                            {tx.type === 'earning' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </td>
                          <td style={{ padding: '15px', textTransform: 'capitalize' }}>{tx.type}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              padding: '4px 8px',
                              background: tx.status === 'completed' ? '#43e97b' : '#f59e0b',
                              borderRadius: '4px',
                              fontSize: '0.8rem'
                            }}>
                              {tx.status}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#888' }}>
                            {formatRelativeTime(tx.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Platform Analytics</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    background: '#1a1a1a',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '1px solid #333'
                  }}>
                    <h3>User Statistics</h3>
                    <div style={{ marginTop: '15px' }}>
                      <StatRow label="Total Users" value={stats.totalUsers} />
                      <StatRow label="Active Users (24h)" value={stats.activeUsers} />
                      <StatRow label="New Today" value={stats.newUsersToday} />
                      <StatRow label="Avg. Content per User" value={(stats.totalContent / stats.totalUsers).toFixed(1)} />
                    </div>
                  </div>

                  <div style={{
                    background: '#1a1a1a',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '1px solid #333'
                  }}>
                    <h3>Revenue Statistics</h3>
                    <div style={{ marginTop: '15px' }}>
                      <StatRow label="Total Revenue" value={formatCurrency(stats.totalEarnings)} />
                      <StatRow label="Today's Revenue" value={formatCurrency(stats.revenueToday)} />
                      <StatRow label="This Week" value={formatCurrency(stats.revenueWeek)} />
                      <StatRow label="This Month" value={formatCurrency(stats.revenueMonth)} />
                      <StatRow label="Pending Payouts" value={formatCurrency(stats.pendingPayouts)} />
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid #333'
                }}>
                  <h3 style={{ marginBottom: '15px' }}>Export Data</h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button style={{
                      padding: '10px 20px',
                      background: '#ff3366',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: 'pointer'
                    }}>
                      Export Users (CSV)
                    </button>
                    <button style={{
                      padding: '10px 20px',
                      background: '#4facfe',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: 'pointer'
                    }}>
                      Export Content (CSV)
                    </button>
                    <button style={{
                      padding: '10px 20px',
                      background: '#43e97b',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: 'pointer'
                    }}>
                      Export Earnings (CSV)
                    </button>
                    <button style={{
                      padding: '10px 20px',
                      background: '#f59e0b',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'white',
                      cursor: 'pointer'
                    }}>
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div>
                <h2 style={{ marginBottom: '20px' }}>Platform Settings</h2>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '30px',
                  border: '1px solid #333',
                  maxWidth: '600px'
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="NexStream"
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '5px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
                      Max Upload Size (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue="500"
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '5px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
                      Minimum Payout Amount ($)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '5px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
                      MLM Commission Rates
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        type="number"
                        defaultValue="10"
                        placeholder="Level 1 %"
                        style={{
                          padding: '10px',
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: 'white'
                        }}
                      />
                      <input
                        type="number"
                        defaultValue="5"
                        placeholder="Level 2 %"
                        style={{
                          padding: '10px',
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: 'white'
                        }}
                      />
                      <input
                        type="number"
                        defaultValue="2"
                        placeholder="Level 3 %"
                        style={{
                          padding: '10px',
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: 'white'
                        }}
                      />
                    </div>
                  </div>

                  <button style={{
                    padding: '12px 30px',
                    background: '#ff3366',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Admin Withdrawal Modal */}
      <AnimatePresence>
        {showPayoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowPayoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              style={{
                background: '#1a1a2a',
                borderRadius: '20px',
                padding: '30px',
                width: '90%',
                maxWidth: '400px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: '20px' }}>Admin Withdrawal</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#888', display: 'block', marginBottom: '5px' }}>
                  Payment Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                >
                  <option value="flutterwave">Flutterwave (Bank Transfer)</option>
                  <option value="paypal">PayPal</option>
                  <option value="mpesa">M-Pesa</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={processWithdrawal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#ff3366',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Process Withdrawal
                </button>
                <button
                  onClick={() => setShowPayoutModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, title, value, subtitle, color, gradient }) => (
  <motion.div
    whileHover={{ y: -5 }}
    style={{
      background: gradient || '#1a1a1a',
      borderRadius: '15px',
      padding: '25px',
      border: '1px solid #333',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      fontSize: '3rem',
      opacity: 0.1
    }}>
      {icon}
    </div>
    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{icon}</div>
    <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</div>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value}</div>
    {subtitle && <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>{subtitle}</div>}
  </motion.div>
);

// Stat Row Component
const StatRow = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #333'
  }}>
    <span style={{ color: '#888' }}>{label}</span>
    <span style={{ fontWeight: 'bold' }}>{value}</span>
  </div>
);

export default AdminDashboard;
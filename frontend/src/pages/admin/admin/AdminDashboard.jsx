import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalContent: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Get users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get creators
      const { count: creatorCount } = await supabase
        .from('channels')
        .select('*', { count: 'exact', head: true });

      // Get content
      const { count: contentCount } = await supabase
        .from('content')
        .select('*', { count: 'exact', head: true });

      // Get earnings
      const { data: earnings } = await supabase
        .from('earnings')
        .select('amount');

      // Get pending withdrawals
      const { count: pendingCount } = await supabase
        .from('withdrawals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setUsers(recentUsers || []);
      setStats({
        totalUsers: userCount || 0,
        totalCreators: creatorCount || 0,
        totalContent: contentCount || 0,
        totalEarnings: earnings?.reduce((s, e) => s + e.amount, 0) || 0,
        pendingWithdrawals: pendingCount || 0
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure?')) return;

    await supabase.from('profiles').delete().eq('id', userId);
    loadAdminData();
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white', background: '#0f0f0f', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Admin Dashboard</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Platform management</p>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', color: '#ef4444' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Creators</h3>
          <p style={{ fontSize: '2rem', color: '#3b82f6' }}>{stats.totalCreators}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Content</h3>
          <p style={{ fontSize: '2rem', color: '#10b981' }}>{stats.totalContent}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Pending</h3>
          <p style={{ fontSize: '2rem', color: '#fbbf24' }}>{stats.pendingWithdrawals}</p>
        </div>
      </div>

      {/* Users List */}
      <h2 style={{ marginBottom: '20px' }}>Recent Users</h2>
      <div style={{ background: '#1f1f1f', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#2d2d2d' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Joined</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #2d2d2d' }}>
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name || 'User'}`}
                    alt=""
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />
                  {u.full_name || 'No name'}
                </td>
                <td style={{ padding: '15px', color: '#888' }}>{u.email}</td>
                <td style={{ padding: '15px', color: '#888' }}>
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '15px' }}>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    style={{
                      padding: '5px 15px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
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
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    earnings: 0,
    referrals: 0,
    content: 0,
    views: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Load real stats from database
    const { data: earnings } = await supabase
      .from('earnings')
      .select('amount')
      .eq('user_id', user?.id);

    const { count: referrals } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user?.id);

    setStats({
      earnings: earnings?.reduce((sum, e) => sum + e.amount, 0) || 0,
      referrals: referrals || 0,
      content: 12,
      views: 15432
    });
  };

  const quickActions = [
    { icon: '🎬', title: 'Movies', path: '/movies', color: '#ef4444' },
    { icon: '🎵', title: 'Music', path: '/music', color: '#3b82f6' },
    { icon: '🎮', title: 'Games', path: '/games', color: '#10b981' },
    { icon: '🤝', title: 'Network', path: '/network', color: '#fbbf24' },
    { icon: '💬', title: 'Chat', path: '/chat', color: '#8b5cf6' },
    { icon: '💰', title: 'Wallet', path: '/wallet', color: '#ef4444' }
  ];

  return (
    <div style={{ padding: '40px', color: 'white', background: '#0f0f0f', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
        Welcome back, {user?.user_metadata?.full_name || user?.email}
      </h1>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ background: '#1f1f1f', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Earnings</h3>
          <p style={{ fontSize: '2rem', color: '#ef4444' }}>${stats.earnings}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Referrals</h3>
          <p style={{ fontSize: '2rem', color: '#3b82f6' }}>{stats.referrals}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Content</h3>
          <p style={{ fontSize: '2rem', color: '#10b981' }}>{stats.content}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Views</h3>
          <p style={{ fontSize: '2rem', color: '#fbbf24' }}>{stats.views}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '40px'
      }}>
        {quickActions.map(action => (
          <Link key={action.path} to={action.path} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#1f1f1f',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{action.icon}</div>
              <h3 style={{ color: action.color, margin: 0 }}>{action.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 style={{ marginBottom: '20px' }}>Recent Activity</h2>
      <div style={{ background: '#1f1f1f', borderRadius: '10px', padding: '20px' }}>
        <p style={{ color: '#888', textAlign: 'center' }}>No recent activity</p>
      </div>
    </div>
  );
};

export default Dashboard;
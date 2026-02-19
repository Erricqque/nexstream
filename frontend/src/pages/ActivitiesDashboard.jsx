import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { statsService } from '../services/statsService';
import { supabase } from '../lib/supabase';

const ActivitiesDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    content: 0,
    views: 0,
    earnings: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get platform stats
        const [totalUsers, totalContent, totalViews, totalEarnings] = await Promise.all([
          statsService.getTotalUsers(),
          statsService.getTotalContent(),
          statsService.getTotalViews(),
          statsService.getTotalEarnings()
        ]);
        
        setStats({
          users: totalUsers,
          content: totalContent,
          views: totalViews,
          earnings: totalEarnings
        });

        // Get recent activities (last 10)
        const { data: recentContent } = await supabase
          .from('content')
          .select(`
            id,
            title,
            type,
            created_at,
            profiles (username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (recentContent) {
          setRecentActivities(recentContent.map(item => ({
            id: item.id,
            type: 'content',
            content: `New ${item.type}: ${item.title}`,
            time: new Date(item.created_at).toLocaleDateString(),
            icon: item.type === 'video' ? '🎬' : '📝',
            user: item.profiles?.username || 'Anonymous'
          })));
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: '40px 20px'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Activities Dashboard</h1>
        
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          <motion.div
            whileHover={{ y: -5 }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>👥</div>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Users</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {stats.users.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📄</div>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Content</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.content.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>👁️</div>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Views</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.views.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: '30px',
              border: '1px solid #333'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>💰</div>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Earnings</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
              ${stats.earnings.toFixed(2)}
            </div>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '15px',
          padding: '30px',
          border: '1px solid #333'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Recent Activities</h2>
          
          {recentActivities.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    background: '#2d2d2d',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>{activity.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0 }}>{activity.content}</p>
                    <small style={{ color: '#888' }}>by {activity.user}</small>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>{activity.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
              No recent activities found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesDashboard;

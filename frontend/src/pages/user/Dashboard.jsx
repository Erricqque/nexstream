import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { statsService } from '../../services/statsService';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    content: 0,
    views: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          const userStats = await statsService.getUserStats(user.id);
          setStats(userStats);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
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
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Here's what's happening with your content
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📊</div>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Your Content</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
              {stats.content}
            </div>
            <p style={{ color: '#666', marginTop: '10px' }}>pieces uploaded</p>
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
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.views.toLocaleString()}
            </div>
            <p style={{ color: '#666', marginTop: '10px' }}>across all content</p>
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
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              ${stats.earnings.toFixed(2)}
            </div>
            <p style={{ color: '#666', marginTop: '10px' }}>lifetime earnings</p>
          </motion.div>
        </div>

        <div style={{
          background: '#1a1a1a',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid #333'
        }}>
          <h2 style={{ marginBottom: '30px' }}>Quick Actions</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <Link
              to="/upload"
              style={{
                background: '#2d2d2d',
                padding: '20px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.target.style.background = '#3d3d3d'}
              onMouseLeave={e => e.target.style.background = '#2d2d2d'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📤</div>
              <div>Upload Content</div>
            </Link>
            
            <Link
              to="/wallet"
              style={{
                background: '#2d2d2d',
                padding: '20px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.target.style.background = '#3d3d3d'}
              onMouseLeave={e => e.target.style.background = '#2d2d2d'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
              <div>View Wallet</div>
            </Link>
            
            <Link
              to="/analytics"
              style={{
                background: '#2d2d2d',
                padding: '20px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.target.style.background = '#3d3d3d'}
              onMouseLeave={e => e.target.style.background = '#2d2d2d'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📈</div>
              <div>View Analytics</div>
            </Link>
            
            <Link
              to="/settings"
              style={{
                background: '#2d2d2d',
                padding: '20px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.target.style.background = '#3d3d3d'}
              onMouseLeave={e => e.target.style.background = '#2d2d2d'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚙️</div>
              <div>Settings</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
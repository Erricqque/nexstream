import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { statsService } from '../services/statsService';
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalViews: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const adminStats = await statsService.getAdminStats();
        setStats(adminStats);
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
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
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Admin Dashboard</h1>
        
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
              {stats.totalUsers.toLocaleString()}
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
              {stats.totalContent.toLocaleString()}
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
              {stats.totalViews.toLocaleString()}
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
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Revenue</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
              ${stats.totalRevenue.toFixed(2)}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
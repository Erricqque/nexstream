import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { statsService } from '../services/statsService';

const Home = () => {
  const [stats, setStats] = useState({
    users: 0,
    content: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, content, earnings] = await Promise.all([
          statsService.getTotalUsers(),
          statsService.getTotalContent(),
          statsService.getTotalEarnings()
        ]);
        
        setStats({ users, content, earnings });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '4rem', marginBottom: '20px' }}
        >
          Welcome to NexStream
        </motion.h1>
        
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontSize: '1.5rem', marginBottom: '40px', opacity: 0.9 }}
        >
          Your ultimate entertainment platform for movies, music, and games
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '60px',
            marginTop: '60px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
              {loading ? '...' : stats.users.toLocaleString()}+
            </div>
            <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Active Users</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
              {loading ? '...' : stats.content.toLocaleString()}+
            </div>
            <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Content Pieces</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
              ${loading ? '...' : (stats.earnings / 1000000).toFixed(1)}M+
            </div>
            <div style={{ fontSize: '1.2rem', opacity: 0.8 }}>Total Earnings</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ marginTop: '60px' }}
        >
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              padding: '15px 40px',
              margin: '0 10px',
              background: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            Get Started
          </Link>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '15px 40px',
              margin: '0 10px',
              background: 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              border: '2px solid white',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'white';
              e.target.style.color = '#667eea';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'white';
            }}
          >
            Sign In
          </Link>
        </motion.div>
      </div>

      <div style={{
        background: 'white',
        padding: '80px 20px',
        color: '#333'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '60px' }}>Platform Features</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {[
              { icon: '🎬', title: 'Movies', desc: 'Stream the latest movies and TV shows' },
              { icon: '🎵', title: 'Music', desc: 'Listen to millions of songs' },
              { icon: '🎮', title: 'Games', desc: 'Play 100+ free games' },
              { icon: '💬', title: 'Chat', desc: 'Connect with friends' },
              { icon: '🤖', title: 'AI Assistant', desc: 'Get help from our AI' },
              { icon: '💰', title: 'Wallet', desc: 'Earn and withdraw money' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                style={{
                  padding: '30px',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
                <h3 style={{ marginBottom: '10px' }}>{feature.title}</h3>
                <p style={{ color: '#666' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
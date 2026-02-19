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
      {/* Hero Section */}
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

        {/* Stats Section */}
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

        {/* CTA Buttons */}
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

      {/* Features Section */}
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

export default Home;import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [stats, setStats] = useState({
    users: 15432,
    creators: 2345,
    movies: 9823,
    earnings: 1234567
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 25s infinite ease-in-out'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 30s infinite ease-in-out reverse'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 20s infinite ease-in-out'
        }}></div>

        {/* Animated wave lines */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3
        }}>
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          <path d="M0,200 Q150,100 300,200 T600,200 T900,200 T1200,200 T1500,200 T1800,200 T2100,200 T2400,200" 
                stroke="url(#wave-gradient)" 
                strokeWidth="3" 
                fill="none"
                style={{ animation: 'waveFlow 25s linear infinite' }} />
          
          <path d="M0,300 Q200,400 400,300 T800,300 T1200,300 T1600,300 T2000,300 T2400,300" 
                stroke="url(#wave-gradient)" 
                strokeWidth="2" 
                fill="none"
                style={{ animation: 'waveFlowReverse 30s linear infinite' }} />
          
          <path d="M0,400 Q300,350 600,400 T1200,400 T1800,400 T2400,400" 
                stroke="url(#wave-gradient)" 
                strokeWidth="2.5" 
                fill="none"
                style={{ animation: 'waveFlow 20s linear infinite' }} />
        </svg>

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
            animation: `floatParticle ${15 + Math.random() * 20}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* ===== HERO SECTION ===== */}
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '0 20px',
            animation: 'fadeInUp 1s ease'
          }}>
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid #ef4444',
                borderRadius: '50px',
                padding: '8px 20px',
                marginBottom: '30px',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🚀</span>
                <span style={{ color: '#ef4444', fontWeight: '500' }}>
                  Trusted by 15,000+ creators
                </span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                fontWeight: '800',
                margin: '0 0 20px 0',
                background: 'linear-gradient(135deg, #ef4444, #3b82f6, #8b5cf6, #ef4444)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientFlow 8s ease infinite',
                letterSpacing: '-0.02em'
              }}
            >
              NexStream
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '20px',
                fontWeight: '300'
              }}
            >
              Create, Share & Earn on Your Terms
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                fontSize: '1.1rem',
                color: '#888',
                maxWidth: '600px',
                margin: '0 auto 40px',
                lineHeight: '1.6'
              }}
            >
              Join thousands of creators building their audience and earning money 
              through content, referrals, and network marketing.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '60px'
              }}
            >
              <Link
                to="/register"
                style={{
                  padding: '16px 40px',
                  background: '#ef4444',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  boxShadow: '0 10px 20px rgba(239,68,68,0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                Create Free Account
              </Link>
              
              <Link
                to="/login"
                style={{
                  padding: '16px 40px',
                  background: 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  border: '2px solid rgba(239,68,68,0.5)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(239,68,68,0.1)';
                  e.target.style.borderColor = '#ef4444';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(239,68,68,0.5)';
                }}
              >
                Sign In
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '60px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {stats.users.toLocaleString()}+
                </div>
                <div style={{ color: '#888' }}>Active Users</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {stats.creators.toLocaleString()}+
                </div>
                <div style={{ color: '#888' }}>Content Creators</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  ${(stats.earnings / 1000000).toFixed(1)}M+
                </div>
                <div style={{ color: '#888' }}>Paid to Creators</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ===== FEATURES SECTION ===== */}
        <div style={{ padding: '80px 20px', background: '#0f0f0f' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ fontSize: '2.5rem', marginBottom: '20px' }}
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ color: '#888', fontSize: '1.1rem', marginBottom: '60px' }}
            >
              Join for free and unlock powerful tools to grow your audience and income
            </motion.p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {[
                {
                  icon: '🎬',
                  title: 'Content Creation',
                  desc: 'Upload videos, music, and games. Set your own prices and earn up to 100% revenue.'
                },
                {
                  icon: '🤝',
                  title: 'Network Marketing',
                  desc: 'Earn 10% from referrals, 5% from their referrals, and 2.5% from third level.'
                },
                {
                  icon: '💬',
                  title: 'Real-Time Chat',
                  desc: 'Connect with fans and fellow creators through our WhatsApp-style messaging.'
                },
                {
                  icon: '🤖',
                  title: 'AI Assistant',
                  desc: '24/7 support to help you navigate the platform and maximize your earnings.'
                },
                {
                  icon: '💰',
                  title: 'Multiple Revenue Streams',
                  desc: 'Earn from content sales, referrals, business accounts, and more.'
                },
                {
                  icon: '🛡️',
                  title: 'Secure Payments',
                  desc: 'Fast, secure payouts via M-Pesa, Airtel, Tigo Pesa, and bank transfers.'
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    background: '#1a1a1a',
                    borderRadius: '15px',
                    padding: '30px',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
                  <h3 style={{ marginBottom: '10px' }}>{feature.title}</h3>
                  <p style={{ color: '#888', lineHeight: '1.6' }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <div style={{ padding: '80px 20px', background: '#0a0a0a' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ fontSize: '2.5rem', marginBottom: '20px' }}
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ color: '#888', fontSize: '1.1rem', marginBottom: '60px' }}
            >
              Get started in minutes, start earning immediately
            </motion.p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px'
            }}>
              {[
                { step: '1', title: 'Create Account', desc: 'Sign up for free in under 2 minutes' },
                { step: '2', title: 'Upload Content', desc: 'Share your videos, music, or games' },
                { step: '3', title: 'Grow Audience', desc: 'Build your community and followers' },
                { step: '4', title: 'Earn Money', desc: 'Get paid via M-Pesa or bank transfer' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  style={{ position: 'relative' }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: '0 auto 20px'
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ color: '#888' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== CALL TO ACTION SECTION ===== */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #3b82f6, #8b5cf6)',
          backgroundSize: '300% 300%',
          animation: 'gradientFlow 10s ease infinite',
          padding: '100px 20px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '700' }}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9 }}
            >
              Join thousands of creators already earning on NexStream. 
              No credit card required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                to="/register"
                style={{
                  padding: '18px 50px',
                  background: 'white',
                  color: '#ef4444',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  display: 'inline-block',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
              >
                Create Free Account
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <footer style={{
          background: '#0a0a0a',
          padding: '60px 20px 30px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              marginBottom: '40px'
            }}>
              <div>
                <h3 style={{ color: '#ef4444', marginBottom: '20px', fontSize: '1.5rem' }}>NexStream</h3>
                <p style={{ color: '#888', lineHeight: '1.6' }}>
                  Empowering creators worldwide to build sustainable businesses through digital content.
                </p>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '20px' }}>Platform</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/movies" style={{ color: '#888', textDecoration: 'none' }}>Movies</Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/music" style={{ color: '#888', textDecoration: 'none' }}>Music</Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/games" style={{ color: '#888', textDecoration: 'none' }}>Games</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '20px' }}>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/about" style={{ color: '#888', textDecoration: 'none' }}>About</Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/contact" style={{ color: '#888', textDecoration: 'none' }}>Contact</Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/terms" style={{ color: '#888', textDecoration: 'none' }}>Terms</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '20px' }}>Follow Us</h4>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <a href="#" style={{ color: '#888', fontSize: '1.5rem' }}>📘</a>
                  <a href="#" style={{ color: '#888', fontSize: '1.5rem' }}>🐦</a>
                  <a href="#" style={{ color: '#888', fontSize: '1.5rem' }}>📷</a>
                </div>
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              paddingTop: '30px',
              borderTop: '1px solid #1f1f1f',
              color: '#888'
            }}>
              <p>&copy; 2026 NexStream. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== ANIMATION STYLES ===== */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes floatParticle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
          }
          
          @keyframes waveFlow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes waveFlowReverse {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
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
      
      {/* ===== HERO SECTION ===== */}
      <div style={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(239,68,68,0.2) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>

        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 20s infinite'
        }}></div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '900px',
          padding: '0 20px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Trust Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid #ef4444',
              borderRadius: '50px',
              padding: '8px 20px',
              marginBottom: '30px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🚀</span>
              <span style={{ color: '#ef4444', fontWeight: '500' }}>
                Trusted by 15,000+ creators
              </span>
            </div>

            {/* Main Title */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: '800',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #ef4444, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Create, Share & Earn
              </span>
              <br />
              on Your Terms
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '1.2rem',
              color: '#888',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Join thousands of creators building their audience and earning money 
              through content, referrals, and network marketing.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '60px'
            }}>
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
                  border: '2px solid rgba(239,68,68,0.5)'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '60px',
              flexWrap: 'wrap'
            }}>
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div style={{ padding: '80px 20px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
            Everything You Need to Succeed
          </h2>
          <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '60px' }}>
            Join for free and unlock powerful tools to grow your audience and income
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                icon: '🎬',
                title: 'Content Creation',
                desc: 'Upload videos, music, and games. Set your own prices and earn 70-100% revenue.'
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
              <div
                key={i}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  padding: '30px',
                  textAlign: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
                <h3 style={{ marginBottom: '10px' }}>{feature.title}</h3>
                <p style={{ color: '#888', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444, #3b82f6)',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
          Ready to Start Your Journey?
        </h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
          Join thousands of creators already earning on NexStream
        </p>
        <Link
          to="/register"
          style={{
            padding: '16px 40px',
            background: 'white',
            color: '#ef4444',
            textDecoration: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: '600',
            display: 'inline-block',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          Create Free Account
        </Link>
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
              <h3 style={{ color: '#ef4444', marginBottom: '20px' }}>NexStream</h3>
              <p style={{ color: '#888' }}>Empowering creators worldwide</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }}>Platform</h4>
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
              <h4 style={{ marginBottom: '20px' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '15px' }}>
                <a href="#" style={{ color: '#888' }}>📘</a>
                <a href="#" style={{ color: '#888' }}>🐦</a>
                <a href="#" style={{ color: '#888' }}>📷</a>
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

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -30px) scale(1.1); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIHomeWidget from './AIHomeWidget';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* ===== ANIMATED BACKGROUND ELEMENTS ===== */}
      
      {/* Floating orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0,180,216,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 20s infinite ease-in-out',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 25s infinite ease-in-out reverse',
        zIndex: 0
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'float 15s infinite ease-in-out',
        zIndex: 0
      }}></div>

      {/* Animated wave lines */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00b4d8" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#0077b6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00b4d8" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 */}
        <path d="M0,100 Q150,50 300,100 T600,100 T900,100 T1200,100 T1500,100 T1800,100 T2100,100 T2400,100" 
              stroke="url(#wave-gradient)" 
              strokeWidth="3" 
              fill="none"
              style={{
                animation: 'waveFlow 25s linear infinite'
              }} />
        
        {/* Wave 2 */}
        <path d="M0,200 Q200,250 400,200 T800,200 T1200,200 T1600,200 T2000,200 T2400,200" 
              stroke="url(#wave-gradient)" 
              strokeWidth="2" 
              fill="none"
              style={{
                animation: 'waveFlowReverse 30s linear infinite'
              }} />
        
        {/* Wave 3 */}
        <path d="M0,300 Q300,350 600,300 T1200,300 T1800,300 T2400,300" 
              stroke="url(#wave-gradient)" 
              strokeWidth="2.5" 
              fill="none"
              style={{
                animation: 'waveFlow 20s linear infinite'
              }} />
      </svg>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: '2px',
          height: '2px',
          background: 'rgba(100,255,218,0.3)',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(0,180,216,0.5)',
          animation: `floatParticle ${15 + Math.random() * 20}s linear infinite`,
          animationDelay: `${Math.random() * 10}s`,
          zIndex: 1
        }}></div>
      ))}

      {/* ===== MAIN CONTENT ===== */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Hero Section */}
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', padding: '0 20px' }}>
            
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0,180,216,0.3)',
              borderRadius: '50px',
              padding: '8px 20px',
              marginBottom: '30px',
              animation: 'glow 3s ease-in-out infinite'
            }}>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <span style={{ color: '#00b4d8', fontWeight: '500' }}>The Future of Digital Entertainment</span>
            </div>

            {/* Main Title */}
            <h1 style={{
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              fontWeight: '800',
              margin: '0 0 20px 0',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6, #ff69b4, #00b4d8)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientFlow 8s ease infinite',
              textShadow: '0 0 30px rgba(0,180,216,0.3)'
            }}>
              NexStream
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '20px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              Create. Sell. Connect. Earn.
            </p>

            {/* Description */}
            <p style={{
              fontSize: '1.1rem',
              color: '#888',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              The all-in-one platform where creators build channels, sell content, 
              and connect with fans through real-time chat and network marketing.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to="/register"
                style={{
                  padding: '15px 40px',
                  background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,180,216,0.3)',
                  transition: 'all 0.3s ease',
                  animation: 'pulse 3s ease-in-out infinite'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(0,180,216,0.4)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 20px rgba(0,180,216,0.3)';
                }}
              >
                Start Your Channel Free
              </Link>

              <Link
                to="/login"
                style={{
                  padding: '15px 40px',
                  background: 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: '2px solid rgba(0,180,216,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(0,180,216,0.1)';
                  e.target.style.borderColor = '#00b4d8';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(0,180,216,0.5)';
                }}
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '50px',
              justifyContent: 'center',
              marginTop: '60px',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00b4d8' }}>10K+</div>
                <div style={{ color: '#888' }}>Active Creators</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff69b4' }}>50K+</div>
                <div style={{ color: '#888' }}>Content Items</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>1M+</div>
                <div style={{ color: '#888' }}>Monthly Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== ENHANCED GET STARTED SECTION ===== */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 60px',
          padding: '40px 30px',
          background: 'linear-gradient(135deg, rgba(0,180,216,0.1), rgba(0,119,182,0.05))',
          borderRadius: '30px',
          border: '1px solid rgba(0,180,216,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '2.2rem', 
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {user ? '👋 Welcome Back!' : '🚀 Start Your Creator Journey'}
            </h2>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
              {user 
                ? 'What would you like to do today?' 
                : 'Choose how you want to begin your success story on NexStream'}
            </p>
          </div>

          {/* Conditional Content based on login status */}
          {!user ? (
            /* Options for non-logged-in users */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '25px'
            }}>
              
              {/* Option 1: Watch Content */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '30px 25px',
                border: '1px solid #333',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#00b4d8';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,180,216,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => window.location.href = '/explore'}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2.5rem'
                }}>
                  👁️
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Watch & Explore</h3>
                <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.6' }}>
                  Discover amazing content from creators around the world. Find your next favorite channel.
                </p>
                <div style={{ color: '#00b4d8', fontWeight: 'bold' }}>
                  Browse Content →
                </div>
              </div>

              {/* Option 2: Create Channel (Popular) */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '30px 25px',
                border: '2px solid #00b4d8',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,180,216,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,180,216,0.2)';
              }}
              onClick={() => window.location.href = '/register'}
              >
                {/* Popular Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '-30px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: 'black',
                  padding: '5px 40px',
                  transform: 'rotate(45deg)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  MOST POPULAR
                </div>

                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2.5rem'
                }}>
                  🎬
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Create a Channel</h3>
                <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.6' }}>
                  Start your creator journey today. Build your audience and earn money from your passion.
                </p>
                <div style={{ 
                  background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  display: 'inline-block',
                  fontWeight: 'bold'
                }}>
                  Sign Up Free →
                </div>
              </div>

              {/* Option 3: Earn Money */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '30px 25px',
                border: '1px solid #333',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#4CAF50';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(76,175,80,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => window.location.href = '/affiliate'}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2.5rem'
                }}>
                  💰
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Earn Money</h3>
                <p style={{ color: '#aaa', marginBottom: '20px', lineHeight: '1.6' }}>
                  Join our MLM program and earn commissions from referrals. Make money while you sleep.
                </p>
                <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  Learn About MLM →
                </div>
              </div>
            </div>
          ) : (
            /* Options for logged-in users */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              
              <button onClick={() => window.location.href = '/upload'}
                style={{
                  padding: '20px',
                  background: 'rgba(0,180,216,0.1)',
                  border: '1px solid #00b4d8',
                  borderRadius: '15px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,180,216,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,180,216,0.1)'}
              >
                📤 Upload Content
              </button>

              <button onClick={() => window.location.href = '/channel-settings'}
                style={{
                  padding: '20px',
                  background: 'rgba(255,215,0,0.1)',
                  border: '1px solid #FFD700',
                  borderRadius: '15px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,215,0,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,215,0,0.1)'}
              >
                ⚙️ Channel Settings
              </button>

              <button onClick={() => window.location.href = '/activities'}
                style={{
                  padding: '20px',
                  background: 'rgba(76,175,80,0.1)',
                  border: '1px solid #4CAF50',
                  borderRadius: '15px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(76,175,80,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(76,175,80,0.1)'}
              >
                📊 View Analytics
              </button>

              <button onClick={() => window.location.href = '/affiliate'}
                style={{
                  padding: '20px',
                  background: 'rgba(255,68,68,0.1)',
                  border: '1px solid #ff4444',
                  borderRadius: '15px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,68,68,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,68,68,0.1)'}
              >
                🤝 MLM Referrals
              </button>
            </div>
          )}

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '40px',
            color: '#666',
            fontSize: '0.9rem',
            flexWrap: 'wrap'
          }}>
            <span>🔒 Secure Payments</span>
            <span>⚡ Instant Withdrawals</span>
            <span>🌍 Global Community</span>
            <span>🛡️ Creator Protection</span>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 60px',
          padding: '0 20px'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Everything You Need to Succeed
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: "🎬", title: "Sell Your Content", desc: "Upload movies, music, videos and games. Set your own prices and earn directly." },
              { icon: "💬", title: "Real-Time Chat", desc: "Connect with fans instantly. WhatsApp-like messaging with media sharing." },
              { icon: "👥", title: "Network Marketing", desc: "Built-in MLM system. Refer others and earn lifetime commissions." },
              { icon: "💰", title: "Multiple Revenue Streams", desc: "Subscriptions, rentals, one-time purchases, tips, and affiliate sales." }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '15px',
                padding: '30px 20px',
                textAlign: 'center',
                border: '1px solid #333',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#00b4d8';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,180,216,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#333';
              }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{feature.icon}</div>
                <h3 style={{ marginBottom: '10px' }}>{feature.title}</h3>
                <p style={{ color: '#888', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Start?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
            Join thousands of creators already earning on NexStream
          </p>
          <Link
            to={user ? '/create-channel' : '/register'}
            style={{
              padding: '15px 40px',
              background: 'white',
              color: '#0077b6',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {user ? 'Create Your Channel' : 'Get Started Free'}
          </Link>
        </div>

        {/* Footer */}
        <footer style={{
          background: '#0a0f1e',
          padding: '40px 20px',
          borderTop: '1px solid #1e2a3a'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px'
          }}>
            <div>
              <h3 style={{ color: '#00b4d8', marginBottom: '20px' }}>NexStream</h3>
              <p style={{ color: '#888', lineHeight: '1.6' }}>
                Empowering creators to build sustainable businesses through digital content and community.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}><Link to="/explore" style={{ color: '#888', textDecoration: 'none' }}>Explore</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/channels" style={{ color: '#888', textDecoration: 'none' }}>Channels</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/trending" style={{ color: '#888', textDecoration: 'none' }}>Trending</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Creator</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}><Link to="/create-channel" style={{ color: '#888', textDecoration: 'none' }}>Start Channel</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/upload" style={{ color: '#888', textDecoration: 'none' }}>Upload</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/affiliate" style={{ color: '#888', textDecoration: 'none' }}>MLM Program</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '10px' }}><Link to="/guidelines" style={{ color: '#888', textDecoration: 'none' }}>Guidelines</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/terms" style={{ color: '#888', textDecoration: 'none' }}>Terms</Link></li>
                <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #1e2a3a',
            color: '#666'
          }}>
            © 2026 NexStream. All rights reserved.
          </div>
        </footer>
      </div>

      {/* AI Assistant Widget */}
      <AIHomeWidget />

      {/* Animation styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes waveFlow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes waveFlowReverse {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          @keyframes floatParticle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
          }
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0,180,216,0.2); }
            50% { box-shadow: 0 0 40px rgba(0,180,216,0.4); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
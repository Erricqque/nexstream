import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Hero = ({ onCtaClick }) => {
  return (
    <section style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2a 50%, #16213e 100%)'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1
      }}>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#FF3366',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center'
        }}>
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(255,51,102,0.1)',
                padding: '8px 16px',
                borderRadius: '30px',
                display: 'inline-block',
                marginBottom: '30px',
                border: '1px solid rgba(255,51,102,0.3)'
              }}
            >
              <span style={{ color: '#FF3366', fontWeight: '600' }}>
                🚀 Join the Creator Economy
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '800',
                lineHeight: 1.2,
                marginBottom: '30px',
                color: 'white'
              }}
            >
              Share Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Creativity
              </span>
              <br />
              Build Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #4FACFE, #43E97B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Empire
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: '1.2rem',
                lineHeight: 1.6,
                color: '#aaa',
                marginBottom: '40px',
                maxWidth: '600px'
              }}
            >
              Join millions of creators who are turning their passion into profit. 
              Upload videos, share music, create games, and earn from your content 
              with the most creator-friendly platform on the web.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
            >
              <Button variant="primary" size="large" onClick={onCtaClick}>
                Start Creating Free
              </Button>
              <Button variant="outline" size="large" onClick={() => window.location.href = '/browse'}>
                Explore Content
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                display: 'flex',
                gap: '30px',
                marginTop: '50px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,51,102,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF3366',
                  fontSize: '1.2rem'
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>10M+</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Active Users</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(79,172,254,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4FACFE',
                  fontSize: '1.2rem'
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>$50M+</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Paid to Creators</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(67,233,123,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#43E97B',
                  fontSize: '1.2rem'
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'white' }}>100+</div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Countries</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image/Video */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: 'relative',
              height: '600px',
              borderRadius: '30px',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,51,102,0.2), rgba(79,172,254,0.2))',
              zIndex: 1
            }} />
            
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
            </video>

            {/* Floating Cards */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '50px',
                left: '30px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '15px 25px',
                borderRadius: '15px',
                border: '1px solid rgba(255,255,255,0.2)',
                zIndex: 2
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  🎬
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>New Video Upload</div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>by Creator • 2 min ago</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              style={{
                position: 'absolute',
                bottom: '50px',
                right: '30px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '15px 25px',
                borderRadius: '15px',
                border: '1px solid rgba(255,255,255,0.2)',
                zIndex: 2
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #43E97B, #4FACFE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  💰
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>$1,234 Earned Today</div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>by Creator • Top earner</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const CTA = ({ onPrimaryClick, onSecondaryClick }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEarlyAccess = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
      // Here you would typically send this to your backend
      console.log('Early access email:', email);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      navigate('/register');
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      navigate('/browse');
    }
  };

  return (
    <section style={{
      padding: '100px 20px',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,51,102,0.2) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-50%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,172,254,0.2) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite reverse'
      }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-block',
              background: 'rgba(255,51,102,0.1)',
              padding: '8px 20px',
              borderRadius: '30px',
              marginBottom: '30px',
              border: '1px solid rgba(255,51,102,0.3)'
            }}
          >
            <span style={{ color: '#FF3366', fontWeight: '600' }}>
              ⚡ Limited Time Offer
            </span>
          </motion.div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            marginBottom: '20px',
            color: 'white',
            lineHeight: 1.3
          }}>
            Ready to Start Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Creator Journey?
            </span>
          </h2>

          <p style={{
            fontSize: '1.2rem',
            color: '#888',
            marginBottom: '40px',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Join millions of creators who are already building their future on NexStream. 
            Start uploading, earning, and growing today.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            <Button variant="primary" size="large" onClick={handlePrimaryClick}>
              Create Free Account
            </Button>
            <Button variant="outline" size="large" onClick={handleSecondaryClick}>
              Explore Content
            </Button>
          </div>

          {/* Early Access Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{
              maxWidth: '400px',
              margin: '0 auto 40px',
              background: 'rgba(255,255,255,0.02)',
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '1.2rem' }}>
              Get Early Access
            </h3>
            <form onSubmit={handleEarlyAccess} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isSubmitted}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#2a2a2a',
                  border: '1px solid #333',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isSubmitted}
                style={{
                  padding: '12px 24px',
                  background: isSubmitted ? '#43E97B' : '#FF3366',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: isSubmitted ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isSubmitted ? '✓ Sent' : 'Notify Me'}
              </button>
            </form>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#43E97B', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#888' }}>No credit card required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#43E97B', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#888' }}>Cancel anytime</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#43E97B', fontSize: '1.2rem' }}>✓</span>
              <span style={{ color: '#888' }}>Start earning immediately</span>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            style={{
              marginTop: '60px',
              padding: '30px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.95rem' }}>
              Trusted by creators from
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              opacity: 0.7
            }}>
              {['YouTube', 'TikTok', 'Instagram', 'Twitch'].map((platform, index) => (
                <motion.span
                  key={platform}
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 'bold', 
                    color: '#666',
                    letterSpacing: '1px'
                  }}
                >
                  {platform}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
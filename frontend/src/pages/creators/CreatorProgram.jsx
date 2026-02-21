import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreatorProgram = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const benefits = [
    {
      icon: '💰',
      title: 'Higher Revenue Share',
      desc: 'Earn up to 90% of your content revenue'
    },
    {
      icon: '🎁',
      title: 'Exclusive Perks',
      desc: 'Early access to new features and tools'
    },
    {
      icon: '👥',
      title: 'Priority Support',
      desc: '24/7 dedicated support for creators'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      desc: 'Detailed insights into your audience'
    },
    {
      icon: '🏆',
      title: 'Badges & Recognition',
      desc: 'Get verified and featured on platform'
    },
    {
      icon: '🎓',
      title: 'Creator Academy',
      desc: 'Exclusive courses and mentorship'
    }
  ];

  const tiers = [
    {
      name: 'Rising Creator',
      requirements: '1K followers • 10K views/month',
      benefits: ['70% revenue share', 'Basic analytics', 'Community access']
    },
    {
      name: 'Professional Creator',
      requirements: '10K followers • 100K views/month',
      benefits: ['80% revenue share', 'Advanced analytics', 'Priority support', 'MLM access']
    },
    {
      name: 'Elite Creator',
      requirements: '100K followers • 1M views/month',
      benefits: ['90% revenue share', 'Custom domain', 'Dedicated manager', 'Early access']
    }
  ];

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
        padding: `${spacing.xxl} ${spacing.xl}`,
        textAlign: 'center'
      }}>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.md
          }}
        >
          Creator Program
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: fontSize.lg,
            maxWidth: '700px',
            margin: '0 auto',
            opacity: 0.9
          }}
        >
          Join an exclusive community of creators and unlock premium benefits
        </motion.p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${spacing.xxl} ${spacing.xl}`
      }}>
        {/* Benefits Grid */}
        <h2 style={{ fontSize: fontSize.xl, textAlign: 'center', marginBottom: spacing.xl }}>
          Program Benefits
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.lg,
          marginBottom: spacing.xxl
        }}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: spacing.xl,
                textAlign: 'center',
                border: '1px solid #333'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>{benefit.icon}</div>
              <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.sm }}>{benefit.title}</h3>
              <p style={{ color: '#888' }}>{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Program Tiers */}
        <h2 style={{ fontSize: fontSize.xl, textAlign: 'center', marginBottom: spacing.xl }}>
          Creator Tiers
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.lg,
          marginBottom: spacing.xxl
        }}>
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: spacing.xl,
                border: index === 1 ? '2px solid #FF3366' : '1px solid #333',
                position: 'relative'
              }}
            >
              {index === 1 && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#FF3366',
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: '20px',
                  fontSize: fontSize.xs
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: fontSize.lg, color: '#FF3366', marginBottom: spacing.sm }}>
                {tier.name}
              </h3>
              <p style={{ color: '#888', marginBottom: spacing.md }}>{tier.requirements}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {tier.benefits.map((benefit, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.sm,
                    color: '#ccc'
                  }}>
                    <span style={{ color: '#43E97B' }}>✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* How to Join */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '15px',
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.xl, textAlign: 'center', marginBottom: spacing.xl }}>
            How to Join
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: spacing.xl
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#FF3366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize.xl,
                margin: '0 auto',
                marginBottom: spacing.md
              }}>1</div>
              <h3>Create Account</h3>
              <p style={{ color: '#888' }}>Sign up for a free NexStream account</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#4FACFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize.xl,
                margin: '0 auto',
                marginBottom: spacing.md
              }}>2</div>
              <h3>Upload Content</h3>
              <p style={{ color: '#888' }}>Start sharing your creativity with the world</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#43E97B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize.xl,
                margin: '0 auto',
                marginBottom: spacing.md
              }}>3</div>
              <h3>Get Invited</h3>
              <p style={{ color: '#888' }}>Top creators receive program invitations</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
          borderRadius: '15px',
          padding: spacing.xxl,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
            Ready to Level Up?
          </h2>
          <p style={{ fontSize: fontSize.lg, marginBottom: spacing.lg, opacity: 0.9 }}>
            Start your creator journey today
          </p>
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: 'white',
                border: 'none',
                borderRadius: '30px',
                color: '#FF3366',
                fontSize: fontSize.md,
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Join Now
            </button>
            <Link to="/">
              <button style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: 'transparent',
                border: '2px solid white',
                borderRadius: '30px',
                color: 'white',
                fontSize: fontSize.md,
                cursor: 'pointer'
              }}>
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatorProgram;
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: '🎬',
      title: 'Upload Anything',
      description: 'Videos, music, games, courses - all in one place with support for 50+ formats',
      color: '#FF3366',
      stats: '50+ formats'
    },
    {
      icon: '💰',
      title: 'Multiple Income Streams',
      description: 'Earn from ads, subscriptions, tips, and our revolutionary MLM commission system',
      color: '#4FACFE',
      stats: '4 ways to earn'
    },
    {
      icon: '🌍',
      title: 'Global Audience',
      description: 'Reach millions of viewers in over 100 countries with built-in translation',
      color: '#43E97B',
      stats: '100+ countries'
    },
    {
      icon: '📊',
      title: 'Real-Time Analytics',
      description: 'Track your growth, earnings, and audience engagement in real-time',
      color: '#F59E0B',
      stats: 'Live dashboard'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Tools',
      description: 'Smart recommendations, automated thumbnails, and content optimization',
      color: '#A78BFA',
      stats: '24/7 AI assistance'
    },
    {
      icon: '🔒',
      title: 'Creator Protection',
      description: 'Copyright protection, content ID, and dispute resolution',
      color: '#F472B6',
      stats: '100% secure'
    }
  ];

  return (
    <section style={{
      padding: '100px 20px',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,51,102,0.1) 0%, transparent 70%)',
        zIndex: 0
      }} />
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '20px',
            color: 'white'
          }}>
            Everything You Need to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Succeed
            </span>
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#888',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Powerful tools and features designed to help creators at every stage of their journey
          </p>
        </motion.div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '40px 30px',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Gradient border on hover */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                opacity: 0,
                transition: 'opacity 0.3s'
              }} className="feature-border" />

              <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>{feature.icon}</div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '15px',
                color: 'white',
                fontWeight: '600'
              }}>{feature.title}</h3>
              <p style={{
                color: '#888',
                lineHeight: 1.6,
                marginBottom: '20px',
                fontSize: '1rem'
              }}>{feature.description}</p>
              
              {/* Stats Badge */}
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: `rgba(${feature.color === '#FF3366' ? '255,51,102' : 
                  feature.color === '#4FACFE' ? '79,172,254' : 
                  feature.color === '#43E97B' ? '67,233,123' : 
                  feature.color === '#F59E0B' ? '245,158,11' : 
                  feature.color === '#A78BFA' ? '167,139,250' : '244,114,182'}, 0.1)`,
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: feature.color
              }}>
                {feature.stats}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            textAlign: 'center',
            marginTop: '60px'
          }}
        >
          <Link to="/register">
            <button style={{
              padding: '18px 45px',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255,51,102,0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
              Start Creating Free
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
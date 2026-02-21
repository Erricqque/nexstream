import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const [counts, setCounts] = useState({
    creators: 0,
    videos: 0,
    earnings: 0,
    countries: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const targetCounts = {
    creators: 15000000,
    videos: 25000000,
    earnings: 50000000,
    countries: 120
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounts();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounts = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        creators: Math.min(Math.floor((targetCounts.creators / steps) * step), targetCounts.creators),
        videos: Math.min(Math.floor((targetCounts.videos / steps) * step), targetCounts.videos),
        earnings: Math.min(Math.floor((targetCounts.earnings / steps) * step), targetCounts.earnings),
        countries: Math.min(Math.floor((targetCounts.countries / steps) * step), targetCounts.countries)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num}`;
  };

  return (
    <section ref={sectionRef} style={{
      padding: '80px 20px',
      background: 'linear-gradient(135deg, #1a1a2a, #16213e)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,51,102,0.3) 0%, transparent 50%)'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '50px',
            color: 'white'
          }}
        >
          NexStream by the{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Numbers
          </span>
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px'
        }}>
          {/* Creators Stat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #FF3366, #FF6B3B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              {formatNumber(counts.creators)}+
            </div>
            <div style={{ color: '#888', fontSize: '1.1rem' }}>Active Creators</div>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #FF3366, transparent)',
              margin: '15px auto'
            }} />
          </motion.div>

          {/* Videos Stat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #4FACFE, #00F2FE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              {formatNumber(counts.videos)}+
            </div>
            <div style={{ color: '#888', fontSize: '1.1rem' }}>Videos & Content</div>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #4FACFE, transparent)',
              margin: '15px auto'
            }} />
          </motion.div>

          {/* Earnings Stat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #43E97B, #38F9D7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              {formatCurrency(counts.earnings)}+
            </div>
            <div style={{ color: '#888', fontSize: '1.1rem' }}>Paid to Creators</div>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #43E97B, transparent)',
              margin: '15px auto'
            }} />
          </motion.div>

          {/* Countries Stat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              {counts.countries}+
            </div>
            <div style={{ color: '#888', fontSize: '1.1rem' }}>Countries Worldwide</div>
            <div style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #F59E0B, transparent)',
              margin: '15px auto'
            }} />
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '60px',
            flexWrap: 'wrap'
          }}
        >
          {['Secure Payments', '24/7 Support', 'Creator First', 'MLM Ready'].map((badge, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#666'
            }}>
              <span style={{ color: '#43E97B', fontSize: '1.2rem' }}>✓</span>
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
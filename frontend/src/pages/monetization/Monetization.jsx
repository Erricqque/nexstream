import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Monetization = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const revenueStreams = [
    {
      icon: '👁️',
      title: 'Ad Revenue',
      description: 'Earn from ads shown on your content',
      rate: '60% revenue share',
      requirements: '1,000 views/month',
      color: '#FF3366'
    },
    {
      icon: '💎',
      title: 'Subscriptions',
      description: 'Monthly recurring revenue from fans',
      rate: '70% revenue share',
      requirements: '500 subscribers',
      color: '#4FACFE'
    },
    {
      icon: '🎁',
      title: 'Tips & Donations',
      description: 'Direct support from your audience',
      rate: '90% revenue share',
      requirements: 'No minimum',
      color: '#43E97B'
    },
    {
      icon: '🌳',
      title: 'MLM Commissions',
      description: 'Earn from your referral network',
      rate: 'Up to 18% commission',
      requirements: 'Active referral program',
      color: '#F59E0B'
    },
    {
      icon: '💰',
      title: 'Content Sales',
      description: 'Sell your content directly',
      rate: '85% revenue share',
      requirements: 'Pro account',
      color: '#A78BFA'
    },
    {
      icon: '🏆',
      title: 'Bonuses',
      description: 'Performance-based incentives',
      rate: 'Up to $5,000/month',
      requirements: 'Top creators',
      color: '#F472B6'
    }
  ];

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      features: [
        '60% ad revenue share',
        'Tips enabled',
        'Basic analytics',
        'Standard support'
      ],
      color: '#888'
    },
    {
      name: 'Pro',
      price: '$9.99/mo',
      features: [
        '70% ad revenue share',
        'Subscriptions enabled',
        'Content sales',
        'Advanced analytics',
        'Priority support',
        'Custom domain'
      ],
      color: '#FF3366',
      popular: true
    },
    {
      name: 'Business',
      price: '$29.99/mo',
      features: [
        '75% ad revenue share',
        'MLM program access',
        'Team accounts',
        'API access',
        'Dedicated manager',
        'Custom branding'
      ],
      color: '#4FACFE'
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
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Monetization Options
          </h1>
          <p style={{ color: '#888', fontSize: fontSize.lg }}>
            Multiple ways to earn from your content
          </p>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.xl,
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: spacing.lg
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: fontSize.xxl, fontWeight: 'bold' }}>$50M+</div>
            <div style={{ opacity: 0.9 }}>Paid to Creators</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: fontSize.xxl, fontWeight: 'bold' }}>5M+</div>
            <div style={{ opacity: 0.9 }}>Active Creators</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: fontSize.xxl, fontWeight: 'bold' }}>120+</div>
            <div style={{ opacity: 0.9 }}>Countries</div>
          </div>
        </motion.div>

        {/* Revenue Streams */}
        <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg, textAlign: 'center' }}>
          Revenue Streams
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          {revenueStreams.map((stream, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.xl,
                borderTop: `4px solid ${stream.color}`
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>{stream.icon}</div>
              <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.sm }}>{stream.title}</h3>
              <p style={{ color: '#888', marginBottom: spacing.md }}>{stream.description}</p>
              <p style={{ color: stream.color, fontWeight: 'bold', marginBottom: spacing.xs }}>
                {stream.rate}
              </p>
              <p style={{ color: '#666', fontSize: fontSize.sm }}>{stream.requirements}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg, textAlign: 'center' }}>
          Choose Your Plan
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ y: -10 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.xl,
                position: 'relative',
                border: tier.popular ? `2px solid ${tier.color}` : 'none',
                transform: tier.popular ? 'scale(1.05)' : 'none',
                zIndex: tier.popular ? 1 : 0
              }}
            >
              {tier.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: tier.color,
                  padding: `${spacing.xs} ${spacing.lg}`,
                  borderRadius: '20px',
                  fontSize: fontSize.xs,
                  fontWeight: 'bold'
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: fontSize.xl, color: tier.color, marginBottom: spacing.xs }}>
                {tier.name}
              </h3>
              <p style={{ fontSize: fontSize.xxl, fontWeight: 'bold', marginBottom: spacing.lg }}>
                {tier.price}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: spacing.xl }}>
                {tier.features.map((feature, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.sm,
                    color: '#ccc'
                  }}>
                    <span style={{ color: '#43E97B' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: tier.color,
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: fontSize.md,
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg, textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: spacing.xl
          }}>
            {[
              {
                q: 'When do I get paid?',
                a: 'Payouts are processed weekly for balances over $10. Funds arrive within 1-3 business days.'
              },
              {
                q: 'What is the minimum payout?',
                a: 'The minimum payout amount is $10 USD across all payment methods.'
              },
              {
                q: 'How are earnings calculated?',
                a: 'Earnings are based on views, engagement, and your revenue share tier.'
              },
              {
                q: 'Can I use multiple monetization methods?',
                a: 'Yes, you can enable multiple revenue streams simultaneously.'
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3 style={{ color: '#4FACFE', marginBottom: spacing.sm }}>{faq.q}</h3>
                <p style={{ color: '#888', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monetization;
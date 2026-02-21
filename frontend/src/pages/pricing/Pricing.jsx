import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Pricing = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('pro');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        'Upload up to 50 videos',
        '500MB per file',
        'Basic analytics',
        'Community access',
        'Standard support'
      ],
      limitations: [
        'No MLM access',
        '70% revenue share',
        'Basic customization'
      ],
      color: '#888',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For serious creators',
      features: [
        'Unlimited uploads',
        '2GB per file',
        'Advanced analytics',
        'MLM program access',
        'Priority support',
        'Custom domain',
        '80% revenue share'
      ],
      color: '#FF3366',
      popular: true,
      savings: 'Save 17%'
    },
    {
      id: 'business',
      name: 'Business',
      price: { monthly: 29.99, yearly: 299.99 },
      description: 'For teams and businesses',
      features: [
        'Everything in Pro',
        'Team accounts (5 users)',
        'API access',
        'Dedicated account manager',
        'Custom branding',
        '85% revenue share',
        'Advanced MLM tools'
      ],
      color: '#4FACFE',
      popular: false,
      savings: 'Save 17%'
    }
  ];

  const features = [
    'Video Uploads',
    'File Size Limit',
    'Revenue Share',
    'MLM Program',
    'Analytics',
    'Support',
    'Custom Domain',
    'Team Accounts',
    'API Access'
  ];

  const comparisonData = {
    free: ['50/mo', '500MB', '70%', '❌', 'Basic', 'Standard', '❌', '❌', '❌'],
    pro: ['Unlimited', '2GB', '80%', '✅', 'Advanced', 'Priority', '✅', '❌', '❌'],
    business: ['Unlimited', '5GB', '85%', '✅', 'Advanced', 'Dedicated', '✅', '✅', '✅']
  };

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
            Simple, Transparent Pricing
          </h1>
          <p style={{ color: '#888', fontSize: fontSize.lg }}>
            Choose the plan that's right for your creator journey
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: spacing.xl
        }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '50px',
            padding: spacing.xs,
            display: 'inline-flex'
          }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: billingCycle === 'monthly' ? '#FF3366' : 'transparent',
                border: 'none',
                borderRadius: '30px',
                color: billingCycle === 'monthly' ? 'white' : '#888',
                cursor: 'pointer',
                fontSize: fontSize.md
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: billingCycle === 'yearly' ? '#FF3366' : 'transparent',
                border: 'none',
                borderRadius: '30px',
                color: billingCycle === 'yearly' ? 'white' : '#888',
                cursor: 'pointer',
                fontSize: fontSize.md,
                position: 'relative'
              }}
            >
              Yearly
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-20px',
                background: '#43E97B',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '0.6rem',
                color: 'white'
              }}>
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: spacing.xl,
                border: plan.popular ? '2px solid #FF3366' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '-30px',
                  background: '#FF3366',
                  padding: '8px 40px',
                  transform: 'rotate(45deg)',
                  fontSize: fontSize.xs,
                  fontWeight: 'bold'
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: spacing.lg }}>
                <h3 style={{ fontSize: fontSize.xl, color: plan.color, marginBottom: spacing.xs }}>
                  {plan.name}
                </h3>
                <p style={{ color: '#888', marginBottom: spacing.md }}>{plan.description}</p>
                <div style={{ marginBottom: spacing.md }}>
                  <span style={{ fontSize: fontSize.xxl, fontWeight: 'bold' }}>
                    ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span style={{ color: '#888', fontSize: fontSize.sm }}>
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                {plan.savings && billingCycle === 'yearly' && (
                  <p style={{ color: '#43E97B', fontSize: fontSize.sm }}>{plan.savings}</p>
                )}
              </div>

              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: plan.id === selectedPlan ? plan.color : 'transparent',
                  border: `2px solid ${plan.color}`,
                  borderRadius: '30px',
                  color: plan.id === selectedPlan ? 'white' : plan.color,
                  fontSize: fontSize.md,
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: spacing.lg
                }}
                onMouseEnter={() => setSelectedPlan(plan.id)}
              >
                {plan.price.monthly === 0 ? 'Get Started' : 'Choose Plan'}
              </button>

              <div>
                <p style={{ fontWeight: 'bold', marginBottom: spacing.md }}>Includes:</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {plan.features.map((feature, i) => (
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
                {plan.limitations && (
                  <>
                    <p style={{ fontWeight: 'bold', marginTop: spacing.md, marginBottom: spacing.md }}>
                      Limitations:
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          marginBottom: spacing.sm,
                          color: '#888'
                        }}>
                          <span style={{ color: '#FF3366' }}>✕</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl,
            marginBottom: spacing.xl,
            overflowX: 'auto'
          }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg, textAlign: 'center' }}>
            Compare Features
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: spacing.md, textAlign: 'left' }}>Feature</th>
                <th style={{ padding: spacing.md, textAlign: 'center' }}>Free</th>
                <th style={{ padding: spacing.md, textAlign: 'center' }}>Pro</th>
                <th style={{ padding: spacing.md, textAlign: 'center' }}>Business</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: spacing.md }}>{feature}</td>
                  <td style={{ padding: spacing.md, textAlign: 'center', color: '#888' }}>
                    {comparisonData.free[index]}
                  </td>
                  <td style={{ padding: spacing.md, textAlign: 'center', color: '#fff' }}>
                    {comparisonData.pro[index]}
                  </td>
                  <td style={{ padding: spacing.md, textAlign: 'center', color: '#fff' }}>
                    {comparisonData.business[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl
          }}
        >
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
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.'
              },
              {
                q: 'Is there a long-term contract?',
                a: 'No contracts. You can cancel anytime with no hidden fees.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and M-PESA for African creators.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee on all paid plans.'
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3 style={{ color: '#4FACFE', marginBottom: spacing.sm }}>{faq.q}</h3>
                <p style={{ color: '#888', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: spacing.xl,
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '10px',
            padding: spacing.xxl,
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
            Start Your Creator Journey Today
          </h2>
          <p style={{ fontSize: fontSize.lg, marginBottom: spacing.lg, opacity: 0.9 }}>
            Join millions of creators already earning on NexStream
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: 'white',
              border: 'none',
              borderRadius: '30px',
              color: '#FF3366',
              fontSize: fontSize.lg,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Get Started Free
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
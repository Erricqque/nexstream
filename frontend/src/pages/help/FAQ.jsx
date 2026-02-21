import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FAQ = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { id: 'general', name: 'General', icon: '📌' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'content', name: 'Content', icon: '🎬' },
    { id: 'earnings', name: 'Earnings', icon: '💰' },
    { id: 'mlm', name: 'MLM', icon: '🌳' },
    { id: 'technical', name: 'Technical', icon: '⚙️' }
  ];

  const faqs = {
    general: [
      {
        q: 'What is NexStream?',
        a: 'NexStream is a content creation platform where creators can upload videos, music, games, and earn money through views, subscriptions, and our MLM program.'
      },
      {
        q: 'Is NexStream free to use?',
        a: 'Yes, creating an account and uploading content is completely free. We only take a commission when you earn money.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply create an account, complete your profile, and start uploading content. Check out our Help Center for detailed guides.'
      }
    ],
    account: [
      {
        q: 'How do I change my password?',
        a: 'Go to Settings > Security to change your password. You\'ll need your current password to verify the change.'
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, you can delete your account from Settings > Account. Note that this action is irreversible.'
      },
      {
        q: 'How do I update my email?',
        a: 'Go to Settings > Account to update your email address. You\'ll receive a verification link at your new email.'
      }
    ],
    content: [
      {
        q: 'What file formats are supported?',
        a: 'We support MP4, MOV, AVI for videos; MP3, WAV for audio; JPG, PNG for images; and ZIP for games.'
      },
      {
        q: 'Is there a file size limit?',
        a: 'Free accounts can upload up to 500MB per file. Pro accounts get up to 2GB per file.'
      },
      {
        q: 'How do I get more views?',
        a: 'Optimize your titles, use eye-catching thumbnails, promote on social media, and engage with your audience.'
      }
    ],
    earnings: [
      {
        q: 'How much can I earn?',
        a: 'Earnings vary based on views, engagement, and your MLM network. Top creators earn $10,000+ monthly.'
      },
      {
        q: 'When do I get paid?',
        a: 'Payouts are processed weekly for balances over $10. Funds arrive within 1-3 business days.'
      },
      {
        q: 'What payment methods are available?',
        a: 'We support Flutterwave (bank transfer), PayPal, and M-PESA depending on your region.'
      }
    ],
    mlm: [
      {
        q: 'How does the MLM program work?',
        a: 'You earn commissions from your referrals and their downline. Level 1: 10%, Level 2: 5%, Level 3: 3%.'
      },
      {
        q: 'How do I refer someone?',
        a: 'Share your unique referral link from your dashboard. When they sign up, they become part of your network.'
      },
      {
        q: 'Is there a limit to my downline?',
        a: 'No, you can build an unlimited downline. The more you grow your network, the more you earn.'
      }
    ],
    technical: [
      {
        q: 'Why is my video not playing?',
        a: 'Try clearing your cache, updating your browser, or checking your internet connection. Contact support if issues persist.'
      },
      {
        q: 'Which browsers are supported?',
        a: 'We support the latest versions of Chrome, Firefox, Safari, and Edge.'
      },
      {
        q: 'Is there a mobile app?',
        a: 'Our platform is fully responsive and works great on mobile browsers. A native app is coming soon.'
      }
    ]
  };

  const allFaqs = Object.values(faqs).flat();
  const filteredFaqs = allFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: '#888' }}>
            Find answers to common questions about NexStream
          </p>
        </motion.div>

        {/* Search */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '50px',
          padding: spacing.xs,
          display: 'flex',
          alignItems: 'center',
          marginBottom: spacing.xl
        }}>
          <span style={{ padding: spacing.md, color: '#888' }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            style={{
              flex: 1,
              padding: `${spacing.md} 0`,
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: fontSize.md,
              outline: 'none'
            }}
          />
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          overflowX: 'auto',
          paddingBottom: spacing.xs,
          flexWrap: isMobile ? 'nowrap' : 'wrap'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: activeCategory === cat.id ? '#FF3366' : '#1a1a1a',
                border: 'none',
                borderRadius: '30px',
                color: activeCategory === cat.id ? 'white' : '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {searchQuery ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: spacing.lg
                }}
              >
                <details>
                  <summary style={{
                    cursor: 'pointer',
                    fontSize: fontSize.md,
                    fontWeight: 'bold',
                    color: '#fff',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {faq.q}
                    <span style={{ color: '#FF3366' }}>▼</span>
                  </summary>
                  <p style={{
                    color: '#888',
                    marginTop: spacing.md,
                    lineHeight: 1.6,
                    padding: spacing.sm
                  }}>
                    {faq.a}
                  </p>
                </details>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            {categories.map(cat => (
              <div key={cat.id}>
                <h2 style={{
                  fontSize: fontSize.lg,
                  marginBottom: spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm
                }}>
                  <span>{cat.icon}</span>
                  {cat.name}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  {faqs[cat.id].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        background: '#1a1a1a',
                        borderRadius: '10px',
                        padding: spacing.lg
                      }}
                    >
                      <details>
                        <summary style={{
                          cursor: 'pointer',
                          fontSize: fontSize.md,
                          fontWeight: 'bold',
                          color: '#fff',
                          listStyle: 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          {faq.q}
                          <span style={{ color: '#FF3366' }}>▼</span>
                        </summary>
                        <p style={{
                          color: '#888',
                          marginTop: spacing.md,
                          lineHeight: 1.6,
                          padding: spacing.sm
                        }}>
                          {faq.a}
                        </p>
                      </details>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: spacing.xl,
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '10px',
            padding: spacing.xl,
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
            Still have questions?
          </h2>
          <p style={{ marginBottom: spacing.lg, opacity: 0.9 }}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div style={{
            display: 'flex',
            gap: spacing.md,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/help')}
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
              Visit Help Center
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@nexstream.com'}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: 'transparent',
                border: '2px solid white',
                borderRadius: '30px',
                color: 'white',
                fontSize: fontSize.md,
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Email Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
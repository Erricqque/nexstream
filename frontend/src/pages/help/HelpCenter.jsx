import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { id: 'all', name: 'All Articles', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Billing', icon: '👤' },
    { id: 'content', name: 'Content Creation', icon: '🎬' },
    { id: 'earnings', name: 'Earnings & Payouts', icon: '💰' },
    { id: 'mlm', name: 'MLM Network', icon: '🌳' },
    { id: 'technical', name: 'Technical Support', icon: '⚙️' }
  ];

  const articles = [
    {
      id: 1,
      title: 'How to create your first video',
      category: 'getting-started',
      views: 15234,
      helpful: 234,
      content: `
        <h3>Getting Started with Video Upload</h3>
        <p>Follow these steps to upload your first video on NexStream:</p>
        <ol>
          <li>Click on the "Upload" button in the top navigation</li>
          <li>Select your video file (MP4, MOV, or AVI format)</li>
          <li>Add a catchy title and description</li>
          <li>Choose relevant tags and category</li>
          <li>Set your video privacy settings</li>
          <li>Click "Publish" to share with the world</li>
        </ol>
        <p>Pro tip: Add an eye-catching thumbnail to increase views!</p>
      `
    },
    {
      id: 2,
      title: 'Understanding MLM commissions',
      category: 'mlm',
      views: 8765,
      helpful: 189,
      content: `
        <h3>MLM Commission Structure</h3>
        <p>Our MLM program offers multiple ways to earn:</p>
        <ul>
          <li><strong>Direct Commission (10%):</strong> Earn from your direct referrals</li>
          <li><strong>Level 2 Commission (5%):</strong> Earn from your referrals' referrals</li>
          <li><strong>Level 3 Commission (3%):</strong> Earn from third-level referrals</li>
          <li><strong>Binary Bonus:</strong> Extra earnings from balanced team growth</li>
        </ul>
        <p>Commissions are calculated daily and paid out weekly.</p>
      `
    },
    {
      id: 3,
      title: 'How to withdraw your earnings',
      category: 'earnings',
      views: 12345,
      helpful: 312,
      content: `
        <h3>Withdrawing Your Funds</h3>
        <p>Follow these steps to withdraw your earnings:</p>
        <ol>
          <li>Go to your Wallet from the dashboard</li>
          <li>Click "Withdraw Funds"</li>
          <li>Select your preferred payment method</li>
          <li>Enter the amount (minimum $10)</li>
          <li>Confirm the withdrawal</li>
        </ol>
        <p>Funds typically arrive within 1-3 business days.</p>
      `
    },
    {
      id: 4,
      title: 'Setting up your profile',
      category: 'account',
      views: 5432,
      helpful: 98,
      content: `
        <h3>Complete Your Profile</h3>
        <p>Make your profile stand out:</p>
        <ul>
          <li>Add a professional profile picture</li>
          <li>Write an engaging bio</li>
          <li>Link your social media accounts</li>
          <li>Set your payment preferences</li>
          <li>Customize your channel banner</li>
        </ul>
      `
    },
    {
      id: 5,
      title: 'Troubleshooting video playback',
      category: 'technical',
      views: 3210,
      helpful: 76,
      content: `
        <h3>Video Playback Issues</h3>
        <p>If you're experiencing video playback problems:</p>
        <ol>
          <li>Clear your browser cache and cookies</li>
          <li>Update your browser to the latest version</li>
          <li>Disable browser extensions temporarily</li>
          <li>Check your internet connection speed</li>
          <li>Try a different browser or device</li>
        </ol>
      `
    }
  ];

  const faqs = [
    {
      q: 'How long does it take to get paid?',
      a: 'Payouts are processed within 1-3 business days after request.'
    },
    {
      q: 'What is the minimum payout amount?',
      a: 'The minimum payout amount is $10 USD.'
    },
    {
      q: 'Can I use multiple payment methods?',
      a: 'Yes, you can add multiple payment methods and choose your default.'
    },
    {
      q: 'How do I refer friends?',
      a: 'Share your unique referral link from your dashboard to earn commissions.'
    }
  ];

  const filteredArticles = articles.filter(article => 
    (selectedCategory === 'all' || article.category === selectedCategory) &&
    (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.content.toLowerCase().includes(searchQuery.toLowerCase()))
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            Help Center
          </h1>
          <p style={{ color: '#888' }}>
            Find answers to your questions and get support
          </p>
        </motion.div>

        {/* Search Bar */}
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
            placeholder="Search for help articles..."
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
          paddingBottom: spacing.xs
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: selectedCategory === cat.id ? '#FF3366' : '#1a1a1a',
                border: 'none',
                borderRadius: '30px',
                color: selectedCategory === cat.id ? 'white' : '#888',
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

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '3fr 1fr',
          gap: spacing.xl
        }}>
          {/* Articles */}
          <div>
            {selectedArticle ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => setSelectedArticle(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    marginBottom: spacing.lg
                  }}
                >
                  ← Back to articles
                </button>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: spacing.xl
                }}>
                  <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
                    {selectedArticle.title}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    style={{
                      color: '#ccc',
                      lineHeight: 1.8,
                      marginBottom: spacing.xl
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #333',
                    paddingTop: spacing.lg
                  }}>
                    <div style={{ display: 'flex', gap: spacing.lg }}>
                      <span style={{ color: '#888' }}>👁️ {selectedArticle.views} views</span>
                      <span style={{ color: '#888' }}>👍 {selectedArticle.helpful} found helpful</span>
                    </div>
                    <button
                      style={{
                        padding: `${spacing.sm} ${spacing.lg}`,
                        background: '#4FACFE',
                        border: 'none',
                        borderRadius: '20px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Was this helpful? 👍
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {filteredArticles.map(article => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedArticle(article)}
                    style={{
                      background: '#1a1a1a',
                      borderRadius: '10px',
                      padding: spacing.lg,
                      cursor: 'pointer'
                    }}
                  >
                    <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.sm }}>
                      {article.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: spacing.md,
                      color: '#888',
                      fontSize: fontSize.sm
                    }}>
                      <span>{categories.find(c => c.id === article.category)?.icon}</span>
                      <span>👁️ {article.views} views</span>
                      <span>👍 {article.helpful} helpful</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* FAQs */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg,
              marginBottom: spacing.lg
            }}>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {faqs.map((faq, index) => (
                  <details key={index} style={{
                    background: '#2a2a2a',
                    borderRadius: '8px',
                    padding: spacing.sm
                  }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#fff',
                      padding: spacing.sm
                    }}>
                      {faq.q}
                    </summary>
                    <p style={{
                      color: '#888',
                      padding: spacing.sm,
                      margin: 0,
                      lineHeight: 1.6
                    }}>
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div style={{
              background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
              borderRadius: '10px',
              padding: spacing.xl,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>💬</div>
              <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.sm }}>
                Still need help?
              </h3>
              <p style={{ marginBottom: spacing.lg, opacity: 0.9 }}>
                Our support team is available 24/7
              </p>
              <button
                onClick={() => setShowContactForm(true)}
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  color: '#FF3366',
                  fontSize: fontSize.md,
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: spacing.md
              }}
              onClick={() => setShowContactForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                style={{
                  background: '#1a1a2a',
                  borderRadius: '15px',
                  padding: spacing.xl,
                  width: '100%',
                  maxWidth: '500px'
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
                  Contact Support
                </h2>

                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Category
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  >
                    <option>Technical Issue</option>
                    <option>Account & Billing</option>
                    <option>Content Question</option>
                    <option>Payment Issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Describe your issue in detail..."
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: spacing.md
                }}>
                  <button
                    onClick={() => setShowContactForm(false)}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      background: '#FF3366',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowContactForm(false)}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HelpCenter;
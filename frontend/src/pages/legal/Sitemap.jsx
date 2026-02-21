import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sitemap = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const sections = [
    {
      title: 'Public Pages',
      icon: '🌐',
      color: '#FF3366',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'Browse Content', path: '/browse' },
        { name: 'Search', path: '/search' },
        { name: 'Categories', path: '/categories' },
        { name: 'Pricing', path: '/pricing' }
      ]
    },
    {
      title: 'Creator Pages',
      icon: '🎬',
      color: '#4FACFE',
      links: [
        { name: 'Featured Creators', path: '/creators' },
        { name: 'Creator Program', path: '/creator-program' },
        { name: 'Trending', path: '/trending' },
        { name: 'Monetization', path: '/monetization' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Upload Content', path: '/upload' }
      ]
    },
    {
      title: 'User Pages',
      icon: '👤',
      color: '#43E97B',
      links: [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Profile', path: '/profile/:username' },
        { name: 'Settings', path: '/settings' },
        { name: 'Notifications', path: '/notifications' },
        { name: 'Watch History', path: '/history' },
        { name: 'Liked Content', path: '/liked' },
        { name: 'Subscriptions', path: '/subscriptions' },
        { name: 'Playlists', path: '/playlists' }
      ]
    },
    {
      title: 'Community',
      icon: '👥',
      color: '#F59E0B',
      links: [
        { name: 'Community Home', path: '/community' },
        { name: 'Create Community', path: '/community/create' },
        { name: 'Help Center', path: '/help' },
        { name: 'FAQ', path: '/faq' }
      ]
    },
    {
      title: 'Business',
      icon: '💼',
      color: '#A78BFA',
      links: [
        { name: 'Business Dashboard', path: '/business' },
        { name: 'MLM Network', path: '/business/mlm' },
        { name: 'Earnings', path: '/business/earnings' },
        { name: 'Referral Center', path: '/business/referrals' },
        { name: 'Payout Settings', path: '/business/payout-settings' },
        { name: 'Wallet', path: '/business/wallet' }
      ]
    },
    {
      title: 'Company',
      icon: '🏢',
      color: '#F472B6',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
        { name: 'Blog', path: '/blog' }
      ]
    },
    {
      title: 'Legal',
      icon: '⚖️',
      color: '#FF3366',
      links: [
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'Sitemap', path: '/sitemap' }
      ]
    },
    {
      title: 'Special',
      icon: '🤖',
      color: '#4FACFE',
      links: [
        { name: 'AI Chat', path: '/ai-chat' },
        { name: 'Admin Panel', path: '/admin' }
      ]
    }
  ];

  const totalPages = sections.reduce((acc, s) => acc + s.links.length, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
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
            Sitemap
          </h1>
          <p style={{ color: '#888' }}>
            Complete navigation guide for NexStream platform
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <StatCard value={totalPages} label="Total Pages" color="#FF3366" />
          <StatCard value={sections.length} label="Categories" color="#4FACFE" />
        </div>

        {/* Sitemap Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: spacing.lg
        }}>
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: spacing.lg,
                borderLeft: `4px solid ${section.color}`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                marginBottom: spacing.md
              }}>
                <span style={{ fontSize: fontSize.xl }}>{section.icon}</span>
                <h2 style={{ fontSize: fontSize.lg, color: section.color }}>{section.title}</h2>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: spacing.sm
              }}>
                {section.links.map((link, i) => (
                  <Link
                    key={i}
                    to={link.path}
                    style={{
                      color: '#888',
                      textDecoration: 'none',
                      padding: spacing.xs,
                      transition: 'color 0.2s',
                      fontSize: fontSize.sm,
                      display: 'block'
                    }}
                    onMouseEnter={e => e.target.style.color = section.color}
                    onMouseLeave={e => e.target.style.color = '#888'}
                  >
                    • {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back to Home */}
        <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
          <Link to="/" style={{
            display: 'inline-block',
            padding: `${spacing.md} ${spacing.xl}`,
            background: '#FF3366',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '30px',
            fontWeight: '600'
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// StatCard component with spacing defined inside
const StatCard = ({ value, label, color }) => {
  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
  };

  return (
    <div style={{
      background: '#1a1a1a',
      padding: spacing.md,
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: fontSize.xl, fontWeight: 'bold', color }}>{value}</div>
      <div style={{ color: '#888', fontSize: fontSize.sm }}>{label}</div>
    </div>
  );
};

export default Sitemap;
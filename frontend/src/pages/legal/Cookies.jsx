import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cookies = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted) {
      setShowBanner(false);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
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
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`,
      position: 'relative'
    }}>
      {/* Cookie Banner */}
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#1a1a1a',
            padding: spacing.lg,
            borderTop: '1px solid #333',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: spacing.md
          }}
        >
          <div style={{ flex: 1, color: '#ccc' }}>
            <strong style={{ color: '#FF3366' }}>🍪 Cookie Notice</strong>
            <p style={{ fontSize: fontSize.sm, marginTop: spacing.xs }}>
              We use cookies to enhance your experience on NexStream. By continuing to browse, you agree to our use of cookies.
            </p>
          </div>
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <button
              onClick={acceptCookies}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: '#FF3366',
                border: 'none',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Accept
            </button>
            <Link to="/privacy">
              <button style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: 'transparent',
                border: '1px solid #333',
                borderRadius: '20px',
                color: '#888',
                cursor: 'pointer'
              }}>
                Learn More
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Cookie Policy
          </h1>
          <p style={{ color: '#888' }}>
            Last updated: March 21, 2024
          </p>
        </motion.div>

        {/* What Are Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#1a1a1a',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.lg,
            borderLeft: '4px solid #FF3366'
          }}
        >
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#FF3366' }}>
            What Are Cookies?
          </h2>
          <p style={{ color: '#ccc', lineHeight: 1.8 }}>
            Cookies are small text files that are stored on your device when you visit a website. They help us provide you with a better experience by remembering your preferences, login status, and other information.
          </p>
        </motion.div>

        {/* How We Use Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#1a1a1a',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.lg,
            borderLeft: '4px solid #4FACFE'
          }}
        >
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#4FACFE' }}>
            How We Use Cookies
          </h2>
          <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: spacing.md }}>
            We use cookies for the following purposes:
          </p>
          <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: spacing.lg }}>
            <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
            <li><strong>Authentication:</strong> Keep you logged in</li>
            <li><strong>Preferences:</strong> Remember your settings</li>
            <li><strong>Analytics:</strong> Understand how you use our platform</li>
            <li><strong>Personalization:</strong> Tailor content to your interests</li>
          </ul>
        </motion.div>

        {/* Types of Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: '#1a1a1a',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.lg,
            borderLeft: '4px solid #43E97B'
          }}
        >
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#43E97B' }}>
            Types of Cookies We Use
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: spacing.xs }}>Session Cookies</h3>
              <p style={{ color: '#888' }}>Temporary cookies that expire when you close your browser</p>
            </div>
            <div>
              <h3 style={{ color: '#fff', marginBottom: spacing.xs }}>Persistent Cookies</h3>
              <p style={{ color: '#888' }}>Remain on your device for a set period</p>
            </div>
            <div>
              <h3 style={{ color: '#fff', marginBottom: spacing.xs }}>Third-Party Cookies</h3>
              <p style={{ color: '#888' }}>Set by services we use (analytics, payment processors)</p>
            </div>
          </div>
        </motion.div>

        {/* Cookie List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: '#1a1a1a',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.lg,
            borderLeft: '4px solid #F59E0B'
          }}
        >
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#F59E0B' }}>
            Specific Cookies We Use
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: spacing.sm, color: '#888' }}>Cookie Name</th>
                  <th style={{ textAlign: 'left', padding: spacing.sm, color: '#888' }}>Purpose</th>
                  <th style={{ textAlign: 'left', padding: spacing.sm, color: '#888' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: spacing.sm }}>sb-auth-token</td>
                  <td style={{ padding: spacing.sm, color: '#ccc' }}>Authentication</td>
                  <td style={{ padding: spacing.sm, color: '#888' }}>Session</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: spacing.sm }}>preferences</td>
                  <td style={{ padding: spacing.sm, color: '#ccc' }}>User settings</td>
                  <td style={{ padding: spacing.sm, color: '#888' }}>1 year</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: spacing.sm }}>analytics_id</td>
                  <td style={{ padding: spacing.sm, color: '#ccc' }}>Usage tracking</td>
                  <td style={{ padding: spacing.sm, color: '#888' }}>30 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Manage Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: '#1a1a1a',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.lg,
            borderLeft: '4px solid #A78BFA'
          }}
        >
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#A78BFA' }}>
            How to Manage Cookies
          </h2>
          <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: spacing.md }}>
            You can control and manage cookies in your browser settings. Please note that disabling cookies may affect your experience on NexStream.
          </p>
          <div style={{
            background: '#2a2a2a',
            borderRadius: '10px',
            padding: spacing.lg,
            marginTop: spacing.md
          }}>
            <p style={{ marginBottom: spacing.sm }}><strong>Browser Links:</strong></p>
            <ul style={{ color: '#ccc' }}>
              <li><a href="#" style={{ color: '#4FACFE' }}>Chrome</a></li>
              <li><a href="#" style={{ color: '#4FACFE' }}>Firefox</a></li>
              <li><a href="#" style={{ color: '#4FACFE' }}>Safari</a></li>
              <li><a href="#" style={{ color: '#4FACFE' }}>Edge</a></li>
            </ul>
          </div>
        </motion.div>

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

export default Cookies;
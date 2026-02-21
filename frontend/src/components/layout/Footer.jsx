import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Browse Content', path: '/browse' },
        { label: 'Featured Creators', path: '/creators' },
        { label: 'Categories', path: '/categories' },
        { label: 'Trending', path: '/trending' }
      ]
    },
    {
      title: 'For Creators',
      links: [
        { label: 'Start Creating', path: '/register' },
        { label: 'Creator Program', path: '/creator-program' },
        { label: 'Monetization', path: '/monetization' },
        { label: 'Analytics', path: '/analytics' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
        { label: 'Blog', path: '/blog' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Community', path: '/community' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' }
      ]
    }
  ];

  const socialLinks = [
    { icon: '📘', url: 'https://facebook.com/nexstream', label: 'Facebook' },
    { icon: '🐦', url: 'https://twitter.com/nexstream', label: 'Twitter' },
    { icon: '📷', url: 'https://instagram.com/nexstream', label: 'Instagram' },
    { icon: '🎵', url: 'https://tiktok.com/@nexstream', label: 'TikTok' },
    { icon: '💼', url: 'https://linkedin.com/company/nexstream', label: 'LinkedIn' },
    { icon: '📺', url: 'https://youtube.com/nexstream', label: 'YouTube' }
  ];

  return (
    <footer style={{
      background: '#0a0a0f',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '60px 0 30px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Main Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(4, 1fr)',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Column */}
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                NexStream
              </h3>
            </Link>
            <p style={{
              color: '#888',
              lineHeight: 1.6,
              marginBottom: '20px'
            }}>
              The ultimate platform for creators to share, connect, and earn. Join millions of creators building their future with NexStream.
            </p>
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {socialLinks.map(social => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#1a1a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    fontSize: '1.2rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 style={{
                color: 'white',
                fontSize: '1.1rem',
                marginBottom: '20px',
                fontWeight: '600'
              }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map(link => (
                  <li key={link.path} style={{ marginBottom: '12px' }}>
                    <Link
                      to={link.path}
                      style={{
                        color: '#888',
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        transition: 'color 0.2s',
                        ':hover': { color: '#FF3366' }
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '30px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            © {currentYear} NexStream. All rights reserved.
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/terms" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
              Terms
            </Link>
            <Link to="/privacy" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
              Privacy
            </Link>
            <Link to="/cookies" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
              Cookies
            </Link>
            <Link to="/sitemap" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>
              Sitemap
            </Link>
          </div>

          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            Made with ❤️ by{' '}
            <a
              href="https://instagram.com/darie_daisyDon"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FF3366', textDecoration: 'none' }}
            >
              @darie_daisyDon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
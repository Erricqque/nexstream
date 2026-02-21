import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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
            Privacy Policy
          </h1>
          <p style={{ color: '#888' }}>
            Last updated: March 21, 2024
          </p>
        </motion.div>

        {/* Introduction */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '15px',
          padding: spacing.xl,
          marginBottom: spacing.xl,
          border: '1px solid #333'
        }}>
          <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: fontSize.md }}>
            At NexStream, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our platform. Please read this 
            privacy policy carefully. If you do not agree with the terms of this privacy policy, please 
            do not access the platform.
          </p>
        </div>

        {/* Policy Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #FF3366'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#FF3366' }}>
              1. Information We Collect
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p style={{ marginBottom: spacing.md }}>We collect several types of information from and about users of our platform:</p>
              <h3 style={{ color: '#fff', marginBottom: spacing.sm }}>Personal Information:</h3>
              <ul style={{ marginBottom: spacing.md, paddingLeft: spacing.lg }}>
                <li>Name and username</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Profile information and avatar</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>
              
              <h3 style={{ color: '#fff', marginBottom: spacing.sm }}>Content Information:</h3>
              <ul style={{ marginBottom: spacing.md, paddingLeft: spacing.lg }}>
                <li>Videos, images, and audio you upload</li>
                <li>Comments and messages</li>
                <li>Playlists and collections</li>
              </ul>
              
              <h3 style={{ color: '#fff', marginBottom: spacing.sm }}>Usage Information:</h3>
              <ul style={{ marginBottom: spacing.md, paddingLeft: spacing.lg }}>
                <li>Viewing history and preferences</li>
                <li>Interactions with content</li>
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
              </ul>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #4FACFE'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#4FACFE' }}>
              2. How We Use Your Information
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p style={{ marginBottom: spacing.md }}>We use the information we collect to:</p>
              <ul style={{ paddingLeft: spacing.lg }}>
                <li>Provide, operate, and maintain our platform</li>
                <li>Process transactions and send related information</li>
                <li>Personalize your experience</li>
                <li>Communicate with you about updates and promotions</li>
                <li>Analyze usage patterns and improve our services</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #43E97B'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#43E97B' }}>
              3. Sharing Your Information
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p style={{ marginBottom: spacing.md }}>We do not sell your personal information. We may share information with:</p>
              <ul style={{ paddingLeft: spacing.lg }}>
                <li><strong>Service Providers:</strong> Payment processors, hosting services, analytics providers</li>
                <li><strong>Business Partners:</strong> With your consent or as necessary to provide services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
              </ul>
            </div>
          </motion.div>

          {/* Section 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #F59E0B'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#F59E0B' }}>
              4. Data Security
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p>
                We implement industry-standard security measures to protect your personal information. 
                However, no method of transmission over the Internet is 100% secure. You are responsible 
                for maintaining the security of your account credentials.
              </p>
            </div>
          </motion.div>

          {/* Section 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #A78BFA'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#A78BFA' }}>
              5. Your Rights and Choices
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p style={{ marginBottom: spacing.md }}>You have the right to:</p>
              <ul style={{ paddingLeft: spacing.lg }}>
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data</li>
              </ul>
              <p style={{ marginTop: spacing.md }}>
                To exercise these rights, visit your account settings or contact us at privacy@nexstream.com.
              </p>
            </div>
          </motion.div>

          {/* Section 6 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #F472B6'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#F472B6' }}>
              6. Cookies and Tracking Technologies
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p>
                We use cookies and similar tracking technologies to track activity on our platform and 
                hold certain information. You can instruct your browser to refuse all cookies or to indicate 
                when a cookie is being sent. However, some features may not function properly without cookies.
              </p>
            </div>
          </motion.div>

          {/* Section 7 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #FF3366'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#FF3366' }}>
              7. Children's Privacy
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p>
                Our platform is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe your 
                child has provided us with information, please contact us.
              </p>
            </div>
          </motion.div>

          {/* Section 8 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #4FACFE'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#4FACFE' }}>
              8. International Data Transfers
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                By using our platform, you consent to such transfers. We take appropriate safeguards to 
                ensure your information remains protected.
              </p>
            </div>
          </motion.div>

          {/* Section 9 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #43E97B'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#43E97B' }}>
              9. Changes to This Privacy Policy
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date. You are advised to 
                review this policy periodically for any changes.
              </p>
            </div>
          </motion.div>

          {/* Section 10 - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: spacing.xl,
              borderLeft: '4px solid #F59E0B'
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#F59E0B' }}>
              10. Contact Us
            </h2>
            <div style={{ color: '#ccc', lineHeight: 1.8 }}>
              <p style={{ marginBottom: spacing.md }}>If you have questions about this Privacy Policy, please contact us:</p>
              <div style={{
                background: '#2a2a2a',
                borderRadius: '10px',
                padding: spacing.lg,
                marginTop: spacing.md
              }}>
                <p style={{ marginBottom: spacing.sm }}><strong>Email:</strong> privacy@nexstream.com</p>
                <p style={{ marginBottom: spacing.sm }}><strong>Address:</strong> 123 Creator Lane, Silicon Valley, CA 94025</p>
                <p><strong>Data Protection Officer:</strong> dpo@nexstream.com</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back to Home */}
        <div style={{
          marginTop: spacing.xl,
          textAlign: 'center'
        }}>
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

export default PrivacyPolicy;
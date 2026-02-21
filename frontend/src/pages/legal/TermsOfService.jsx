import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeSection, setActiveSection] = useState('welcome');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    { id: 'welcome', title: 'Welcome to NexStream' },
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'eligibility', title: '2. Eligibility' },
    { id: 'account', title: '3. Account Registration' },
    { id: 'content', title: '4. Content Guidelines' },
    { id: 'intellectual', title: '5. Intellectual Property' },
    { id: 'payments', title: '6. Payments & Earnings' },
    { id: 'mlm', title: '7. MLM Program' },
    { id: 'termination', title: '8. Termination' },
    { id: 'liability', title: '9. Limitation of Liability' },
    { id: 'changes', title: '10. Changes to Terms' },
    { id: 'contact', title: '11. Contact Us' }
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
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Terms of Service
          </h1>
          <p style={{ color: '#888' }}>
            Last updated: January 15, 2024
          </p>
        </motion.div>

        {/* Last Updated Banner */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.lg,
          marginBottom: spacing.xl,
          border: '1px solid #333'
        }}>
          <p style={{ color: '#888', lineHeight: 1.6 }}>
            Please read these terms carefully before using NexStream. By accessing or using our platform, 
            you agree to be bound by these terms. If you disagree with any part, you may not access the service.
          </p>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '250px 1fr',
          gap: spacing.xl
        }}>
          {/* Sidebar Navigation */}
          {!isMobile && (
            <div style={{
              position: 'sticky',
              top: '100px',
              height: 'fit-content'
            }}>
              <div style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.lg
              }}>
                <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>Contents</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      style={{
                        textAlign: 'left',
                        padding: spacing.sm,
                        background: activeSection === section.id ? '#FF3366' : 'transparent',
                        border: 'none',
                        borderRadius: '5px',
                        color: activeSection === section.id ? 'white' : '#888',
                        cursor: 'pointer',
                        fontSize: fontSize.sm,
                        transition: 'all 0.2s'
                      }}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Terms Content */}
          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl
          }}>
            <section id="welcome" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#FF3366' }}>
                Welcome to NexStream
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                Welcome to NexStream, a content creation and sharing platform that enables creators to upload, 
                share, and monetize their content while building a community. These Terms of Service govern your 
                use of our website, applications, and services.
              </p>
            </section>

            <section id="agreement" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#4FACFE' }}>
                1. Agreement to Terms
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                By accessing or using NexStream, you agree to be bound by these Terms. If you do not agree 
                to all the terms and conditions, you may not access the platform. NexStream reserves the right 
                to modify these terms at any time, and your continued use constitutes acceptance of such changes.
              </p>
            </section>

            <section id="eligibility" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#43E97B' }}>
                2. Eligibility
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                You must be at least 13 years old to use NexStream. Users under 18 must have parental consent. 
                By using our service, you represent that you have the right, authority, and capacity to enter 
                into this agreement and to abide by all terms and conditions.
              </p>
            </section>

            <section id="account" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#F59E0B' }}>
                3. Account Registration
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                You are responsible for maintaining the security of your account. You must provide accurate 
                and complete information. You are fully responsible for all activities that occur under your 
                account. Notify us immediately of any unauthorized use.
              </p>
              <ul style={{ color: '#888', lineHeight: 1.8, paddingLeft: spacing.lg }}>
                <li>One person may not maintain multiple accounts</li>
                <li>Accounts cannot be shared with others</li>
                <li>You must be a human to create an account</li>
              </ul>
            </section>

            <section id="content" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#FF3366' }}>
                4. Content Guidelines
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                You retain all rights to content you upload. By uploading, you grant NexStream a worldwide, 
                non-exclusive, royalty-free license to host and distribute your content. You represent that 
                you own or have the necessary rights to all content you upload.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                Prohibited content includes:
              </p>
              <ul style={{ color: '#888', lineHeight: 1.8, paddingLeft: spacing.lg }}>
                <li>Copyrighted material without permission</li>
                <li>Explicit or adult content</li>
                <li>Harassment or hate speech</li>
                <li>Violent or dangerous content</li>
                <li>Misinformation or deceptive content</li>
                <li>Spam or misleading metadata</li>
              </ul>
            </section>

            <section id="intellectual" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#4FACFE' }}>
                5. Intellectual Property
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                The NexStream name, logo, and platform design are trademarks of NexStream. You may not use 
                our trademarks without written permission. All rights not expressly granted are reserved.
              </p>
            </section>

            <section id="payments" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#43E97B' }}>
                6. Payments & Earnings
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                Creators earn revenue through views, subscriptions, and the MLM program. Payments are processed 
                through Flutterwave, PayPal, and M-PESA. You must provide accurate payment information. 
                NexStream takes a commission on earnings as detailed in your dashboard.
              </p>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                Minimum payout: $10 USD. Payouts are processed weekly and may take 1-3 business days to arrive.
              </p>
            </section>

            <section id="mlm" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#F59E0B' }}>
                7. MLM Program
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                Our MLM program allows you to earn commissions from referrals. Commissions are structured as:
              </p>
              <ul style={{ color: '#888', lineHeight: 1.8, paddingLeft: spacing.lg }}>
                <li>Level 1 (Direct referrals): 10%</li>
                <li>Level 2: 5%</li>
                <li>Level 3: 3%</li>
              </ul>
              <p style={{ color: '#888', lineHeight: 1.8, marginTop: spacing.md }}>
                Fraudulent referral activity may result in termination and forfeiture of earnings.
              </p>
            </section>

            <section id="termination" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#FF3366' }}>
                8. Termination
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                NexStream may terminate or suspend your account immediately, without prior notice, for any 
                violation of these Terms. Upon termination, your right to use the service will cease immediately.
                You may terminate your account at any time from your settings.
              </p>
            </section>

            <section id="liability" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#4FACFE' }}>
                9. Limitation of Liability
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                NexStream shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages resulting from your use or inability to use the service. Our total liability shall not 
                exceed the amount you paid us in the past 12 months.
              </p>
            </section>

            <section id="changes" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#43E97B' }}>
                10. Changes to Terms
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                We reserve the right to modify these terms at any time. We will notify users of material changes 
                via email or platform notice. Your continued use after changes constitutes acceptance.
              </p>
            </section>

            <section id="contact" style={{ marginBottom: spacing.xl }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#F59E0B' }}>
                11. Contact Us
              </h2>
              <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
                For questions about these Terms, please contact us:
              </p>
              <div style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: spacing.lg
              }}>
                <p style={{ marginBottom: spacing.xs }}>📧 legal@nexstream.com</p>
                <p style={{ marginBottom: spacing.xs }}>📞 +1 (800) 123-4567</p>
                <p>📍 123 Creator Lane, Silicon Valley, CA 94025</p>
              </div>
            </section>

            {/* Acceptance */}
            <div style={{
              marginTop: spacing.xl,
              padding: spacing.lg,
              background: '#2a2a2a',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#888' }}>
                By using NexStream, you acknowledge that you have read and understood these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
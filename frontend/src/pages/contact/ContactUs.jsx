import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@nexstream.com',
      response: '24-48 hours'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available 24/7',
      response: 'Instant'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      details: '+1 (800) 123-4567',
      response: 'Mon-Fri, 9am-6pm'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Creator Lane, Silicon Valley, CA',
      response: 'By appointment'
    }
  ];

  const faqs = [
    {
      q: 'How quickly do you respond?',
      a: 'We aim to respond to all inquiries within 24 hours during business days.'
    },
    {
      q: 'Do you have phone support?',
      a: 'Yes, phone support is available Monday through Friday, 9am-6pm PST.'
    },
    {
      q: 'Can I schedule a call?',
      a: 'Absolutely! Select "Schedule a Call" from the priority dropdown.'
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
          style={{ marginBottom: spacing.xl, textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Get in Touch
          </h1>
          <p style={{ color: '#888', fontSize: fontSize.lg }}>
            We're here to help and answer any questions you might have
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.lg,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: spacing.sm }}>{method.icon}</div>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.xs }}>{method.title}</h3>
              <p style={{ color: '#FF3366', marginBottom: spacing.xs }}>{method.details}</p>
              <p style={{ color: '#888', fontSize: fontSize.xs }}>Response: {method.response}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form & Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: spacing.xl
        }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.xl
            }}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
              Send us a Message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                style={{
                  background: '#43E97B',
                  borderRadius: '8px',
                  padding: spacing.xl,
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>✓</div>
                <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.sm }}>
                  Message Sent!
                </h3>
                <p>We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="report">Report Content</option>
                  </select>
                </div>

                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="schedule">Schedule a Call</option>
                  </select>
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md,
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: spacing.lg,
                    background: '#FF3366',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: fontSize.lg,
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}
          >
            {/* Office Hours */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg
            }}>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                Office Hours
              </h3>
              <div style={{ marginBottom: spacing.sm }}>
                <p><strong>Monday - Friday:</strong> 9am - 6pm PST</p>
                <p><strong>Saturday:</strong> 10am - 4pm PST</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </div>

            {/* FAQs */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg
            }}>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                Quick Answers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {faqs.map((faq, index) => (
                  <details key={index}>
                    <summary style={{
                      cursor: 'pointer',
                      color: '#4FACFE',
                      marginBottom: spacing.xs
                    }}>
                      {faq.q}
                    </summary>
                    <p style={{ color: '#888', fontSize: fontSize.sm, marginTop: spacing.xs }}>
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg,
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                Connect With Us
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: spacing.md
              }}>
                {['📘', '🐦', '📷', '🎵'].map((icon, index) => (
                  <a
                    key={index}
                    href="#"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#2a2a2a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Map (placeholder) */}
            <div style={{
              height: '200px',
              background: '#1a1a1a',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: '#888'
            }}>
              🗺️
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
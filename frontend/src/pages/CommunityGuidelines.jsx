import React from 'react';
import { Link } from 'react-router-dom';

const CommunityGuidelines = () => {
  const guidelines = [
    {
      title: "1. Respect Others",
      description: "Treat everyone with respect. Harassment, bullying, or hate speech will not be tolerated.",
      icon: "🤝",
      rules: [
        "No hate speech or discrimination",
        "No harassment or bullying",
        "Respect differing opinions",
        "Be kind and constructive in comments"
      ]
    },
    {
      title: "2. Original Content",
      description: "Only upload content you created or have permission to use. Respect copyright laws.",
      icon: "🎨",
      rules: [
        "No copyright infringement",
        "Give credit when using others' work",
        "Don't reupload content without permission",
        "Use royalty-free music and assets"
      ]
    },
    {
      title: "3. Appropriate Content",
      description: "Content must be suitable for the platform. Mark mature content appropriately.",
      icon: "🔞",
      rules: [
        "No explicit sexual content",
        "No excessive violence or gore",
        "Mark mature content with warning",
        "Follow age restrictions"
      ]
    },
    {
      title: "4. Spam & Scams",
      description: "Don't spam or engage in deceptive practices. Build genuine engagement.",
      icon: "🚫",
      rules: [
        "No misleading thumbnails or titles",
        "No fake engagement services",
        "Don't post repetitive comments",
        "No phishing or scams"
      ]
    },
    {
      title: "5. Privacy",
      description: "Respect others' privacy. Don't share personal information without consent.",
      icon: "🔒",
      rules: [
        "Don't share personal contact info",
        "No doxxing",
        "Respect others' privacy settings",
        "Don't record others without permission"
      ]
    },
    {
      title: "6. Monetization",
      description: "Follow monetization rules to earn fairly from your content.",
      icon: "💰",
      rules: [
        "No fraudulent view counts",
        "No buying subscribers",
        "Transparent sponsorships",
        "Follow ad-friendly content guidelines"
      ]
    }
  ];

  const prohibitedContent = [
    "Child exploitation",
    "Terrorist content",
    "Illegal activities",
    "Dangerous challenges",
    "Malware or viruses",
    "Impersonation",
    "Sexual exploitation",
    "Self-harm promotion"
  ];

  const enforcement = [
    "Content removal",
    "Channel strikes",
    "Temporary suspension",
    "Permanent ban",
    "Legal action for severe violations"
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      color: 'white',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Community Guidelines
          </h1>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>
            Our commitment to keeping NexStream safe and welcoming for everyone
          </p>
        </div>

        {/* Introduction */}
        <div style={{
          background: 'rgba(0,180,216,0.1)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid #00b4d8'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            At NexStream, we're building a community where creators and viewers can connect, share, and grow together. 
            These guidelines help ensure everyone has a positive experience. Violating these rules may result in content removal, 
            channel strikes, or account termination.
          </p>
        </div>

        {/* Guidelines Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {guidelines.map((section, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '15px',
                padding: '25px',
                border: '1px solid #333',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '2.5rem' }}>{section.icon}</span>
                <h3 style={{ fontSize: '1.3rem', color: '#00b4d8' }}>{section.title}</h3>
              </div>
              <p style={{ color: '#aaa', marginBottom: '15px' }}>{section.description}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {section.rules.map((rule, i) => (
                  <li key={i} style={{
                    marginBottom: '8px',
                    color: '#888',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#4CAF50' }}>✓</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Prohibited Content */}
        <div style={{
          background: 'rgba(255,68,68,0.05)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid #ff4444'
        }}>
          <h2 style={{ color: '#ff4444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🚫</span> Strictly Prohibited
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {prohibitedContent.map((item, index) => (
              <div key={index} style={{
                padding: '10px',
                background: 'rgba(255,68,68,0.1)',
                borderRadius: '5px',
                textAlign: 'center',
                color: '#ff8888'
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Enforcement */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid #333'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Enforcement Actions</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {enforcement.map((action, index) => (
              <span key={index} style={{
                padding: '8px 16px',
                background: index > 2 ? 'rgba(255,68,68,0.2)' : 'rgba(255,215,0,0.2)',
                borderRadius: '20px',
                color: index > 2 ? '#ff4444' : '#FFD700',
                fontSize: '0.9rem'
              }}>
                {action}
              </span>
            ))}
          </div>
        </div>

        {/* Report Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0b1a2e, #0a0f1e)',
          borderRadius: '15px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid #00b4d8'
        }}>
          <h2 style={{ marginBottom: '15px' }}>See Something? Say Something</h2>
          <p style={{ color: '#aaa', marginBottom: '25px' }}>
            If you see content that violates our guidelines, please report it immediately.
            Our team reviews every report within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Report Content
            </button>
            <button style={{
              padding: '12px 30px',
              background: 'transparent',
              border: '1px solid #00b4d8',
              borderRadius: '5px',
              color: '#00b4d8',
              cursor: 'pointer'
            }}>
              Appeal a Decision
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <p>Last updated: February 2026</p>
          <p>Questions? Contact us at support@nexstream.com</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
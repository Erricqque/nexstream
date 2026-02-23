import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AITips = ({ userData }) => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);

  const tips = [
    "🎬 Post consistently to grow your audience",
    "📱 Use eye-catching thumbnails",
    "🔍 Research trending topics in your niche",
    "💬 Engage with your commenters",
    "📊 Check analytics to see what works",
    "🤝 Collaborate with other creators",
    "💰 Promote your content on social media",
    "⏰ Post when your audience is most active",
    "📝 Write detailed descriptions for SEO",
    "🎯 Focus on a specific niche"
  ];

  const getAITip = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/tip', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTip(data.tip || tips[Math.floor(Math.random() * tips.length)]);
    } catch (error) {
      setTip(tips[Math.floor(Math.random() * tips.length)]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAITip();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,51,102,0.1), rgba(79,172,254,0.1))',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        border: '1px solid #333',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#FF3366' }}>AI Tip</h4>
          <p style={{ margin: 0, color: '#ccc', fontSize: '14px' }}>
            {loading ? 'Getting tip...' : tip}
          </p>
        </div>
        <button
          onClick={getAITip}
          style={{
            background: 'none',
            border: 'none',
            color: '#FF3366',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ↻
        </button>
      </div>
    </motion.div>
  );
};

export default AITips;
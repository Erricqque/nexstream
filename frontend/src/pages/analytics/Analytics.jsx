import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Analytics = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = {
    views: {
      total: 45231,
      change: '+12.5%',
      daily: [1200, 1350, 1420, 1580, 1650, 1720, 1890]
    },
    earnings: {
      total: 3240.50,
      change: '+8.3%',
      daily: [45.20, 52.30, 48.90, 67.40, 71.20, 82.10, 95.30]
    },
    subscribers: {
      total: 1234,
      change: '+5.2%',
      daily: [12, 15, 18, 22, 25, 28, 32]
    },
    engagement: {
      likes: 8923,
      comments: 1234,
      shares: 567
    }
  };

  const topContent = [
    { title: 'Gaming Montage 2024', views: 12340, earnings: 324.50 },
    { title: 'Music Tutorial', views: 8900, earnings: 234.20 },
    { title: 'Vlog #45', views: 5600, earnings: 145.80 },
    { title: 'React Tutorial', views: 4300, earnings: 112.30 }
  ];

  const timeframes = ['7d', '30d', '90d', '1y'];

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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
          flexWrap: 'wrap',
          gap: spacing.md
        }}>
          <h1 style={{ fontSize: isMobile ? fontSize.xl : fontSize.xxl }}>
            Analytics Dashboard
          </h1>
          <div style={{ display: 'flex', gap: spacing.sm }}>
            {timeframes.map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  background: timeframe === t ? '#FF3366' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '20px',
                  color: timeframe === t ? 'white' : '#888',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <StatCard
            title="Total Views"
            value={stats.views.total.toLocaleString()}
            change={stats.views.change}
            icon="👁️"
            color="#FF3366"
          />
          <StatCard
            title="Total Earnings"
            value={`$${stats.earnings.total}`}
            change={stats.earnings.change}
            icon="💰"
            color="#43E97B"
          />
          <StatCard
            title="Subscribers"
            value={stats.subscribers.total}
            change={stats.subscribers.change}
            icon="👥"
            color="#4FACFE"
          />
        </div>

        {/* Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.lg
          }}>
            <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>Views Overview</h3>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              height: '200px',
              gap: spacing.xs
            }}>
              {stats.views.daily.map((value, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: `${(value / 2000) * 180}px`,
                    background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                    borderRadius: '5px 5px 0 0'
                  }} />
                  <span style={{ fontSize: fontSize.xs, color: '#888', marginTop: spacing.xs }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.lg
          }}>
            <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>Engagement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <EngagementItem label="Likes" value={stats.engagement.likes} color="#FF3366" />
              <EngagementItem label="Comments" value={stats.engagement.comments} color="#4FACFE" />
              <EngagementItem label="Shares" value={stats.engagement.shares} color="#43E97B" />
            </div>
          </div>
        </div>

        {/* Top Content */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.lg
        }}>
          <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>Top Performing Content</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Title</th>
                  <th style={{ textAlign: 'right', padding: spacing.md }}>Views</th>
                  <th style={{ textAlign: 'right', padding: spacing.md }}>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {topContent.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: spacing.md }}>{item.title}</td>
                    <td style={{ padding: spacing.md, textAlign: 'right', color: '#4FACFE' }}>
                      {item.views.toLocaleString()}
                    </td>
                    <td style={{ padding: spacing.md, textAlign: 'right', color: '#43E97B' }}>
                      ${item.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, color }) => {
  const spacing = { xs: '4px', sm: '8px', md: '16px' };
  const fontSize = { sm: '0.875rem', md: '1rem', lg: '1.25rem' };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        background: '#1a1a1a',
        borderRadius: '10px',
        padding: spacing.md,
        borderLeft: `4px solid ${color}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
        <span style={{ color: '#888' }}>{title}</span>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <p style={{ fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: spacing.xs }}>{value}</p>
      <p style={{ color: '#43E97B', fontSize: fontSize.sm }}>{change}</p>
    </motion.div>
  );
};

const EngagementItem = ({ label, value, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ color: '#888' }}>{label}</span>
    <span style={{ color, fontWeight: 'bold' }}>{value.toLocaleString()}</span>
  </div>
);

export default Analytics;
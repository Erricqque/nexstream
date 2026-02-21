import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ReferralCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [referralLink, setReferralLink] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 45,
    activeReferrals: 38,
    pendingReferrals: 7,
    totalEarned: 3250.75,
    monthlyEarned: 450.25,
    conversionRate: 24.5,
    topLevel: 3
  });

  const [referrals, setReferrals] = useState([]);
  const [referralHistory, setReferralHistory] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadReferralData();
      generateReferralLink();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    setReferralLink(`${baseUrl}/register?ref=${user?.id || 'demo123'}`);
  };

  const loadReferralData = async () => {
    try {
      setReferrals([
        { id: 1, name: 'John Doe', level: 1, joined: '2024-01-15', earnings: 450.00, status: 'active' },
        { id: 2, name: 'Jane Smith', level: 1, joined: '2024-01-10', earnings: 320.50, status: 'active' },
        { id: 3, name: 'Mike Johnson', level: 2, joined: '2023-12-05', earnings: 890.25, status: 'active' },
        { id: 4, name: 'Sarah Wilson', level: 2, joined: '2023-12-01', earnings: 670.00, status: 'active' },
        { id: 5, name: 'Tom Brown', level: 3, joined: '2023-11-20', earnings: 1200.00, status: 'active' },
        { id: 6, name: 'Emily Davis', level: 1, joined: '2024-01-20', earnings: 0, status: 'pending' }
      ]);

      setReferralHistory([
        { id: 1, date: '2024-01-15', type: 'Direct Commission', amount: 45.00, from: 'John Doe' },
        { id: 2, date: '2024-01-14', type: 'Level 2 Commission', amount: 22.50, from: 'Mike Johnson' },
        { id: 3, date: '2024-01-13', type: 'Level 3 Commission', amount: 12.00, from: 'Tom Brown' },
        { id: 4, date: '2024-01-12', type: 'Direct Commission', amount: 32.00, from: 'Jane Smith' },
        { id: 5, date: '2024-01-11', type: 'Matching Bonus', amount: 18.75, from: 'Sarah Wilson' }
      ]);
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const shareViaSocial = (platform) => {
    const text = encodeURIComponent('Join me on NexStream and start earning!');
    const url = encodeURIComponent(referralLink);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`
    };

    window.open(shareUrls[platform], '_blank');
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #FF3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

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
          <div>
            <h1 style={{
              fontSize: isMobile ? fontSize.xl : fontSize.xxl,
              marginBottom: spacing.xs
            }}>
              Referral Center
            </h1>
            <p style={{ color: '#888' }}>
              Grow your network and earn commissions
            </p>
          </div>
          <button
            onClick={() => navigate('/business')}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              background: 'transparent',
              border: '1px solid #FF3366',
              borderRadius: '20px',
              color: '#FF3366',
              cursor: 'pointer',
              fontSize: fontSize.sm
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile 
            ? '1fr' 
            : window.innerWidth <= 1024 
              ? 'repeat(2, 1fr)' 
              : 'repeat(4, 1fr)',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <StatsCard
            icon="👥"
            title="Total Referrals"
            value={referralStats.totalReferrals}
            subtitle="All time"
            color="#FF3366"
          />
          <StatsCard
            icon="✅"
            title="Active"
            value={referralStats.activeReferrals}
            subtitle={`${referralStats.pendingReferrals} pending`}
            color="#43E97B"
          />
          <StatsCard
            icon="💰"
            title="Total Earned"
            value={`$${referralStats.totalEarned}`}
            subtitle={`+$${referralStats.monthlyEarned} this month`}
            color="#4FACFE"
          />
          <StatsCard
            icon="📊"
            title="Conversion Rate"
            value={`${referralStats.conversionRate}%`}
            subtitle="Level ${referralStats.topLevel} top earner"
            color="#F59E0B"
          />
        </div>

        {/* Referral Link */}
        <div style={{
          background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
          borderRadius: '10px',
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>
            Your Referral Link
          </h2>
          <div style={{
            display: 'flex',
            gap: spacing.sm,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <input
              type="text"
              value={referralLink}
              readOnly
              style={{
                flex: 1,
                padding: spacing.md,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: fontSize.sm
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: 'white',
                border: 'none',
                borderRadius: '8px',
                color: '#FF3366',
                fontSize: fontSize.md,
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Copy Link
            </button>
          </div>

          {/* Social Share */}
          <div style={{
            display: 'flex',
            gap: spacing.md,
            marginTop: spacing.lg,
            justifyContent: 'center'
          }}>
            {['facebook', 'twitter', 'whatsapp', 'telegram'].map(platform => (
              <button
                key={platform}
                onClick={() => shareViaSocial(platform)}
                style={{
                  padding: spacing.sm,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  textTransform: 'capitalize'
                }}
              >
                {platform === 'facebook' && '📘'}
                {platform === 'twitter' && '🐦'}
                {platform === 'whatsapp' && '📱'}
                {platform === 'telegram' && '📨'}
              </button>
            ))}
          </div>
        </div>

        {/* Commission Structure */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
            Commission Structure
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: spacing.lg
          }}>
            {[
              { level: 1, rate: '10%', desc: 'Direct referral commission', color: '#FF3366' },
              { level: 2, rate: '5%', desc: 'Second level commission', color: '#4FACFE' },
              { level: 3, rate: '3%', desc: 'Third level commission', color: '#43E97B' }
            ].map(item => (
              <div key={item.level} style={{
                padding: spacing.lg,
                background: '#2a2a2a',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: fontSize.xl, color: item.color, marginBottom: spacing.sm }}>
                  {item.rate}
                </h3>
                <p style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>Level {item.level}</p>
                <p style={{ color: '#888', fontSize: fontSize.sm }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referrals List */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
            Your Referrals
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Name</th>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Level</th>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Joined</th>
                  <th style={{ textAlign: 'right', padding: spacing.md }}>Earnings</th>
                  <th style={{ textAlign: 'center', padding: spacing.md }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map(ref => (
                  <tr key={ref.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: spacing.md }}>{ref.name}</td>
                    <td style={{ padding: spacing.md }}>Level {ref.level}</td>
                    <td style={{ padding: spacing.md, color: '#888' }}>{ref.joined}</td>
                    <td style={{ padding: spacing.md, textAlign: 'right', color: '#43E97B' }}>
                      ${ref.earnings.toFixed(2)}
                    </td>
                    <td style={{ padding: spacing.md, textAlign: 'center' }}>
                      <span style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        background: ref.status === 'active' ? '#43E97B' : '#F59E0B',
                        borderRadius: '4px',
                        fontSize: fontSize.xs
                      }}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral History */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
            Commission History
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Date</th>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Type</th>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>From</th>
                  <th style={{ textAlign: 'right', padding: spacing.md }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {referralHistory.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: spacing.md, color: '#888' }}>{item.date}</td>
                    <td style={{ padding: spacing.md }}>{item.type}</td>
                    <td style={{ padding: spacing.md }}>{item.from}</td>
                    <td style={{ padding: spacing.md, textAlign: 'right', color: '#43E97B' }}>
                      +${item.amount.toFixed(2)}
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

const StatsCard = ({ icon, title, value, subtitle, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    style={{
      background: '#1a1a1a',
      padding: spacing.lg,
      borderRadius: '10px',
      borderLeft: `4px solid ${color}`
    }}
  >
    <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>{icon}</div>
    <p style={{ color: '#888', fontSize: fontSize.sm, marginBottom: spacing.xs }}>{title}</p>
    <p style={{ fontSize: fontSize.xl, fontWeight: 'bold', color, marginBottom: spacing.xs }}>
      {value}
    </p>
    <p style={{ color: '#666', fontSize: fontSize.xs }}>{subtitle}</p>
  </motion.div>
);

export default ReferralCenter;
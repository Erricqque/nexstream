import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Earnings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [timeframe, setTimeframe] = useState('month');
  const [earnings, setEarnings] = useState({
    total: 15420.50,
    available: 3240.80,
    pending: 850.00,
    withdrawn: 11329.70
  });

  const [earningsBySource, setEarningsBySource] = useState([
    { source: 'Video Views', amount: 8750.25, percentage: 57 },
    { source: 'Subscriptions', amount: 3240.50, percentage: 21 },
    { source: 'MLM Commissions', amount: 2150.75, percentage: 14 },
    { source: 'Tips & Donations', amount: 1279.00, percentage: 8 }
  ]);

  const [recentEarnings, setRecentEarnings] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadEarningsData();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user, timeframe]);

  const loadEarningsData = async () => {
    try {
      // Mock data - replace with real API calls
      setRecentEarnings([
        { id: 1, date: '2024-01-15', source: 'Video Views', amount: 45.50, status: 'completed' },
        { id: 2, date: '2024-01-14', source: 'Subscription', amount: 23.75, status: 'completed' },
        { id: 3, date: '2024-01-13', source: 'MLM Commission', amount: 12.00, status: 'completed' },
        { id: 4, date: '2024-01-12', source: 'Tip', amount: 5.50, status: 'completed' },
        { id: 5, date: '2024-01-11', source: 'Video Views', amount: 18.25, status: 'pending' }
      ]);

      setPayoutHistory([
        { id: 1, date: '2024-01-10', amount: 150.00, method: 'Flutterwave', status: 'completed' },
        { id: 2, date: '2023-12-15', amount: 200.00, method: 'PayPal', status: 'completed' },
        { id: 3, date: '2023-11-20', amount: 175.50, method: 'M-PESA', status: 'completed' }
      ]);
    } catch (error) {
      console.error('Error loading earnings data:', error);
    } finally {
      setLoading(false);
    }
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
              Earnings Dashboard
            </h1>
            <p style={{ color: '#888' }}>
              Track your revenue and payouts
            </p>
          </div>

          <div style={{ display: 'flex', gap: spacing.sm }}>
            {['week', 'month', 'year', 'all'].map(period => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  background: timeframe === period ? '#FF3366' : 'transparent',
                  border: '1px solid #333',
                  borderRadius: '20px',
                  color: timeframe === period ? 'white' : '#888',
                  cursor: 'pointer',
                  fontSize: fontSize.sm,
                  textTransform: 'capitalize'
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
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
          <SummaryCard
            title="Total Earnings"
            value={`$${earnings.total.toLocaleString()}`}
            subtitle="Lifetime earnings"
            color="#FF3366"
          />
          <SummaryCard
            title="Available"
            value={`$${earnings.available.toLocaleString()}`}
            subtitle="Ready to withdraw"
            color="#43E97B"
          />
          <SummaryCard
            title="Pending"
            value={`$${earnings.pending.toLocaleString()}`}
            subtitle="Processing"
            color="#F59E0B"
          />
          <SummaryCard
            title="Withdrawn"
            value={`$${earnings.withdrawn.toLocaleString()}`}
            subtitle="Total paid out"
            color="#4FACFE"
          />
        </div>

        {/* Earnings by Source */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl
          }}>
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
              Earnings by Source
            </h2>
            {earningsBySource.map((item, index) => (
              <div key={index} style={{ marginBottom: spacing.md }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: spacing.xs
                }}>
                  <span style={{ color: '#888' }}>{item.source}</span>
                  <span style={{ fontWeight: 'bold' }}>${item.amount.toLocaleString()}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#2a2a2a',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    background: index === 0 ? '#FF3366' 
                      : index === 1 ? '#4FACFE' 
                      : index === 2 ? '#43E97B' 
                      : '#F59E0B',
                    borderRadius: '4px',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Earnings */}
          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl
          }}>
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
              Recent Earnings
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                    <th style={{ textAlign: 'left', padding: spacing.sm }}>Date</th>
                    <th style={{ textAlign: 'left', padding: spacing.sm }}>Source</th>
                    <th style={{ textAlign: 'right', padding: spacing.sm }}>Amount</th>
                    <th style={{ textAlign: 'center', padding: spacing.sm }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEarnings.map(earning => (
                    <tr key={earning.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: spacing.sm, color: '#888' }}>{earning.date}</td>
                      <td style={{ padding: spacing.sm }}>{earning.source}</td>
                      <td style={{ padding: spacing.sm, textAlign: 'right', color: '#43E97B' }}>
                        ${earning.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: spacing.sm, textAlign: 'center' }}>
                        <span style={{
                          padding: `${spacing.xs} ${spacing.sm}`,
                          background: earning.status === 'completed' ? '#43E97B' : '#F59E0B',
                          borderRadius: '4px',
                          fontSize: fontSize.xs
                        }}>
                          {earning.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
            Payout History
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Date</th>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Method</th>
                  <th style={{ textAlign: 'right', padding: spacing.md }}>Amount</th>
                  <th style={{ textAlign: 'center', padding: spacing.md }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map(payout => (
                  <tr key={payout.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: spacing.md, color: '#888' }}>{payout.date}</td>
                    <td style={{ padding: spacing.md }}>{payout.method}</td>
                    <td style={{ padding: spacing.md, textAlign: 'right', color: '#43E97B' }}>
                      ${payout.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: spacing.md, textAlign: 'center' }}>
                      <span style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        background: payout.status === 'completed' ? '#43E97B' : '#F59E0B',
                        borderRadius: '4px',
                        fontSize: fontSize.xs
                      }}>
                        {payout.status}
                      </span>
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

const SummaryCard = ({ title, value, subtitle, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    style={{
      background: '#1a1a1a',
      padding: spacing.lg,
      borderRadius: '10px',
      borderLeft: `4px solid ${color}`
    }}
  >
    <p style={{ color: '#888', fontSize: fontSize.sm, marginBottom: spacing.xs }}>{title}</p>
    <p style={{ fontSize: fontSize.xl, fontWeight: 'bold', color, marginBottom: spacing.xs }}>
      {value}
    </p>
    <p style={{ color: '#666', fontSize: fontSize.xs }}>{subtitle}</p>
  </motion.div>
);

export default Earnings;
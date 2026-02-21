import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [businessData, setBusinessData] = useState({
    totalEarnings: 15420.50,
    monthlyEarnings: 3240.80,
    totalViews: 45231,
    totalSubscribers: 1234,
    mlmLevel: 3,
    downlineCount: 45,
    commissionRate: 10,
    pendingPayout: 850.00
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [downlineMembers, setDownlineMembers] = useState([]);
  const [earningsHistory, setEarningsHistory] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadBusinessData();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadBusinessData = async () => {
    try {
      setRecentTransactions([
        { id: 1, type: 'earning', amount: 45.50, desc: 'Video views', date: '2024-01-15', status: 'completed' },
        { id: 2, type: 'earning', amount: 23.75, desc: 'Subscription', date: '2024-01-14', status: 'completed' },
        { id: 3, type: 'commission', amount: 12.00, desc: 'Referral commission', date: '2024-01-13', status: 'completed' },
        { id: 4, type: 'payout', amount: -150.00, desc: 'Withdrawal', date: '2024-01-10', status: 'completed' }
      ]);

      setDownlineMembers([
        { id: 1, name: 'John Doe', level: 1, earnings: 1250.00, joinDate: '2023-12-01', active: true },
        { id: 2, name: 'Jane Smith', level: 1, earnings: 980.00, joinDate: '2023-12-05', active: true },
        { id: 3, name: 'Mike Johnson', level: 2, earnings: 450.00, joinDate: '2023-12-10', active: true },
        { id: 4, name: 'Sarah Wilson', level: 2, earnings: 320.00, joinDate: '2023-12-15', active: false }
      ]);

      setEarningsHistory([
        { month: 'Jan', amount: 1240 },
        { month: 'Feb', amount: 1560 },
        { month: 'Mar', amount: 1890 },
        { month: 'Apr', amount: 2240 },
        { month: 'May', amount: 2680 },
        { month: 'Jun', amount: 3120 }
      ]);
    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'mlm', label: 'MLM Network', icon: '🌳' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'payouts', label: 'Payouts', icon: '💳' }
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
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.xl
          }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Business Dashboard
          </h1>
          <p style={{ opacity: 0.9 }}>
            Welcome back! Here's your business overview
          </p>
        </motion.div>

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
          <StatCard
            icon="💰"
            title="Total Earnings"
            value={`$${businessData.totalEarnings.toLocaleString()}`}
            subtitle={`+$${businessData.monthlyEarnings.toLocaleString()} this month`}
            color="#FF3366"
          />
          <StatCard
            icon="👁️"
            title="Total Views"
            value={businessData.totalViews.toLocaleString()}
            subtitle="+12.5% vs last month"
            color="#4FACFE"
          />
          <StatCard
            icon="👥"
            title="Subscribers"
            value={businessData.totalSubscribers.toLocaleString()}
            subtitle={`${businessData.downlineCount} in downline`}
            color="#43E97B"
          />
          <StatCard
            icon="📊"
            title="MLM Level"
            value={businessData.mlmLevel}
            subtitle={`${businessData.commissionRate}% commission`}
            color="#F59E0B"
          />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          overflowX: 'auto',
          paddingBottom: spacing.xs,
          borderBottom: '1px solid #333'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                background: activeTab === tab.id ? '#FF3366' : 'transparent',
                border: 'none',
                borderRadius: '30px',
                color: activeTab === tab.id ? 'white' : '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                fontSize: fontSize.md,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Earnings Chart */}
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: spacing.xl,
                  marginBottom: spacing.xl
                }}>
                  <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                    Earnings Overview
                  </h2>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    height: '200px',
                    gap: spacing.sm
                  }}>
                    {earningsHistory.map((item, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '100%',
                          height: `${(item.amount / 3500) * 180}px`,
                          background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                          borderRadius: '5px 5px 0 0',
                          transition: 'height 0.3s'
                        }} />
                        <span style={{ fontSize: fontSize.xs, color: '#888', marginTop: spacing.xs }}>
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: spacing.xl
                }}>
                  <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                    Recent Transactions
                  </h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Description</th>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Amount</th>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Date</th>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map(tx => (
                          <tr key={tx.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: spacing.md }}>{tx.desc}</td>
                            <td style={{
                              padding: spacing.md,
                              color: tx.amount > 0 ? '#43E97B' : '#FF3366',
                              fontWeight: 'bold'
                            }}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                            </td>
                            <td style={{ padding: spacing.md, color: '#888' }}>{tx.date}</td>
                            <td style={{ padding: spacing.md }}>
                              <span style={{
                                padding: `${spacing.xs} ${spacing.sm}`,
                                background: tx.status === 'completed' ? '#43E97B' : '#F59E0B',
                                borderRadius: '4px',
                                fontSize: fontSize.xs,
                                textTransform: 'capitalize'
                              }}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MLM Network Tab */}
            {activeTab === 'mlm' && (
              <div>
                <div style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: spacing.xl,
                  marginBottom: spacing.xl
                }}>
                  <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                    Your MLM Network
                  </h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: spacing.lg,
                    marginBottom: spacing.xl
                  }}>
                    <div style={{
                      padding: spacing.lg,
                      background: '#2a2a2a',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>📊</div>
                      <h3>Level {businessData.mlmLevel}</h3>
                      <p style={{ color: '#888' }}>Current Level</p>
                    </div>
                    <div style={{
                      padding: spacing.lg,
                      background: '#2a2a2a',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>👥</div>
                      <h3>{businessData.downlineCount}</h3>
                      <p style={{ color: '#888' }}>Downline Members</p>
                    </div>
                    <div style={{
                      padding: spacing.lg,
                      background: '#2a2a2a',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>💰</div>
                      <h3>${businessData.pendingPayout}</h3>
                      <p style={{ color: '#888' }}>Pending Commission</p>
                    </div>
                  </div>

                  <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                    Downline Members
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Name</th>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Level</th>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Earnings</th>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Joined</th>
                          <th style={{ textAlign: 'left', padding: spacing.md }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {downlineMembers.map(member => (
                          <tr key={member.id} style={{ borderBottom: '1px solid #333' }}>
                            <td style={{ padding: spacing.md }}>{member.name}</td>
                            <td style={{ padding: spacing.md }}>Level {member.level}</td>
                            <td style={{ padding: spacing.md, color: '#43E97B' }}>
                              ${member.earnings}
                            </td>
                            <td style={{ padding: spacing.md, color: '#888' }}>{member.joinDate}</td>
                            <td style={{ padding: spacing.md }}>
                              <span style={{
                                padding: `${spacing.xs} ${spacing.sm}`,
                                background: member.active ? '#43E97B' : '#888',
                                borderRadius: '4px',
                                fontSize: fontSize.xs
                              }}>
                                {member.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
              <div style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.xl
              }}>
                <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                  Request Payout
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
                  gap: spacing.xl
                }}>
                  <div>
                    <div style={{ marginBottom: spacing.lg }}>
                      <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter amount"
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

                    <div style={{ marginBottom: spacing.lg }}>
                      <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                        Payment Method
                      </label>
                      <select
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
                        <option value="flutterwave">Flutterwave (Bank Transfer)</option>
                        <option value="paypal">PayPal</option>
                        <option value="mpesa">M-PESA</option>
                      </select>
                    </div>

                    <button
                      style={{
                        width: '100%',
                        padding: spacing.lg,
                        background: '#FF3366',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: fontSize.md,
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Request Payout
                    </button>
                  </div>

                  <div style={{
                    background: '#2a2a2a',
                    borderRadius: '8px',
                    padding: spacing.lg
                  }}>
                    <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                      Payout Summary
                    </h3>
                    <div style={{ marginBottom: spacing.md }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                        <span style={{ color: '#888' }}>Available Balance</span>
                        <span style={{ fontWeight: 'bold' }}>${businessData.totalEarnings}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                        <span style={{ color: '#888' }}>Minimum Payout</span>
                        <span>$10.00</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                        <span style={{ color: '#888' }}>Processing Fee</span>
                        <span>$1.50</span>
                      </div>
                      <div style={{
                        borderTop: '1px solid #333',
                        marginTop: spacing.md,
                        paddingTop: spacing.md
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                          <span>You'll Receive</span>
                          <span style={{ color: '#43E97B' }}>$148.50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    xl: '1.5rem'
  };

  return (
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
};

export default BusinessDashboard;
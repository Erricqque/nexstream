import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [walletData, setWalletData] = useState({
    balance: 3240.80,
    pending: 850.00,
    lifetime: 15420.50,
    withdrawn: 11329.70,
    currency: 'USD'
  });

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadWalletData();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadWalletData = async () => {
    try {
      setTransactions([
        { id: 1, type: 'credit', desc: 'Video Views', amount: 45.50, date: '2024-01-15', status: 'completed' },
        { id: 2, type: 'credit', desc: 'Subscription Revenue', amount: 23.75, date: '2024-01-14', status: 'completed' },
        { id: 3, type: 'credit', desc: 'MLM Commission', amount: 12.00, date: '2024-01-13', status: 'completed' },
        { id: 4, type: 'debit', desc: 'Withdrawal to Bank', amount: -150.00, date: '2024-01-10', status: 'completed' },
        { id: 5, type: 'credit', desc: 'Tip from Fan', amount: 5.50, date: '2024-01-09', status: 'completed' },
        { id: 6, type: 'pending', desc: 'Video Views (Processing)', amount: 18.25, date: '2024-01-08', status: 'pending' }
      ]);
    } catch (error) {
      console.error('Error loading wallet data:', error);
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

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
              My Wallet
            </h1>
            <p style={{ color: '#888' }}>
              Manage your earnings and withdrawals
            </p>
          </div>
          <button
            onClick={() => navigate('/business/payout')}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: '#FF3366',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontSize: fontSize.md,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Withdraw Funds
          </button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '20px',
            padding: spacing.xl,
            marginBottom: spacing.xl,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)'
          }} />
          
          <p style={{ fontSize: fontSize.sm, opacity: 0.9, marginBottom: spacing.sm }}>
            Available Balance
          </p>
          <h2 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            fontWeight: 'bold',
            marginBottom: spacing.sm
          }}>
            ${walletData.balance.toFixed(2)}
          </h2>
          <p style={{ fontSize: fontSize.sm, opacity: 0.9 }}>
            ≈ KES {(walletData.balance * 130).toLocaleString()} • ≈ EUR {(walletData.balance * 0.92).toFixed(2)}
          </p>

          <div style={{
            display: 'flex',
            gap: spacing.xl,
            marginTop: spacing.xl,
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{ fontSize: fontSize.xs, opacity: 0.8 }}>Pending</p>
              <p style={{ fontSize: fontSize.md, fontWeight: 'bold' }}>
                ${walletData.pending.toFixed(2)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: fontSize.xs, opacity: 0.8 }}>Lifetime Earnings</p>
              <p style={{ fontSize: fontSize.md, fontWeight: 'bold' }}>
                ${walletData.lifetime.toFixed(2)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: fontSize.xs, opacity: 0.8 }}>Total Withdrawn</p>
              <p style={{ fontSize: fontSize.md, fontWeight: 'bold' }}>
                ${walletData.withdrawn.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <QuickAction
            icon="💳"
            title="Add Payment Method"
            desc="Link bank or mobile money"
            onClick={() => navigate('/business/payout-settings')}
          />
          <QuickAction
            icon="📊"
            title="View Earnings"
            desc="See your revenue breakdown"
            onClick={() => navigate('/business/earnings')}
          />
          <QuickAction
            icon="📤"
            title="Request Payout"
            desc="Withdraw your earnings"
            onClick={() => navigate('/business/payout')}
          />
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
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Date</th>
                  <th style={{ textAlign: 'left', padding: spacing.md }}>Description</th>
                  <th style={{ textAlign: 'right', padding: spacing.md }}>Amount</th>
                  <th style={{ textAlign: 'center', padding: spacing.md }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: spacing.md, color: '#888' }}>{tx.date}</td>
                    <td style={{ padding: spacing.md }}>{tx.desc}</td>
                    <td style={{
                      padding: spacing.md,
                      textAlign: 'right',
                      color: tx.type === 'credit' ? '#43E97B' : tx.type === 'debit' ? '#FF3366' : '#F59E0B',
                      fontWeight: 'bold'
                    }}>
                      {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: spacing.md, textAlign: 'center' }}>
                      <span style={{
                        padding: `${spacing.xs} ${spacing.sm}`,
                        background: tx.status === 'completed' ? '#43E97B' : '#F59E0B',
                        borderRadius: '4px',
                        fontSize: fontSize.xs
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
    </div>
  );
};

const QuickAction = ({ icon, title, desc, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    style={{
      background: '#1a1a1a',
      padding: spacing.lg,
      borderRadius: '10px',
      cursor: 'pointer',
      border: '1px solid #333',
      transition: 'all 0.2s'
    }}
  >
    <div style={{ fontSize: '2rem', marginBottom: spacing.sm }}>{icon}</div>
    <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.xs }}>{title}</h3>
    <p style={{ color: '#888', fontSize: fontSize.sm }}>{desc}</p>
  </motion.div>
);

export default Wallet;
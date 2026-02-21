import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const PayoutSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeMethod, setActiveMethod] = useState('flutterwave');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadPaymentMethods();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      setPaymentMethods([
        {
          id: 1,
          type: 'flutterwave',
          label: 'Flutterwave',
          details: 'Bank: Equity Bank • Account: ****1234',
          isDefault: true,
          verified: true
        },
        {
          id: 2,
          type: 'paypal',
          label: 'PayPal',
          details: 'email@example.com',
          isDefault: false,
          verified: true
        },
        {
          id: 3,
          type: 'mpesa',
          label: 'M-PESA',
          details: '+254 *** *** 789',
          isDefault: false,
          verified: false
        }
      ]);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMethod = (id) => {
    setPaymentMethods(methods =>
      methods.map(m => ({
        ...m,
        isDefault: m.id === id
      }))
    );
  };

  const removeMethod = (id) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
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

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              Payout Settings
            </h1>
            <p style={{ color: '#888' }}>
              Manage your payment methods for withdrawals
            </p>
          </div>
          <button
            onClick={() => setShowAddMethod(true)}
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
            + Add Method
          </button>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: spacing.xl }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
            Your Payment Methods
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {paymentMethods.map(method => (
              <motion.div
                key={method.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: spacing.lg,
                  border: method.isDefault ? '2px solid #43E97B' : '1px solid #333'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: spacing.md
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: method.type === 'flutterwave' ? '#FF3366' 
                        : method.type === 'paypal' ? '#4FACFE' 
                        : '#43E97B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {method.type === 'flutterwave' ? '💳' 
                        : method.type === 'paypal' ? '📧' 
                        : '📱'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.xs }}>
                        {method.label}
                      </h3>
                      <p style={{ color: '#888', fontSize: fontSize.sm }}>
                        {method.details}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: spacing.sm }}>
                    {method.verified ? (
                      <span style={{
                        padding: `${spacing.xs} ${spacing.md}`,
                        background: '#43E97B',
                        borderRadius: '20px',
                        fontSize: fontSize.xs
                      }}>
                        ✓ Verified
                      </span>
                    ) : (
                      <span style={{
                        padding: `${spacing.xs} ${spacing.md}`,
                        background: '#F59E0B',
                        borderRadius: '20px',
                        fontSize: fontSize.xs
                      }}>
                        ⚠ Pending
                      </span>
                    )}

                    {!method.isDefault && (
                      <>
                        <button
                          onClick={() => setDefaultMethod(method.id)}
                          style={{
                            padding: `${spacing.sm} ${spacing.md}`,
                            background: 'transparent',
                            border: '1px solid #4FACFE',
                            borderRadius: '20px',
                            color: '#4FACFE',
                            fontSize: fontSize.xs,
                            cursor: 'pointer'
                          }}
                        >
                          Make Default
                        </button>
                        <button
                          onClick={() => removeMethod(method.id)}
                          style={{
                            padding: `${spacing.sm} ${spacing.md}`,
                            background: 'transparent',
                            border: '1px solid #FF3366',
                            borderRadius: '20px',
                            color: '#FF3366',
                            fontSize: fontSize.xs,
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                    {method.isDefault && (
                      <span style={{
                        padding: `${spacing.sm} ${spacing.md}`,
                        background: '#43E97B',
                        borderRadius: '20px',
                        fontSize: fontSize.xs
                      }}>
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payout Preferences */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
            Payout Preferences
          </h2>
          
          <div style={{ marginBottom: spacing.lg }}>
            <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
              Minimum Payout Amount
            </label>
            <select
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: spacing.md,
                background: '#2a2a2a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: fontSize.md
              }}
            >
              <option value="10">$10.00</option>
              <option value="20">$20.00</option>
              <option value="50">$50.00</option>
              <option value="100">$100.00</option>
            </select>
          </div>

          <div style={{ marginBottom: spacing.lg }}>
            <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
              Payout Schedule
            </label>
            <select
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: spacing.md,
                background: '#2a2a2a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: fontSize.md
              }}
            >
              <option value="manual">Manual (Request only)</option>
              <option value="weekly">Weekly (Every Monday)</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <button
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: '#FF3366',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: fontSize.md,
              cursor: 'pointer'
            }}
          >
            Save Preferences
          </button>
        </div>

        {/* Payout History */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl
        }}>
          <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
            Recent Payouts
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
                <tr>
                  <td style={{ padding: spacing.md, color: '#888' }}>2024-01-15</td>
                  <td style={{ padding: spacing.md }}>Flutterwave</td>
                  <td style={{ padding: spacing.md, textAlign: 'right', color: '#43E97B' }}>$150.00</td>
                  <td style={{ padding: spacing.md, textAlign: 'center' }}>
                    <span style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      background: '#43E97B',
                      borderRadius: '4px',
                      fontSize: fontSize.xs
                    }}>
                      Completed
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: spacing.md, color: '#888' }}>2023-12-20</td>
                  <td style={{ padding: spacing.md }}>PayPal</td>
                  <td style={{ padding: spacing.md, textAlign: 'right', color: '#43E97B' }}>$200.00</td>
                  <td style={{ padding: spacing.md, textAlign: 'center' }}>
                    <span style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      background: '#43E97B',
                      borderRadius: '4px',
                      fontSize: fontSize.xs
                    }}>
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Method Modal */}
        <AnimatePresence>
          {showAddMethod && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: spacing.md
              }}
              onClick={() => setShowAddMethod(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                style={{
                  background: '#1a1a2a',
                  borderRadius: '15px',
                  padding: spacing.xl,
                  width: '100%',
                  maxWidth: '500px'
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
                  Add Payment Method
                </h2>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Payment Method
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: spacing.sm
                  }}>
                    {['flutterwave', 'paypal', 'mpesa'].map(method => (
                      <button
                        key={method}
                        onClick={() => setActiveMethod(method)}
                        style={{
                          padding: spacing.md,
                          background: activeMethod === method ? '#FF3366' : '#2a2a2a',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: fontSize.sm,
                          textTransform: 'capitalize'
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {activeMethod === 'flutterwave' && (
                  <>
                    <div style={{ marginBottom: spacing.md }}>
                      <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Equity Bank"
                        style={{
                          width: '100%',
                          padding: spacing.md,
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: spacing.md }}>
                      <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                        Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter account number"
                        style={{
                          width: '100%',
                          padding: spacing.md,
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: spacing.md }}>
                      <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                        Account Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter account name"
                        style={{
                          width: '100%',
                          padding: spacing.md,
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </div>
                  </>
                )}

                {activeMethod === 'paypal' && (
                  <div style={{ marginBottom: spacing.md }}>
                    <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                      PayPal Email
                    </label>
                    <input
                      type="email"
                      placeholder="your-email@example.com"
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </div>
                )}

                {activeMethod === 'mpesa' && (
                  <>
                    <div style={{ marginBottom: spacing.md }}>
                      <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+254 700 000 000"
                        style={{
                          width: '100%',
                          padding: spacing.md,
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: spacing.md }}>
                      <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                        Account Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name on M-PESA"
                        style={{
                          width: '100%',
                          padding: spacing.md,
                          background: '#2a2a2a',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </div>
                  </>
                )}

                <div style={{
                  display: 'flex',
                  gap: spacing.md,
                  marginTop: spacing.xl
                }}>
                  <button
                    onClick={() => setShowAddMethod(false)}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      background: '#FF3366',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md,
                      cursor: 'pointer'
                    }}
                  >
                    Add Method
                  </button>
                  <button
                    onClick={() => setShowAddMethod(false)}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PayoutSettings;
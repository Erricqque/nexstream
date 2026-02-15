import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Affiliate = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    pending: 0,
    withdrawn: 0
  });
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (user) {
      // Generate unique referral link
      setReferralLink(`${window.location.origin}/register?ref=${user.id}`);
      
      // Load referral data from backend
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    // Simulated data - replace with actual API calls
    setReferrals([
      { id: 1, name: 'John Doe', level: 1, joined: '2026-02-01', earnings: 45.50, active: true },
      { id: 2, name: 'Jane Smith', level: 1, joined: '2026-02-03', earnings: 32.75, active: true },
      { id: 3, name: 'Bob Johnson', level: 2, joined: '2026-02-05', earnings: 18.20, active: true },
      { id: 4, name: 'Alice Brown', level: 2, joined: '2026-02-07', earnings: 12.90, active: false },
      { id: 5, name: 'Charlie Wilson', level: 3, joined: '2026-02-10', earnings: 5.50, active: true },
    ]);

    setEarnings({
      total: 245.75,
      level1: 124.50,
      level2: 67.80,
      level3: 53.45,
      pending: 78.25,
      withdrawn: 167.50
    });
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Network Marketing - MLM System
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          Earn commissions by referring new users to NexStream
        </p>

        {/* Earnings Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Earnings</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00b4d8' }}>
              ${earnings.total.toFixed(2)}
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 1 (10%)</h3>
            <p style={{ fontSize: '1.5rem', color: '#FFD700' }}>${earnings.level1.toFixed(2)}</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 2 (5%)</h3>
            <p style={{ fontSize: '1.5rem', color: '#FFA500' }}>${earnings.level2.toFixed(2)}</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 3 (2.5%)</h3>
            <p style={{ fontSize: '1.5rem', color: '#FF69B4' }}>${earnings.level3.toFixed(2)}</p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div style={{
          background: 'rgba(0,180,216,0.1)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid #00b4d8'
        }}>
          <h2 style={{ marginBottom: '15px' }}>Your Referral Link</h2>
          <p style={{ color: '#888', marginBottom: '15px' }}>
            Share this link with friends. You earn 10% from their purchases, 5% from their referrals, and 2.5% from their referrals' referrals.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={referralLink}
              readOnly
              style={{
                flex: 1,
                padding: '15px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #333',
                borderRadius: '10px',
                color: '#00b4d8',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={copyReferralLink}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Commission Structure */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Commission Structure</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,215,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '24px'
              }}>👤</div>
              <h3>Level 1</h3>
              <p style={{ color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' }}>10%</p>
              <p style={{ color: '#888' }}>Direct referrals</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,165,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '24px'
              }}>👥</div>
              <h3>Level 2</h3>
              <p style={{ color: '#FFA500', fontSize: '1.5rem', fontWeight: 'bold' }}>5%</p>
              <p style={{ color: '#888' }}>Referrals of referrals</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255,105,180,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '24px'
              }}>👪</div>
              <h3>Level 3</h3>
              <p style={{ color: '#FF69B4', fontSize: '1.5rem', fontWeight: 'bold' }}>2.5%</p>
              <p style={{ color: '#888' }}>Third level referrals</p>
            </div>
          </div>
        </div>

        {/* Referral List */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '30px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Your Referrals</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Level</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Joined</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(ref => (
                <tr key={ref.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>{ref.name}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: ref.level === 1 ? 'rgba(255,215,0,0.2)' : 
                                 ref.level === 2 ? 'rgba(255,165,0,0.2)' : 'rgba(255,105,180,0.2)',
                      color: ref.level === 1 ? '#FFD700' : 
                             ref.level === 2 ? '#FFA500' : '#FF69B4',
                      padding: '5px 10px',
                      borderRadius: '5px'
                    }}>
                      Level {ref.level}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#888' }}>{ref.joined}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: ref.active ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                      color: ref.active ? '#4CAF50' : '#ff4444',
                      padding: '5px 10px',
                      borderRadius: '5px'
                    }}>
                      {ref.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#00b4d8', fontWeight: 'bold' }}>
                    ${ref.earnings.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Withdraw Section */}
        <div style={{
          marginTop: '30px',
          background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,119,182,0.2))',
          borderRadius: '15px',
          padding: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3>Available for Withdrawal</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00b4d8' }}>
              ${earnings.pending.toFixed(2)}
            </p>
            <p style={{ color: '#888' }}>Minimum withdrawal: $50</p>
          </div>
          <button style={{
            padding: '15px 40px',
            background: earnings.pending >= 50 ? 'linear-gradient(135deg, #00b4d8, #0077b6)' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: earnings.pending >= 50 ? 'pointer' : 'not-allowed',
            opacity: earnings.pending >= 50 ? 1 : 0.5
          }}>
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default Affiliate;
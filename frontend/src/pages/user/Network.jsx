import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const Network = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState({
    level1: 0,
    level2: 0,
    level3: 0,
    total: 0,
    pending: 0
  });
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setReferralLink(`${window.location.origin}/register?ref=${user.id}`);
      loadNetworkData();
    }
  }, [user]);

  const loadNetworkData = async () => {
    try {
      // Load referrals
      const { data: refData } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:profiles!referred_id(
            full_name,
            email,
            avatar_url,
            created_at
          )
        `)
        .eq('referrer_id', user.id);

      setReferrals(refData || []);

      // Load earnings
      const { data: earnData } = await supabase
        .from('earnings')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'commission');

      const level1 = earnData?.filter(e => e.metadata?.level === 1).reduce((s, e) => s + e.amount, 0) || 0;
      const level2 = earnData?.filter(e => e.metadata?.level === 2).reduce((s, e) => s + e.amount, 0) || 0;
      const level3 = earnData?.filter(e => e.metadata?.level === 3).reduce((s, e) => s + e.amount, 0) || 0;

      setEarnings({
        level1,
        level2,
        level3,
        total: level1 + level2 + level3,
        pending: (level1 + level2 + level3) * 0.8 // 80% available
      });
    } catch (error) {
      console.error('Error loading network:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white', background: '#0f0f0f', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Network Marketing</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Earn commissions by referring friends</p>

      {/* Earnings Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 1 (10%)</h3>
          <p style={{ fontSize: '2rem', color: '#ef4444' }}>${earnings.level1.toFixed(2)}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 2 (5%)</h3>
          <p style={{ fontSize: '2rem', color: '#3b82f6' }}>${earnings.level2.toFixed(2)}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 3 (2.5%)</h3>
          <p style={{ fontSize: '2rem', color: '#10b981' }}>${earnings.level3.toFixed(2)}</p>
        </div>
        <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '10px' }}>
          <h3 style={{ color: '#888', marginBottom: '10px' }}>Available</h3>
          <p style={{ fontSize: '2rem', color: '#fbbf24' }}>${earnings.pending.toFixed(2)}</p>
        </div>
      </div>

      {/* Referral Link */}
      <div style={{
        background: '#1f1f1f',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '40px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Your Referral Link</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={referralLink}
            readOnly
            style={{
              flex: 1,
              padding: '15px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: '#ef4444',
              fontSize: '0.9rem'
            }}
          />
          <button
            onClick={copyLink}
            style={{
              padding: '15px 30px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Copy
          </button>
        </div>
        <p style={{ color: '#888', marginTop: '15px', fontSize: '0.9rem' }}>
          Share this link with friends. You earn when they join and purchase!
        </p>
      </div>

      {/* Referrals List */}
      <h2 style={{ marginBottom: '20px' }}>Your Referrals ({referrals.length})</h2>
      
      {referrals.length === 0 ? (
        <div style={{
          background: '#1f1f1f',
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#888' }}>No referrals yet. Start sharing your link!</p>
        </div>
      ) : (
        <div style={{ background: '#1f1f1f', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#2d2d2d' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Level</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Joined</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(ref => (
                <tr key={ref.id} style={{ borderBottom: '1px solid #2d2d2d' }}>
                  <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={ref.referred?.avatar_url || `https://ui-avatars.com/api/?name=${ref.referred?.full_name || 'User'}`}
                      alt=""
                      style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                    />
                    {ref.referred?.full_name || ref.referred?.email || 'Anonymous'}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: ref.level === 1 ? '#ef4444' : ref.level === 2 ? '#3b82f6' : '#10b981',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '0.8rem'
                    }}>
                      Level {ref.level}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#888' }}>
                    {new Date(ref.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: ref.status === 'active' ? '#10b981' : '#6b7280',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '0.8rem'
                    }}>
                      {ref.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Network;
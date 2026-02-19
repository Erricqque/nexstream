import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
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
  const [loading, setLoading] = useState(true);
  const [withdrawalMethod, setWithdrawalMethod] = useState('mpesa');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalPhone, setWithdrawalPhone] = useState('');

  useEffect(() => {
    if (user) {
      loadAffiliateData();
      setReferralLink(`${window.location.origin}/register?ref=${user.id}`);
    }
  }, [user]);

  const loadAffiliateData = async () => {
    try {
      // Load referrals from database
      const { data: referralsData } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:user_id (
            email,
            full_name,
            created_at
          )
        `)
        .eq('referrer_id', user.id);

      setReferrals(referralsData || []);

      // Load earnings
      const { data: earningsData } = await supabase
        .from('earnings')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'commission');

      const { data: withdrawalsData } = await supabase
        .from('withdrawals')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      const totalEarnings = earningsData?.reduce((sum, e) => sum + e.amount, 0) || 0;
      const totalWithdrawn = withdrawalsData?.reduce((sum, w) => sum + w.amount, 0) || 0;

      // Calculate by level
      const level1 = earningsData?.filter(e => e.metadata?.level === 1).reduce((sum, e) => sum + e.amount, 0) || 0;
      const level2 = earningsData?.filter(e => e.metadata?.level === 2).reduce((sum, e) => sum + e.amount, 0) || 0;
      const level3 = earningsData?.filter(e => e.metadata?.level === 3).reduce((sum, e) => sum + e.amount, 0) || 0;

      setEarnings({
        total: totalEarnings - totalWithdrawn,
        level1,
        level2,
        level3,
        pending: totalEarnings - totalWithdrawn,
        withdrawn: totalWithdrawn
      });
    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || withdrawalAmount < 10) {
      alert('Minimum withdrawal is $10');
      return;
    }

    if (withdrawalAmount > earnings.pending) {
      alert('Insufficient balance');
      return;
    }

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert([{
          user_id: user.id,
          amount: parseFloat(withdrawalAmount),
          payment_method: withdrawalMethod,
          phone_number: withdrawalPhone,
          status: 'pending',
          created_at: new Date()
        }]);

      if (error) throw error;
      
      alert('Withdrawal request submitted successfully!');
      setWithdrawalAmount('');
      loadAffiliateData();
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Failed to submit withdrawal request');
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Network Marketing</h1>
        <p style={{ color: '#888', marginBottom: '40px' }}>
          Earn commissions by referring new users to NexStream
        </p>

        {/* Earnings Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Earnings</h3>
            <p style={{ fontSize: '2rem', color: '#ef4444' }}>${earnings.total.toFixed(2)}</p>
          </div>
          
          <div style={{
            background: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 1 (10%)</h3>
            <p style={{ fontSize: '1.5rem', color: '#fbbf24' }}>${earnings.level1.toFixed(2)}</p>
          </div>
          
          <div style={{
            background: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 2 (5%)</h3>
            <p style={{ fontSize: '1.5rem', color: '#fbbf24' }}>${earnings.level2.toFixed(2)}</p>
          </div>
          
          <div style={{
            background: '#1f1f1f',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Level 3 (2.5%)</h3>
            <p style={{ fontSize: '1.5rem', color: '#fbbf24' }}>${earnings.level3.toFixed(2)}</p>
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
                padding: '12px',
                background: '#2d2d2d',
                border: '1px solid #3d3d3d',
                borderRadius: '5px',
                color: '#ef4444'
              }}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                alert('Copied!');
              }}
              style={{
                padding: '12px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div style={{
          background: '#1f1f1f',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '40px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Withdraw Earnings</h3>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            Available Balance: <span style={{ color: '#ef4444', fontSize: '1.5rem' }}>${earnings.pending.toFixed(2)}</span>
          </p>

          <div style={{ display: 'grid', gap: '20px', maxWidth: '400px' }}>
            <input
              type="number"
              placeholder="Amount to withdraw ($10 min)"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              style={{
                padding: '12px',
                background: '#2d2d2d',
                border: '1px solid #3d3d3d',
                borderRadius: '5px',
                color: 'white'
              }}
            />

            <select
              value={withdrawalMethod}
              onChange={(e) => setWithdrawalMethod(e.target.value)}
              style={{
                padding: '12px',
                background: '#2d2d2d',
                border: '1px solid #3d3d3d',
                borderRadius: '5px',
                color: 'white'
              }}
            >
              <option value="mpesa">M-Pesa</option>
              <option value="airtel">Airtel Money</option>
              <option value="tigo">Tigo Pesa</option>
              <option value="bank">Bank Transfer</option>
            </select>

            <input
              type="tel"
              placeholder="Phone Number"
              value={withdrawalPhone}
              onChange={(e) => setWithdrawalPhone(e.target.value)}
              style={{
                padding: '12px',
                background: '#2d2d2d',
                border: '1px solid #3d3d3d',
                borderRadius: '5px',
                color: 'white'
              }}
            />

            <button
              onClick={handleWithdrawal}
              style={{
                padding: '15px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        {/* Referrals List */}
        <h3 style={{ marginBottom: '20px' }}>Your Referrals ({referrals.length})</h3>
        <div style={{
          background: '#1f1f1f',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          {referrals.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              No referrals yet. Share your link to start earning!
            </p>
          ) : (
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
                  <tr key={ref.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
                    <td style={{ padding: '15px' }}>
                      {ref.referred?.full_name || ref.referred?.email || 'Anonymous'}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        background: ref.level === 1 ? '#fbbf24' : ref.level === 2 ? '#f59e0b' : '#ef4444',
                        color: 'black',
                        padding: '3px 10px',
                        borderRadius: '3px'
                      }}>
                        Level {ref.level}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#888' }}>
                      {new Date(ref.joined_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        background: ref.status === 'active' ? '#10b981' : '#6b7280',
                        color: 'white',
                        padding: '3px 10px',
                        borderRadius: '3px'
                      }}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Affiliate;
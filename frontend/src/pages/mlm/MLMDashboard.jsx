import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const MLMDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    level1Count: 0,
    level2Count: 0,
    level3Count: 0,
    totalEarnings: 0,
    pendingCommissions: 0
  });
  const [referrals, setReferrals] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadMLMData();
    generateReferralLink();
  }, [user]);

  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    setReferralLink(`${baseUrl}/register?ref=${user.id}`);
  };

  const loadMLMData = async () => {
    try {
      setLoading(true);

      // Get referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*, referred:referred_id(username, email, created_at)')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      setReferrals(referralsData || []);

      // Get MLM earnings
      const { data: earningsData } = await supabase
        .from('mlm_earnings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setEarnings(earningsData || []);

      // Calculate stats
      const level1 = referralsData?.filter(r => r.level === 1).length || 0;
      const level2 = referralsData?.filter(r => r.level === 2).length || 0;
      const level3 = referralsData?.filter(r => r.level === 3).length || 0;
      const totalEarned = earningsData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const pending = earningsData?.filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

      setStats({
        totalReferrals: referralsData?.length || 0,
        level1Count: level1,
        level2Count: level2,
        level3Count: level3,
        totalEarnings: totalEarned,
        pendingCommissions: pending
      });

    } catch (error) {
      console.error('Error loading MLM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
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
      padding: spacing.xl,
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
          <h1 style={{ fontSize: fontSize.xl, marginBottom: spacing.xs }}>
            MLM Business Dashboard
          </h1>
          <p style={{ opacity: 0.9 }}>Build your network and earn commissions</p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <StatCard
            icon="👥"
            title="Total Referrals"
            value={stats.totalReferrals}
            color="#FF3366"
          />
          <StatCard
            icon="💰"
            title="Total Earnings"
            value={`$${stats.totalEarnings.toFixed(2)}`}
            color="#43E97B"
          />
          <StatCard
            icon="⏳"
            title="Pending"
            value={`$${stats.pendingCommissions.toFixed(2)}`}
            color="#F59E0B"
          />
          <StatCard
            icon="📊"
            title="Levels"
            value={`L1:${stats.level1Count} L2:${stats.level2Count} L3:${stats.level3Count}`}
            color="#4FACFE"
          />
        </div>

        {/* Referral Link */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>
            Your Referral Link
          </h3>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={referralLink}
              readOnly
              style={{
                flex: 1,
                padding: spacing.md,
                background: '#2a2a2a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: fontSize.md
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: '#FF3366',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Copy Link
            </button>
          </div>
          <p style={{ color: '#888', marginTop: spacing.sm, fontSize: fontSize.sm }}>
            Share this link to earn 10% commission on direct referrals
          </p>
        </div>

        {/* Commission Structure */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>
            Commission Structure
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: spacing.md
          }}>
            <LevelCard level={1} rate="10%" desc="Direct referrals" color="#FF3366" />
            <LevelCard level={2} rate="5%" desc="Second level" color="#4FACFE" />
            <LevelCard level={3} rate="3%" desc="Third level" color="#43E97B" />
          </div>
        </div>

        {/* Referrals List */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '10px',
          padding: spacing.xl
        }}>
          <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>
            Your Referrals
          </h3>
          {referrals.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', padding: spacing.xl }}>
              No referrals yet. Share your link to start earning!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ padding: spacing.sm, textAlign: 'left' }}>Username</th>
                    <th style={{ padding: spacing.sm, textAlign: 'left' }}>Level</th>
                    <th style={{ padding: spacing.sm, textAlign: 'left' }}>Joined</th>
                    <th style={{ padding: spacing.sm, textAlign: 'left' }}>Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(ref => (
                    <tr key={ref.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: spacing.sm }}>
                        {ref.referred?.username || 'New User'}
                      </td>
                      <td style={{ padding: spacing.sm }}>Level {ref.level}</td>
                      <td style={{ padding: spacing.sm, color: '#888' }}>
                        {new Date(ref.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: spacing.sm, color: '#43E97B' }}>
                        ${ref.commission_earned?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px'
  };
  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    lg: '1.25rem'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        background: '#1a1a1a',
        padding: spacing.md,
        borderRadius: '10px',
        borderLeft: `4px solid ${color}`
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>{icon}</div>
      <p style={{ color: '#888', fontSize: fontSize.sm }}>{title}</p>
      <p style={{ fontSize: fontSize.lg, fontWeight: 'bold', color }}>{value}</p>
    </motion.div>
  );
};

const LevelCard = ({ level, rate, desc, color }) => {
  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px'
  };
  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    xl: '1.5rem'
  };

  return (
    <div style={{
      padding: spacing.md,
      background: '#2a2a2a',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h4 style={{ fontSize: fontSize.xl, color, marginBottom: spacing.xs }}>{rate}</h4>
      <p style={{ fontWeight: 'bold' }}>Level {level}</p>
      <p style={{ color: '#888', fontSize: fontSize.xs }}>{desc}</p>
    </div>
  );
};

export default MLMDashboard;
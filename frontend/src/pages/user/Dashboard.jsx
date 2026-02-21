import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PlaylistCard from '../../components/playlists/PlaylistCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [mlmStats, setMlmStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingCommissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Load user content
      const { data: contentData } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setContent(contentData || []);

      // Load playlists
      const { data: playlistData } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPlaylists(playlistData || []);

      // Load MLM stats
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      const { data: earningsData } = await supabase
        .from('mlm_earnings')
        .select('*')
        .eq('user_id', user.id);

      const totalEarned = earningsData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const pending = earningsData?.filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

      setMlmStats({
        totalReferrals: referralsData?.length || 0,
        totalEarnings: totalEarned,
        pendingCommissions: pending
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header Banner */}
      <div style={{
        height: '150px',
        background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
        position: 'relative'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `0 ${spacing.xl}` }}>
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.lg,
          marginTop: '-50px',
          marginBottom: spacing.xl,
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: profile?.avatar_url 
              ? `url(${profile.avatar_url}) center/cover`
              : 'linear-gradient(135deg, #FF3366, #4FACFE)',
            border: '4px solid #0f0f0f'
          }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: fontSize.xl, marginBottom: spacing.xs }}>
              {profile?.username || user?.email?.split('@')[0]}
            </h1>
            <p style={{ color: '#888' }}>
              {content.length} videos • {playlists.length} playlists
            </p>
          </div>
          <Link to="/settings">
            <button style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              background: '#2a2a2a',
              border: '1px solid #333',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer'
            }}>
              Edit Profile
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <StatCard
            icon="👁️"
            title="Total Views"
            value={formatNumber(content.reduce((sum, c) => sum + (c.views_count || 0), 0))}
            color="#FF3366"
          />
          <StatCard
            icon="❤️"
            title="Total Likes"
            value={formatNumber(content.reduce((sum, c) => sum + (c.likes_count || 0), 0))}
            color="#4FACFE"
          />
          <Link to="/mlm" style={{ textDecoration: 'none' }}>
            <StatCard
              icon="🌳"
              title="MLM Network"
              value={`${mlmStats.totalReferrals} referrals`}
              subtitle={`$${mlmStats.totalEarnings.toFixed(2)} earned`}
              color="#43E97B"
              clickable
            />
          </Link>
          <Link to="/earnings" style={{ textDecoration: 'none' }}>
            <StatCard
              icon="💰"
              title="Earnings"
              value={`$${mlmStats.pendingCommissions.toFixed(2)}`}
              subtitle="Pending"
              color="#F59E0B"
              clickable
            />
          </Link>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: spacing.md,
          borderBottom: '1px solid #333',
          marginBottom: spacing.xl
        }}>
          <TabButton
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
            icon="🎬"
            label="My Content"
          />
          <TabButton
            active={activeTab === 'playlists'}
            onClick={() => setActiveTab('playlists')}
            icon="📋"
            label="Playlists"
          />
          <TabButton
            active={activeTab === 'mlm'}
            onClick={() => setActiveTab('mlm')}
            icon="🌳"
            label="MLM Network"
          />
          <TabButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon="📊"
            label="Analytics"
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'content' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg
            }}>
              <h2 style={{ fontSize: fontSize.lg }}>Your Videos</h2>
              <Link to="/upload">
                <button style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: '#FF3366',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  cursor: 'pointer'
                }}>
                  + Upload New
                </button>
              </Link>
            </div>

            {content.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: spacing.xl,
                background: '#1a1a1a',
                borderRadius: '10px'
              }}>
                <p style={{ color: '#888' }}>No content yet. Start uploading!</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: spacing.lg
              }}>
                {content.map(item => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg
            }}>
              <h2 style={{ fontSize: fontSize.lg }}>Your Playlists</h2>
            </div>

            {playlists.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: spacing.xl,
                background: '#1a1a1a',
                borderRadius: '10px'
              }}>
                <p style={{ color: '#888' }}>No playlists yet. Create one from any video!</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: spacing.lg
              }}>
                {playlists.map(playlist => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mlm' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg
            }}>
              <h2 style={{ fontSize: fontSize.lg }}>MLM Network</h2>
              <Link to="/mlm">
                <button style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: '#FF3366',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  cursor: 'pointer'
                }}>
                  View Full Dashboard →
              </button>
              </Link>
            </div>

            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.xl,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>🌳</div>
              <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.sm }}>
                Your MLM Network
              </h3>
              <p style={{ color: '#888', marginBottom: spacing.lg }}>
                You have {mlmStats.totalReferrals} referrals earning you ${mlmStats.totalEarnings.toFixed(2)}
              </p>
              <Link to="/mlm">
                <button style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: '#FF3366',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  cursor: 'pointer'
                }}>
                  Manage MLM Network
                </button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>Analytics</h2>
            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.xl,
              textAlign: 'center'
            }}>
              <p style={{ color: '#888' }}>Detailed analytics coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== COMPONENTS WITH THEIR OWN SPACING ==========

const StatCard = ({ icon, title, value, subtitle, color, clickable }) => {
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
      whileHover={clickable ? { y: -5 } : {}}
      style={{
        background: '#1a1a1a',
        padding: spacing.md,
        borderRadius: '10px',
        borderLeft: `4px solid ${color}`,
        cursor: clickable ? 'pointer' : 'default'
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>{icon}</div>
      <p style={{ color: '#888', fontSize: fontSize.sm }}>{title}</p>
      <p style={{ fontSize: fontSize.lg, fontWeight: 'bold', color }}>{value}</p>
      {subtitle && <p style={{ color: '#888', fontSize: fontSize.xs }}>{subtitle}</p>}
    </motion.div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => {
  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px'
  };

  const fontSize = {
    sm: '0.875rem',
    md: '1rem'
  };

  return (
    <button
      onClick={onClick}
      style={{
        padding: `${spacing.sm} 0`,
        marginRight: spacing.md,
        background: 'none',
        border: 'none',
        color: active ? '#FF3366' : '#888',
        cursor: 'pointer',
        borderBottom: active ? '2px solid #FF3366' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        fontSize: fontSize.md
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
};

const ContentCard = ({ content }) => {
  const navigate = useNavigate();
  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px'
  };
  
  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/content/${content.id}`)}
      style={{
        background: '#1a1a1a',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      <div style={{
        height: '140px',
        background: content.thumbnail_url 
          ? `url(${content.thumbnail_url}) center/cover`
          : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)'
      }} />
      <div style={{ padding: spacing.md }}>
        <h3 style={{ fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.xs }}>
          {content.title}
        </h3>
        <p style={{ color: '#888', fontSize: fontSize.sm }}>
          {content.views_count || 0} views
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
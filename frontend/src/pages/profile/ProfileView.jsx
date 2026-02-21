import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useResponsive, containerStyle, fontSize, spacing } from '../../styles/responsive';

const ProfileView = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const responsive = useResponsive();
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState({
    subscribers: 0,
    totalViews: 0,
    totalLikes: 0,
    joinDate: null
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadProfile();
    checkCurrentUser();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Get user by username
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (!userData) {
        navigate('/404');
        return;
      }

      setProfile(userData);

      // Get user's content
      const { data: contentData } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', userData.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      setContent(contentData || []);

      // Get stats
      const totalViews = contentData?.reduce((sum, item) => sum + (item.views_count || 0), 0) || 0;
      const totalLikes = contentData?.reduce((sum, item) => sum + (item.likes_count || 0), 0) || 0;

      // Get subscriber count
      const { count } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('channel_id', userData.id);

      setStats({
        subscribers: count || 0,
        totalViews,
        totalLikes,
        joinDate: userData.created_at
      });

    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    
    if (user && profile) {
      const { data } = await supabase
        .from('subscribers')
        .select('*')
        .eq('channel_id', profile.id)
        .eq('subscriber_id', user.id)
        .single();
      
      setIsSubscribed(!!data);
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      if (isSubscribed) {
        await supabase
          .from('subscribers')
          .delete()
          .eq('channel_id', profile.id)
          .eq('subscriber_id', currentUser.id);
        
        setStats(prev => ({ ...prev, subscribers: prev.subscribers - 1 }));
      } else {
        await supabase
          .from('subscribers')
          .insert([{
            channel_id: profile.id,
            subscriber_id: currentUser.id
          }]);
        
        setStats(prev => ({ ...prev, subscribers: prev.subscribers + 1 }));
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
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
          width: responsive.isMobile ? '40px' : '50px',
          height: responsive.isMobile ? '40px' : '50px',
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

      {/* Cover Image */}
      <div style={{
        height: responsive.isMobile ? '150px' : '200px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        position: 'relative'
      }} />

      {/* Profile Header */}
      <div style={containerStyle}>
        <div style={{
          display: 'flex',
          flexDirection: responsive.isMobile ? 'column' : 'row',
          alignItems: responsive.isMobile ? 'center' : 'flex-end',
          gap: spacing.lg,
          marginTop: responsive.isMobile ? '-40px' : '-50px',
          marginBottom: spacing.xl,
          textAlign: responsive.isMobile ? 'center' : 'left'
        }}>
          {/* Avatar */}
          <div style={{
            width: responsive.isMobile ? '100px' : '120px',
            height: responsive.isMobile ? '100px' : '120px',
            borderRadius: '50%',
            background: profile?.avatar_url 
              ? `url(${profile.avatar_url}) center/cover`
              : 'linear-gradient(135deg, #FF3366, #4FACFE)',
            border: '4px solid #0f0f0f',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }} />

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: responsive.isMobile ? fontSize.xl : fontSize.xxl,
              marginBottom: spacing.xs
            }}>
              {profile?.username}
            </h1>
            <p style={{ color: '#888', marginBottom: spacing.sm }}>
              {profile?.bio || 'No bio yet'}
            </p>
            
            {/* Stats Row */}
            <div style={{
              display: 'flex',
              gap: responsive.isMobile ? spacing.md : spacing.xl,
              justifyContent: responsive.isMobile ? 'center' : 'flex-start',
              flexWrap: 'wrap'
            }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#FF3366' }}>
                  {stats.subscribers.toLocaleString()}
                </span>
                <span style={{ color: '#888', marginLeft: spacing.xs }}>subscribers</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', color: '#4FACFE' }}>
                  {stats.totalViews.toLocaleString()}
                </span>
                <span style={{ color: '#888', marginLeft: spacing.xs }}>views</span>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', color: '#43E97B' }}>
                  {content.length}
                </span>
                <span style={{ color: '#888', marginLeft: spacing.xs }}>videos</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>
                  Joined {new Date(stats.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Subscribe Button */}
          {currentUser?.id !== profile?.id && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribe}
              style={{
                padding: responsive.isMobile ? `${spacing.sm} ${spacing.lg}` : `${spacing.md} ${spacing.xl}`,
                background: isSubscribed ? 'rgba(255,255,255,0.1)' : '#FF3366',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                fontSize: fontSize.sm,
                fontWeight: '600',
                cursor: 'pointer',
                width: responsive.isMobile ? '100%' : 'auto'
              }}
            >
              {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
            </motion.button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: responsive.isMobile ? spacing.sm : spacing.lg,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: spacing.xl,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: spacing.xs
        }}>
          {['videos', 'playlists', 'about'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: `${spacing.md} 0`,
                background: 'none',
                border: 'none',
                color: activeTab === tab ? '#FF3366' : '#888',
                fontSize: fontSize.md,
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid #FF3366' : 'none',
                textTransform: 'capitalize'
              }}
            >
              {tab}
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
            {activeTab === 'videos' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: responsive.isMobile 
                  ? '1fr' 
                  : responsive.isTablet 
                    ? 'repeat(2, 1fr)' 
                    : 'repeat(3, 1fr)',
                gap: spacing.lg
              }}>
                {content.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/content/${item.id}`)}
                    style={{
                      background: '#1a1a1a',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      height: responsive.isMobile ? '120px' : '140px',
                      background: item.thumbnail_url 
                        ? `url(${item.thumbnail_url}) center/cover`
                        : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)'
                    }} />
                    <div style={{ padding: spacing.md }}>
                      <h3 style={{
                        fontSize: fontSize.sm,
                        marginBottom: spacing.xs,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#888',
                        fontSize: fontSize.xs
                      }}>
                        <span>👁️ {item.views_count || 0}</span>
                        <span>❤️ {item.likes_count || 0}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'about' && (
              <div style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.xl
              }}>
                <h3 style={{ marginBottom: spacing.md }}>About</h3>
                <p style={{ color: '#888', lineHeight: 1.6, marginBottom: spacing.lg }}>
                  {profile?.bio || 'No bio provided'}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: responsive.isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: spacing.md
                }}>
                  <div>
                    <p style={{ color: '#888', marginBottom: spacing.xs }}>Joined</p>
                    <p>{new Date(profile?.created_at).toLocaleDateString()}</p>
                  </div>
                  {profile?.website && (
                    <div>
                      <p style={{ color: '#888', marginBottom: spacing.xs }}>Website</p>
                      <a 
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4FACFE', textDecoration: 'none' }}
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile?.location && (
                    <div>
                      <p style={{ color: '#888', marginBottom: spacing.xs }}>Location</p>
                      <p>{profile.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileView;
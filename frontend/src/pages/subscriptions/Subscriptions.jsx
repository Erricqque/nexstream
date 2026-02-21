import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Subscriptions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [newContent, setNewContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadSubscriptions();
      loadNewContent();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadSubscriptions = async () => {
    try {
      // Mock subscriptions - replace with real data
      setSubscriptions([
        {
          id: 1,
          name: 'TechReviews Pro',
          avatar: null,
          subscribers: '1.2M',
          newVideos: 3,
          lastUpload: '2 hours ago',
          category: 'Technology'
        },
        {
          id: 2,
          name: 'GamingWithMike',
          avatar: null,
          subscribers: '850K',
          newVideos: 5,
          lastUpload: '5 hours ago',
          category: 'Gaming'
        },
        {
          id: 3,
          name: 'MusicLab Official',
          avatar: null,
          subscribers: '2.1M',
          newVideos: 2,
          lastUpload: '1 day ago',
          category: 'Music'
        },
        {
          id: 4,
          name: 'TravelBug',
          avatar: null,
          subscribers: '950K',
          newVideos: 4,
          lastUpload: '3 hours ago',
          category: 'Travel'
        },
        {
          id: 5,
          name: 'FitnessGuru',
          avatar: null,
          subscribers: '1.5M',
          newVideos: 1,
          lastUpload: '2 days ago',
          category: 'Fitness'
        }
      ]);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const loadNewContent = async () => {
    try {
      // Mock new content from subscriptions
      setNewContent([
        {
          id: 101,
          title: 'iPhone 15 Pro Review',
          channel: 'TechReviews Pro',
          thumbnail: null,
          views: '45K',
          uploadedAt: '2 hours ago',
          duration: '12:30'
        },
        {
          id: 102,
          title: 'Best Games of 2024',
          channel: 'GamingWithMike',
          thumbnail: null,
          views: '23K',
          uploadedAt: '5 hours ago',
          duration: '18:45'
        },
        {
          id: 103,
          title: 'New Album Teaser',
          channel: 'MusicLab Official',
          thumbnail: null,
          views: '67K',
          uploadedAt: '1 day ago',
          duration: '3:30'
        }
      ]);
    } catch (error) {
      console.error('Error loading new content:', error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (channelId) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== channelId));
  };

  const totalNewVideos = subscriptions.reduce((sum, sub) => sum + sub.newVideos, 0);

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
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
              Subscriptions
            </h1>
            <p style={{ color: '#888' }}>
              You're subscribed to {subscriptions.length} channels • {totalNewVideos} new videos
            </p>
          </div>

          <div style={{ display: 'flex', gap: spacing.sm }}>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer',
                fontSize: fontSize.sm
              }}
            >
              {viewMode === 'grid' ? '📋 List' : '🔲 Grid'}
            </button>
            <button
              onClick={() => navigate('/browse')}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: '#FF3366',
                border: 'none',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer',
                fontSize: fontSize.sm
              }}
            >
              Discover More
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xl }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #FF3366',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        ) : (
          <>
            {/* New Content Section */}
            {newContent.length > 0 && (
              <div style={{ marginBottom: spacing.xl }}>
                <h2 style={{
                  fontSize: fontSize.lg,
                  marginBottom: spacing.lg,
                  color: '#43E97B'
                }}>
                  🔔 Latest from your subscriptions
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? '1fr' 
                    : window.innerWidth <= 1024 
                      ? 'repeat(2, 1fr)' 
                      : 'repeat(3, 1fr)',
                  gap: spacing.lg
                }}>
                  {newContent.map(item => (
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
                        height: '140px',
                        background: item.thumbnail 
                          ? `url(${item.thumbnail}) center/cover`
                          : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          bottom: spacing.xs,
                          right: spacing.xs,
                          padding: `${spacing.xs} ${spacing.sm}`,
                          background: 'rgba(0,0,0,0.7)',
                          borderRadius: '4px',
                          fontSize: fontSize.xs
                        }}>
                          {item.duration}
                        </span>
                      </div>
                      <div style={{ padding: spacing.md }}>
                        <h3 style={{
                          fontSize: fontSize.md,
                          fontWeight: '600',
                          marginBottom: spacing.xs
                        }}>
                          {item.title}
                        </h3>
                        <p style={{
                          color: '#888',
                          fontSize: fontSize.sm,
                          marginBottom: spacing.xs
                        }}>
                          {item.channel}
                        </p>
                        <p style={{
                          color: '#666',
                          fontSize: fontSize.xs
                        }}>
                          {item.views} views • {item.uploadedAt}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscriptions List */}
            <div>
              <h2 style={{
                fontSize: fontSize.lg,
                marginBottom: spacing.lg
              }}>
                Channels you follow
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid'
                  ? isMobile 
                    ? '1fr' 
                    : window.innerWidth <= 1024 
                      ? 'repeat(2, 1fr)' 
                      : 'repeat(3, 1fr)'
                  : '1fr',
                gap: spacing.md
              }}>
                <AnimatePresence>
                  {subscriptions.map((channel, index) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md,
                        padding: spacing.lg,
                        background: '#1a1a1a',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        flexDirection: viewMode === 'grid' && !isMobile ? 'column' : 'row',
                        textAlign: viewMode === 'grid' && !isMobile ? 'center' : 'left'
                      }}
                      onClick={() => navigate(`/profile/${channel.name.toLowerCase().replace(/\s+/g, '')}`)}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: viewMode === 'grid' && !isMobile ? '80px' : '50px',
                        height: viewMode === 'grid' && !isMobile ? '80px' : '50px',
                        borderRadius: '50%',
                        background: channel.avatar 
                          ? `url(${channel.avatar}) center/cover`
                          : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: viewMode === 'grid' && !isMobile ? '2rem' : '1.2rem',
                        color: 'white'
                      }}>
                        {!channel.avatar && channel.name[0]}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: fontSize.md,
                          fontWeight: '600',
                          marginBottom: spacing.xs
                        }}>
                          {channel.name}
                        </h3>
                        <p style={{
                          color: '#888',
                          fontSize: fontSize.sm,
                          marginBottom: spacing.xs
                        }}>
                          {channel.subscribers} subscribers • {channel.category}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.md,
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            color: '#43E97B',
                            fontSize: fontSize.xs
                          }}>
                            {channel.newVideos} new videos
                          </span>
                          <span style={{
                            color: '#666',
                            fontSize: fontSize.xs
                          }}>
                            Last upload {channel.lastUpload}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unsubscribe(channel.id);
                          }}
                          style={{
                            padding: `${spacing.sm} ${spacing.lg}`,
                            background: 'transparent',
                            border: '1px solid #FF3366',
                            borderRadius: '20px',
                            color: '#FF3366',
                            fontSize: fontSize.sm,
                            cursor: 'pointer'
                          }}
                        >
                          Unsubscribe
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Subscriptions;
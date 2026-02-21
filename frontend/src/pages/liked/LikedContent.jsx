import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const LikedContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadLikedContent();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadLikedContent = async () => {
    try {
      // Mock liked data - replace with real data from your likes table
      setLikedItems([
        {
          id: 1,
          title: 'Amazing Nature Documentary',
          creator: 'NatureLens',
          thumbnail: null,
          likes: '15K',
          likedAt: '2 hours ago',
          duration: '45:20'
        },
        {
          id: 2,
          title: 'Epic Gaming Montage',
          creator: 'GameMaster Pro',
          thumbnail: null,
          likes: '8.5K',
          likedAt: 'Yesterday',
          duration: '12:15'
        },
        {
          id: 3,
          title: 'Music Production Masterclass',
          creator: 'BeatLab',
          thumbnail: null,
          likes: '22K',
          likedAt: '3 days ago',
          duration: '90:00'
        },
        {
          id: 4,
          title: 'Travel Vlog: Bali Paradise',
          creator: 'Wanderlust',
          thumbnail: null,
          likes: '31K',
          likedAt: '1 week ago',
          duration: '25:30'
        }
      ]);
    } catch (error) {
      console.error('Error loading liked content:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeLike = async (id) => {
    setLikedItems(likedItems.filter(item => item.id !== id));
  };

  const clearAllLikes = async () => {
    setLikedItems([]);
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
        maxWidth: '1200px',
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
              Liked Content
            </h1>
            <p style={{ color: '#888' }}>
              {likedItems.length} {likedItems.length === 1 ? 'item' : 'items'} you've liked
            </p>
          </div>

          {likedItems.length > 0 && (
            <button
              onClick={clearAllLikes}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: 'transparent',
                border: '1px solid #FF3366',
                borderRadius: '20px',
                color: '#FF3366',
                cursor: 'pointer',
                fontSize: fontSize.sm
              }}
            >
              Clear All Likes
            </button>
          )}
        </div>

        {/* Content Grid */}
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
        ) : likedItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: spacing.xxl,
            background: '#1a1a1a',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>❤️</div>
            <h2 style={{ marginBottom: spacing.md }}>No liked content yet</h2>
            <p style={{ color: '#888', marginBottom: spacing.lg }}>
              Videos you like will appear here
            </p>
            <button
              onClick={() => navigate('/browse')}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: '#FF3366',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                fontSize: fontSize.md,
                cursor: 'pointer'
              }}
            >
              Explore Content
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : window.innerWidth <= 1024 
                ? 'repeat(2, 1fr)' 
                : 'repeat(3, 1fr)',
            gap: spacing.lg
          }}>
            <AnimatePresence>
              {likedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  style={{
                    background: '#1a1a1a',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => navigate(`/content/${item.id}`)}
                >
                  {/* Like Badge */}
                  <div style={{
                    position: 'absolute',
                    top: spacing.sm,
                    right: spacing.sm,
                    zIndex: 2,
                    background: 'rgba(255,51,102,0.9)',
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: '15px',
                    fontSize: fontSize.xs,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>❤️</span>
                    {formatNumber(item.likes)}
                  </div>

                  {/* Thumbnail */}
                  <div style={{
                    height: '160px',
                    background: item.thumbnail 
                      ? `url(${item.thumbnail}) center/cover`
                      : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                    position: 'relative'
                  }}>
                    {/* Duration */}
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

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLike(item.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: spacing.xs,
                        left: spacing.xs,
                        background: 'rgba(0,0,0,0.7)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        color: 'white',
                        fontSize: fontSize.md,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: spacing.md }}>
                    <h3 style={{
                      fontSize: fontSize.md,
                      fontWeight: '600',
                      marginBottom: spacing.xs,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      color: '#888',
                      fontSize: fontSize.sm,
                      marginBottom: spacing.xs
                    }}>
                      {item.creator}
                    </p>
                    <p style={{
                      color: '#666',
                      fontSize: fontSize.xs
                    }}>
                      Liked {item.likedAt}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
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

export default LikedContent;
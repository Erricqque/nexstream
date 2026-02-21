import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const WatchHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadHistory();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadHistory = async () => {
    try {
      // Mock history data - replace with real data from your views table
      setHistory([
        {
          id: 1,
          title: '10 Tips for Better Videos',
          creator: 'VideoPro',
          thumbnail: null,
          views: '2.5K',
          watchedAt: '2 hours ago',
          progress: 85,
          duration: '10:25'
        },
        {
          id: 2,
          title: 'Music Production Tutorial',
          creator: 'BeatMaker',
          thumbnail: null,
          views: '1.2K',
          watchedAt: 'Yesterday',
          progress: 100,
          duration: '15:30'
        },
        {
          id: 3,
          title: 'Gaming Highlights 2024',
          creator: 'GameMaster',
          thumbnail: null,
          views: '5.1K',
          watchedAt: '3 days ago',
          progress: 30,
          duration: '20:15'
        }
      ]);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    setHistory([]);
  };

  const removeFromHistory = async (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const filterOptions = ['all', 'today', 'this week', 'this month'];

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
        maxWidth: '1000px',
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
              Watch History
            </h1>
            <p style={{ color: '#888' }}>
              {history.length} {history.length === 1 ? 'video' : 'videos'} in history
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
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
              Clear History
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          overflowX: 'auto',
          paddingBottom: spacing.xs
        }}>
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: filter === option ? '#FF3366' : 'transparent',
                border: 'none',
                borderRadius: '20px',
                color: filter === option ? 'white' : '#888',
                cursor: 'pointer',
                fontSize: fontSize.sm,
                textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* History List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xl }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #FF3366',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        ) : history.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: spacing.xxl,
            background: '#1a1a1a',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>📺</div>
            <h2 style={{ marginBottom: spacing.md }}>Your history is empty</h2>
            <p style={{ color: '#888', marginBottom: spacing.lg }}>
              Videos you watch will appear here
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
              Browse Content
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: 'flex',
                  gap: spacing.md,
                  padding: spacing.lg,
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  marginBottom: spacing.sm,
                  cursor: 'pointer',
                  flexDirection: isMobile ? 'column' : 'row'
                }}
                onClick={() => navigate(`/content/${item.id}`)}
              >
                {/* Thumbnail */}
                <div style={{
                  width: isMobile ? '100%' : '160px',
                  height: isMobile ? '120px' : '90px',
                  background: item.thumbnail 
                    ? `url(${item.thumbnail}) center/cover`
                    : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                  borderRadius: '5px',
                  position: 'relative'
                }}>
                  {/* Progress Bar */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '4px',
                    width: `${item.progress}%`,
                    background: '#FF3366',
                    borderRadius: '0 0 0 5px'
                  }} />
                  
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
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: spacing.xs
                  }}>
                    <h3 style={{
                      fontSize: fontSize.md,
                      fontWeight: '600'
                    }}>
                      {item.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        cursor: 'pointer',
                        fontSize: fontSize.md,
                        padding: spacing.xs
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <p style={{
                    color: '#888',
                    fontSize: fontSize.sm,
                    marginBottom: spacing.xs
                  }}>
                    {item.creator} • {item.views} views
                  </p>

                  <p style={{
                    color: '#666',
                    fontSize: fontSize.xs
                  }}>
                    Watched {item.watchedAt} • {item.progress}% watched
                  </p>

                  {/* Progress Text */}
                  {item.progress < 100 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/content/${item.id}`);
                      }}
                      style={{
                        marginTop: spacing.sm,
                        padding: `${spacing.xs} ${spacing.md}`,
                        background: 'transparent',
                        border: '1px solid #4FACFE',
                        borderRadius: '15px',
                        color: '#4FACFE',
                        fontSize: fontSize.xs,
                        cursor: 'pointer'
                      }}
                    >
                      Continue Watching
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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

export default WatchHistory;
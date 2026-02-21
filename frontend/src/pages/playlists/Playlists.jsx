import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Playlists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadPlaylists();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadPlaylists = async () => {
    try {
      // Mock playlists - replace with real data
      setPlaylists([
        {
          id: 1,
          name: 'Favorite Videos',
          description: 'My favorite content on NexStream',
          videoCount: 12,
          totalViews: '45.2K',
          thumbnail: null,
          isPublic: true,
          createdAt: '2 weeks ago'
        },
        {
          id: 2,
          name: 'Music to Relax',
          description: 'Chill beats and relaxing music',
          videoCount: 8,
          totalViews: '23.1K',
          thumbnail: null,
          isPublic: true,
          createdAt: '1 month ago'
        },
        {
          id: 3,
          name: 'Gaming Highlights',
          description: 'Best gaming moments',
          videoCount: 15,
          totalViews: '67.8K',
          thumbnail: null,
          isPublic: false,
          createdAt: '3 weeks ago'
        },
        {
          id: 4,
          name: 'Tutorials',
          description: 'Learning resources',
          videoCount: 6,
          totalViews: '12.4K',
          thumbnail: null,
          isPublic: true,
          createdAt: '5 days ago'
        }
      ]);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist = {
      id: playlists.length + 1,
      name: newPlaylistName,
      description: newPlaylistDesc,
      videoCount: 0,
      totalViews: '0',
      thumbnail: null,
      isPublic: true,
      createdAt: 'Just now'
    };

    setPlaylists([newPlaylist, ...playlists]);
    setShowCreateModal(false);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
  };

  const deletePlaylist = async (id) => {
    setPlaylists(playlists.filter(p => p.id !== id));
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
              Your Playlists
            </h1>
            <p style={{ color: '#888' }}>
              {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'} •{' '}
              {playlists.reduce((sum, p) => sum + p.videoCount, 0)} total videos
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: '#FF3366',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontSize: fontSize.md,
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm
            }}
          >
            <span>➕</span>
            Create Playlist
          </motion.button>
        </div>

        {/* Playlists Grid */}
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
        ) : playlists.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: spacing.xxl,
            background: '#1a1a1a',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>📋</div>
            <h2 style={{ marginBottom: spacing.md }}>No playlists yet</h2>
            <p style={{ color: '#888', marginBottom: spacing.lg }}>
              Create playlists to organize your favorite content
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
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
              Create Your First Playlist
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
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  style={{
                    background: '#1a1a1a',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  {/* Thumbnail */}
                  <div style={{
                    height: '160px',
                    background: playlist.thumbnail 
                      ? `url(${playlist.thumbnail}) center/cover`
                      : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                    position: 'relative'
                  }}>
                    {/* Privacy Badge */}
                    <div style={{
                      position: 'absolute',
                      top: spacing.sm,
                      right: spacing.sm,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      background: playlist.isPublic ? 'rgba(67,233,123,0.9)' : 'rgba(255,51,102,0.9)',
                      borderRadius: '15px',
                      fontSize: fontSize.xs,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {playlist.isPublic ? '🌍 Public' : '🔒 Private'}
                    </div>

                    {/* Video Count */}
                    <div style={{
                      position: 'absolute',
                      bottom: spacing.sm,
                      left: spacing.sm,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      background: 'rgba(0,0,0,0.7)',
                      borderRadius: '4px',
                      fontSize: fontSize.xs,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>🎬</span>
                      {playlist.videoCount} {playlist.videoCount === 1 ? 'video' : 'videos'}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: spacing.md }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: spacing.xs
                    }}>
                      <h3 style={{
                        fontSize: fontSize.md,
                        fontWeight: '600',
                        marginBottom: spacing.xs
                      }}>
                        {playlist.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePlaylist(playlist.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#888',
                          cursor: 'pointer',
                          fontSize: fontSize.md
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <p style={{
                      color: '#888',
                      fontSize: fontSize.sm,
                      marginBottom: spacing.sm,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '40px'
                    }}>
                      {playlist.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#666',
                      fontSize: fontSize.xs
                    }}>
                      <span>👁️ {playlist.totalViews} views</span>
                      <span>📅 {playlist.createdAt}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Create Playlist Modal */}
        <AnimatePresence>
          {showCreateModal && (
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
              onClick={() => setShowCreateModal(false)}
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
                  maxWidth: '400px'
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
                  Create New Playlist
                </h2>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{
                    display: 'block',
                    color: '#888',
                    marginBottom: spacing.xs,
                    fontSize: fontSize.sm
                  }}>
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="e.g., Favorite Videos"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: spacing.xl }}>
                  <label style={{
                    display: 'block',
                    color: '#888',
                    marginBottom: spacing.xs,
                    fontSize: fontSize.sm
                  }}>
                    Description (optional)
                  </label>
                  <textarea
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    placeholder="What's this playlist about?"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md,
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: spacing.md,
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    onClick={createPlaylist}
                    disabled={!newPlaylistName.trim()}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      background: !newPlaylistName.trim() ? '#555' : '#FF3366',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: fontSize.md,
                      cursor: !newPlaylistName.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
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

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Playlists;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    loadPlaylistData();
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);

  const loadPlaylistData = async () => {
    try {
      // Mock playlist data - replace with real data
      setPlaylist({
        id: parseInt(id),
        name: 'Favorite Videos',
        description: 'My favorite content on NexStream',
        creator: 'You',
        createdAt: '2 weeks ago',
        videoCount: 12,
        totalViews: '45.2K',
        isPublic: true
      });

      setVideos([
        {
          id: 1,
          title: 'Amazing Nature Documentary',
          creator: 'NatureLens',
          duration: '45:20',
          views: '15K',
          addedAt: '2 days ago',
          thumbnail: null
        },
        {
          id: 2,
          title: 'Epic Gaming Montage',
          creator: 'GameMaster Pro',
          duration: '12:15',
          views: '8.5K',
          addedAt: '1 week ago',
          thumbnail: null
        },
        {
          id: 3,
          title: 'Music Production Masterclass',
          creator: 'BeatLab',
          duration: '90:00',
          views: '22K',
          addedAt: '2 weeks ago',
          thumbnail: null
        }
      ]);
    } catch (error) {
      console.error('Error loading playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = async (videoId) => {
    setVideos(videos.filter(v => v.id !== videoId));
  };

  const savePlaylistChanges = () => {
    setPlaylist({
      ...playlist,
      name: editedName || playlist.name,
      description: editedDesc || playlist.description
    });
    setIsEditing(false);
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
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: spacing.xl
        }}>
          <button
            onClick={() => navigate('/playlists')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: fontSize.md,
              cursor: 'pointer',
              marginBottom: spacing.md
            }}
          >
            ← Back to Playlists
          </button>

          {isEditing ? (
            <div>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder={playlist.name}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: '#2a2a2a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: fontSize.xl,
                  marginBottom: spacing.md
                }}
              />
              <textarea
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                placeholder={playlist.description}
                rows="3"
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: '#2a2a2a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: fontSize.md,
                  marginBottom: spacing.md,
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: spacing.md }}>
                <button
                  onClick={savePlaylistChanges}
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    background: '#43E97B',
                    border: 'none',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: fontSize.sm,
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    background: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '20px',
                    color: '#888',
                    fontSize: fontSize.sm,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: spacing.md
            }}>
              <div>
                <h1 style={{
                  fontSize: isMobile ? fontSize.xl : fontSize.xxl,
                  marginBottom: spacing.xs
                }}>
                  {playlist.name}
                </h1>
                <p style={{
                  color: '#888',
                  fontSize: fontSize.md,
                  marginBottom: spacing.sm
                }}>
                  {playlist.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: spacing.lg,
                  color: '#666',
                  fontSize: fontSize.sm,
                  flexWrap: 'wrap'
                }}>
                  <span>By {playlist.creator}</span>
                  <span>📅 {playlist.createdAt}</span>
                  <span>🎬 {playlist.videoCount} videos</span>
                  <span>👁️ {playlist.totalViews} views</span>
                  <span>{playlist.isPublic ? '🌍 Public' : '🔒 Private'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditedName(playlist.name);
                  setEditedDesc(playlist.description);
                  setIsEditing(true);
                }}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: '#4FACFE',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: fontSize.sm,
                  cursor: 'pointer'
                }}
              >
                Edit Playlist
              </button>
            </div>
          )}
        </div>

        {/* Videos List */}
        <h2 style={{
          fontSize: fontSize.lg,
          marginBottom: spacing.lg
        }}>
          Videos in this playlist
        </h2>

        {videos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: spacing.xxl,
            background: '#1a1a1a',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>🎬</div>
            <h3 style={{ marginBottom: spacing.sm }}>No videos in this playlist</h3>
            <p style={{ color: '#888', marginBottom: spacing.lg }}>
              Add videos from the browse page
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
          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <AnimatePresence>
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    display: 'flex',
                    gap: spacing.md,
                    padding: spacing.lg,
                    borderBottom: index < videos.length - 1 ? '1px solid #333' : 'none',
                    cursor: 'pointer',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}
                  onClick={() => navigate(`/content/${video.id}`)}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: isMobile ? '100%' : '160px',
                    height: isMobile ? '120px' : '90px',
                    background: video.thumbnail 
                      ? `url(${video.thumbnail}) center/cover`
                      : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                    borderRadius: '5px',
                    position: 'relative',
                    flexShrink: 0
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
                      {video.duration}
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
                        {video.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVideo(video.id);
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
                      {video.creator}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: spacing.lg,
                      color: '#666',
                      fontSize: fontSize.xs
                    }}>
                      <span>👁️ {video.views} views</span>
                      <span>📅 Added {video.addedAt}</span>
                    </div>
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

export default PlaylistDetail;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const AddToPlaylistModal = ({ isOpen, onClose, contentId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadPlaylists();
    } else {
      setShowNewPlaylist(false);
      setNewPlaylistName('');
      setError('');
    }
  }, [isOpen, user]);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error('Error loading playlists:', error);
      setError('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const addToPlaylist = async (playlistId) => {
    try {
      setAddingToPlaylist(true);
      setError('');

      // Check if already in playlist
      const { data: existing, error: checkError } = await supabase
        .from('playlist_videos')
        .select('*')
        .eq('playlist_id', playlistId)
        .eq('content_id', contentId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        alert('This video is already in the playlist');
        setAddingToPlaylist(false);
        return;
      }

      // Get max position
      const { data: positions, error: posError } = await supabase
        .from('playlist_videos')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1);

      if (posError) throw posError;

      const nextPosition = positions?.length > 0 ? positions[0].position + 1 : 0;

      // Add to playlist
      const { error: insertError } = await supabase
        .from('playlist_videos')
        .insert([{
          playlist_id: playlistId,
          content_id: contentId,
          position: nextPosition
        }]);

      if (insertError) throw insertError;

      // Don't try to update video_count - let the database handle it via a trigger
      // or just don't update it for now

      alert('Added to playlist successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding to playlist:', error);
      setError(error.message || 'Failed to add to playlist');
    } finally {
      setAddingToPlaylist(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      setError('Please enter a playlist name');
      return;
    }

    try {
      setAddingToPlaylist(true);
      setError('');

      console.log('Creating playlist for user:', user.id);

      // Insert only the columns that definitely exist
      const { data, error } = await supabase
        .from('playlists')
        .insert([{
          user_id: user.id,
          name: newPlaylistName.trim(),
          is_public: true,
          created_at: new Date().toISOString()
          // removed description, thumbnail_url, video_count, updated_at
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Playlist created:', data);

      setPlaylists([data, ...playlists]);
      setNewPlaylistName('');
      setShowNewPlaylist(false);
      
      // Automatically add current video to new playlist
      setTimeout(() => {
        addToPlaylist(data.id);
      }, 100);
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError(error.message || 'Failed to create playlist');
    } finally {
      setAddingToPlaylist(false);
    }
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
    lg: '1.25rem'
  };

  if (!user) {
    return (
      <AnimatePresence>
        {isOpen && (
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
            onClick={onClose}
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
                maxWidth: '400px',
                textAlign: 'center'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>🔒</div>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.md }}>
                Login Required
              </h2>
              <p style={{ color: '#888', marginBottom: spacing.lg }}>
                Please login to create and manage playlists
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: '#FF3366',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: fontSize.md,
                  cursor: 'pointer'
                }}
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
          onClick={onClose}
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
              maxWidth: '400px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
              Add to Playlist
            </h2>

            {error && (
              <div style={{
                padding: spacing.sm,
                background: 'rgba(255,51,102,0.1)',
                border: '1px solid #FF3366',
                borderRadius: '8px',
                color: '#FF3366',
                fontSize: fontSize.sm,
                marginBottom: spacing.md
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: spacing.lg }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  border: '3px solid #FF3366',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }} />
              </div>
            ) : (
              <>
                {/* Playlist List */}
                <div style={{ marginBottom: spacing.lg, maxHeight: '300px', overflowY: 'auto' }}>
                  {playlists.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: spacing.lg,
                      background: '#2a2a2a',
                      borderRadius: '8px',
                      color: '#888'
                    }}>
                      No playlists yet. Create one below!
                    </div>
                  ) : (
                    playlists.map(playlist => (
                      <div
                        key={playlist.id}
                        onClick={() => addToPlaylist(playlist.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: spacing.md,
                          background: '#2a2a2a',
                          borderRadius: '8px',
                          marginBottom: spacing.xs,
                          cursor: addingToPlaylist ? 'wait' : 'pointer',
                          opacity: addingToPlaylist ? 0.7 : 1,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => !addingToPlaylist && (e.currentTarget.style.background = '#333')}
                        onMouseLeave={e => !addingToPlaylist && (e.currentTarget.style.background = '#2a2a2a')}
                      >
                        <div>
                          <p style={{ fontWeight: 'bold' }}>{playlist.name}</p>
                          <p style={{ color: '#888', fontSize: fontSize.xs }}>
                            {/* Don't try to access video_count if it doesn't exist */}
                            Videos
                          </p>
                        </div>
                        {!playlist.is_public && (
                          <span style={{ color: '#888' }}>🔒</span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Create New Playlist */}
                {showNewPlaylist ? (
                  <div>
                    <input
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Enter playlist name"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        marginBottom: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: fontSize.md
                      }}
                    />
                    <div style={{ display: 'flex', gap: spacing.sm }}>
                      <button
                        onClick={createPlaylist}
                        disabled={!newPlaylistName.trim() || addingToPlaylist}
                        style={{
                          flex: 1,
                          padding: spacing.sm,
                          background: !newPlaylistName.trim() || addingToPlaylist ? '#555' : '#FF3366',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: fontSize.sm,
                          cursor: !newPlaylistName.trim() || addingToPlaylist ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewPlaylist(false)}
                        disabled={addingToPlaylist}
                        style={{
                          flex: 1,
                          padding: spacing.sm,
                          background: 'transparent',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: fontSize.sm,
                          cursor: addingToPlaylist ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewPlaylist(true)}
                    disabled={addingToPlaylist}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: 'transparent',
                      border: '2px dashed #333',
                      borderRadius: '8px',
                      color: addingToPlaylist ? '#666' : '#888',
                      fontSize: fontSize.md,
                      cursor: addingToPlaylist ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    + Create New Playlist
                  </button>
                )}
              </>
            )}

            <button
              onClick={onClose}
              disabled={addingToPlaylist}
              style={{
                width: '100%',
                padding: spacing.md,
                marginTop: spacing.lg,
                background: 'transparent',
                border: '1px solid #333',
                borderRadius: '8px',
                color: addingToPlaylist ? '#666' : 'white',
                fontSize: fontSize.md,
                cursor: addingToPlaylist ? 'not-allowed' : 'pointer'
              }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AnimatePresence>
  );
};

export default AddToPlaylistModal;
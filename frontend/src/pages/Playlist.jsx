import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadPlaylist();
  }, [id, user]);

  const loadPlaylist = async () => {
    try {
      setLoading(true);

      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .single();

      if (playlistError) throw playlistError;
      setPlaylist(playlistData);
      setPlaylistName(playlistData.name);
      setPlaylistDescription(playlistData.description || '');

      if (user && playlistData.user_id === user.id) {
        setIsOwner(true);
      }

      const { data: playlistVideos, error: videosError } = await supabase
        .from('playlist_videos')
        .select(`
          *,
          content:content_id (*)
        `)
        .eq('playlist_id', id)
        .order('position');

      if (videosError) throw videosError;

      const videosWithUrls = await Promise.all(playlistVideos?.map(async (pv) => {
        const { data: fileData } = supabase.storage
          .from('content')
          .getPublicUrl(pv.content.file_url);

        let thumbnailUrl = null;
        if (pv.content.thumbnail_url) {
          const { data: thumbData } = supabase.storage
            .from('content')
            .getPublicUrl(pv.content.thumbnail_url);
          thumbnailUrl = thumbData.publicUrl;
        }

        return {
          ...pv.content,
          publicUrl: fileData.publicUrl,
          thumbnailUrl,
          position: pv.position
        };
      }) || []);

      setVideos(videosWithUrls);
    } catch (error) {
      console.error('Error loading playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index) => {
    if (!isOwner) return;
    setDraggedItem(index);
  };

  const handleDragEnter = (index) => {
    if (!isOwner) return;
    setDragOverItem(index);
  };

  const handleDragEnd = async () => {
    if (!isOwner || draggedItem === null || dragOverItem === null) return;
    if (draggedItem === dragOverItem) return;

    const newVideos = [...videos];
    const draggedVideo = newVideos[draggedItem];
    newVideos.splice(draggedItem, 1);
    newVideos.splice(dragOverItem, 0, draggedVideo);

    const updatedVideos = newVideos.map((video, idx) => ({
      ...video,
      position: idx
    }));

    setVideos(updatedVideos);
    setDraggedItem(null);
    setDragOverItem(null);

    try {
      const updates = updatedVideos.map((video, idx) => ({
        playlist_id: id,
        content_id: video.id,
        position: idx
      }));

      await supabase
        .from('playlist_videos')
        .delete()
        .eq('playlist_id', id);

      await supabase
        .from('playlist_videos')
        .insert(updates);
    } catch (error) {
      console.error('Error saving playlist order:', error);
    }
  };

  const removeFromPlaylist = async (videoId) => {
    if (!isOwner) return;

    if (window.confirm('Remove this video from playlist?')) {
      try {
        await supabase
          .from('playlist_videos')
          .delete()
          .eq('playlist_id', id)
          .eq('content_id', videoId);

        setVideos(videos.filter(v => v.id !== videoId));
      } catch (error) {
        console.error('Error removing from playlist:', error);
      }
    }
  };

  const updatePlaylist = async () => {
    if (!isOwner) return;

    try {
      await supabase
        .from('playlists')
        .update({
          name: playlistName,
          description: playlistDescription,
          updated_at: new Date()
        })
        .eq('id', id);

      setPlaylist({
        ...playlist,
        name: playlistName,
        description: playlistDescription
      });
      setEditing(false);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const deletePlaylist = async () => {
    if (!isOwner) return;

    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await supabase
          .from('playlists')
          .delete()
          .eq('id', id);

        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
    }
  };

  const sharePlaylist = () => {
    const url = window.location.href;
    if (navigator.share && isMobile) {
      navigator.share({
        title: playlist.name,
        text: playlist.description || 'Check out this playlist on NexStream!',
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    setShowShareModal(false);
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
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
          border: '4px solid #ff3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Playlist not found</h1>
          <Link to="/browse">Browse Content</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: isMobile ? '15px' : '40px 20px'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .playlist-header { flex-direction: column !important; }
          .playlist-actions { width: 100% !important; margin-top: 15px !important; }
          .playlist-actions button { flex: 1; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Playlist Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="playlist-header"
          style={{
            background: 'linear-gradient(135deg, rgba(255,51,102,0.1), rgba(79,172,254,0.1))',
            borderRadius: '20px',
            padding: isMobile ? '20px' : '40px',
            marginBottom: isMobile ? '20px' : '40px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          {editing ? (
            <div style={{ width: '100%' }}>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Playlist name"
                style={{
                  width: '100%',
                  padding: isMobile ? '12px' : '15px',
                  marginBottom: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: isMobile ? '1.2rem' : '1.5rem'
                }}
              />
              <textarea
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Playlist description"
                rows="3"
                style={{
                  width: '100%',
                  padding: isMobile ? '12px' : '15px',
                  marginBottom: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={updatePlaylist}
                  style={{
                    flex: 1,
                    padding: isMobile ? '12px' : '10px 20px',
                    background: '#ff3366',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    flex: 1,
                    padding: isMobile ? '12px' : '10px 20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 style={{ 
                  fontSize: isMobile ? '1.8rem' : '2.5rem', 
                  marginBottom: '10px' 
                }}>
                  {playlist.name}
                </h1>
                <p style={{ color: '#888', marginBottom: '15px' }}>
                  {playlist.description || 'No description'}
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: isMobile ? '10px' : '20px', 
                  color: '#aaa', 
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  flexWrap: 'wrap'
                }}>
                  <span>{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>
                  <span>Created {new Date(playlist.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="playlist-actions" style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={sharePlaylist}
                  style={{
                    padding: isMobile ? '12px 20px' : '8px 16px',
                    background: '#4facfe',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  📤 Share
                </button>
                {isOwner && (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        padding: isMobile ? '12px 20px' : '8px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={deletePlaylist}
                      style={{
                        padding: isMobile ? '12px 20px' : '8px 16px',
                        background: '#ff3366',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </motion.div>

        {/* Videos List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ 
            marginBottom: '20px',
            fontSize: isMobile ? '1.3rem' : '1.5rem' 
          }}>
            Videos in this playlist
          </h2>

          {videos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: isMobile ? '40px 20px' : '60px',
              background: 'rgba(20,20,30,0.5)',
              borderRadius: '20px'
            }}>
              <div style={{ fontSize: isMobile ? '3rem' : '4rem', marginBottom: '20px' }}>📝</div>
              <h3>No videos in this playlist</h3>
              <p style={{ color: '#888', marginTop: '10px' }}>
                {isOwner ? 'Browse content to add videos' : 'Check back later for updates'}
              </p>
              {isOwner && (
                <Link to="/browse">
                  <button style={{
                    marginTop: '20px',
                    padding: isMobile ? '12px 24px' : '10px 20px',
                    background: '#ff3366',
                    border: 'none',
                    borderRadius: '20px',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    Browse Content
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: isMobile ? '10px' : '15px' 
            }}>
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  draggable={isOwner}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '10px' : '15px',
                    padding: isMobile ? '15px' : '15px',
                    background: draggedItem === index 
                      ? 'rgba(255,51,102,0.2)'
                      : dragOverItem === index
                        ? 'rgba(79,172,254,0.2)'
                        : 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    cursor: isOwner ? 'grab' : 'pointer',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => !isOwner && navigate(`/content/${video.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: isMobile ? '30px' : '40px',
                      height: isMobile ? '30px' : '40px',
                      background: '#ff3366',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      {index + 1}
                    </div>

                    <div style={{
                      width: isMobile ? '80px' : '120px',
                      height: isMobile ? '45px' : '67px',
                      background: video.thumbnailUrl 
                        ? `url(${video.thumbnailUrl}) center/cover`
                        : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                      borderRadius: '5px',
                      flexShrink: 0
                    }} />
                  </div>

                  <div style={{ 
                    flex: 1,
                    marginLeft: isMobile ? '45px' : 0
                  }}>
                    <h3 style={{ 
                      fontSize: isMobile ? '1rem' : '1.1rem',
                      marginBottom: '5px'
                    }}>
                      {video.title}
                    </h3>
                    <p style={{ 
                      color: '#888', 
                      fontSize: isMobile ? '0.8rem' : '0.9rem',
                      marginBottom: '5px',
                      display: '-webkit-box',
                      WebkitLineClamp: isMobile ? 2 : 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {video.description}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      gap: isMobile ? '10px' : '15px', 
                      color: '#666', 
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      flexWrap: 'wrap'
                    }}>
                      <span>👁️ {formatViews(video.views_count || 0)}</span>
                      <span>❤️ {video.likes_count || 0}</span>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromPlaylist(video.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff3366',
                        fontSize: isMobile ? '1.5rem' : '1.2rem',
                        cursor: 'pointer',
                        padding: isMobile ? '10px' : '0 10px',
                        alignSelf: 'center'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Playlist;
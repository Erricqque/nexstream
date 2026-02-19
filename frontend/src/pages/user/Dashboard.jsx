import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { statsService } from '../../services/statsService';
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalEarnings: 0,
    totalLikes: 0,
    totalDownloads: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      await loadUserProfile(user.id);
      await loadUserContent(user.id);
      await loadUserStats(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data || { username: user?.email?.split('@')[0] });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadUserContent = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get public URLs for each content item
      const contentWithUrls = await Promise.all((data || []).map(async (item) => {
        const { data: fileData } = supabase.storage
          .from('content')
          .getPublicUrl(item.file_url);

        let thumbnailUrl = null;
        if (item.thumbnail_url) {
          const { data: thumbData } = supabase.storage
            .from('content')
            .getPublicUrl(item.thumbnail_url);
          thumbnailUrl = thumbData.publicUrl;
        }

        return {
          ...item,
          publicUrl: fileData.publicUrl,
          thumbnailUrl
        };
      }));

      setContent(contentWithUrls);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadUserStats = async (userId) => {
    try {
      const userStats = await statsService.getUserStats(userId);
      
      // Calculate totals from content
      const totalViews = content.reduce((sum, item) => sum + (item.views_count || 0), 0);
      const totalDownloads = content.reduce((sum, item) => sum + (item.downloads_count || 0), 0);
      const totalLikes = content.reduce((sum, item) => sum + (item.likes_count || 0), 0);

      setStats({
        totalViews: userStats.views || totalViews,
        totalEarnings: userStats.earnings || 0,
        totalLikes,
        totalDownloads
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDeleteContent = async () => {
    if (!contentToDelete) return;

    try {
      // Delete from storage
      if (contentToDelete.file_url) {
        await supabase.storage
          .from('content')
          .remove([contentToDelete.file_url]);
      }

      if (contentToDelete.thumbnail_url) {
        await supabase.storage
          .from('content')
          .remove([contentToDelete.thumbnail_url]);
      }

      // Delete from database
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentToDelete.id);

      if (error) throw error;

      // Update local state
      setContent(content.filter(item => item.id !== contentToDelete.id));
      setShowDeleteConfirm(false);
      setContentToDelete(null);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'video': return '🎬';
      case 'music': return '🎵';
      case 'game': return '🎮';
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#43e97b';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ff3366';
      default: return '#888';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #ff3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: 'white',
      padding: '40px 20px'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with Profile */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,51,102,0.1), rgba(79,172,254,0.1))',
            borderRadius: '30px',
            padding: '40px',
            marginBottom: '40px',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: profile?.avatar_url 
                ? `url(${profile.avatar_url}) center/cover`
                : 'linear-gradient(135deg, #ff3366, #4facfe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: '0 10px 30px rgba(255,51,102,0.3)'
            }}>
              {!profile?.avatar_url && '👤'}
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>
                {profile?.username || user?.email?.split('@')[0] || 'Creator'}
              </h1>
              <p style={{ color: '#888', marginBottom: '15px' }}>{user?.email}</p>
              
              {/* Quick Stats */}
              <div style={{ display: 'flex', gap: '30px' }}>
                <div>
                  <span style={{ color: '#ff3366', fontWeight: 'bold' }}>{content.length}</span>
                  <span style={{ color: '#888', marginLeft: '5px' }}>uploads</span>
                </div>
                <div>
                  <span style={{ color: '#4facfe', fontWeight: 'bold' }}>{stats.totalViews.toLocaleString()}</span>
                  <span style={{ color: '#888', marginLeft: '5px' }}>views</span>
                </div>
                <div>
                  <span style={{ color: '#43e97b', fontWeight: 'bold' }}>${stats.totalEarnings.toFixed(2)}</span>
                  <span style={{ color: '#888', marginLeft: '5px' }}>earned</span>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>+</span> Upload New
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '10px'
          }}
        >
          {['content', 'analytics', 'settings'].map(tab => (
            <motion.button
              key={tab}
              whileHover={{ y: -2 }}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: 'none',
                color: activeTab === tab ? '#ff3366' : '#888',
                fontSize: '1.1rem',
                cursor: 'pointer',
                position: 'relative',
                textTransform: 'capitalize'
              }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    bottom: '-11px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #ff3366, #4facfe)'
                  }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              {[
                { label: 'Total Uploads', value: content.length, icon: '📤', color: '#ff3366' },
                { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: '👁️', color: '#4facfe' },
                { label: 'Total Likes', value: stats.totalLikes.toLocaleString(), icon: '❤️', color: '#43e97b' },
                { label: 'Total Downloads', value: stats.totalDownloads.toLocaleString(), icon: '⬇️', color: '#f59e0b' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  style={{
                    background: 'rgba(20,20,30,0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '25px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ color: '#888', marginTop: '5px' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Content Grid */}
            <h2 style={{ marginBottom: '20px' }}>Your Uploads</h2>
            
            {content.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '60px',
                  background: 'rgba(20,20,30,0.5)',
                  borderRadius: '20px'
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📤</div>
                <h3>No uploads yet</h3>
                <p style={{ color: '#888', marginTop: '10px', marginBottom: '20px' }}>
                  Start sharing your creativity with the world
                </p>
                <Link to="/upload">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '15px 40px',
                      background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: '1.1rem',
                      cursor: 'pointer'
                    }}
                  >
                    Upload Your First Content
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {content.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    style={{
                      background: 'rgba(20,20,30,0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.05)',
                      position: 'relative'
                    }}
                  >
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '4px 12px',
                      background: getStatusColor(item.status),
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      zIndex: 2
                    }}>
                      {item.status}
                    </div>

                    {/* Thumbnail */}
                    <div
                      onClick={() => navigate(`/content/${item.id}`)}
                      style={{
                        height: '160px',
                        background: item.thumbnailUrl 
                          ? `url(${item.thumbnailUrl}) center/cover`
                          : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      {!item.thumbnailUrl && getIconForType(item.content_type)}
                      
                      {/* Type Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '4px 8px',
                        borderRadius: '15px',
                        fontSize: '0.7rem'
                      }}>
                        {item.content_type}
                      </div>
                    </div>

                    {/* Content Info */}
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h3 style={{ 
                          fontSize: '1.2rem',
                          marginBottom: '5px',
                          flex: 1
                        }}>
                          {item.title}
                        </h3>
                        
                        {/* Actions Menu */}
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/edit-content/${item.id}`)}
                            style={{
                              background: 'rgba(79,172,254,0.2)',
                              border: 'none',
                              color: '#4facfe',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >
                            ✎
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setContentToDelete(item);
                              setShowDeleteConfirm(true);
                            }}
                            style={{
                              background: 'rgba(255,51,102,0.2)',
                              border: 'none',
                              color: '#ff3366',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >
                            ×
                          </motion.button>
                        </div>
                      </div>

                      <p style={{ 
                        color: '#888', 
                        fontSize: '0.9rem',
                        marginBottom: '15px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '40px'
                      }}>
                        {item.description}
                      </p>

                      {/* Stats Row */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#aaa',
                        fontSize: '0.9rem',
                        marginBottom: '15px'
                      }}>
                        <span>👁️ {item.views_count || 0}</span>
                        <span>❤️ {item.likes_count || 0}</span>
                        <span>⬇️ {item.downloads_count || 0}</span>
                        <span>{item.is_free ? '🆓' : `$${item.price}`}</span>
                      </div>

                      {/* Date */}
                      <div style={{ color: '#666', fontSize: '0.8rem' }}>
                        Uploaded: {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(20,20,30,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <h2 style={{ marginBottom: '30px' }}>Content Analytics</h2>
            
            <div style={{ display: 'grid', gap: '30px' }}>
              {/* Performance by content type */}
              {['video', 'music', 'game', 'image'].map(type => {
                const typeContent = content.filter(c => c.content_type === type);
                if (typeContent.length === 0) return null;

                const typeViews = typeContent.reduce((sum, c) => sum + (c.views_count || 0), 0);
                const typeEarnings = typeContent.reduce((sum, c) => sum + (c.price || 0), 0);

                return (
                  <div key={type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ textTransform: 'capitalize' }}>{type}</span>
                      <span>{typeContent.length} items • {typeViews} views</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(typeContent.length / content.length) * 100}%` }}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #ff3366, #4facfe)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(20,20,30,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <h2 style={{ marginBottom: '30px' }}>Profile Settings</h2>
            
            <div style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Username</label>
                <input
                  type="text"
                  value={profile?.username || ''}
                  placeholder="Enter username"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#666'
                  }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '15px',
                  background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
              zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              style={{
                background: '#1a1a2a',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '400px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
              <h3 style={{ marginBottom: '10px' }}>Delete Content?</h3>
              <p style={{ color: '#888', marginBottom: '30px' }}>
                Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteContent}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: '#ff3366',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setContentToDelete(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

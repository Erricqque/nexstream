import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Trending = ({ onItemClick }) => {
  const navigate = useNavigate();
  const [trendingContent, setTrendingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);

  const categories = [
    { id: 'all', label: 'All', icon: '🔥' },
    { id: 'video', label: 'Videos', icon: '🎬' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'game', label: 'Games', icon: '🎮' },
    { id: 'image', label: 'Images', icon: '🖼️' }
  ];

  useEffect(() => {
    loadTrendingContent();
  }, [activeCategory]);

  const loadTrendingContent = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('content')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'approved')
        .order('views_count', { ascending: false })
        .limit(8);

      if (activeCategory !== 'all') {
        query = query.eq('content_type', activeCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Get public URLs for thumbnails
      const contentWithUrls = await Promise.all((data || []).map(async (item) => {
        let thumbnailUrl = null;
        if (item.thumbnail_url) {
          const { data: thumbData } = supabase.storage
            .from('content')
            .getPublicUrl(item.thumbnail_url);
          thumbnailUrl = thumbData.publicUrl;
        }

        let avatarUrl = null;
        if (item.profiles?.avatar_url) {
          const { data: avatarData } = supabase.storage
            .from('avatars')
            .getPublicUrl(item.profiles.avatar_url);
          avatarUrl = avatarData.publicUrl;
        }

        return {
          ...item,
          thumbnailUrl,
          avatarUrl
        };
      }));

      setTrendingContent(contentWithUrls);
    } catch (error) {
      console.error('Error loading trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleItemClick = (id) => {
    if (onItemClick) {
      onItemClick(id);
    } else {
      navigate(`/content/${id}`);
    }
  };

  return (
    <section style={{
      padding: '80px 20px',
      background: '#0f0f0f',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: '700',
              marginBottom: '10px',
              color: 'white'
            }}>
              Trending{' '}
              <span style={{
                background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Content
              </span>
            </h2>
            <p style={{ color: '#888', fontSize: '1.1rem' }}>
              Most popular content from our community right now
            </p>
          </div>

          {/* Category Filters */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            background: '#1a1a1a',
            padding: '5px',
            borderRadius: '40px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 20px',
                  background: activeCategory === cat.id ? '#FF3366' : 'transparent',
                  border: 'none',
                  borderRadius: '30px',
                  color: activeCategory === cat.id ? 'white' : '#888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px',
            background: '#1a1a1a',
            borderRadius: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #FF3366',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#888' }}>Loading trending content...</p>
          </div>
        ) : trendingContent.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px',
            background: '#1a1a1a',
            borderRadius: '20px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>No content yet</h3>
            <p style={{ color: '#888' }}>Be the first to upload something amazing!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {trendingContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={() => handleItemClick(item.id)}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `2px solid ${hoveredItem === item.id ? '#FF3366' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {/* Trending Badge */}
                {index < 3 && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 2,
                    background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>🏆</span>
                    #{index + 1} Trending
                  </div>
                )}

                {/* Thumbnail */}
                <div style={{
                  position: 'relative',
                  height: '180px',
                  background: item.thumbnailUrl 
                    ? `url(${item.thumbnailUrl}) center/cover`
                    : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                  transition: 'transform 0.3s'
                }}>
                  {/* Content Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '6px 12px',
                    background: 'rgba(0,0,0,0.8)',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize',
                    color: 'white',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {item.content_type === 'video' && '🎬'}
                    {item.content_type === 'music' && '🎵'}
                    {item.content_type === 'game' && '🎮'}
                    {item.content_type === 'image' && '🖼️'}
                    {' ' + item.content_type}
                  </div>

                  {/* Duration Badge (for videos) */}
                  {item.content_type === 'video' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      padding: '4px 8px',
                      background: 'rgba(0,0,0,0.8)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: 'white'
                    }}>
                      10:25
                    </div>
                  )}

                  {/* Hover Overlay */}
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,51,102,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                    >
                      <span style={{ fontSize: '2rem' }}>▶️</span>
                      <span style={{ fontWeight: 'bold' }}>Play Now</span>
                    </motion.div>
                  )}
                </div>

                {/* Content Info */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    color: '#888',
                    fontSize: '0.9rem',
                    marginBottom: '15px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5',
                    height: '2.7em'
                  }}>
                    {item.description}
                  </p>

                  {/* Creator Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: item.avatarUrl 
                          ? `url(${item.avatarUrl}) center/cover`
                          : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                        border: '2px solid rgba(255,255,255,0.1)'
                      }} />
                      <div>
                        <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
                          {item.profiles?.username || 'Creator'}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.8rem' }}>
                          {formatTimeAgo(item.created_at)}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#888',
                      fontSize: '0.9rem'
                    }}>
                      <span>👁️</span>
                      <span>{formatViews(item.views_count || 0)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{ 
            textAlign: 'center', 
            marginTop: '50px'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            style={{
              padding: '15px 40px',
              background: 'transparent',
              border: '2px solid rgba(255,51,102,0.3)',
              borderRadius: '30px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={e => e.target.style.background = '#FF3366'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            <span>Browse All Content</span>
            <span>→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Loading Animation Style */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Trending;
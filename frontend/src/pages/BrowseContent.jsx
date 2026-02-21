import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const BrowseContent = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Fetch all approved content
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get public URLs for each content item
      const contentWithUrls = await Promise.all((data || []).map(async (item) => {
        // Get file URL
        let fileUrl = null;
        if (item.file_url) {
          const { data: fileData } = supabase.storage
            .from('content')
            .getPublicUrl(item.file_url);
          fileUrl = fileData.publicUrl;
        }

        // Get thumbnail URL
        let thumbnailUrl = null;
        if (item.thumbnail_url) {
          const { data: thumbData } = supabase.storage
            .from('content')
            .getPublicUrl(item.thumbnail_url);
          thumbnailUrl = thumbData.publicUrl;
        }

        // Get avatar URL
        let avatarUrl = null;
        if (item.profiles?.avatar_url) {
          const { data: avatarData } = supabase.storage
            .from('avatars')
            .getPublicUrl(item.profiles.avatar_url);
          avatarUrl = avatarData.publicUrl;
        }

        return {
          ...item,
          fileUrl,
          thumbnailUrl,
          avatarUrl,
          username: item.profiles?.username || 'Anonymous'
        };
      }));

      setContent(contentWithUrls);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.content_type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'game': return '🎮';
      case 'image': return '🖼️';
      case 'document': return '📄';
      default: return '📁';
    }
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
      padding: `${spacing.xl} ${spacing.xl}`,
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: fontSize.xxl,
            marginBottom: spacing.xs,
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Browse Content
          </h1>
          <p style={{ color: '#888' }}>
            Discover amazing content from creators around the world
          </p>
        </motion.div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: spacing.md,
          marginBottom: spacing.xl,
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Search videos, music, games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 2,
              minWidth: '250px',
              padding: spacing.md,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '30px',
              color: 'white',
              fontSize: fontSize.md,
              outline: 'none'
            }}
          />

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              flex: 1,
              minWidth: '150px',
              padding: spacing.md,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '30px',
              color: 'white',
              fontSize: fontSize.md,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="audio">Music</option>
            <option value="game">Games</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </select>
        </div>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: spacing.xxl,
            background: '#1a1a1a',
            borderRadius: '15px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: spacing.md }}>📭</div>
            <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.sm }}>No content found</h2>
            <p style={{ color: '#888' }}>Be the first to upload something amazing!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing.lg
          }}>
            {filteredContent.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/content/${item.id}`)}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #333',
                  transition: 'all 0.2s'
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  position: 'relative',
                  height: '160px',
                  background: item.thumbnailUrl 
                    ? `url(${item.thumbnailUrl}) center/cover`
                    : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!item.thumbnailUrl && (
                    <div style={{ fontSize: '3rem' }}>
                      {getTypeIcon(item.content_type)}
                    </div>
                  )}
                  
                  {/* Content Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: fontSize.xs,
                    textTransform: 'capitalize'
                  }}>
                    {item.content_type}
                  </div>
                </div>

                {/* Content Info */}
                <div style={{ padding: spacing.lg }}>
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
                    marginBottom: spacing.sm,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '40px'
                  }}>
                    {item.description || 'No description'}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.sm
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: item.avatarUrl 
                        ? `url(${item.avatarUrl}) center/cover`
                        : 'linear-gradient(135deg, #FF3366, #4FACFE)'
                    }} />
                    <span style={{ color: '#aaa', fontSize: fontSize.sm }}>
                      {item.username}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #333',
                    paddingTop: spacing.sm,
                    color: '#888',
                    fontSize: fontSize.xs
                  }}>
                    <span>👁️ {formatViews(item.views_count)}</span>
                    <span>❤️ {item.likes_count || 0}</span>
                    <span>📅 {formatDate(item.created_at)}</span>
                    {!item.is_free && (
                      <span style={{ color: '#43E97B' }}>${item.price}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseContent;
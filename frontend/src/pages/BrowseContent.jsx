import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const BrowseContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Query content that is approved (status = 'approved')
      // You can change this based on your needs
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('status', 'approved') // Only show approved content
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // For each content item, get the public URL
      const contentWithUrls = await Promise.all((data || []).map(async (item) => {
        // Get file URL
        const { data: fileData } = supabase.storage
          .from('content')
          .getPublicUrl(item.file_url);

        // Get thumbnail URL if exists
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
    } finally {
      setLoading(false);
    }
  };

  // Filter content based on type and search
  const filteredContent = content.filter(item => {
    const matchesType = selectedType === 'all' || item.content_type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #ff3366, #4facfe)',
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
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(20,20,30,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '40px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 2,
                minWidth: '250px',
                padding: '15px 20px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem'
              }}
            />

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '15px 20px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="music">Music</option>
              <option value="game">Games</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </motion.div>

        {/* Content Grid */}
        {filteredContent.length === 0 ? (
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
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
            <h2>No content found</h2>
            <p style={{ color: '#888', marginTop: '10px' }}>
              Be the first to upload something amazing!
            </p>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '20px',
                  padding: '15px 40px',
                  background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                Upload Content
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '30px'
            }}
          >
            {filteredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => navigate(`/content/${item.id}`)}
                style={{
                  background: 'rgba(20,20,30,0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                {/* Thumbnail/Preview */}
                <div style={{
                  height: '180px',
                  background: item.thumbnailUrl 
                    ? `url(${item.thumbnailUrl}) center/cover`
                    : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!item.thumbnailUrl && (
                    <div style={{ fontSize: '4rem' }}>
                      {getIconForType(item.content_type)}
                    </div>
                  )}
                  
                  {/* Content type badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#fff'
                  }}>
                    {item.content_type}
                  </div>

                  {/* Price badge if not free */}
                  {!item.is_free && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'linear-gradient(135deg, #ff3366, #ff6b3b)',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      ${item.price}
                    </div>
                  )}
                </div>

                {/* Content info */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ 
                    marginBottom: '5px',
                    fontSize: '1.2rem',
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
                    height: '40px'
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    color: '#aaa'
                  }}>
                    <span>By {item.profiles?.username || 'Anonymous'}</span>
                    <span>👁️ {item.views_count || 0}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    {item.tags?.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        padding: '3px 8px',
                        background: 'rgba(255,51,102,0.1)',
                        borderRadius: '15px',
                        fontSize: '0.7rem',
                        color: '#ff3366'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrowseContent;
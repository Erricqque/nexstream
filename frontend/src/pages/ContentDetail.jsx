import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedContent, setRelatedContent] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadContent();
    checkUser();
  }, [id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadContent = async () => {
    try {
      setLoading(true);

      // Get content details
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('content')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);

      // Get public URLs
      const { data: fileData } = supabase.storage
        .from('content')
        .getPublicUrl(data.file_url);

      let thumbnailUrl = null;
      if (data.thumbnail_url) {
        const { data: thumbData } = supabase.storage
          .from('content')
          .getPublicUrl(data.thumbnail_url);
        thumbnailUrl = thumbData.publicUrl;
      }

      setContent({
        ...data,
        publicUrl: fileData.publicUrl,
        thumbnailUrl
      });

      // Load related content (same category or tags)
      const { data: related } = await supabase
        .from('content')
        .select('*')
        .neq('id', id)
        .eq('status', 'approved')
        .or(`category.eq.${data.category},content_type.eq.${data.content_type}`)
        .limit(4);

      setRelatedContent(related || []);

    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Increment download count
      await supabase
        .from('content')
        .update({ downloads_count: (content.downloads_count || 0) + 1 })
        .eq('id', id);

      // For non-free content, check if user has purchased
      if (!content.is_free) {
        // Check if user has purchased
        const { data: purchase } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_id', id)
          .single();

        if (!purchase) {
          navigate(`/checkout/${id}`);
          return;
        }
      }

      // Download the file
      window.open(content.publicUrl, '_blank');
    } catch (error) {
      console.error('Error during download:', error);
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

  if (!content) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
          <h2>Content not found</h2>
          <Link to="/browse">
            <button style={{
              marginTop: '20px',
              padding: '10px 30px',
              background: 'linear-gradient(135deg, #ff3366, #4facfe)',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              cursor: 'pointer'
            }}>
              Browse Content
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: 'white'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Hero section with thumbnail */}
      <div style={{
        height: '400px',
        background: content.thumbnailUrl 
          ? `url(${content.thumbnailUrl}) center/cover`
          : 'linear-gradient(135deg, #ff3366, #4facfe)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(0deg, #0a0a0f 0%, transparent 50%, transparent 100%)'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          right: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: 'rgba(255,51,102,0.2)',
              borderRadius: '30px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,51,102,0.3)'
            }}>
              {getIconForType(content.content_type)} {content.content_type}
            </div>
            <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{content.title}</h1>
            <div style={{ display: 'flex', gap: '20px', color: '#aaa' }}>
              <span>By {content.profiles?.username || 'Anonymous'}</span>
              <span>👁️ {content.views_count || 0} views</span>
              <span>⬇️ {content.downloads_count || 0} downloads</span>
              <span>📅 {new Date(content.created_at).toLocaleDateString()}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          {/* Left column - Description and preview */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{
              background: 'rgba(20,20,30,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '30px'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Description</h2>
              <p style={{ color: '#aaa', lineHeight: 1.8 }}>
                {content.description}
              </p>

              {content.tags && content.tags.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ marginBottom: '10px', fontSize: '1rem', color: '#888' }}>Tags</h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {content.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '5px 12px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview based on content type */}
            {content.content_type === 'video' && (
              <div style={{
                background: 'rgba(20,20,30,0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h2 style={{ marginBottom: '20px' }}>Preview</h2>
                <video 
                  src={content.publicUrl} 
                  controls
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>
            )}

            {content.content_type === 'music' && (
              <div style={{
                background: 'rgba(20,20,30,0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h2 style={{ marginBottom: '20px' }}>Preview</h2>
                <audio 
                  src={content.publicUrl} 
                  controls
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {content.content_type === 'image' && (
              <div style={{
                background: 'rgba(20,20,30,0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <h2 style={{ marginBottom: '20px' }}>Preview</h2>
                <img 
                  src={content.publicUrl} 
                  alt={content.title}
                  style={{ maxWidth: '100%', borderRadius: '10px' }}
                />
              </div>
            )}
          </motion.div>

          {/* Right column - Actions and details */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{
              background: 'rgba(20,20,30,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'sticky',
              top: '100px'
            }}>
              {/* Price */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                {content.is_free ? (
                  <>
                    <div style={{ fontSize: '2rem', color: '#43e97b', marginBottom: '10px' }}>FREE</div>
                    <p style={{ color: '#888' }}>No payment required</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '10px' }}>
                      ${content.price}
                    </div>
                    <p style={{ color: '#888' }}>One-time purchase</p>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                style={{
                  width: '100%',
                  padding: '20px',
                  fontSize: '1.2rem',
                  background: content.is_free
                    ? 'linear-gradient(135deg, #43e97b, #38f9d7)'
                    : 'linear-gradient(135deg, #ff3366, #ff6b3b)',
                  border: 'none',
                  borderRadius: '15px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
              >
                {content.is_free ? 'Download Now' : 'Purchase & Download'}
              </motion.button>

              {!user && (
                <p style={{ color: '#ff3366', textAlign: 'center', fontSize: '0.9rem' }}>
                  Please <Link to="/login" style={{ color: '#4facfe' }}>login</Link> to download
                </p>
              )}

              {/* File details */}
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>File Details</h3>
                <table style={{ width: '100%', color: '#aaa' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 0' }}>Type:</td>
                      <td style={{ textAlign: 'right' }}>{content.file_type || content.content_type}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0' }}>Size:</td>
                      <td style={{ textAlign: 'right' }}>
                        {content.file_size ? `${(content.file_size / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0' }}>Category:</td>
                      <td style={{ textAlign: 'right', textTransform: 'capitalize' }}>{content.category}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 0' }}>Uploaded:</td>
                      <td style={{ textAlign: 'right' }}>{new Date(content.created_at).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Creator info */}
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px'
              }}>
                <h3 style={{ marginBottom: '10px' }}>Creator</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: content.profiles?.avatar_url 
                      ? `url(${content.profiles.avatar_url}) center/cover`
                      : 'linear-gradient(135deg, #ff3366, #4facfe)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {!content.profiles?.avatar_url && '👤'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{content.profiles?.username || 'Anonymous'}</div>
                    <Link to={`/profile/${content.profiles?.id}`} style={{ color: '#4facfe', fontSize: '0.9rem' }}>
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related content */}
        {relatedContent.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: '60px' }}
          >
            <h2 style={{ marginBottom: '30px' }}>You might also like</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {relatedContent.map(item => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/content/${item.id}`)}
                  style={{
                    background: 'rgba(20,20,30,0.7)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{
                    height: '140px',
                    background: 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                  }}>
                    {getIconForType(item.content_type)}
                  </div>
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '5px' }}>{item.title}</h4>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>
                      👁️ {item.views_count || 0} views
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContentDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Comments from '../components/comments/Comments';
import LikeButton from '../components/likes/LikeButton';
import SubscribeButton from '../components/subscribe/SubscribeButton';
import AddToPlaylistModal from '../components/playlists/AddToPlaylistModal';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    loadContent();
  }, [id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(false);

      // Get content details
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();

      if (contentError) throw contentError;
      if (!contentData) throw new Error('Content not found');

      // Increment view count
      await supabase
        .from('content')
        .update({ views_count: (contentData.views_count || 0) + 1 })
        .eq('id', id);

      // Get creator profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url, bio, id')
        .eq('id', contentData.user_id)
        .single();

      // Get public URL for content
      let publicUrl = null;
      if (contentData.file_url) {
        const { data: fileData } = supabase.storage
          .from('content')
          .getPublicUrl(contentData.file_url);
        publicUrl = fileData.publicUrl;
        console.log('Content URL:', publicUrl);
      }

      // Get thumbnail URL
      let thumbnailUrl = null;
      if (contentData.thumbnail_url) {
        const { data: thumbData } = supabase.storage
          .from('content')
          .getPublicUrl(contentData.thumbnail_url);
        thumbnailUrl = thumbData.publicUrl;
      }

      // Get avatar URL
      let avatarUrl = null;
      if (profileData?.avatar_url) {
        const { data: avatarData } = supabase.storage
          .from('avatars')
          .getPublicUrl(profileData.avatar_url);
        avatarUrl = avatarData.publicUrl;
      }

      setContent({
        ...contentData,
        publicUrl,
        thumbnailUrl
      });

      setCreator({
        ...profileData,
        avatarUrl,
        username: profileData?.username || 'Anonymous'
      });

    } catch (error) {
      console.error('Error loading content:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
    lg: '1.25rem',
    xl: '1.5rem'
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

  if (error || !content) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: spacing.lg
      }}>
        <div style={{ fontSize: '4rem' }}>😕</div>
        <h1 style={{ fontSize: fontSize.xl }}>Content not found</h1>
        <Link to="/browse">
          <button style={{
            padding: `${spacing.md} ${spacing.xl}`,
            background: '#FF3366',
            border: 'none',
            borderRadius: '30px',
            color: 'white',
            cursor: 'pointer'
          }}>
            Browse Content
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: spacing.xl }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: fontSize.md,
            cursor: 'pointer',
            marginBottom: spacing.lg
          }}
        >
          ← Back
        </button>

        {/* Video Player */}
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          background: '#000',
          borderRadius: '15px',
          marginBottom: spacing.lg
        }}>
          {content.content_type === 'video' ? (
            <video
              src={content.publicUrl}
              controls
              poster={content.thumbnailUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          ) : content.content_type === 'audio' ? (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2a, #16213e)'
            }}>
              <audio src={content.publicUrl} controls style={{ width: '80%' }} />
            </div>
          ) : content.content_type === 'image' ? (
            <img
              src={content.publicUrl}
              alt={content.title}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: spacing.md,
              background: '#1a1a1a'
            }}>
              <div style={{ fontSize: '4rem' }}>📄</div>
              <h3>{content.title}</h3>
              <a
                href={content.publicUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: '#FF3366',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '30px'
                }}
              >
                Download File
              </a>
            </div>
          )}
        </div>

        {/* Title and Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
          flexWrap: 'wrap',
          gap: spacing.md
        }}>
          <h1 style={{ fontSize: fontSize.xl, flex: 1 }}>
            {content.title}
          </h1>
          
          <div style={{ display: 'flex', gap: spacing.sm }}>
            {/* Playlist Button */}
            <button
              onClick={() => setShowPlaylistModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: fontSize.md,
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '20px'
              }}
              onMouseEnter={e => e.target.style.background = '#1a1a1a'}
              onMouseLeave={e => e.target.style.background = 'none'}
            >
              <span>📋</span>
              <span>Save</span>
            </button>
            
            {/* Like Button */}
            <LikeButton contentId={id} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
          flexWrap: 'wrap',
          gap: spacing.md
        }}>
          <div style={{ color: '#888', fontSize: fontSize.sm }}>
            {formatViews(content.views_count)} views • {formatDate(content.created_at)}
          </div>
        </div>

        {/* Creator Info with Subscribe Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
          padding: spacing.md,
          background: '#1a1a1a',
          borderRadius: '10px',
          marginBottom: spacing.lg
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: creator?.avatarUrl 
                ? `url(${creator.avatarUrl}) center/cover`
                : 'linear-gradient(135deg, #FF3366, #4FACFE)'
            }} />
            <div>
              <Link to={`/profile/${creator?.username}`} style={{ color: 'white', textDecoration: 'none' }}>
                <h3 style={{ fontSize: fontSize.md }}>{creator?.username}</h3>
              </Link>
              {creator?.bio && (
                <p style={{ color: '#888', fontSize: fontSize.sm, marginTop: spacing.xs }}>
                  {creator.bio}
                </p>
              )}
            </div>
          </div>
          <SubscribeButton channelId={creator?.id} />
        </div>

        {/* Description */}
        {content.description && (
          <div style={{
            padding: spacing.lg,
            background: '#1a1a1a',
            borderRadius: '10px',
            marginBottom: spacing.lg
          }}>
            <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.sm }}>Description</h3>
            <p style={{ color: '#ccc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {content.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div style={{
            display: 'flex',
            gap: spacing.sm,
            flexWrap: 'wrap',
            marginBottom: spacing.lg
          }}>
            {content.tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '15px',
                  color: '#888',
                  fontSize: fontSize.xs
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <Comments contentId={id} />

        {/* Add to Playlist Modal */}
        <AddToPlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          contentId={id}
        />
      </div>
    </div>
  );
};

export default ContentDetail;
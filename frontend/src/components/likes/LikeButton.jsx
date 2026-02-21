import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const LikeButton = ({ contentId }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contentId) {
      loadLikes();
    }
  }, [contentId, user]);

  const loadLikes = async () => {
    try {
      // Get like count
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('content_id', contentId);

      setLikeCount(count || 0);

      // Check if user liked
      if (user) {
        const { data } = await supabase
          .from('likes')
          .select('*')
          .eq('content_id', contentId)
          .eq('user_id', user.id)
          .maybeSingle();

        setLiked(!!data);
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like content');
      return;
    }

    try {
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('content_id', contentId)
          .eq('user_id', user.id);

        if (error) throw error;
        setLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert([{
            content_id: contentId,
            user_id: user.id
          }]);

        if (error) throw error;
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        color: liked ? '#FF3366' : '#888',
        fontSize: '1rem',
        cursor: loading ? 'wait' : 'pointer',
        padding: '8px 12px',
        borderRadius: '20px'
      }}
      onMouseEnter={e => !loading && (e.target.style.background = '#1a1a1a')}
      onMouseLeave={e => !loading && (e.target.style.background = 'none')}
    >
      <span style={{ fontSize: '1.2rem' }}>{liked ? '❤️' : '🤍'}</span>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
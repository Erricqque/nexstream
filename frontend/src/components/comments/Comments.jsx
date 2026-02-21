import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const Comments = ({ contentId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (contentId) {
      loadComments();
    }
  }, [contentId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('content_id', contentId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get avatars and replies for comments
      const commentsWithData = await Promise.all((data || []).map(async (comment) => {
        // Get avatar URL
        let avatarUrl = null;
        if (comment.profiles?.avatar_url) {
          const { data: avatarData } = supabase.storage
            .from('avatars')
            .getPublicUrl(comment.profiles.avatar_url);
          avatarUrl = avatarData.publicUrl;
        }

        // Get replies
        const { data: replies } = await supabase
          .from('comments')
          .select(`
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true });

        // Get avatars for replies
        const repliesWithAvatars = await Promise.all((replies || []).map(async (reply) => {
          let replyAvatarUrl = null;
          if (reply.profiles?.avatar_url) {
            const { data: avatarData } = supabase.storage
              .from('avatars')
              .getPublicUrl(reply.profiles.avatar_url);
            replyAvatarUrl = avatarData.publicUrl;
          }
          return {
            ...reply,
            avatarUrl: replyAvatarUrl
          };
        }));

        return {
          ...comment,
          avatarUrl,
          replies: repliesWithAvatars
        };
      }));

      setComments(commentsWithData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      alert('Please login to comment');
      return;
    }

    const text = replyingTo ? replyText : newComment;
    if (!text.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          content_id: contentId,
          user_id: user.id,
          text: text,
          parent_id: replyingTo || null
        }])
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      let avatarUrl = null;
      if (data.profiles?.avatar_url) {
        const { data: avatarData } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.profiles.avatar_url);
        avatarUrl = avatarData.publicUrl;
      }

      const newCommentWithData = {
        ...data,
        avatarUrl,
        replies: []
      };

      if (replyingTo) {
        // Add reply to parent comment
        setComments(comments.map(c => 
          c.id === replyingTo 
            ? { ...c, replies: [...(c.replies || []), newCommentWithData] }
            : c
        ));
        setReplyingTo(null);
        setReplyText('');
      } else {
        // Add new top-level comment
        setComments([newCommentWithData, ...comments]);
        setNewComment('');
      }

    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem'
  };

  return (
    <div style={{ marginTop: spacing.lg }}>
      <h3 style={{ marginBottom: spacing.md }}>Comments ({comments.length})</h3>

      {/* Comment Input */}
      {user ? (
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.lg
        }}>
          <textarea
            value={replyingTo ? replyText : newComment}
            onChange={(e) => replyingTo ? setReplyText(e.target.value) : setNewComment(e.target.value)}
            placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
            rows="3"
            style={{
              flex: 1,
              padding: spacing.md,
              background: '#2a2a2a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: fontSize.md,
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
            <button
              onClick={handleSubmitComment}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: '#FF3366',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {replyingTo ? 'Reply' : 'Comment'}
            </button>
            {replyingTo && (
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: 'transparent',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#888',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          background: '#1a1a1a',
          borderRadius: '8px',
          marginBottom: spacing.lg
        }}>
          <p style={{ color: '#888' }}>Please login to join the conversation</p>
        </div>
      )}

      {/* Comments List */}
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
      ) : comments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: spacing.lg,
          background: '#1a1a1a',
          borderRadius: '8px',
          color: '#888'
        }}>
          No comments yet. Be the first!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {comments.map(comment => (
            <div key={comment.id}>
              {/* Main Comment */}
              <div style={{
                display: 'flex',
                gap: spacing.sm,
                padding: spacing.md,
                background: '#1a1a1a',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: comment.avatarUrl 
                    ? `url(${comment.avatarUrl}) center/cover`
                    : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing.xs
                  }}>
                    <strong>{comment.profiles?.username || 'Anonymous'}</strong>
                    <span style={{ color: '#888', fontSize: fontSize.xs }}>
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                  <p style={{ color: '#ccc', lineHeight: 1.6 }}>{comment.text}</p>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    style={{
                      marginTop: spacing.xs,
                      background: 'none',
                      border: 'none',
                      color: '#4FACFE',
                      fontSize: fontSize.xs,
                      cursor: 'pointer'
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div style={{ marginLeft: '40px', marginTop: spacing.sm }}>
                  {comment.replies.map(reply => (
                    <div
                      key={reply.id}
                      style={{
                        display: 'flex',
                        gap: spacing.sm,
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        borderRadius: '8px',
                        marginBottom: spacing.xs
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: reply.avatarUrl 
                          ? `url(${reply.avatarUrl}) center/cover`
                          : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: spacing.xs
                        }}>
                          <strong style={{ fontSize: fontSize.sm }}>
                            {reply.profiles?.username || 'Anonymous'}
                          </strong>
                          <span style={{ color: '#888', fontSize: fontSize.xs }}>
                            {formatTime(reply.created_at)}
                          </span>
                        </div>
                        <p style={{ color: '#ccc', fontSize: fontSize.sm }}>{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Comments;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      style={{
        background: '#1a1a1a',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #333'
      }}
    >
      <div style={{
        height: '140px',
        background: playlist.thumbnail_url 
          ? `url(${playlist.thumbnail_url}) center/cover`
          : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          bottom: spacing.sm,
          right: spacing.sm,
          background: 'rgba(0,0,0,0.7)',
          padding: `${spacing.xs} ${spacing.sm}`,
          borderRadius: '4px',
          fontSize: fontSize.xs,
          color: 'white'
        }}>
          {playlist.video_count || 0} videos
        </div>
        {!playlist.is_public && (
          <div style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            background: '#FF3366',
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: '4px',
            fontSize: fontSize.xs
          }}>
            🔒 Private
          </div>
        )}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          📋
        </div>
      </div>
      <div style={{ padding: spacing.md }}>
        <h3 style={{
          fontSize: fontSize.md,
          fontWeight: '600',
          marginBottom: spacing.xs,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {playlist.name}
        </h3>
        {playlist.description && (
          <p style={{
            color: '#888',
            fontSize: fontSize.sm,
            marginBottom: spacing.xs,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '36px'
          }}>
            {playlist.description}
          </p>
        )}
        <p style={{ color: '#666', fontSize: fontSize.xs }}>
          Updated {new Date(playlist.updated_at || playlist.created_at).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
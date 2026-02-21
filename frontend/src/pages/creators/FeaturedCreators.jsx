import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedCreators = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ['all', 'gaming', 'music', 'education', 'entertainment', 'sports'];

  const creators = [
    {
      id: 1,
      name: 'Alex Gaming',
      username: '@alexgaming',
      category: 'gaming',
      subscribers: '2.5M',
      videos: 342,
      earnings: '$45.2K',
      image: null,
      featured: true,
      bio: 'Professional gamer and content creator, playing the latest titles'
    },
    {
      id: 2,
      name: 'Music Master',
      username: '@musicmaster',
      category: 'music',
      subscribers: '1.8M',
      videos: 156,
      earnings: '$38.7K',
      image: null,
      featured: true,
      bio: 'Creating beats and music tutorials for aspiring producers'
    },
    {
      id: 3,
      name: 'EduTech Pro',
      username: '@edutechpro',
      category: 'education',
      subscribers: '3.2M',
      videos: 567,
      earnings: '$52.1K',
      image: null,
      featured: true,
      bio: 'Making technology education accessible for everyone'
    },
    {
      id: 4,
      name: 'Comedy Central',
      username: '@comedycentral',
      category: 'entertainment',
      subscribers: '4.1M',
      videos: 234,
      earnings: '$67.8K',
      image: null,
      featured: true,
      bio: 'Bringing laughter to millions with daily sketches'
    },
    {
      id: 5,
      name: 'Sports Zone',
      username: '@sportszone',
      category: 'sports',
      subscribers: '1.2M',
      videos: 189,
      earnings: '$29.4K',
      image: null,
      featured: false,
      bio: 'Latest sports highlights and analysis'
    },
    {
      id: 6,
      name: 'Tech Reviews',
      username: '@techreviews',
      category: 'technology',
      subscribers: '2.9M',
      videos: 423,
      earnings: '$41.3K',
      image: null,
      featured: true,
      bio: 'Honest reviews of the latest gadgets'
    }
  ];

  const filteredCreators = selectedCategory === 'all' 
    ? creators 
    : creators.filter(c => c.category === selectedCategory);

  const featuredCreators = creators.filter(c => c.featured);

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Featured Creators
          </h1>
          <p style={{ color: '#888' }}>
            Discover amazing creators making waves on NexStream
          </p>
        </motion.div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.xl,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)'
          }} />
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.sm }}>
            Creator Spotlight
          </h2>
          <p style={{ fontSize: fontSize.lg, opacity: 0.9, maxWidth: '600px' }}>
            Every week we highlight exceptional creators who are inspiring their communities
          </p>
        </motion.div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          overflowX: 'auto',
          paddingBottom: spacing.xs,
          flexWrap: isMobile ? 'nowrap' : 'wrap'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: selectedCategory === cat ? '#FF3366' : '#1a1a1a',
                border: 'none',
                borderRadius: '30px',
                color: selectedCategory === cat ? 'white' : '#888',
                cursor: 'pointer',
                fontSize: fontSize.sm,
                textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Creators Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          {filteredCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/profile/${creator.username}`)}
              style={{
                background: '#1a1a1a',
                borderRadius: '15px',
                padding: spacing.lg,
                cursor: 'pointer',
                position: 'relative',
                border: creator.featured ? '2px solid #FFD700' : 'none'
              }}
            >
              {creator.featured && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#FFD700',
                  color: '#000',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: fontSize.xs,
                  fontWeight: 'bold'
                }}>
                  ⭐ Featured
                </div>
              )}

              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: creator.image 
                  ? `url(${creator.image}) center/cover`
                  : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                margin: '0 auto',
                marginBottom: spacing.md
              }} />

              <h3 style={{ fontSize: fontSize.lg, textAlign: 'center', marginBottom: spacing.xs }}>
                {creator.name}
              </h3>
              <p style={{ color: '#4FACFE', textAlign: 'center', marginBottom: spacing.sm }}>
                {creator.username}
              </p>
              <p style={{ color: '#888', fontSize: fontSize.sm, textAlign: 'center', marginBottom: spacing.md }}>
                {creator.bio}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: spacing.sm,
                textAlign: 'center',
                borderTop: '1px solid #333',
                paddingTop: spacing.md
              }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#FF3366' }}>{creator.subscribers}</p>
                  <p style={{ color: '#888', fontSize: fontSize.xs }}>Subscribers</p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#4FACFE' }}>{creator.videos}</p>
                  <p style={{ color: '#888', fontSize: fontSize.xs }}>Videos</p>
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#43E97B' }}>{creator.earnings}</p>
                  <p style={{ color: '#888', fontSize: fontSize.xs }}>Earnings</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Become a Creator CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl,
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
            Want to be featured?
          </h2>
          <p style={{ color: '#888', marginBottom: spacing.lg }}>
            Start creating amazing content and grow your audience on NexStream
          </p>
          <button
            onClick={() => navigate('/upload')}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: '#FF3366',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontSize: fontSize.md,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Start Creating
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedCreators;
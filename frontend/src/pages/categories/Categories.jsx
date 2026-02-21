import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryContent, setCategoryContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    loadCategoryStats();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryContent(selectedCategory);
    }
  }, [selectedCategory]);

  const categoryGroups = [
    {
      name: 'Video Categories',
      icon: '🎬',
      categories: ['Gaming', 'Music', 'Education', 'Entertainment', 'Sports', 'News', 'Technology', 'Lifestyle', 'Travel', 'Comedy']
    },
    {
      name: 'Music Genres',
      icon: '🎵',
      categories: ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Reggae', 'Folk']
    },
    {
      name: 'Game Categories',
      icon: '🎮',
      categories: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Puzzle', 'Multiplayer', 'Arcade', 'Simulation', 'Horror']
    },
    {
      name: 'Visual Arts',
      icon: '🎨',
      categories: ['Photography', 'Art', 'Design', 'Illustration', '3D', 'Wallpaper', 'Digital Art']
    },
    {
      name: 'Educational',
      icon: '📚',
      categories: ['Tutorial', 'Course', 'Lecture', 'Workshop', 'Guide', 'How-to']
    }
  ];

  const loadCategoryStats = async () => {
    try {
      const { data } = await supabase
        .from('content')
        .select('category')
        .eq('status', 'approved');

      // Aggregate counts by category
      const stats = {};
      data?.forEach(item => {
        if (item.category) {
          stats[item.category] = (stats[item.category] || 0) + 1;
        }
      });

      setCategories(stats);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryContent = async (category) => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('content')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('category', category)
        .eq('status', 'approved')
        .order('views_count', { ascending: false })
        .limit(20);

      setCategoryContent(data || []);
    } catch (error) {
      console.error('Error loading category content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
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
    xs: 'clamp(0.75rem, 2vw, 0.875rem)',
    sm: 'clamp(0.875rem, 2.5vw, 1rem)',
    md: 'clamp(1rem, 3vw, 1.25rem)',
    lg: 'clamp(1.25rem, 4vw, 1.5rem)',
    xl: 'clamp(1.5rem, 5vw, 2rem)',
    xxl: 'clamp(2rem, 6vw, 2.5rem)'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${isMobile ? '16px' : '40px'}`
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} 0`
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <div style={containerStyle}>
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
            Explore Categories
          </h1>
          <p style={{ color: '#888' }}>
            Discover content by category and find your next favorite
          </p>
        </motion.div>

        {selectedCategory ? (
          // Category Detail View
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
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
              ← Back to Categories
            </button>

            <h2 style={{
              fontSize: fontSize.xl,
              marginBottom: spacing.lg,
              color: '#FF3366'
            }}>
              {selectedCategory}
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: spacing.xl }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #FF3366',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }} />
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile 
                  ? '1fr' 
                  : window.innerWidth <= 1024 
                    ? 'repeat(2, 1fr)' 
                    : 'repeat(4, 1fr)',
                gap: spacing.lg
              }}>
                {categoryContent.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/content/${item.id}`)}
                    style={{
                      background: '#1a1a1a',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      height: '140px',
                      background: item.thumbnail_url 
                        ? `url(${item.thumbnail_url}) center/cover`
                        : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)'
                    }} />
                    <div style={{ padding: spacing.md }}>
                      <h3 style={{
                        fontSize: fontSize.sm,
                        fontWeight: '600',
                        marginBottom: spacing.xs
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        color: '#888',
                        fontSize: fontSize.xs,
                        marginBottom: spacing.xs
                      }}>
                        By {item.profiles?.username}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#888',
                        fontSize: fontSize.xs
                      }}>
                        <span>👁️ {formatViews(item.views_count || 0)}</span>
                        <span>❤️ {item.likes_count || 0}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Categories Grid View
          <div>
            {categoryGroups.map((group, groupIndex) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                style={{ marginBottom: spacing.xl }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  marginBottom: spacing.lg
                }}>
                  <span style={{ fontSize: '2rem' }}>{group.icon}</span>
                  <h2 style={{ fontSize: fontSize.lg }}>{group.name}</h2>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? 'repeat(2, 1fr)' 
                    : window.innerWidth <= 1024 
                      ? 'repeat(3, 1fr)' 
                      : 'repeat(5, 1fr)',
                  gap: spacing.md
                }}>
                  {group.categories.map(category => {
                    const count = categories[category] || 0;
                    return (
                      <motion.div
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedCategory(category)}
                        style={{
                          padding: spacing.lg,
                          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}
                      >
                        <p style={{
                          fontWeight: '600',
                          marginBottom: spacing.xs,
                          color: '#fff'
                        }}>
                          {category}
                        </p>
                        <p style={{
                          color: '#888',
                          fontSize: fontSize.xs
                        }}>
                          {count} {count === 1 ? 'video' : 'videos'}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Trending = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [timeframe, setTimeframe] = useState('today');
  const [category, setCategory] = useState('all');
  const [trendingData, setTrendingData] = useState({
    videos: [],
    creators: [],
    topics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    loadTrendingData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadTrendingData = async () => {
    try {
      setLoading(true);
      
      // Load trending content from Supabase
      const { data: videos, error } = await supabase
        .from('content')
        .select(`
          id,
          title,
          views_count,
          likes_count,
          profiles:user_id (
            username
          )
        `)
        .eq('status', 'approved')
        .order('views_count', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Format the data
      const formattedVideos = (videos || []).map((video, index) => ({
        id: video.id,
        title: video.title || 'Untitled',
        creator: video.profiles?.username || 'Creator',
        views: formatNumber(video.views_count || 0),
        likes: formatNumber(video.likes_count || 0),
        comments: '0',
        rank: index + 1,
        trend: '+0%',
        category: 'all'
      }));

      setTrendingData({
        videos: formattedVideos,
        creators: [
          { name: 'GameMaster', rank: 1, growth: '+45K', category: 'gaming' },
          { name: 'BeatLab', rank: 2, growth: '+32K', category: 'music' },
          { name: 'CodeMaster', rank: 3, growth: '+28K', category: 'education' }
        ],
        topics: [
          { topic: 'Gaming', posts: '45.2K', trend: '+156%' },
          { topic: 'Music', posts: '32.1K', trend: '+89%' },
          { topic: 'Technology', posts: '28.7K', trend: '+234%' }
        ]
      });
    } catch (error) {
      console.error('Error loading trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeframes = ['today', 'week', 'month', 'year'];
  const categories = ['all', 'gaming', 'music', 'education', 'entertainment', 'sports', 'technology'];

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
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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
            Trending Now
          </h1>
          <p style={{ color: '#888' }}>
            Discover what's hot on NexStream right now
          </p>
        </motion.div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
          flexWrap: 'wrap',
          gap: spacing.md
        }}>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            {timeframes.map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: timeframe === t ? '#FF3366' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '30px',
                  color: timeframe === t ? 'white' : '#888',
                  cursor: 'pointer',
                  fontSize: fontSize.sm,
                  textTransform: 'capitalize'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '30px',
              color: 'white',
              fontSize: fontSize.sm,
              cursor: 'pointer'
            }}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Trending Videos */}
        <div style={{ marginBottom: spacing.xl }}>
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
            🔥 Trending Videos
          </h2>
          {trendingData.videos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: spacing.xl, background: '#1a1a1a', borderRadius: '10px' }}>
              <p style={{ color: '#888' }}>No trending videos yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {trendingData.videos.map(video => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: video.rank * 0.05 }}
                  whileHover={{ scale: 1.01, x: 10 }}
                  onClick={() => navigate(`/content/${video.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: spacing.md,
                    background: '#1a1a1a',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: video.rank === 1 ? '#FFD700' : video.rank === 2 ? '#C0C0C0' : video.rank === 3 ? '#CD7F32' : '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: fontSize.lg,
                    fontWeight: 'bold',
                    color: video.rank <= 3 ? '#000' : '#fff'
                  }}>
                    {video.rank}
                  </div>

                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                    borderRadius: '5px'
                  }} />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.xs }}>{video.title}</h3>
                    <p style={{ color: '#888', marginBottom: spacing.xs }}>{video.creator}</p>
                    <div style={{ display: 'flex', gap: spacing.md, fontSize: fontSize.sm }}>
                      <span>👁️ {video.views}</span>
                      <span>❤️ {video.likes}</span>
                      <span>💬 {video.comments}</span>
                    </div>
                  </div>

                  <div style={{
                    padding: spacing.sm,
                    background: 'rgba(67,233,123,0.1)',
                    borderRadius: '20px',
                    color: '#43E97B',
                    fontSize: fontSize.sm,
                    fontWeight: 'bold'
                  }}>
                    {video.trend}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Trending Creators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: spacing.xl,
          marginBottom: spacing.xl
        }}>
          <div>
            <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
              📈 Trending Creators
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {trendingData.creators.map(creator => (
                <div key={creator.rank} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: spacing.md,
                  background: '#1a1a1a',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <span style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: creator.rank === 1 ? '#FFD700' : creator.rank === 2 ? '#C0C0C0' : '#CD7F32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#000'
                    }}>
                      {creator.rank}
                    </span>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>{creator.name}</p>
                      <p style={{ color: '#888', fontSize: fontSize.xs }}>{creator.category}</p>
                    </div>
                  </div>
                  <span style={{ color: '#43E97B', fontWeight: 'bold' }}>{creator.growth}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div>
            <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
              🔥 Trending Topics
            </h2>
            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg
            }}>
              {trendingData.topics.map((topic, index) => (
                <div key={index} style={{
                  padding: spacing.md,
                  borderBottom: index < trendingData.topics.length - 1 ? '1px solid #333' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                    <span style={{ fontWeight: 'bold' }}>{topic.topic}</span>
                    <span style={{ color: '#43E97B' }}>{topic.trend}</span>
                  </div>
                  <p style={{ color: '#888', fontSize: fontSize.sm }}>{topic.posts} posts</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Region Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: spacing.md,
          flexWrap: 'wrap'
        }}>
          {['Global', 'North America', 'Europe', 'Asia', 'Africa'].map(region => (
            <button
              key={region}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: 'transparent',
                border: '1px solid #333',
                borderRadius: '30px',
                color: '#888',
                cursor: 'pointer',
                fontSize: fontSize.sm
              }}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
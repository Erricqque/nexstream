import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useResponsive, containerStyle, fontSize, spacing } from '../../styles/responsive';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const responsive = useResponsive();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    content: [],
    creators: [],
    communities: []
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    type: 'all',
    duration: 'any',
    uploadDate: 'any',
    sort: 'relevance'
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [location.search]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      // Search content
      const { data: contentData } = await supabase
        .from('content')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('status', 'approved')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('views_count', { ascending: false })
        .limit(20);

      // Search creators/profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select(`
          *,
          content:content(count)
        `)
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .limit(10);

      // Search communities
      const { data: communitiesData } = await supabase
        .from('communities')
        .select(`
          *,
          members:community_members(count)
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10);

      // Get thumbnails and avatars
      const contentWithUrls = await Promise.all((contentData || []).map(async (item) => {
        let thumbnailUrl = null;
        if (item.thumbnail_url) {
          const { data } = supabase.storage
            .from('content')
            .getPublicUrl(item.thumbnail_url);
          thumbnailUrl = data.publicUrl;
        }
        return { ...item, thumbnailUrl };
      }));

      const profilesWithAvatars = await Promise.all((profilesData || []).map(async (profile) => {
        let avatarUrl = null;
        if (profile.avatar_url) {
          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(profile.avatar_url);
          avatarUrl = data.publicUrl;
        }
        return { ...profile, avatarUrl };
      }));

      setResults({
        content: contentWithUrls,
        creators: profilesWithAvatars,
        communities: communitiesData || []
      });

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters_list = [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'creators', label: 'Creators', icon: '👤' },
    { id: 'communities', label: 'Communities', icon: '👥' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Top Rated' }
  ];

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getTotalResults = () => {
    return results.content.length + results.creators.length + results.communities.length;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} 0`
    }}>
      <div style={containerStyle}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: responsive.isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.sm
          }}>
            Search Results
          </h1>
          {query && (
            <p style={{ color: '#888' }}>
              Found {getTotalResults()} results for "{query}"
            </p>
          )}
        </motion.div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          flexDirection: responsive.isMobile ? 'column' : 'row'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: spacing.md,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888'
            }}>
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch(query)}
              placeholder="Search videos, creators, communities..."
              style={{
                width: '100%',
                padding: `${spacing.md} ${spacing.md} ${spacing.md} 45px`,
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '30px',
                color: 'white',
                fontSize: fontSize.md
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => performSearch(query)}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: '#FF3366',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontSize: fontSize.md,
              fontWeight: '600',
              cursor: 'pointer',
              width: responsive.isMobile ? '100%' : 'auto'
            }}
          >
            Search
          </motion.button>
        </div>

        {/* Filters and Sort */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
          flexDirection: responsive.isMobile ? 'column' : 'row',
          gap: spacing.md
        }}>
          <div style={{
            display: 'flex',
            gap: spacing.sm,
            flexWrap: 'wrap'
          }}>
            {filters_list.map(filter => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: activeFilter === filter.id ? '#FF3366' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '30px',
                  color: activeFilter === filter.id ? 'white' : '#888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  fontSize: fontSize.sm
                }}
              >
                <span>{filter.icon}</span>
                {filter.label}
                {filter.id === 'all' && ` (${getTotalResults()})`}
                {filter.id === 'videos' && ` (${results.content.length})`}
                {filter.id === 'creators' && ` (${results.creators.length})`}
                {filter.id === 'communities' && ` (${results.communities.length})`}
              </motion.button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by: {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: spacing.xxl
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #FF3366',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#888' }}>Searching...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Videos Results */}
              {(activeFilter === 'all' || activeFilter === 'videos') && results.content.length > 0 && (
                <div style={{ marginBottom: spacing.xl }}>
                  {(activeFilter === 'all') && (
                    <h2 style={{
                      fontSize: fontSize.lg,
                      marginBottom: spacing.lg,
                      color: '#FF3366'
                    }}>
                      Videos ({results.content.length})
                    </h2>
                  )}
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: responsive.isMobile 
                      ? '1fr' 
                      : responsive.isTablet 
                        ? 'repeat(2, 1fr)' 
                        : 'repeat(3, 1fr)',
                    gap: spacing.lg
                  }}>
                    {results.content.map(item => (
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
                          height: responsive.isMobile ? '120px' : '140px',
                          background: item.thumbnailUrl 
                            ? `url(${item.thumbnailUrl}) center/cover`
                            : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            top: spacing.xs,
                            right: spacing.xs,
                            padding: `${spacing.xs} ${spacing.sm}`,
                            background: 'rgba(0,0,0,0.7)',
                            borderRadius: '4px',
                            fontSize: fontSize.xs,
                            textTransform: 'capitalize'
                          }}>
                            {item.content_type}
                          </span>
                        </div>
                        <div style={{ padding: spacing.md }}>
                          <h3 style={{
                            fontSize: fontSize.sm,
                            fontWeight: '600',
                            marginBottom: spacing.xs,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.title}
                          </h3>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: '#888',
                            fontSize: fontSize.xs
                          }}>
                            <span>By {item.profiles?.username}</span>
                            <span>👁️ {formatViews(item.views_count || 0)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creators Results */}
              {(activeFilter === 'all' || activeFilter === 'creators') && results.creators.length > 0 && (
                <div style={{ marginBottom: spacing.xl }}>
                  {(activeFilter === 'all') && (
                    <h2 style={{
                      fontSize: fontSize.lg,
                      marginBottom: spacing.lg,
                      color: '#4FACFE'
                    }}>
                      Creators ({results.creators.length})
                    </h2>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: responsive.isMobile 
                      ? '1fr' 
                      : 'repeat(2, 1fr)',
                    gap: spacing.md
                  }}>
                    {results.creators.map(creator => (
                      <motion.div
                        key={creator.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(`/profile/${creator.username}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.md,
                          padding: spacing.md,
                          background: '#1a1a1a',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: creator.avatarUrl 
                            ? `url(${creator.avatarUrl}) center/cover`
                            : 'linear-gradient(135deg, #FF3366, #4FACFE)'
                        }} />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontWeight: '600', marginBottom: spacing.xs }}>
                            {creator.username}
                          </h3>
                          <p style={{ color: '#888', fontSize: fontSize.xs }}>
                            {creator.content?.count || 0} videos • 
                            {creator.followers || 0} followers
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities Results */}
              {(activeFilter === 'all' || activeFilter === 'communities') && results.communities.length > 0 && (
                <div>
                  {(activeFilter === 'all') && (
                    <h2 style={{
                      fontSize: fontSize.lg,
                      marginBottom: spacing.lg,
                      color: '#43E97B'
                    }}>
                      Communities ({results.communities.length})
                    </h2>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: responsive.isMobile 
                      ? '1fr' 
                      : 'repeat(2, 1fr)',
                    gap: spacing.md
                  }}>
                    {results.communities.map(community => (
                      <motion.div
                        key={community.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(`/community/${community.id}`)}
                        style={{
                          padding: spacing.lg,
                          background: '#1a1a1a',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm }}>
                          <span style={{ fontSize: '2rem' }}>{community.icon || '👥'}</span>
                          <div>
                            <h3 style={{ fontWeight: '600' }}>{community.name}</h3>
                            <p style={{ color: '#888', fontSize: fontSize.xs }}>
                              {community.members?.count || 0} members
                            </p>
                          </div>
                        </div>
                        <p style={{ color: '#888', fontSize: fontSize.sm, lineHeight: 1.5 }}>
                          {community.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {getTotalResults() === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: spacing.xxl
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>🔍</div>
                  <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
                    No results found
                  </h2>
                  <p style={{ color: '#888' }}>
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
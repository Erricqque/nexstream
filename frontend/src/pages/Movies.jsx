import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('views');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadGenres();
    loadMovies();
  }, []);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    loadMovies(true);
  }, [selectedGenre, sortBy, searchQuery]);

  const loadGenres = async () => {
    const { data } = await supabase
      .from('genres')
      .select('*')
      .order('name');
    setGenres(data || []);
  };

  const loadMovies = async (reset = false) => {
    setLoading(true);
    try {
      let query = supabase
        .from('movies')
        .select('*', { count: 'exact' });

      // Filter by genre
      if (selectedGenre !== 'all') {
        query = query.contains('genre', [selectedGenre]);
      }

      // Search by title
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Sort
      switch (sortBy) {
        case 'views':
          query = query.order('views', { ascending: false });
          break;
        case 'year':
          query = query.order('release_year', { ascending: false });
          break;
        case 'rating':
          query = query.order('imdb_rating', { ascending: false });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        default:
          query = query.order('views', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * 20;
      const to = from + 19;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      if (reset) {
        setMovies(data || []);
      } else {
        setMovies(prev => [...prev, ...(data || [])]);
      }

      setTotalCount(count || 0);
      setHasMore(data?.length === 20);

    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    loadMovies();
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Movies</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Discover thousands of free movies across all genres
        </p>
      </div>

      {/* Filters Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '30px 20px',
        borderBottom: '1px solid #272727'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          
          {/* Search */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: '30px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Sort */}
          <div style={{ minWidth: '200px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: '30px',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="views">Most Viewed</option>
              <option value="year">Latest First</option>
              <option value="rating">Top Rated</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Genre Filter */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          <button
            onClick={() => setSelectedGenre('all')}
            style={{
              padding: '8px 20px',
              background: selectedGenre === 'all' ? '#ef4444' : '#1f1f1f',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: selectedGenre === 'all' ? 'bold' : 'normal'
            }}
          >
            All
          </button>
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.name)}
              style={{
                padding: '8px 20px',
                background: selectedGenre === genre.name ? '#ef4444' : '#1f1f1f',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{genre.icon}</span>
              {genre.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p style={{ color: '#888', marginTop: '20px' }}>
          Showing {movies.length} of {totalCount} movies
        </p>
      </div>

      {/* Movies Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {movies.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#888', fontSize: '1.2rem' }}>No movies found</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '25px'
            }}>
              {movies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  <div style={{
                    background: '#1f1f1f',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(239,68,68,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    
                    {/* Poster */}
                    <div style={{
                      position: 'relative',
                      aspectRatio: '2/3',
                      background: '#2d2d2d'
                    }}>
                      {movie.thumbnail_url ? (
                        <img
                          src={movie.thumbnail_url}
                          alt={movie.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          background: '#2d2d2d',
                          color: '#666'
                        }}>
                          🎬
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      {movie.imdb_rating && (
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.8)',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          color: '#fbbf24',
                          fontWeight: 'bold'
                        }}>
                          ⭐ {movie.imdb_rating}
                        </span>
                      )}

                      {/* View Count */}
                      {movie.views > 0 && (
                        <span style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          background: 'rgba(0,0,0,0.8)',
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          color: '#888'
                        }}>
                          👁️ {formatNumber(movie.views)}
                        </span>
                      )}
                    </div>

                    {/* Movie Info */}
                    <div style={{ padding: '15px' }}>
                      <h3 style={{
                        margin: '0 0 8px 0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {movie.title}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        color: '#888',
                        fontSize: '0.8rem',
                        marginBottom: '8px'
                      }}>
                        <span>{movie.release_year}</span>
                        {movie.duration && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(movie.duration)}</span>
                          </>
                        )}
                      </div>

                      {/* Genre Tags */}
                      <div style={{
                        display: 'flex',
                        gap: '5px',
                        flexWrap: 'wrap'
                      }}>
                        {movie.genre?.slice(0, 2).map(g => (
                          <span key={g} style={{
                            padding: '3px 8px',
                            background: '#333',
                            borderRadius: '3px',
                            fontSize: '0.7rem',
                            color: '#ccc'
                          }}>
                            {g}
                          </span>
                        ))}
                        {movie.genre?.length > 2 && (
                          <span style={{
                            padding: '3px 8px',
                            background: '#333',
                            borderRadius: '3px',
                            fontSize: '0.7rem',
                            color: '#ccc'
                          }}>
                            +{movie.genre.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  style={{
                    padding: '15px 40px',
                    background: loading ? '#333' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Movies;
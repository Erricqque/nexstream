import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdb } from '../services/tmdb';

const TMDbMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [category, page, searchQuery, selectedGenre]);

  const loadGenres = async () => {
    const genreList = await tmdb.getGenres();
    setGenres(genreList || []);
  };

  const loadMovies = async () => {
    setLoading(true);
    let data = null;

    try {
      if (searchQuery) {
        data = await tmdb.searchMovies(searchQuery, page);
      } else if (selectedGenre) {
        data = await tmdb.getByGenre(selectedGenre, page);
      } else {
        switch (category) {
          case 'popular':
            data = await tmdb.getPopular(page);
            break;
          case 'trending':
            data = await tmdb.getTrending('week');
            break;
          case 'upcoming':
            data = await tmdb.getUpcoming(page);
            break;
          case 'now_playing':
            data = await tmdb.getNowPlaying(page);
            break;
          case 'top_rated':
            data = await tmdb.getTopRated(page);
            break;
          default:
            data = await tmdb.getPopular(page);
        }
      }

      if (data) {
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
        
        // Set featured movie from first result if available and on first page
        if (page === 1 && data.results?.length > 0 && !featuredMovie) {
          setFeaturedMovie(data.results[0]);
        }
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getYouTubeTrailer = (movie) => {
    return `https://www.youtube.com/watch?v=dQw4w9WgXcQ`;
  };

  if (loading && movies.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(239,68,68,0.2)',
          borderTopColor: '#ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
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
      
      {/* Featured Movie Hero Section */}
      {featuredMovie && !searchQuery && !selectedGenre && page === 1 && (
        <div style={{
          height: '80vh',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px'
        }}>
          {/* Backdrop Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%), url(${tmdb.getImageUrl(featuredMovie.backdrop_path, 'original')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />

          {/* Featured Content */}
          <div style={{
            position: 'absolute',
            bottom: '100px',
            left: '50px',
            right: '50px',
            maxWidth: '600px'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {featuredMovie.title}
            </h1>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '15px',
              color: '#d1d5db'
            }}>
              <span>{featuredMovie.release_date?.split('-')[0]}</span>
              {featuredMovie.vote_average > 0 && (
                <>
                  <span>•</span>
                  <span style={{ color: '#fbbf24' }}>
                    ⭐ {featuredMovie.vote_average.toFixed(1)}
                  </span>
                </>
              )}
              <span>•</span>
              <span>{featuredMovie.original_language?.toUpperCase()}</span>
            </div>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#e5e7eb',
              marginBottom: '25px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {featuredMovie.overview}
            </p>

            <div style={{ display: 'flex', gap: '15px' }}>
              <Link
                to={`/tmdb-movie/${featuredMovie.id}`}
                style={{
                  padding: '14px 30px',
                  background: '#ef4444',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                ▶ Watch Now
              </Link>
              
              <a
                href={getYouTubeTrailer(featuredMovie)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '14px 30px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                Watch Trailer
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎬 Movies</h1>
          <p style={{ color: '#888' }}>Thousands of free movies from The Movie Database</p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            maxWidth: '600px'
          }}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
                setSelectedGenre(null);
              }}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: '30px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                style={{
                  padding: '0 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {[
            { id: 'popular', label: 'Popular', icon: '🔥' },
            { id: 'trending', label: 'Trending', icon: '📈' },
            { id: 'upcoming', label: 'Upcoming', icon: '🚀' },
            { id: 'now_playing', label: 'Now Playing', icon: '🎬' },
            { id: 'top_rated', label: 'Top Rated', icon: '⭐' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setSelectedGenre(null);
                setSearchQuery('');
                setPage(1);
              }}
              style={{
                padding: '10px 25px',
                background: category === cat.id && !selectedGenre && !searchQuery ? '#ef4444' : '#1f1f1f',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Genre Filters */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          overflowX: 'auto',
          paddingBottom: '10px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              setSelectedGenre(null);
              setPage(1);
            }}
            style={{
              padding: '8px 20px',
              background: !selectedGenre ? '#ef4444' : '#1f1f1f',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All
          </button>
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => {
                setSelectedGenre(genre.id);
                setCategory(null);
                setSearchQuery('');
                setPage(1);
              }}
              style={{
                padding: '8px 20px',
                background: selectedGenre === genre.id ? '#ef4444' : '#1f1f1f',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <p style={{ color: '#888', marginBottom: '20px' }}>
            Found {movies.length} movies
          </p>
        )}

        {/* Movies Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {movies.map(movie => (
            <Link
              key={movie.id}
              to={`/tmdb-movie/${movie.id}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <div style={{
                background: '#1f1f1f',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
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
                  {movie.poster_path ? (
                    <img
                      src={tmdb.getImageUrl(movie.poster_path, 'w342')}
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
                      color: '#666',
                      background: '#2d2d2d'
                    }}>
                      🎬
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  {movie.vote_average > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.8)',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      color: '#fbbf24',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      ⭐ {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div style={{ padding: '12px', flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}>
                    {movie.title}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: '#888'
                  }}>
                    <span>
                      {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </span>
                    <span style={{ textTransform: 'uppercase' }}>
                      {movie.original_language}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '40px',
            marginBottom: '40px'
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '12px 25px',
                background: page === 1 ? '#333' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Previous
            </button>
            
            <div style={{
              display: 'flex',
              gap: '5px',
              alignItems: 'center'
            }}>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    style={{
                      width: '40px',
                      height: '40px',
                      background: page === pageNum ? '#ef4444' : '#1f1f1f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: page === pageNum ? 'bold' : 'normal'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              style={{
                padding: '12px 25px',
                background: page >= totalPages ? '#333' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default TMDbMovies;
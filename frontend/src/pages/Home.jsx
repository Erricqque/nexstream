import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tmdb } from '../services/tmdb';

const Home = () => {
  const { user } = useAuth();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 15432,
    movies: 9823,
    views: 1234567
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      // Get popular movies
      const popular = await tmdb.getPopular(1);
      setPopularMovies(popular.results?.slice(0, 8) || []);
      
      // Get trending movies
      const trending = await tmdb.getTrending('week');
      setTrendingMovies(trending.results?.slice(0, 8) || []);
      
      // Get upcoming movies
      const upcoming = await tmdb.getUpcoming(1);
      setUpcomingMovies(upcoming.results?.slice(0, 8) || []);
      
      // Set featured movies (mix of popular and trending)
      const featured = popular.results?.slice(0, 6) || [];
      setFeaturedMovies(featured);
      
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : null;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
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
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 25s infinite ease-in-out'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 30s infinite ease-in-out reverse'
        }}></div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        
        {/* ===== HERO SECTION ===== */}
        <div style={{
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '0 20px',
            animation: 'fadeInUp 1s ease'
          }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid #ef4444',
              borderRadius: '50px',
              padding: '8px 20px',
              marginBottom: '30px',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🎬</span>
              <span style={{ color: '#ef4444', fontWeight: '500' }}>The Ultimate Movie Experience</span>
            </div>

            {/* Main Title */}
            <h1 style={{
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              fontWeight: '800',
              margin: '0 0 20px 0',
              background: 'linear-gradient(135deg, #ef4444, #3b82f6, #8b5cf6, #ef4444)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientFlow 8s ease infinite',
              letterSpacing: '-0.02em'
            }}>
              NexStream
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '20px',
              fontWeight: '300'
            }}>
              Thousands of Free Movies at Your Fingertips
            </p>

            {/* Description */}
            <p style={{
              fontSize: '1.1rem',
              color: '#888',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Watch the latest movies, classics, and hidden gems completely free. 
              No subscription needed. Start watching now!
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to="/tmdb-movies"
                style={{
                  padding: '16px 40px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(239,68,68,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(239,68,68,0.4)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 20px rgba(239,68,68,0.3)';
                }}
              >
                Browse All Movies
              </Link>
              
              {!user ? (
                <Link
                  to="/register"
                  style={{
                    padding: '16px 40px',
                    background: 'transparent',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    border: '2px solid rgba(239,68,68,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(239,68,68,0.1)';
                    e.target.style.borderColor = '#ef4444';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'rgba(239,68,68,0.5)';
                  }}
                >
                  Sign Up Free
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  style={{
                    padding: '16px 40px',
                    background: 'transparent',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    border: '2px solid rgba(239,68,68,0.5)'
                  }}
                >
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '50px',
              justifyContent: 'center',
              marginTop: '60px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {formatNumber(stats.movies)}+
                </div>
                <div style={{ color: '#888' }}>Free Movies</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {formatNumber(stats.users)}+
                </div>
                <div style={{ color: '#888' }}>Happy Users</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  {formatNumber(stats.views)}+
                </div>
                <div style={{ color: '#888' }}>Total Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== POPULAR MOVIES SECTION ===== */}
        {popularMovies.length > 0 && (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '600' }}>🔥 Popular Movies</h2>
              <Link to="/tmdb-movies" style={{ 
                color: '#ef4444', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'gap 0.2s'
              }}
              onMouseEnter={e => e.target.style.gap = '10px'}
              onMouseLeave={e => e.target.style.gap = '5px'}>
                View All <span>→</span>
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '25px'
            }}>
              {popularMovies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/tmdb-movie/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  <div style={{
                    background: '#1f1f1f',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
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
                          src={getImageUrl(movie.poster_path)}
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
                          color: '#666'
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
                        fontSize: '0.8rem',
                        color: '#888'
                      }}>
                        <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== TRENDING NOW SECTION ===== */}
        {trendingMovies.length > 0 && (
          <div style={{ background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)', padding: '60px 20px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '600' }}>📈 Trending This Week</h2>
                <Link to="/tmdb-movies?filter=trending" style={{ 
                  color: '#ef4444', 
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  Explore All <span>→</span>
                </Link>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {trendingMovies.slice(0, 6).map(movie => (
                  <Link
                    key={movie.id}
                    to={`/tmdb-movie/${movie.id}`}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      background: '#1f1f1f',
                      borderRadius: '12px',
                      padding: '15px',
                      transition: 'transform 0.2s, background 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.background = '#2d2d2d';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.background = '#1f1f1f';
                    }}>
                      
                      {/* Thumbnail */}
                      <div style={{
                        width: '80px',
                        height: '120px',
                        background: '#2d2d2d',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {movie.poster_path ? (
                          <img
                            src={getImageUrl(movie.poster_path)}
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
                            fontSize: '2rem'
                          }}>
                            🎬
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
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
                        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '5px' }}>
                          {movie.release_date?.split('-')[0] || 'N/A'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {movie.vote_average > 0 && (
                            <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                              ⭐ {movie.vote_average.toFixed(1)}
                            </span>
                          )}
                          <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>
                            #{movie.popularity?.toFixed(0)} trending
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== UPCOMING MOVIES SECTION ===== */}
        {upcomingMovies.length > 0 && (
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '600' }}>🚀 Coming Soon</h2>
              <Link to="/tmdb-movies?filter=upcoming" style={{ 
                color: '#ef4444', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                View All <span>→</span>
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '25px'
            }}>
              {upcomingMovies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/tmdb-movie/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  <div style={{
                    background: '#1f1f1f',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    
                    {/* Poster */}
                    <div style={{
                      aspectRatio: '2/3',
                      background: '#2d2d2d'
                    }}>
                      {movie.poster_path ? (
                        <img
                          src={getImageUrl(movie.poster_path)}
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
                          color: '#666'
                        }}>
                          🎬
                        </div>
                      )}
                    </div>

                    {/* Coming Soon Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: '#ef4444',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      COMING SOON
                    </div>

                    {/* Movie Info */}
                    <div style={{ padding: '12px' }}>
                      <h3 style={{
                        margin: '0 0 5px 0',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {movie.title}
                      </h3>
                      <p style={{ color: '#888', fontSize: '0.8rem' }}>
                        {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'Date TBA'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== CALL TO ACTION SECTION ===== */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626, #3b82f6, #8b5cf6)',
          backgroundSize: '300% 300%',
          animation: 'gradientFlow 10s ease infinite',
          padding: '100px 20px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '700' }}>
              Start Watching Today
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9, lineHeight: '1.6' }}>
              Join thousands of movie lovers watching free content on NexStream. 
              No credit card required, just pure entertainment.
            </p>
            <Link
              to="/tmdb-movies"
              style={{
                padding: '18px 50px',
                background: 'white',
                color: '#ef4444',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: '700',
                display: 'inline-block',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
            >
              Browse Free Movies
            </Link>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <footer style={{
          background: '#0a0a0a',
          padding: '60px 20px 30px'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              marginBottom: '40px'
            }}>
              <div>
                <h3 style={{ color: '#ef4444', marginBottom: '20px', fontSize: '1.5rem' }}>NexStream</h3>
                <p style={{ color: '#888', lineHeight: '1.6' }}>
                  Your ultimate destination for free movies and entertainment. Watch anywhere, anytime.
                </p>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '20px' }}>Movies</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/tmdb-movies?filter=popular" style={{ color: '#888', textDecoration: 'none' }}>Popular</Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/tmdb-movies?filter=trending" style={{ color: '#888', textDecoration: 'none' }}>Trending</Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/tmdb-movies?filter=upcoming" style={{ color: '#888', textDecoration: 'none' }}>Upcoming</Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link to="/tmdb-movies?filter=top_rated" style={{ color: '#888', textDecoration: 'none' }}>Top Rated</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '20px' }}>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: '#888', textDecoration: 'none' }}>About</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: '#888', textDecoration: 'none' }}>Contact</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/terms" style={{ color: '#888', textDecoration: 'none' }}>Terms</Link></li>
                  <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ color: '#888', textDecoration: 'none' }}>Privacy</Link></li>
                </ul>
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              paddingTop: '30px',
              borderTop: '1px solid #1f1f1f',
              color: '#888'
            }}>
              <p>&copy; 2026 NexStream. All rights reserved.</p>
              <p style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                Movie data provided by TMDb
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== ANIMATION STYLES ===== */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
        `}
      </style>
    </div>
  );
};

export default Home;
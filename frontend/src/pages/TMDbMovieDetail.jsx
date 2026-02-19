import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdb } from '../services/tmdb';
import { youtubeMovies } from '../services/youtubeMovies';

const TMDbMovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [videoSources, setVideoSources] = useState([]);

  useEffect(() => {
    loadMovieData();
  }, [id]);

  const loadMovieData = async () => {
    setLoading(true);
    try {
      const data = await tmdb.getMovieDetails(id);
      if (data) {
        setMovie(data);
        setCredits(data.credits);
        
        // Get video sources (YouTube, etc.)
        const sources = youtubeMovies.getSources(
          data.id, 
          data.title, 
          data.release_date?.split('-')[0]
        );
        setVideoSources(sources);
        
        // Set default source if available
        if (sources.length > 0) {
          setSelectedSource(sources[0]);
        }
        
        const videoData = data.videos?.results || [];
        const trailers = videoData.filter(v => 
          v.type === 'Trailer' || v.type === 'Teaser'
        );
        setVideos(trailers);
      }

      const similarData = await tmdb.getSimilar(id);
      if (similarData) {
        setSimilar(similarData.results || []);
      }
    } catch (error) {
      console.error('Error loading movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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

  if (!movie) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '2rem' }}>Movie not found</h1>
        <Link to="/tmdb-movies" style={{
          padding: '12px 30px',
          background: '#ef4444',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          Browse Movies
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const director = credits?.crew?.find(person => person.job === 'Director');
  const cast = credits?.cast?.slice(0, 8) || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* YouTube Player Modal */}
      {showPlayer && selectedSource && selectedSource.type === 'youtube' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Player Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 30px',
            background: '#1a1a1a',
            color: 'white'
          }}>
            <div>
              <h3 style={{ margin: 0 }}>{movie.title}</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#888' }}>
                Source: {selectedSource.source}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {videoSources.map((source, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSource(source)}
                  style={{
                    padding: '5px 15px',
                    background: selectedSource === source ? '#ef4444' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {source.source}
                </button>
              ))}
              <button
                onClick={() => setShowPlayer(false)}
                style={{
                  padding: '5px 15px',
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* YouTube Player */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000'
          }}>
            <iframe
              src={selectedSource.url}
              title={movie.title}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div style={{
        height: '70vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.4) blur(3px)'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
          }} />
        )}
        
        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: '50px',
          right: '50px',
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}>
          {/* Poster */}
          {posterUrl && (
            <div style={{
              width: '250px',
              aspectRatio: '2/3',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.1)',
              flexShrink: 0
            }}>
              <img
                src={posterUrl}
                alt={movie.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Movie Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '3.5rem',
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {movie.title}
            </h1>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '15px',
              color: '#d1d5db',
              flexWrap: 'wrap'
            }}>
              <span>{movie.release_date?.split('-')[0]}</span>
              <span>•</span>
              <span>{formatRuntime(movie.runtime)}</span>
              {movie.vote_average > 0 && (
                <>
                  <span>•</span>
                  <span style={{ color: '#fbbf24' }}>
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                </>
              )}
            </div>

            {/* Genres */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              {movie.genres?.map(genre => (
                <span key={genre.id} style={{
                  padding: '5px 15px',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid #ef4444',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  color: '#ef4444'
                }}>
                  {genre.name}
                </span>
              ))}
            </div>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#e5e7eb',
              maxWidth: '800px',
              marginBottom: '25px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {movie.overview}
            </p>

            {/* Watch Buttons */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {videoSources.map((source, index) => (
                source.type === 'youtube' ? (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedSource(source);
                      setShowPlayer(true);
                    }}
                    style={{
                      padding: '14px 30px',
                      background: index === 0 ? '#ef4444' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  >
                    ▶ Watch {index === 0 ? 'Now' : `on ${source.source}`}
                  </button>
                ) : (
                  <a
                    key={index}
                    href={source.url}
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
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    🔍 {source.description || `Search on ${source.source}`}
                  </a>
                )
              ))}
              
              <Link
                to="/tmdb-movies"
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
                ← Back
              </Link>
            </div>

            {/* Availability Note */}
            {videoSources.length === 0 && (
              <p style={{ marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>
                This movie may not be available for free streaming. Try searching on YouTube or other platforms.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rest of the component (tabs, cast, similar) - same as before */}
      {/* ... */}
      
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

export default TMDbMovieDetail;
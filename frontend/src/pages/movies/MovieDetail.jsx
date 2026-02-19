import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdb } from '../../services/tmdb';
import { publicDomain } from '../../services/publicDomain';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoSources, setVideoSources] = useState([]);
  const [currentSource, setCurrentSource] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    loadMovieData();
  }, [id]);

  useEffect(() => {
    if (movie) {
      const sources = publicDomain.getSources(movie.id, movie.title);
      setVideoSources(sources);
    }
  }, [movie]);

  const loadMovieData = async () => {
    setLoading(true);
    try {
      const data = await tmdb.getMovieDetails(id);
      if (data) {
        setMovie(data);
        setCredits(data.credits);
        
        const videoData = data.videos?.results || [];
        const trailers = videoData.filter(v => 
          v.type === 'Trailer' || v.type === 'Teaser'
        );
        setVideos(trailers);
        
        if (trailers.length > 0) {
          setSelectedVideo(trailers[0]);
        }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getYouTubeUrl = (videoKey) => {
    return `https://www.youtube.com/embed/${videoKey}`;
  };

  // Fallback images for when TMDB images fail to load
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
    e.target.onerror = null;
  };

  const handleBackdropError = (e) => {
    e.target.src = 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
    e.target.onerror = null;
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
        <Link to="/movies" style={{
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
    ? tmdb.getImageUrl(movie.backdrop_path, 'original')
    : null;

  const posterUrl = movie.poster_path 
    ? tmdb.getImageUrl(movie.poster_path, 'w500')
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
      
      {/* Video Player Modal */}
      {showVideo && videoSources[currentSource] && (
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
          {/* Video Player Header */}
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
                Source: {videoSources[currentSource].source}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {videoSources.map((source, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSource(index)}
                  style={{
                    padding: '5px 15px',
                    background: currentSource === index ? '#ef4444' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Source {index + 1}
                </button>
              ))}
              <button
                onClick={() => setShowVideo(false)}
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

          {/* Video Player */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000'
          }}>
            {videoSources[currentSource].url.includes('archive.org') ? (
              <iframe
                src={videoSources[currentSource].url.replace('/details/', '/embed/')}
                width="100%"
                height="100%"
                frameBorder="0"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allowFullScreen
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : videoSources[currentSource].url.includes('vidsrc') || 
               videoSources[currentSource].url.includes('embed') ? (
              <iframe
                src={videoSources[currentSource].url}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                referrerPolicy="no-referrer"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#888' }}>
                <p>Click below to search for this movie on Internet Archive</p>
                <a
                  href={videoSources[currentSource].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '15px',
                    padding: '12px 30px',
                    background: '#ef4444',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px'
                  }}
                >
                  Search on Internet Archive
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && selectedVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowTrailer(false)}>
          <div style={{
            width: '100%',
            maxWidth: '1000px',
            aspectRatio: '16/9',
            background: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={e => e.stopPropagation()}>
            <iframe
              src={getYouTubeUrl(selectedVideo.key)}
              title={selectedVideo.name}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
            <button
              onClick={() => setShowTrailer(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Section with Backdrop */}
      <div style={{
        height: '70vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            onError={handleBackdropError}
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
                onError={handleImageError}
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
                    ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count?.toLocaleString()} votes)
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

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowVideo(true)}
                style={{
                  padding: '14px 30px',
                  background: '#ef4444',
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
                ▶ Watch Movie
              </button>
              
              {videos.length > 0 && (
                <button
                  onClick={() => setShowTrailer(true)}
                  style={{
                    padding: '14px 30px',
                    background: 'transparent',
                    color: 'white',
                    border: '2px solid #ef4444',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  Watch Trailer
                </button>
              )}
              
              <Link
                to="/movies"
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

            <p style={{ marginTop: '10px', color: '#888', fontSize: '0.9rem' }}>
              Multiple video sources available. Click the source buttons if one doesn't work.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '30px',
          borderBottom: '1px solid #272727',
          marginBottom: '30px',
          overflowX: 'auto',
          paddingBottom: '5px'
        }}>
          {['about', 'cast', 'similar'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #ef4444' : '2px solid transparent',
                color: activeTab === tab ? 'white' : '#9ca3af',
                fontSize: '1.1rem',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'color 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Synopsis</h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#d1d5db',
              marginBottom: '30px'
            }}>
              {movie.overview || 'No synopsis available.'}
            </p>

            {movie.tagline && (
              <div style={{
                padding: '20px',
                background: '#1f1f1f',
                borderRadius: '12px',
                borderLeft: '4px solid #ef4444',
                fontStyle: 'italic',
                color: '#e5e7eb',
                fontSize: '1.1rem'
              }}>
                "{movie.tagline}"
              </div>
            )}
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === 'cast' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Cast & Crew</h2>
            
            {director && (
              <div style={{
                background: '#1f1f1f',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '30px'
              }}>
                <h3 style={{ color: '#9ca3af', marginBottom: '10px' }}>Director</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {director.profile_path ? (
                    <img
                      src={tmdb.getImageUrl(director.profile_path, 'w185')}
                      alt={director.name}
                      onError={handleImageError}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}>
                      {director.name?.[0] || 'D'}
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{director.name}</h4>
                    <p style={{ color: '#888' }}>{director.job}</p>
                  </div>
                </div>
              </div>
            )}

            {cast.length > 0 && (
              <div>
                <h3 style={{ color: '#9ca3af', marginBottom: '20px' }}>Cast</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '20px'
                }}>
                  {cast.map(person => (
                    <div key={person.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      background: '#1f1f1f',
                      borderRadius: '10px',
                      padding: '10px'
                    }}>
                      {person.profile_path ? (
                        <img
                          src={tmdb.getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          onError={handleImageError}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold'
                        }}>
                          {person.name?.[0] || '?'}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: '3px' }}>{person.name}</h4>
                        <p style={{ color: '#888', fontSize: '0.85rem' }}>{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Similar Movies Tab */}
        {activeTab === 'similar' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>You May Also Like</h2>
            
            {similar.length === 0 ? (
              <p style={{ color: '#888' }}>No similar movies found.</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '20px'
              }}>
                {similar.slice(0, 10).map(movie => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <div style={{
                      background: '#1f1f1f',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transition: 'transform 0.2s'
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
                            src={tmdb.getImageUrl(movie.poster_path, 'w342')}
                            alt={movie.title}
                            onError={handleImageError}
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
                            fontSize: '2rem',
                            color: '#666'
                          }}>
                            🎬
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: '10px' }}>
                        <h4 style={{
                          fontSize: '0.9rem',
                          margin: '0 0 5px 0',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {movie.title}
                        </h4>
                        <p style={{ color: '#888', fontSize: '0.8rem' }}>
                          {movie.release_date?.split('-')[0] || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default MovieDetail;
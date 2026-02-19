import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    loadMovieData();
  }, [id, user]);

  const loadMovieData = async () => {
    setLoading(true);
    try {
      // Load movie details
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (movieError) throw movieError;
      setMovie(movieData);

      // Increment views
      await supabase
        .from('movies')
        .update({ views: (movieData.views || 0) + 1 })
        .eq('id', id);

      // Track view
      await supabase
        .from('movie_views')
        .insert([{
          movie_id: id,
          user_id: user?.id || null,
          ip_address: null,
          viewed_at: new Date()
        }]);

      // Load recommendations
      if (movieData?.genre?.length > 0) {
        const { data: recData } = await supabase
          .from('movies')
          .select('*')
          .contains('genre', [movieData.genre[0]])
          .neq('id', id)
          .order('views', { ascending: false })
          .limit(10);

        setRecommendations(recData || []);
      }

      // Load reviews
      const { data: reviewData } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('movie_id', id)
        .order('created_at', { ascending: false });

      setReviews(reviewData || []);

      // Check if in user's watchlist
      if (user) {
        const { data: watchData } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('movie_id', id)
          .maybeSingle();

        setInWatchlist(!!watchData);

        // Check if user has rated
        const { data: userReview } = await supabase
          .from('reviews')
          .select('rating, review_text')
          .eq('user_id', user.id)
          .eq('movie_id', id)
          .maybeSingle();

        if (userReview) {
          setUserRating(userReview.rating);
          setReviewText(userReview.review_text || '');
        }
      }

    } catch (error) {
      console.error('Error loading movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (inWatchlist) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', id);
        setInWatchlist(false);
      } else {
        await supabase
          .from('watchlist')
          .insert([{
            user_id: user.id,
            movie_id: id,
            added_at: new Date()
          }]);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error('Watchlist error:', error);
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (userRating > 0) {
        await supabase
          .from('reviews')
          .update({ rating, updated_at: new Date() })
          .eq('user_id', user.id)
          .eq('movie_id', id);
      } else {
        await supabase
          .from('reviews')
          .insert([{
            user_id: user.id,
            movie_id: id,
            rating,
            review_text: reviewText || null,
            created_at: new Date()
          }]);
      }
      setUserRating(rating);
      loadMovieData(); // Reload to show new review
    } catch (error) {
      console.error('Rating error:', error);
    }
  };

  const handleReviewSubmit = async () => {
    if (!user || !reviewText.trim()) return;

    try {
      if (userRating > 0) {
        await supabase
          .from('reviews')
          .update({ 
            review_text: reviewText,
            updated_at: new Date() 
          })
          .eq('user_id', user.id)
          .eq('movie_id', id);
      } else {
        await supabase
          .from('reviews')
          .insert([{
            user_id: user.id,
            movie_id: id,
            rating: null,
            review_text: reviewText,
            created_at: new Date()
          }]);
      }
      setReviewText('');
      loadMovieData();
    } catch (error) {
      console.error('Review error:', error);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* Hero Section with Backdrop */}
      <div style={{
        height: '70vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
          src={movie.backdrop_url || movie.thumbnail_url}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.3) blur(5px)'
          }}
        />
        
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
          <div style={{
            width: '250px',
            aspectRatio: '2/3',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.1)'
          }}>
            <img
              src={movie.poster_url || movie.thumbnail_url}
              alt={movie.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Movie Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{movie.title}</h1>
            
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '20px',
              color: '#d1d5db',
              flexWrap: 'wrap'
            }}>
              <span>{movie.release_year}</span>
              <span>•</span>
              <span>{movie.rating}</span>
              <span>•</span>
              <span>{formatDuration(movie.duration)}</span>
              {movie.imdb_rating && (
                <>
                  <span>•</span>
                  <span style={{ color: '#fbbf24' }}>⭐ {movie.imdb_rating}/10</span>
                </>
              )}
            </div>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#e5e7eb',
              maxWidth: '800px',
              marginBottom: '20px'
            }}>
              {movie.description}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowTrailer(true)}
                style={{
                  padding: '14px 30px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              >
                ▶ Watch Trailer
              </button>

              <button
                onClick={handleWatchlist}
                style={{
                  padding: '14px 30px',
                  background: inWatchlist ? '#374151' : 'transparent',
                  color: 'white',
                  border: inWatchlist ? 'none' : '2px solid #ef4444',
                  borderRadius: '30px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setShowTrailer(false)}
        >
          <div style={{
            width: '80%',
            maxWidth: '1000px',
            aspectRatio: '16/9',
            background: '#000',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
          onClick={e => e.stopPropagation()}>
            {movie.trailer_url ? (
              <iframe
                src={movie.trailer_url}
                title="Trailer"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888'
              }}>
                Trailer not available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '30px',
          borderBottom: '1px solid #272727',
          marginBottom: '30px'
        }}>
          {['about', 'cast', 'reviews', 'details'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #ef4444' : '2px solid transparent',
                color: activeTab === tab ? 'white' : '#9ca3af',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Synopsis</h2>
            <p style={{ lineHeight: '1.8', color: '#d1d5db', marginBottom: '30px' }}>
              {movie.description}
            </p>

            {/* Rating Section */}
            {user && (
              <div style={{
                background: '#1f1f1f',
                borderRadius: '12px',
                padding: '25px',
                marginBottom: '30px'
              }}>
                <h3 style={{ marginBottom: '15px' }}>Rate this movie</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(r => (
                    <button
                      key={r}
                      onClick={() => handleRating(r)}
                      style={{
                        width: '40px',
                        height: '40px',
                        background: userRating >= r ? '#fbbf24' : '#2d2d2d',
                        color: userRating >= r ? 'black' : 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Write a review (optional)"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: '#2d2d2d',
                    border: '1px solid #3d3d3d',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    marginBottom: '15px'
                  }}
                />

                <button
                  onClick={handleReviewSubmit}
                  style={{
                    padding: '12px 25px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === 'cast' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Cast & Crew</h2>
            
            {movie.director && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#9ca3af', marginBottom: '5px' }}>Director</h3>
                <p style={{ fontSize: '1.1rem' }}>{movie.director}</p>
              </div>
            )}

            {movie.cast_members?.length > 0 && (
              <div>
                <h3 style={{ color: '#9ca3af', marginBottom: '15px' }}>Cast</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  {movie.cast_members.map((actor, index) => (
                    <div key={index} style={{
                      padding: '10px',
                      background: '#1f1f1f',
                      borderRadius: '5px'
                    }}>
                      {actor}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
              Reviews ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p style={{ color: '#888' }}>No reviews yet. Be the first to review!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{
                    background: '#1f1f1f',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {review.profiles?.full_name?.[0] || 'U'}
                        </div>
                        <div>
                          <strong>{review.profiles?.full_name || 'Anonymous'}</strong>
                          <p style={{ color: '#888', fontSize: '0.8rem' }}>
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {review.rating && (
                        <div style={{
                          padding: '5px 15px',
                          background: '#fbbf24',
                          color: 'black',
                          borderRadius: '20px',
                          fontWeight: 'bold'
                        }}>
                          {review.rating}/10
                        </div>
                      )}
                    </div>
                    {review.review_text && (
                      <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                        {review.review_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div style={{
            background: '#1f1f1f',
            borderRadius: '12px',
            padding: '30px'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Movie Details</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {movie.release_date && (
                <div>
                  <p style={{ color: '#9ca3af', marginBottom: '5px' }}>Release Date</p>
                  <p>{formatDate(movie.release_date)}</p>
                </div>
              )}

              {movie.country?.length > 0 && (
                <div>
                  <p style={{ color: '#9ca3af', marginBottom: '5px' }}>Country</p>
                  <p>{movie.country.join(', ')}</p>
                </div>
              )}

              {movie.language?.length > 0 && (
                <div>
                  <p style={{ color: '#9ca3af', marginBottom: '5px' }}>Language</p>
                  <p>{movie.language.join(', ')}</p>
                </div>
              )}

              {movie.budget > 0 && (
                <div>
                  <p style={{ color: '#9ca3af', marginBottom: '5px' }}>Budget</p>
                  <p>${formatNumber(movie.budget)}</p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <p style={{ color: '#9ca3af', marginBottom: '5px' }}>Revenue</p>
                  <p>${formatNumber(movie.revenue)}</p>
                </div>
              )}

              <div>
                <p style={{ color: '#9ca3af', marginBottom: '5px' }}>Views</p>
                <p>{formatNumber(movie.views)}</p>
              </div>

              {movie.imdb_votes > 0 && (
                <div>
                  <p style={{ color: '#9ca3af', marginBottom: '5px' }}>IMDB Votes</p>
                  <p>{formatNumber(movie.imdb_votes)}</p>
                </div>
              )}

              {movie.metacritic_rating > 0 && (
                <div>
                  <p style={{ color: '#9ca3af', marginBottom: '5px' }}>Metacritic</p>
                  <p>{movie.metacritic_rating}</p>
                </div>
              )}
            </div>

            {movie.awards?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#9ca3af', marginBottom: '10px' }}>Awards</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {movie.awards.map((award, index) => (
                    <li key={index} style={{
                      padding: '10px',
                      background: '#2d2d2d',
                      borderRadius: '5px',
                      marginBottom: '5px'
                    }}>
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>You May Also Like</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '20px'
          }}>
            {recommendations.map(rec => (
              <Link
                key={rec.id}
                to={`/movie/${rec.id}`}
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
                  <img
                    src={rec.thumbnail_url}
                    alt={rec.title}
                    style={{
                      width: '100%',
                      aspectRatio: '2/3',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '10px' }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      margin: '0 0 5px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {rec.title}
                    </h4>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>
                      {rec.release_year}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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

export default MovieDetail;
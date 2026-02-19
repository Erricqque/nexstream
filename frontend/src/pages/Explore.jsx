import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Explore = () => {
  const [movies, setMovies] = useState([]);
  const [music, setMusic] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const [moviesRes, musicRes, gamesRes] = await Promise.all([
        supabase.from('movies').select('*').limit(8),
        supabase.from('music').select('*').limit(8),
        supabase.from('games').select('*').limit(8)
      ]);

      setMovies(moviesRes.data || []);
      setMusic(musicRes.data || []);
      setGames(gamesRes.data || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
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
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
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
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Explore</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          Discover amazing content from our community
        </p>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '40px',
          borderBottom: '1px solid #272727',
          paddingBottom: '15px'
        }}>
          {['all', 'movies', 'music', 'games'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '10px 25px',
                background: activeCategory === cat ? '#ef4444' : 'transparent',
                color: activeCategory === cat ? 'white' : '#888',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: activeCategory === cat ? 'bold' : 'normal',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Movies Section */}
        {(activeCategory === 'all' || activeCategory === 'movies') && movies.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>🎬 Movies</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {movies.map(movie => (
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
                    <img
                      src={movie.thumbnail_url}
                      alt={movie.title}
                      style={{
                        width: '100%',
                        aspectRatio: '2/3',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '10px' }}>
                      <h3 style={{ fontSize: '0.9rem', margin: '0 0 5px 0' }}>{movie.title}</h3>
                      <p style={{ color: '#888', fontSize: '0.8rem' }}>{movie.release_year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Music Section */}
        {(activeCategory === 'all' || activeCategory === 'music') && music.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>🎵 Music</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              {music.map(song => (
                <div
                  key={song.id}
                  style={{
                    background: '#1f1f1f',
                    borderRadius: '10px',
                    padding: '15px',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{song.title}</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>{song.artist || 'Unknown Artist'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Games Section */}
        {(activeCategory === 'all' || activeCategory === 'games') && games.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>🎮 Games</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {games.map(game => (
                <div
                  key={game.id}
                  style={{
                    background: '#1f1f1f',
                    borderRadius: '10px',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎮</div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{game.title}</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>{game.genre || 'Various'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {movies.length === 0 && music.length === 0 && games.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#888' }}>No content available yet</p>
          </div>
        )}
      </div>

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

export default Explore;
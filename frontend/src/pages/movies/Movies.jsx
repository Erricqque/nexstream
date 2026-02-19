import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdb } from '../../services/tmdb';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    const data = await tmdb.getPopular();
    setMovies(data.results || []);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search) {
      loadMovies();
      return;
    }
    setLoading(true);
    const data = await tmdb.searchMovies(search);
    setMovies(data.results || []);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: 'white', padding: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🎬 Movies</h1>
      
      {/* Search */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: '12px',
            background: '#1f1f1f',
            border: '1px solid #333',
            borderRadius: '5px',
            color: 'white'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '12px 30px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #ef4444',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {movies.map(movie => (
            <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#1f1f1f',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                
                <img
                  src={tmdb.getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  onError={tmdb.handleImageError}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                
                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{movie.title}</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>
                    {movie.release_date?.split('-')[0] || 'N/A'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Movies;
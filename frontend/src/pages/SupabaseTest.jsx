import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('movies')
        .select('count', { count: 'exact', head: true });

      if (error) throw error;

      // Try to fetch some movies
      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*')
        .limit(5);

      if (moviesError) throw moviesError;

      setMovies(moviesData || []);
      setStatus('✅ Connected to Supabase successfully!');
    } catch (err) {
      console.error('Supabase error:', err);
      setError(err.message);
      setStatus('❌ Failed to connect to Supabase');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Supabase Connection Test</h1>
      
      {/* Status */}
      <div style={{
        padding: '20px',
        background: error ? '#2d1a1a' : '#1a2d1a',
        border: error ? '1px solid #ef4444' : '1px solid #10b981',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <p style={{ 
          color: error ? '#ef4444' : '#10b981',
          fontSize: '1.2rem',
          margin: 0
        }}>
          {status}
        </p>
      </div>

      {/* Environment Variables */}
      <div style={{
        background: '#1f1f1f',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Environment Variables</h2>
        <p>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
      </div>

      {/* Movies Data */}
      <div style={{
        background: '#1f1f1f',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Movies from Database ({movies.length})</h2>
        {movies.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {movies.map(movie => (
              <div key={movie.id} style={{
                padding: '15px',
                background: '#2d2d2d',
                borderRadius: '5px'
              }}>
                <strong>{movie.title}</strong>
                {movie.release_year && <span style={{ color: '#888', marginLeft: '10px' }}>({movie.release_year})</span>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#888' }}>No movies found in database</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#2d1a1a',
          border: '1px solid #ef4444',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Error Details:</h3>
          <p style={{ color: '#ef4444' }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;
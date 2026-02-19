import React, { useState, useEffect } from 'react';
import { musicService } from '../../services/musicService';

const Music = () => {
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [search, setSearch] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    setTracks(musicService.getAll());
    setGenres(musicService.getGenres());
  }, []);

  useEffect(() => {
    if (selectedGenre === 'all') {
      setTracks(musicService.getAll());
    } else {
      setTracks(musicService.getByGenre(selectedGenre));
    }
  }, [selectedGenre]);

  const handleSearch = () => {
    if (!search) {
      setTracks(musicService.getAll());
    } else {
      setTracks(musicService.search(search));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: 'white', padding: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🎵 Free Music</h1>

      {/* Controls */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Search music..."
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

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{
            padding: '12px',
            background: '#1f1f1f',
            border: '1px solid #333',
            borderRadius: '5px',
            color: 'white',
            width: '200px'
          }}
        >
          {genres.map(g => (
            <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Music Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {tracks.map(track => (
          <div
            key={track.id}
            style={{
              background: '#1f1f1f',
              borderRadius: '10px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img
                src={track.thumbnail}
                alt={track.title}
                style={{ width: '60px', height: '60px', borderRadius: '5px' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{track.title}</h3>
                <p style={{ margin: 0, color: '#888' }}>{track.artist}</p>
              </div>
            </div>

            <audio
              controls
              src={track.audioUrl}
              style={{ width: '100%', marginTop: '15px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
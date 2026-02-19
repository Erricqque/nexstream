import React, { useState, useEffect } from 'react';
import { musicService } from '../services/musicService';

const Music = () => {
  const [tracks, setTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [playerHtml, setPlayerHtml] = useState(null);

  useEffect(() => {
    loadMusic();
    loadGenres();
  }, []);

  useEffect(() => {
    searchMusic();
  }, [searchQuery, selectedGenre]);

  const loadMusic = () => {
    setTracks(musicService.musicDatabase);
  };

  const loadGenres = () => {
    setGenres(['all', ...musicService.getGenres()]);
  };

  const searchMusic = async () => {
    setLoading(true);
    const results = await musicService.searchMusic(
      searchQuery, 
      selectedGenre !== 'all' ? selectedGenre : null
    );
    setTracks(results);
    setLoading(false);
  };

  const playTrack = (track) => {
    setCurrentlyPlaying(track);
    const embed = musicService.getEmbedHtml(track);
    setPlayerHtml(embed);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        background: 'linear-gradient(135deg, #ef4444, #8b5cf6)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🎵 Free Music</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Thousands of free tracks from SoundCloud, Internet Archive, and Creative Commons
        </p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Search and Filter */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Search songs, artists, or genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '12px 20px',
              background: '#1f1f1f',
              border: '1px solid #333',
              borderRadius: '30px',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{
              padding: '12px 20px',
              background: '#1f1f1f',
              border: '1px solid #333',
              borderRadius: '30px',
              color: 'white',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Now Playing */}
        {currentlyPlaying && playerHtml && (
          <div style={{
            marginBottom: '30px',
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '20px',
            border: '2px solid #ef4444'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>🎧 Now Playing: {currentlyPlaying.title}</h3>
              <button
                onClick={() => {
                  setCurrentlyPlaying(null);
                  setPlayerHtml(null);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
            
            {/* Render the embed HTML */}
            <div dangerouslySetInnerHTML={{ __html: playerHtml.html }} />
          </div>
        )}

        {/* Music Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {tracks.map(track => (
              <div
                key={track.id}
                style={{
                  background: '#1f1f1f',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => playTrack(track)}
              >
                <div style={{ display: 'flex', padding: '15px', gap: '15px' }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#2d2d2d',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      margin: '0 0 5px 0',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}>
                      {track.title}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#888' }}>
                      {track.artist}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '12px'
                      }}>
                        {track.genre}
                      </span>
                      <span style={{ color: '#888' }}>
                        {formatDuration(track.duration)}
                      </span>
                      <span style={{
                        background: '#333',
                        color: '#888',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {track.platform}
                      </span>
                    </div>
                  </div>

                  {/* Play Icon */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    alignSelf: 'center'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>▶</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {tracks.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#888', fontSize: '1.2rem' }}>No tracks found</p>
          </div>
        )}

        {/* Music Sources Info */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#1f1f1f',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: '#888'
        }}>
          <h4 style={{ color: 'white', marginBottom: '10px' }}>🎵 Music Sources</h4>
          <p>All music is from free, legal sources including:</p>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li>SoundCloud - Creative Commons tracks</li>
            <li>Internet Archive - Public domain music</li>
            <li>Free Music Archive - Royalty-free music</li>
            <li>Freesound.org - Sound effects and loops</li>
            <li>YouTube Audio Library - Free music</li>
          </ul>
        </div>
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

export default Music;
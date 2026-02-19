import React, { useState, useEffect } from 'react';
import { gamesService } from './gamesService';
import { motion, AnimatePresence } from 'framer-motion';

const Games = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [gameError, setGameError] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);

  useEffect(() => {
    try {
      console.log('Loading Nexstream games...');
      
      const cats = gamesService.getCategories();
      setCategories(cats);
      
      const featured = gamesService.getFeatured();
      setFeaturedGames(featured);
      
      const allGames = gamesService.getAll();
      setGames(allGames);
      
      console.log(`✅ Nexstream loaded: ${allGames.length} games`);
      setLoading(false);
    } catch (error) {
      console.error('Error loading games:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      let filteredGames = [];
      
      if (searchQuery) {
        filteredGames = gamesService.searchGames(searchQuery);
      } else if (selectedCategory === 'all') {
        filteredGames = gamesService.getAll();
      } else if (selectedCategory === 'multiplayer') {
        filteredGames = gamesService.getMultiplayer();
      } else {
        filteredGames = gamesService.getByCategory(selectedCategory);
      }
      
      setGames(filteredGames);
    } catch (error) {
      console.error('Error filtering games:', error);
    }
  }, [selectedCategory, searchQuery]);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setGameError(false);
    setGameLoading(true);
  };

  const closeGame = () => {
    setSelectedGame(null);
    setGameError(false);
    setGameLoading(false);
  };

  const handleIframeError = () => {
    setGameError(true);
    setGameLoading(false);
  };

  const handleIframeLoad = () => {
    setGameLoading(false);
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
          border: '4px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 20px'
    }}>
      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
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
            onClick={closeGame}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              style={{
                width: '100%',
                maxWidth: '1200px',
                background: '#1f1f1f',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Game Header */}
              <div style={{
                padding: '20px 30px',
                background: '#2d2d2d',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #3d3d3d'
              }}>
                <div>
                  <h2 style={{ margin: '0 0 5px 0' }}>{selectedGame.title}</h2>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                    {selectedGame.description}
                  </p>
                </div>
                <button
                  onClick={closeGame}
                  style={{
                    background: '#3d3d3d',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Game Iframe Area */}
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                background: '#000'
              }}>
                {gameLoading && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#1a1a1a',
                    zIndex: 2
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
                )}

                {gameError && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#1a1a1a',
                    zIndex: 2,
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>😕</div>
                    <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Game Cannot Be Embedded</h3>
                    <p style={{ color: '#888', marginBottom: '20px', maxWidth: '500px' }}>
                      {selectedGame.source === 'poki' ? 'Poki games cannot be embedded directly due to their security policy.' : 
                       'This game provider blocks embedding in iframes.'}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <a 
                        href={selectedGame.embedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          padding: '12px 24px',
                          background: '#ef4444',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: 'bold'
                        }}
                      >
                        Play on {selectedGame.source === 'poki' ? 'Poki.com' : 'Original Site'} ↗
                      </a>
                      <button
                        onClick={closeGame}
                        style={{
                          padding: '12px 24px',
                          background: '#3d3d3d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Try Another Game
                      </button>
                    </div>
                  </div>
                )}

                {!gameError && (
                  <iframe
                    src={selectedGame.embedUrl}
                    title={selectedGame.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                    onError={handleIframeError}
                    onLoad={handleIframeLoad}
                  />
                )}
              </div>

              {/* Game Info Footer */}
              <div style={{
                padding: '20px 30px',
                background: '#2d2d2d',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{
                    padding: '6px 12px',
                    background: '#3d3d3d',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: '#ef4444',
                    marginRight: '10px'
                  }}>
                    {selectedGame.category}
                  </span>
                  {selectedGame.multiplayer && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#3d3d3d',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      color: '#10b981'
                    }}>
                      🎮 Multiplayer
                    </span>
                  )}
                  <span style={{
                    padding: '6px 12px',
                    background: '#3d3d3d',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: '#888',
                    marginLeft: '10px'
                  }}>
                    {selectedGame.source}
                  </span>
                </div>
                <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>
                  {selectedGame.controls || 'Use mouse/keyboard to play'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🎮 Nexstream Games</h1>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '1.1rem' }}>
          {games.length}+ free games ready to play on Nexstream
        </p>

        {/* Featured Games Carousel */}
        {!searchQuery && selectedCategory === 'all' && featuredGames.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ marginBottom: '20px' }}>🔥 Featured on Nexstream</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {featuredGames.map(game => (
                <motion.div
                  key={game.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => handleGameClick(game)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #3b82f6)',
                    borderRadius: '12px',
                    padding: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <div style={{
                    background: '#1f1f1f',
                    borderRadius: '10px',
                    padding: '20px',
                    height: '100%'
                  }}>
                    <div style={{
                      fontSize: '4rem',
                      textAlign: 'center',
                      marginBottom: '15px'
                    }}>
                      {game.thumbnail}
                    </div>
                    <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>{game.title}</h3>
                    <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
                      {game.description.substring(0, 60)}...
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '15px'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        background: '#2d2d2d',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        ⭐ {(game.popularity / 1000000).toFixed(1)}M plays
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div style={{
          background: '#1f1f1f',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search Nexstream games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 2,
                minWidth: '250px',
                padding: '14px 20px',
                background: '#2d2d2d',
                border: '1px solid #3d3d3d',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '14px 20px',
                background: '#2d2d2d',
                border: '1px solid #3d3d3d',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Games Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {games.map(game => (
            <motion.div
              key={game.id}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => handleGameClick(game)}
              style={{
                background: '#1f1f1f',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid #2d2d2d',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, #2d2d2d, #1f1f1f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                position: 'relative'
              }}>
                {game.thumbnail}
                {game.multiplayer && (
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#10b981',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    MULTIPLAYER
                  </span>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{game.title}</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
                  {game.description.substring(0, 60)}...
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    background: '#2d2d2d',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#ef4444'
                  }}>
                    {game.category}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>
                    ⭐ {(game.popularity / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nexstream Stats */}
        <div style={{
          marginTop: '60px',
          padding: '30px',
          background: '#1f1f1f',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
              {gamesService.getStats().totalGames}+
            </div>
            <div style={{ color: '#888' }}>Free Games on Nexstream</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {gamesService.getStats().multiplayerGames}
            </div>
            <div style={{ color: '#888' }}>Multiplayer Games</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {(gamesService.getStats().totalPopularity / 1000000).toFixed(1)}M+
            </div>
            <div style={{ color: '#888' }}>Monthly Players</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    supabase.from('games').select('*').then(({ data }) => setGames(data || []));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: 'white', padding: '20px' }}>
      <h1>Free Games</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {games.map(game => (
          <div key={game.id} style={{ background: '#1f1f1f', padding: '15px', borderRadius: '5px' }}>
            <h3>{game.title}</h3>
            <p>{game.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
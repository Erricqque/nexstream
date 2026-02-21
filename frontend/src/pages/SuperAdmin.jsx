import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      await loadProfile(user.id);
      await loadVideos(user.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const loadVideos = async (userId) => {
    const { data } = await supabase
      .from('content')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setVideos(data || []);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white'
    }}>
      <div style={{
        height: '150px',
        background: 'linear-gradient(135deg, #ff3366, #4facfe)'
      }} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          marginTop: '-50px'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff3366, #4facfe)',
            border: '4px solid #0f0f0f'
          }} />
          <div>
            <h1>{profile?.username || user?.email?.split('@')[0]}</h1>
            <p style={{ color: '#888' }}>{videos.length} videos</p>
          </div>
        </div>

        <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Your Videos</h2>
        
        {videos.length === 0 ? (
          <p style={{ color: '#888' }}>No videos yet</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {videos.map(video => (
              <div key={video.id} style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: '15px'
              }}>
                <div style={{
                  height: '140px',
                  background: '#2a2a2a',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }} />
                <h3>{video.title}</h3>
                <p style={{ color: '#888' }}>{video.views_count || 0} views</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
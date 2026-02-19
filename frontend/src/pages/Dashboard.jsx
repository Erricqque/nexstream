import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '2rem' }}>
            Welcome, {user?.user_metadata?.full_name || user?.email}
          </h1>
          <button
            onClick={signOut}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '30px',
              background: '#1f1f1f',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3>Profile</h3>
            </div>
          </Link>

          <Link to="/settings" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '30px',
              background: '#1f1f1f',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3>Settings</h3>
            </div>
          </Link>

          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '30px',
              background: '#1f1f1f',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3>Upload</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; // THIS MUST BE HERE
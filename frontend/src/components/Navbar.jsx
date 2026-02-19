import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#0f0f0f',
      borderBottom: '1px solid #1f1f1f',
      padding: '15px 30px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            color: '#ef4444',
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 'bold',
            letterSpacing: '-0.5px'
          }}>
            NexStream
          </h1>
        </Link>

        {/* Navigation Links */}
        <div style={{ 
          display: 'flex', 
          gap: '25px', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/movies" style={{ 
            color: '#888', 
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontSize: '1rem'
          }}
          onMouseEnter={e => e.target.style.color = '#ef4444'}
          onMouseLeave={e => e.target.style.color = '#888'}>
            Movies
          </Link>
          
          <Link to="/music" style={{ 
            color: '#888', 
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontSize: '1rem'
          }}
          onMouseEnter={e => e.target.style.color = '#ef4444'}
          onMouseLeave={e => e.target.style.color = '#888'}>
            Music
          </Link>
          
          <Link to="/games" style={{ 
            color: '#888', 
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontSize: '1rem'
          }}
          onMouseEnter={e => e.target.style.color = '#ef4444'}
          onMouseLeave={e => e.target.style.color = '#888'}>
            Games
          </Link>
          
          <Link to="/explore" style={{ 
            color: '#888', 
            textDecoration: 'none',
            transition: 'color 0.2s',
            fontSize: '1rem'
          }}
          onMouseEnter={e => e.target.style.color = '#ef4444'}
          onMouseLeave={e => e.target.style.color = '#888'}>
            Explore
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" style={{ 
                color: '#888', 
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontSize: '1rem'
              }}
              onMouseEnter={e => e.target.style.color = '#ef4444'}
              onMouseLeave={e => e.target.style.color = '#888'}>
                Dashboard
              </Link>
              
              <Link to="/channel" style={{ 
                color: '#888', 
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontSize: '1rem'
              }}
              onMouseEnter={e => e.target.style.color = '#ef4444'}
              onMouseLeave={e => e.target.style.color = '#888'}>
                My Channel
              </Link>
              
              <button
                onClick={handleSignOut}
                style={{
                  padding: '8px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#dc2626'}
                onMouseLeave={e => e.target.style.background = '#ef4444'}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ 
                color: '#888', 
                textDecoration: 'none',
                transition: 'color 0.2s',
                fontSize: '1rem'
              }}
              onMouseEnter={e => e.target.style.color = '#ef4444'}
              onMouseLeave={e => e.target.style.color = '#888'}>
                Login
              </Link>

<Link 
  to="/business" 
  style={{
    padding: '6px 14px',
    background: user?.business ? '#ef4444' : 'transparent',
    color: user?.business ? 'white' : '#888',
    textDecoration: 'none',
    borderRadius: '20px',
    fontSize: '0.9rem'
  }}
>
  💼 Business
</Link>
              
              <Link
                to="/register"
                style={{
                  padding: '8px 20px',
                  background: '#ef4444',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '20px',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#dc2626'}
                onMouseLeave={e => e.target.style.background = '#ef4444'}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

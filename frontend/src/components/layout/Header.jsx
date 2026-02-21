import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Browse', path: '/browse', icon: '🔍' },
    { label: 'Upload', path: '/upload', icon: '📤' },
    { label: 'Community', path: '/community', icon: '👥' },
    { label: 'Pricing', path: '/pricing', icon: '💰' }
  ];

  const userNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Content', path: '/dashboard?tab=videos', icon: '🎬' },
    { label: 'Analytics', path: '/dashboard?tab=analytics', icon: '📈' },
    { label: 'Earnings', path: '/dashboard?tab=earnings', icon: '💰' },
    { label: 'Settings', path: '/dashboard?tab=settings', icon: '⚙️' }
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isScrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF3366" />
                  <stop offset="1" stopColor="#4FACFE" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              NexStream
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: location.pathname === item.path ? '#FF3366' : 'white',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                opacity: location.pathname === item.path ? 1 : 0.8,
                transition: 'all 0.2s',
                padding: '0.5rem 0',
                borderBottom: location.pathname === item.path ? '2px solid #FF3366' : 'none'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.2s',
              padding: '0.5rem'
            }}
          >
            🔍
          </button>

          {/* User Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '30px',
                  padding: '6px 12px 6px 6px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: profile?.avatar_url 
                    ? `url(${profile.avatar_url}) center/cover`
                    : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  color: 'white'
                }}>
                  {!profile?.avatar_url && (profile?.username?.[0] || user.email?.[0] || 'U')}
                </div>
                <span style={{ fontSize: '0.9rem' }}>
                  {profile?.username || user.email?.split('@')[0] || 'User'}
                </span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>▼</span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '10px',
                      background: '#1a1a2a',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      minWidth: '200px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      overflow: 'hidden'
                    }}
                  >
                    {userNavItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 20px',
                          color: 'white',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          transition: 'background 0.2s',
                          borderBottom: '1px solid rgba(255,255,255,0.05)'
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,51,102,0.1)'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '12px 20px',
                        background: 'none',
                        border: 'none',
                        color: '#FF3366',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>🚪</span>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login">
                <button style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '30px',
                  padding: '8px 20px',
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}>
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button style={{
                  background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '8px 20px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Join Free
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#1a1a2a',
              padding: '2rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
          >
            <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for videos, creators, and more..."
                  style={{
                    flex: 1,
                    padding: '15px 20px',
                    background: '#2a2a3a',
                    border: 'none',
                    borderRadius: '30px',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  style={{
                    padding: '0 30px',
                    background: '#FF3366',
                    border: 'none',
                    borderRadius: '30px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              display: 'none',
              background: '#1a1a2a',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '1rem 2rem' }}>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'block',
                    padding: '1rem 0',
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
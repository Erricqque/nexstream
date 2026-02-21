import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { redirectHandler } from '../../utils/redirectHandler';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Clear any prefilled values on mount
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  // If already logged in, use redirect handler
  useEffect(() => {
    if (user) {
      redirectHandler.handlePostLogin(navigate);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message.includes('Invalid login')) {
        setError('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email before logging in');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
      setLoading(false);
    }
    // Redirect handled by useEffect
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    setLoading(true);
    // Store current redirect before social login
    const currentRedirect = localStorage.getItem('redirectAfterLogin');
    
    // Redirect will be handled by OAuth callback
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  // Clear inputs when component unmounts
  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            NexStream
          </h1>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '0.95rem' }}>
            Welcome back! Please enter your details
          </p>
        </div>

        {/* Error Message with Animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: '#fee2e2',
                border: '1px solid #ef4444',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
                color: '#b91c1c',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Redirect Message */}
        <AnimatePresence>
          {redirectHandler.getRedirect() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: '#e0f2fe',
                border: '1px solid #38bdf8',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
                color: '#0369a1',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>↪️</span>
              You'll be redirected after login
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea',
                pointerEvents: 'none'
              }}>
                ✉️
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  transition: 'all 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea',
                pointerEvents: 'none'
              }}>
                🔒
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 48px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  transition: 'all 0.2s',
                  outline: 'none',
                  boxSizing: 'border-box',
                  paddingRight: '50px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#667eea',
                  fontSize: '1.2rem',
                  padding: '4px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              color: '#666',
              fontSize: '0.95rem'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              Remember me
            </label>
            <Link 
              to="/forgot-password"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#764ba2'}
              onMouseLeave={(e) => e.target.style.color = '#667eea'}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 6px rgba(102, 126, 234, 0.2)',
              marginBottom: '20px'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Signing in...
              </span>
            ) : 'Sign In'}
          </motion.button>
        </form>

        {/* Social Login */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <span style={{
              background: 'white',
              padding: '0 15px',
              color: '#999',
              fontSize: '0.9rem'
            }}>
              Or continue with
            </span>
          </div>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: '#e2e8f0',
            zIndex: 0
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '24px'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem',
              transition: 'all 0.2s',
              opacity: loading ? 0.5 : 1
            }}
          >
            G
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
            style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem'
            }}
          >
            GH
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
            style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem'
            }}
          >
            FB
          </motion.button>
        </div>

        {/* Sign Up Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
            onMouseLeave={(e) => e.target.style.color = '#667eea'}
          >
            Sign up
          </Link>
        </p>

        {/* Loading Animation Style */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default Login;
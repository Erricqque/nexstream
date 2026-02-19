import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear any prefilled values on mount
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
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

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message || 'Invalid email or password');
      setLoading(false);
    }
    // Redirect handled by useEffect
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
          maxWidth: '420px',
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

        {/* Error Message */}
        {error && (
          <div style={{
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
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            {error}
          </div>
        )}

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
          <div style={{ marginBottom: '24px' }}>
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
                type="password"
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
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            marginBottom: '24px'
          }}>
            <Link 
              to="/forgot-password"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
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
              boxShadow: '0 4px 6px rgba(102, 126, 234, 0.2)'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

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
              fontWeight: '600'
            }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check auth status but DON'T auto-redirect immediately
  useEffect(() => {
    // If user is already logged in, we'll show a message instead of auto-redirecting
    setCheckingAuth(false);
  }, []);

  // Only redirect after successful signup, not on initial load
  useEffect(() => {
    if (user && !loading && !checkingAuth) {
      // Only redirect if we're not in the middle of signing up
      // and if we're not on the register page intentionally
      const isNewRegistration = sessionStorage.getItem('justRegistered');
      if (isNewRegistration) {
        sessionStorage.removeItem('justRegistered');
        navigate('/dashboard');
      }
    }
  }, [user, loading, checkingAuth, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.fullName
    );
    
    if (error) {
      setError(error.message || 'Failed to create account');
      setLoading(false);
    } else {
      // Set flag that we just registered
      sessionStorage.setItem('justRegistered', 'true');
      // Success message
      setError('');
      alert('Account created successfully! You can now log in.');
      // Redirect to login instead of dashboard
      navigate('/login');
    }
  };

  // If checking auth, show loading
  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid white',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

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
          maxWidth: '480px',
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
            Create your account
          </p>
        </div>

        {/* Already logged in message */}
        {user && (
          <div style={{
            background: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '24px',
            color: '#0d47a1',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
            You're already logged in. 
            <Link to="/dashboard" style={{ color: '#0d47a1', fontWeight: '600', marginLeft: '4px' }}>
              Go to Dashboard
            </Link>
          </div>
        )}

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
          {/* Full Name Field */}
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="fullName"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              Full Name
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
                👤
              </span>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
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
                name="email"
                value={formData.email}
                onChange={handleChange}
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
          <div style={{ marginBottom: '20px' }}>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="confirmPassword"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              Confirm Password
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
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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

          {/* Terms Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <input
              type="checkbox"
              id="terms"
              required
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: '#667eea'
              }}
            />
            <label htmlFor="terms" style={{ color: '#666', fontSize: '0.9rem' }}>
              I agree to the{' '}
              <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>Privacy Policy</a>
            </label>
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>

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

export default Register;
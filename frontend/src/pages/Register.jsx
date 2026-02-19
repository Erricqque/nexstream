import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s infinite ease-in-out'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 25s infinite ease-in-out reverse'
      }}></div>

      {/* Main Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10,
        animation: 'slideUp 0.6s ease'
      }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            NexStream
          </h1>
          <p style={{
            color: '#666',
            marginTop: '8px',
            fontSize: '0.95rem'
          }}>
            Join the creator economy platform
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '14px',
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '0.95rem'
            }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea'
              }}>👤</span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '0.95rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea'
              }}>✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '0.95rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea'
              }}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#667eea'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '0.95rem'
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#667eea'
              }}>🔒</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  transition: 'all 0.3s',
                  outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#667eea'
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Terms */}
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
            <label htmlFor="terms" style={{
              color: '#666',
              fontSize: '0.95rem'
            }}>
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
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s',
              boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={e => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Sign In
          </Link>
        </p>

        {/* Social Login */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#999',
            fontSize: '0.9rem',
            marginBottom: '20px',
            position: 'relative'
          }}>
            <span style={{
              background: 'white',
              padding: '0 10px',
              position: 'relative',
              zIndex: 1
            }}>or continue with</span>
            <span style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: '#e2e8f0',
              zIndex: 0
            }}></span>
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            {['google', 'facebook', 'apple', 'microsoft'].map(provider => (
              <button
                key={provider}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={e => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.2)';
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {provider === 'google' && 'G'}
                {provider === 'facebook' && 'f'}
                {provider === 'apple' && ''}
                {provider === 'microsoft' && 'M'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Register;
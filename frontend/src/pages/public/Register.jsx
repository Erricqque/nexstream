import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { redirectHandler } from '../../utils/redirectHandler';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    phone: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check password strength
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (formData.password.match(/[a-z]/)) strength += 1;
    if (formData.password.match(/[A-Z]/)) strength += 1;
    if (formData.password.match(/[0-9]/)) strength += 1;
    if (formData.password.match(/[^a-zA-Z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Please use a stronger password');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms of service');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`,
          data: {
            username: formData.username || formData.email.split('@')[0],
            full_name: formData.fullName
          }
        }
      });

      if (error) throw error;

      setSuccess('Account created successfully! Please check your email to verify your account.');
      
      // Store email for verification
      localStorage.setItem('verificationEmail', formData.email);
      
      // Automatically redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('User already registered')) {
        setError('An account with this email already exists');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    setLoading(true);
    // Store current redirect before social registration
    const currentRedirect = localStorage.getItem('redirectAfterLogin');
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  const getPasswordStrengthText = () => {
    if (!formData.password) return '';
    if (passwordStrength <= 2) return { text: 'Weak', color: '#ef4444' };
    if (passwordStrength <= 3) return { text: 'Fair', color: '#f59e0b' };
    if (passwordStrength <= 4) return { text: 'Good', color: '#3b82f6' };
    return { text: 'Strong', color: '#10b981' };
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NexStream
          </h1>
          <p style={{ color: '#666', marginTop: '8px' }}>
            Create your account to start your creator journey
          </p>
        </div>

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
              You'll be redirected after registration
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error/Success Messages */}
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
              <span>⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: '#dcfce7',
                border: '1px solid #10b981',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
                color: '#059669',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>✅</span> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Form */}
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="johndoe"
              style={{
                width: '100%',
                padding: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  paddingRight: '50px'
                }}
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
                  fontSize: '1.2rem'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: level <= passwordStrength ? getPasswordStrengthText().color : '#e2e8f0',
                        borderRadius: '2px',
                        transition: 'background 0.3s'
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: getPasswordStrengthText().color, margin: 0 }}>
                  Password strength: {getPasswordStrengthText().text}
                </p>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#333', display: 'block', marginBottom: '8px' }}>
              Confirm Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#f8fafc',
                  border: formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? '1px solid #ef4444'
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? '1px solid #10b981'
                      : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  paddingRight: '50px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#667eea',
                  fontSize: '1.2rem'
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ color: '#666' }}>
                I agree to the{' '}
                <a href="/terms" style={{ color: '#667eea', textDecoration: 'none' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" style={{ color: '#667eea', textDecoration: 'none' }}>Privacy Policy</a>
              </span>
            </label>
          </div>

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
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        {/* Social Registration */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <span style={{ background: 'white', padding: '0 15px', color: '#999', fontSize: '0.9rem' }}>
              Or sign up with
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
          {['google', 'github', 'facebook'].map((provider) => (
            <motion.button
              key={provider}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialRegister(provider)}
              disabled={loading}
              style={{
                padding: '12px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.2rem',
                textTransform: 'capitalize',
                opacity: loading ? 0.5 : 1
              }}
            >
              {provider === 'google' ? 'G' : provider === 'github' ? 'GH' : 'FB'}
            </motion.button>
          ))}
        </div>

        {/* Sign In Link */}
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.95rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
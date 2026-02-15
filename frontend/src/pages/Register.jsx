import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
              >
                {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg py-3 px-4 font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : 'Sign Up'}
          </button>
        </form>

        {/* Social Login Section */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            {/* Google */}
            <button 
              onClick={() => window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=google`}
              className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>

            {/* Facebook */}
            <button 
              onClick={() => window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=facebook`}
              className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Apple */}
            <button 
              onClick={() => window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=apple`}
              className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition"
            >
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.59-.54 8.905 1.507 11.816 1.008 1.434 2.207 3.038 3.793 2.98 1.52-.05 2.09-.96 3.925-.96 1.831 0 2.35.96 3.96.93 1.635-.03 2.67-1.453 3.664-2.904 1.14-1.648 1.61-3.248 1.64-3.33-.036-.012-3.15-1.188-3.18-4.735-.027-3.113 2.55-4.62 2.67-4.69-1.45-2.11-3.68-2.33-4.45-2.38-1.9-.09-3.46 1.11-4.37 1.11-.91 0-2.32-1.08-3.79-1.05-.2 0-.38.01-.58.02.45-.02.9-.03 1.35-.03 1.52 0 2.9.53 3.9 1.44 1 .91 1.6 2.14 1.6 3.44 0 1.3-.6 2.53-1.6 3.44-1 .91-2.4 1.44-3.9 1.44-1.52 0-2.9-.53-3.9-1.44-1-.91-1.6-2.14-1.6-3.44 0-1.3.6-2.53 1.6-3.44 1-.91 2.38-1.44 3.9-1.44z"/>
              </svg>
            </button>

            {/* Microsoft */}
            <button 
              onClick={() => window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=azure`}
              className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <rect x="2" y="2" width="10" height="10" fill="#F25022"/>
                <rect x="12" y="2" width="10" height="10" fill="#7FBA00"/>
                <rect x="2" y="12" width="10" height="10" fill="#00A4EF"/>
                <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
              </svg>
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
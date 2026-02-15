import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const Verification = () => {
  const location = useLocation();
  const { email, message } = location.state || { 
    email: 'your email', 
    message: 'Please verify your email address' 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-2xl text-center">
          
          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <EnvelopeIcon className="w-10 h-10 text-cyan-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Verify your email</h2>
          
          <p className="text-gray-400 mb-6">
            {message}
          </p>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-cyan-400 font-medium">{email}</p>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            Didn't receive the email?{' '}
            <button className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Click to resend
            </button>
          </p>

          <Link
            to="/login"
            className="inline-block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg py-3 px-4 font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verification;
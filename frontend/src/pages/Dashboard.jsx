import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load stats asynchronously - don't block render
    const loadStats = async () => {
      // Simulated fast load - replace with actual API call
      setTimeout(() => {
        setStats({
          views: 12453,
          subscribers: 843,
          content: 12,
          earnings: 347.50
        });
      }, 100);
    };
    
    loadStats();
  }, [user, navigate]);

  // Show minimal UI immediately, then populate with data
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
          
          {/* Header - Always show immediately */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-cyan-400">{user?.user_metadata?.full_name || user?.email}</span>
            </h1>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
            >
              Sign Out
            </button>
          </div>

          {/* Stats Grid - Show skeleton or real data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Channel Views</p>
              <p className="text-2xl font-bold text-white">{stats?.views?.toLocaleString() || '...'}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Subscribers</p>
              <p className="text-2xl font-bold text-white">{stats?.subscribers?.toLocaleString() || '...'}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Total Content</p>
              <p className="text-2xl font-bold text-white">{stats?.content || '...'}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-sm">Earnings</p>
              <p className="text-2xl font-bold text-white">${stats?.earnings?.toFixed(2) || '...'}</p>
            </div>
          </div>

          {/* Quick Actions - Always visible */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/create-channel"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 hover:from-cyan-600 hover:to-blue-700 transition transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-2">Create Channel</h3>
              <p className="text-white/80 text-sm">Start your creator journey</p>
            </Link>

            <Link
              to="/upload"
              className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 hover:from-purple-600 hover:to-pink-700 transition transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-2">Upload Content</h3>
              <p className="text-white/80 text-sm">Share videos, music, games</p>
            </Link>

            <Link
              to="/activities"
              className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 hover:from-yellow-600 hover:to-orange-700 transition transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-2">View Analytics</h3>
              <p className="text-white/80 text-sm">Track your performance</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
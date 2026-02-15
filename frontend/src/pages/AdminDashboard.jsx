import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UsersIcon,
  FilmIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalContent: 0,
    pendingContent: 0,
    totalRevenue: 0,
    reportedContent: 0
  });
  const [pendingContent, setPendingContent] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is admin
    if (!user || user.user_metadata?.role !== 'SUPER_ADMIN') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch pending content
      const contentResponse = await fetch('http://localhost:5000/api/admin/content/pending', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      const contentData = await contentResponse.json();
      setPendingContent(contentData);

      // Fetch recent users
      const usersResponse = await fetch('http://localhost:5000/api/admin/users/recent', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      const usersData = await usersResponse.json();
      setRecentUsers(usersData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveContent = async (contentId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/content/${contentId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      fetchAdminData();
    } catch (err) {
      console.error('Error approving content:', err);
    }
  };

  const handleRejectContent = async (contentId) => {
    try {
      await fetch(`http://localhost:5000/api/admin/content/${contentId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      fetchAdminData();
    } catch (err) {
      console.error('Error rejecting content:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });
        fetchAdminData();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-xl">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user.user_metadata?.full_name || 'Admin'}</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FilmIcon className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Creators</p>
                <p className="text-2xl font-bold text-white">{stats.totalCreators}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FlagIcon className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pendingContent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{stats.totalContent - stats.pendingContent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-white">${stats.totalRevenue}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="w-8 h-8 text-pink-400" />
              <div>
                <p className="text-gray-400 text-sm">Reports</p>
                <p className="text-2xl font-bold text-white">{stats.reportedContent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 text-sm font-medium transition ${
                activeTab === 'overview'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 text-sm font-medium transition ${
                activeTab === 'pending'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Pending Content ({stats.pendingContent})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-1 text-sm font-medium transition ${
                activeTab === 'users'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {/* Pending Content Tab */}
        {activeTab === 'pending' && (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Content Approval Queue</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {pendingContent.length > 0 ? (
                pendingContent.map(item => (
                  <div key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.channel?.name}</p>
                        <p className="text-gray-500 text-xs">
                          Uploaded: {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveContent(item.id)}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectContent(item.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2"
                      >
                        <XCircleIcon className="w-5 h-5" />
                        Reject
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-white text-lg font-semibold mb-2">All Clear!</p>
                  <p className="text-gray-400">No pending content to review</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || user.email}`}
                            alt={user.email}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.user_metadata?.full_name || user.email.split('@')[0]}
                            </div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.user_metadata?.role === 'SUPER_ADMIN' 
                            ? 'bg-purple-500/20 text-purple-400'
                            : user.user_metadata?.role === 'CREATOR'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.user_metadata?.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-sm text-gray-400">Active</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
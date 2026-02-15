import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [channels, setChannels] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreators: 0,
    totalContent: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    reportedContent: 0
  });

  useEffect(() => {
    // Check if user is super admin
    if (!user || user.user_metadata?.role !== 'SUPER_ADMIN') {
      navigate('/');
      return;
    }
    loadPlatformData();
  }, [user, navigate]);

  const loadPlatformData = async () => {
    // Simulated data - replace with actual API calls
    setStats({
      totalUsers: 15432,
      totalCreators: 2345,
      totalContent: 6789,
      totalRevenue: 123456.78,
      pendingApprovals: 23,
      reportedContent: 5
    });

    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CREATOR', status: 'active', joined: '2026-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'SUB_ADMIN', status: 'active', joined: '2026-01-20' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'USER', status: 'suspended', joined: '2026-02-01' },
    ]);

    setChannels([
      { id: 1, name: 'Gaming Channel', owner: 'John Doe', subscribers: 1234, revenue: 5678.90, status: 'active' },
      { id: 2, name: 'Music Studio', owner: 'Jane Smith', subscribers: 2345, revenue: 6789.01, status: 'active' },
      { id: 3, name: 'Movie Hub', owner: 'Bob Johnson', subscribers: 3456, revenue: 7890.12, status: 'suspended' },
    ]);
  };

  const suspendUser = (userId) => {
    alert(`User ${userId} suspended`);
  };

  const deleteContent = (contentId) => {
    alert(`Content ${contentId} deleted`);
  };

  const approveChannel = (channelId) => {
    alert(`Channel ${channelId} approved`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #ff4444, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Super Admin Dashboard
            </h1>
            <p style={{ color: '#888' }}>Full platform control and management</p>
          </div>
          <button
            onClick={signOut}
            style={{
              padding: '12px 30px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00b4d8' }}>{stats.totalUsers}</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Creators</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>{stats.totalCreators}</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Content Items</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFA500' }}>{stats.totalContent}</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Total Revenue</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>${stats.totalRevenue}</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: '#888', marginBottom: '10px' }}>Pending</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff4444' }}>{stats.pendingApprovals}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <button style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #333',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            🚨 View Reports ({stats.reportedContent})
          </button>
          <button style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #333',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            ✅ Approve Content ({stats.pendingApprovals})
          </button>
          <button style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #333',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            📊 Platform Analytics
          </button>
          <button style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #333',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            ⚙️ System Settings
          </button>
        </div>

        {/* User Management */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          border: '1px solid #333'
        }}>
          <h2 style={{ marginBottom: '20px' }}>User Management</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px' }}>{user.name}</td>
                  <td style={{ padding: '15px', color: '#888' }}>{user.email}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: user.role === 'CREATOR' ? 'rgba(255,215,0,0.2)' : 
                                 user.role === 'SUB_ADMIN' ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.1)',
                      color: user.role === 'CREATOR' ? '#FFD700' : 
                             user.role === 'SUB_ADMIN' ? '#00b4d8' : '#888',
                      padding: '5px 10px',
                      borderRadius: '5px'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: user.status === 'active' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                      color: user.status === 'active' ? '#4CAF50' : '#ff4444',
                      padding: '5px 10px',
                      borderRadius: '5px'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button
                      onClick={() => suspendUser(user.id)}
                      style={{
                        padding: '5px 15px',
                        background: 'rgba(255,68,68,0.2)',
                        border: '1px solid #ff4444',
                        borderRadius: '5px',
                        color: '#ff4444',
                        cursor: 'pointer',
                        marginRight: '5px'
                      }}
                    >
                      Suspend
                    </button>
                    <button style={{
                      padding: '5px 15px',
                      background: 'rgba(0,180,216,0.2)',
                      border: '1px solid #00b4d8',
                      borderRadius: '5px',
                      color: '#00b4d8',
                      cursor: 'pointer'
                    }}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Channel Management */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid #333'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Channel Management</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Channel</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Owner</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Subscribers</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Revenue</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map(channel => (
                <tr key={channel.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{channel.name}</td>
                  <td style={{ padding: '15px', color: '#888' }}>{channel.owner}</td>
                  <td style={{ padding: '15px' }}>{channel.subscribers.toLocaleString()}</td>
                  <td style={{ padding: '15px', color: '#00b4d8' }}>${channel.revenue.toFixed(2)}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: channel.status === 'active' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                      color: channel.status === 'active' ? '#4CAF50' : '#ff4444',
                      padding: '5px 10px',
                      borderRadius: '5px'
                    }}>
                      {channel.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button
                      onClick={() => approveChannel(channel.id)}
                      style={{
                        padding: '5px 15px',
                        background: 'rgba(0,255,0,0.2)',
                        border: '1px solid #4CAF50',
                        borderRadius: '5px',
                        color: '#4CAF50',
                        cursor: 'pointer'
                      }}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
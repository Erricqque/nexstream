import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    // Main
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    
    // Content
    { path: '/creator/channel', icon: '📺', label: 'My Channel' },
    { path: '/creator/upload', icon: '📤', label: 'Upload Content' },
    { path: '/creator/analytics', icon: '📈', label: 'Analytics' },
    
    // Business (for business accounts)
    { path: '/business/products', icon: '🏷️', label: 'Sell Products', business: true },
    { path: '/business/sales', icon: '💰', label: 'Sales & Earnings', business: true },
    
    // Network Marketing
    { path: '/network', icon: '🤝', label: 'Network Marketing' },
    { path: '/wallet', icon: '💳', label: 'Wallet & Withdrawals' },
    
    // Social
    { path: '/chat', icon: '💬', label: 'Messages' },
    { path: '/ai-assistant', icon: '🤖', label: 'AI Assistant' },
    
    // Settings
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  // Admin only items
  if (user?.role === 'admin' || user?.role === 'super_admin') {
    menuItems.push(
      { path: '/admin', icon: '👑', label: 'Admin Panel' },
      { path: '/admin/users', icon: '👥', label: 'User Management' }
    );
  }

  // Sub-admin items
  if (user?.role === 'sub_admin') {
    menuItems.push(
      { path: '/sub-admin', icon: '🔧', label: 'Sub-Admin Panel' }
    );
  }

  return (
    <div style={{
      width: '260px',
      background: '#1a1a1a',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto',
      borderRight: '1px solid #2d2d2d'
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #2d2d2d',
        marginBottom: '20px'
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: '#ef4444', margin: 0 }}>NexStream</h2>
        </Link>
      </div>

      {/* Menu Items */}
      <div style={{ padding: '0 10px' }}>
        {menuItems.map(item => {
          // Skip business items if not business account
          if (item.business && user?.account_type !== 'business') return null;
          
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                padding: '12px 15px',
                margin: '5px 0',
                borderRadius: '10px',
                background: isActive ? '#ef4444' : 'transparent',
                color: isActive ? 'white' : '#888',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#2d2d2d';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#888';
                }
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Info */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px',
        borderTop: '1px solid #2d2d2d',
        background: '#1a1a1a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              {user?.full_name || 'User'}
            </p>
            <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>
              {user?.account_type === 'business' ? 'Business Account' : 'Free Account'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
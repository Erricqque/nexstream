import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../layout/Sidebar';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requiredRole) {
    if (requiredRole === 'admin' && !['admin', 'super_admin'].includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'business' && user.account_type !== 'business') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '260px' }}>
        {children}
      </div>
    </div>
  );
};

export default PrivateRoute;
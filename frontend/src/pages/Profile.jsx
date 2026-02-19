import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: 'white', padding: '40px' }}>
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Profile;
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f0f0f'
    }}>
      <Header />
      <main style={{
        flex: 1,
        paddingTop: '80px' // Account for fixed header
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
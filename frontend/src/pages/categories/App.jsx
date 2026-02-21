import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Content Pages
import BrowseContent from './pages/BrowseContent';
import ContentDetail from './pages/ContentDetail';
import Upload from './pages/Upload';
import Categories from './pages/categories/Categories';
import SearchResults from './pages/search/SearchResults';

// User Pages
import Dashboard from './pages/user/Dashboard';
import ProfileView from './pages/profile/ProfileView';
import Settings from './pages/settings/Settings';

// Community Pages
import Community from './pages/Community';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Utility Pages
import AIChat from './pages/AIChat';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Content Routes */}
          <Route path="/browse" element={<BrowseContent />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<SearchResults />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:username" element={<ProfileView />} />
          <Route path="/settings" element={<Settings />} />

          {/* Community Routes */}
          <Route path="/community" element={<Community />} />

          {/* Business Routes */}
          <Route path="/business" element={<BusinessDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* AI Chat */}
          <Route path="/ai-chat" element={<AIChat />} />

          {/* 404 Route */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh',
              background: '#0f0f0f',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h1 style={{ fontSize: '4rem' }}>404</h1>
              <p>Page not found</p>
              <a href="/" style={{
                padding: '10px 20px',
                background: '#FF3366',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}>Go Home</a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
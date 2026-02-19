import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Content Pages
import Movies from './pages/movies/Movies';
import MovieDetail from './pages/movies/MovieDetail';
import Music from './pages/music/Music';
import Games from './pages/games/Games';

// User Pages
import Dashboard from './pages/user/Dashboard';
import Network from './pages/user/Network';
import Wallet from './pages/user/Wallet';
import Chat from './pages/user/Chat';
import AIAssistant from './pages/user/AIAssistant';
import Upload from './pages/Upload';
import BrowseContent from './pages/BrowseContent';
import ContentDetail from './pages/ContentDetail';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

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
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/music" element={<Music />} />
          <Route path="/games" element={<Games />} />
	<Route path="/upload" element={<Upload />} />
	  <Route path="/browse" element={<BrowseContent />} />
<Route path="/content/:id" element={<ContentDetail />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/network" element={<Network />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />

          {/* Business Routes */}
          <Route path="/business" element={<BusinessDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
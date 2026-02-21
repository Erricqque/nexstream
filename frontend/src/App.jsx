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

// Creator Pages
import FeaturedCreators from './pages/creators/FeaturedCreators';
import CreatorProgram from './pages/creators/CreatorProgram';
import Trending from './pages/trending/Trending';
import Monetization from './pages/monetization/Monetization';
import Analytics from './pages/analytics/Analytics';

// Company Pages
import AboutUs from './pages/about/AboutUs';
import Careers from './pages/careers/Careers';
import Press from './pages/press/Press';
import Blog from './pages/blog/Blog';

// User Pages
import Dashboard from './pages/user/Dashboard';
import ProfileView from './pages/profile/ProfileView';
import Settings from './pages/settings/Settings';
import Notifications from './pages/notifications/Notifications';
import WatchHistory from './pages/history/WatchHistory';
import LikedContent from './pages/liked/LikedContent';
import Subscriptions from './pages/subscriptions/Subscriptions';
import Playlists from './pages/playlists/Playlists';
import PlaylistDetail from './pages/playlists/PlaylistDetail';

// Community Pages
import Community from './pages/Community';
import CommunityDetail from './pages/community/CommunityDetail';
import CreateCommunity from './pages/community/CreateCommunity';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import MLMNetwork from './pages/business/MLMNetwork';
import Earnings from './pages/business/Earnings';
import ReferralCenter from './pages/business/ReferralCenter';
import PayoutSettings from './pages/business/PayoutSettings';
import Wallet from './pages/business/Wallet';

// MLM Pages (New)
import MLMDashboard from './pages/mlm/MLMDashboard';

// Legal Pages
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Cookies from './pages/legal/Cookies';
import Sitemap from './pages/legal/Sitemap';

// Help Pages
import HelpCenter from './pages/help/HelpCenter';
import FAQ from './pages/help/FAQ';

// Pricing
import Pricing from './pages/pricing/Pricing';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// AI Pages
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

          {/* Creator Routes */}
          <Route path="/creators" element={<FeaturedCreators />} />
          <Route path="/creator-program" element={<CreatorProgram />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/monetization" element={<Monetization />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Company Routes */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/blog" element={<Blog />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:username" element={<ProfileView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/history" element={<WatchHistory />} />
          <Route path="/liked" element={<LikedContent />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />

          {/* Community Routes */}
          <Route path="/community" element={<Community />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/community/create" element={<CreateCommunity />} />

          {/* Business Routes */}
          <Route path="/business" element={<BusinessDashboard />} />
          <Route path="/business/mlm" element={<MLMNetwork />} />
          <Route path="/business/earnings" element={<Earnings />} />
          <Route path="/business/referrals" element={<ReferralCenter />} />
          <Route path="/business/payout-settings" element={<PayoutSettings />} />
          <Route path="/business/wallet" element={<Wallet />} />

          {/* MLM Routes */}
          <Route path="/mlm" element={<MLMDashboard />} />

          {/* Legal Routes */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/sitemap" element={<Sitemap />} />

          {/* Help Routes */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Pricing */}
          <Route path="/pricing" element={<Pricing />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* AI Routes */}
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
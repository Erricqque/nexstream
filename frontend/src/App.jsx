import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateChannel from './pages/CreateChannel';
import Channel from './pages/Channel';
import Upload from './pages/Upload';
import Content from './pages/Content';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Affiliate from './pages/Affiliate';
import SubAdminPanel from './pages/SubAdminPanel';
import SuperAdmin from './pages/SuperAdmin';
import Chat from './pages/Chat';
import SimpleChat from './pages/SimpleChat';
import AIAssistant from './pages/AIAssistant';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-channel" element={<CreateChannel />} />
          <Route path="/channel/:slug" element={<Channel />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/content/:id" element={<Content />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/sub-admin" element={<SubAdminPanel />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
<Route path="/ai-assistant" element={<AIAssistant />} />
         <Route path="/chat" element={<SimpleChat />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
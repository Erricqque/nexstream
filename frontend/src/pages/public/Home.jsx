import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Hero from '../../components/home/Hero';
import Features from '../../components/home/Features';
import Trending from '../../components/home/Trending';
import Stats from '../../components/home/Stats';
import CTA from '../../components/home/CTA';
import { redirectHandler } from '../../utils/redirectHandler';

const Home = () => {
  const navigate = useNavigate();

  // Handle navigation with redirect storage
  const handleNavigation = (path) => {
    // Check if path requires authentication
    const protectedPaths = ['/upload', '/dashboard', '/community'];
    
    if (protectedPaths.includes(path)) {
      // Check if user is logged in (you'll need to add auth context)
      const user = JSON.parse(localStorage.getItem('sb-nweokaijvelezkqqopam-auth-token') || 'null');
      
      if (!user) {
        // Store intended destination and redirect to login
        redirectHandler.setRedirect(path);
        navigate('/login');
        return;
      }
    }
    
    navigate(path);
  };

  return (
    <Layout>
      <Hero onCtaClick={() => handleNavigation('/register')} />
      <Features />
      <Trending onItemClick={(id) => handleNavigation(`/content/${id}`)} />
      <Stats />
      <CTA 
        onPrimaryClick={() => handleNavigation('/register')}
        onSecondaryClick={() => handleNavigation('/browse')}
      />
    </Layout>
  );
};

export default Home;
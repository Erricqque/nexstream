import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { statsService } from "../../services/statsService";
const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, content: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Inspiring quotes
  const quotes = [
    { text: "Your creativity deserves the world's biggest stage.", author: "NexStream" },
    { text: "Turn your passion into profit. Join thousands of creators.", author: "Creator Spotlight" },
    { text: "Stream, earn, connect. The future of content is here.", author: "NexStream Vision" },
    { text: "Every masterpiece starts with a single click. Make yours today.", author: "Featured Creator" },
    { text: "Join the revolution where creators thrive and dreams take flight.", author: "Community Voice" },
    { text: "Your audience is waiting. What story will you tell?", author: "NexStream" },
    { text: "Create once, earn forever. The creator economy is here.", author: "Success Stories" }
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, content, earnings] = await Promise.all([
          statsService.getTotalUsers(),
          statsService.getTotalContent(),
          statsService.getTotalEarnings()
        ]);
        setStats({ users, content, earnings });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();

    // Rotate quotes every 4 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(quoteInterval);
  }, [quotes.length]);

  // Animated lines canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(150, Math.floor(width * height / 15000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 3 + 1,
          color: `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, 255, ${0.3 + Math.random() * 0.3})`
        });
      }
    };

    const drawLines = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });
      
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.15)';
      ctx.lineWidth = 0.8;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.stroke();
          }
        }
      }
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        ctx.shadowColor = 'rgba(100, 150, 255, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      animationFrameId = requestAnimationFrame(drawLines);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawLines();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated lines canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />

      {/* Gradient overlays for depth */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(10,10,15,0.8) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Main content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        
        {/* Top floating stats - LINKS ADDED */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            display: 'flex',
            gap: '30px',
            background: 'rgba(20,20,30,0.7)',
            backdropFilter: 'blur(10px)',
            padding: '15px 30px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.1, color: '#ff3366' }} style={{ color: 'white' }}>
              <span style={{ color: '#ff3366', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {loading ? '...' : stats.users.toLocaleString()}+
              </span>
              <span style={{ marginLeft: '8px', color: '#aaa' }}>creators</span>
            </motion.div>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.1, color: '#4facfe' }} style={{ color: 'white' }}>
              <span style={{ color: '#4facfe', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {loading ? '...' : stats.content.toLocaleString()}+
              </span>
              <span style={{ marginLeft: '8px', color: '#aaa' }}>videos</span>
            </motion.div>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.1, color: '#43e97b' }} style={{ color: 'white' }}>
              <span style={{ color: '#43e97b', fontWeight: 'bold', fontSize: '1.2rem' }}>
                ${loading ? '...' : (stats.earnings / 1000000).toFixed(1)}M+
              </span>
              <span style={{ marginLeft: '8px', color: '#aaa' }}>earned</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Main hero section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}
        >
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <motion.h1
              animate={{
                textShadow: [
                  '0 0 30px rgba(255,51,102,0.5)',
                  '0 0 60px rgba(79,172,254,0.5)',
                  '0 0 30px rgba(255,51,102,0.5)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                fontSize: 'clamp(3.5rem, 12vw, 7rem)',
                fontWeight: 'bold',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #ff3366, #4facfe, #43e97b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                cursor: 'pointer'
              }}
            >
              NexStream
            </motion.h1>
          </Link>

          {/* Animated quote */}
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
              maxWidth: '900px',
              margin: '0 auto 30px',
              color: '#fff',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              fontWeight: '300',
              lineHeight: 1.4
            }}
          >
            <motion.span
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              "{quotes[currentQuote].text}"
            </motion.span>
            <div style={{ 
              fontSize: '1.1rem', 
              marginTop: '15px', 
              color: '#888',
              letterSpacing: '1px'
            }}>
              — {quotes[currentQuote].author}
            </div>
          </motion.div>

          {/* CTA Buttons - LINKED TO REGISTER */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ 
              display: 'flex', 
              gap: '25px', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              marginTop: '40px'
            }}
          >
            <Link to="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: '0 0 40px rgba(255,51,102,0.6)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '20px 60px',
                  fontSize: '1.3rem',
                  background: 'linear-gradient(135deg, #ff3366, #ff6b3b)',
                  border: 'none',
                  borderRadius: '60px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(255,51,102,0.3)'
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                  }}
                  animate={{ left: '200%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Start Creating
              </motion.button>
            </Link>

            <Link to="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.08,
                  borderColor: '#fff',
                  boxShadow: '0 0 30px rgba(255,255,255,0.2)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '20px 60px',
                  fontSize: '1.3rem',
                  background: 'rgba(20,20,30,0.7)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '60px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                Join as Creator
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature thumbnails grid - ALL LINKED TO REGISTER */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            marginTop: '100px'
          }}
        >
          {[
            {
              icon: '🎬',
              title: 'Movies',
              desc: 'Stream latest blockbusters in 4K',
              color: '#ff3366',
              gradient: 'linear-gradient(135deg, #ff3366, #ff6b3b)',
              stats: '2,500+ titles'
            },
            {
              icon: '🎵',
              title: 'Music',
              desc: 'Millions of songs, ad-free',
              color: '#4facfe',
              gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              stats: '10M+ tracks'
            },
            {
              icon: '🎮',
              title: 'Games',
              desc: '100+ free browser games',
              color: '#43e97b',
              gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
              stats: 'Play instantly'
            },
            {
              icon: '💰',
              title: 'Wallet',
              desc: 'Earn and withdraw instantly',
              color: '#fa709a',
              gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
              stats: '0% fees'
            },
            {
              icon: '💬',
              title: 'Chat',
              desc: 'Connect with global community',
              color: '#a18cd1',
              gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
              stats: 'Real-time'
            },
            {
              icon: '🤖',
              title: 'AI Assistant',
              desc: '24/7 intelligent help',
              color: '#ff9a9e',
              gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
              stats: 'Always learning'
            }
          ].map((feature, index) => (
            <Link to="/register" key={index} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ 
                  y: -25, 
                  scale: 1.05,
                  boxShadow: `0 30px 50px ${feature.color}40`
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'rgba(20,20,30,0.7)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  padding: '35px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  color: 'white',
                  height: '100%'
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: feature.gradient
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <motion.div 
                    style={{ fontSize: '3.5rem', marginBottom: '20px' }}
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, delay: index * 0.1, repeat: Infinity }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 style={{ 
                    fontSize: '1.8rem', 
                    marginBottom: '10px',
                    background: feature.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '1.1rem' }}>
                    {feature.desc}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>{feature.stats}</span>
                    <motion.div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: feature.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem'
                      }}
                      whileHover={{ rotate: 45 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom call to action - LINKED TO REGISTER */}
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{
              marginTop: '120px',
              textAlign: 'center',
              padding: '60px',
              background: 'rgba(20,20,30,0.5)',
              borderRadius: '40px',
              border: '1px solid rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              cursor: 'pointer'
            }}
          >
            <motion.h2 
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #fff, #aaa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ready to start your journey?
            </motion.h2>
            <p style={{ 
              color: '#aaa', 
              marginBottom: '40px', 
              maxWidth: '700px', 
              margin: '0 auto 40px',
              fontSize: '1.2rem'
            }}>
              Join millions of creators who've already found their audience on NexStream.
              Click anywhere or the button below to begin.
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '20px 70px',
                fontSize: '1.3rem',
                background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                border: 'none',
                borderRadius: '60px',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              }}
            >
              Create Free Account
            </motion.button>
          </motion.div>
        </Link>
      </div>

      {/* Click hint - LINKED TO REGISTER */}
      <Link to="/register">
        <motion.div
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            y: [0, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'fixed',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '1rem',
            zIndex: 100,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Click anywhere to begin →
        </motion.div>
      </Link>
    </div>
  );
};

export default Home;
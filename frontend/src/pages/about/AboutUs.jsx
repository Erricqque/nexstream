import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      bio: 'Former YouTube executive with 10+ years in creator economy',
      image: '👨‍💼'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Ex-Google engineer, passionate about scalable platforms',
      image: '👩‍💻'
    },
    {
      name: 'Mike Williams',
      role: 'Head of Creator Success',
      bio: 'Top creator with 5M+ subscribers, now helping others grow',
      image: '👨‍🎤'
    },
    {
      name: 'Emily Zhang',
      role: 'Community Manager',
      bio: 'Building engaged communities for 8+ years',
      image: '👩‍💼'
    }
  ];

  const milestones = [
    { year: '2020', event: 'NexStream founded', icon: '🚀' },
    { year: '2021', event: 'Launched creator program', icon: '🎬' },
    { year: '2022', event: 'Reached 1M creators', icon: '🌟' },
    { year: '2023', event: 'Introduced MLM program', icon: '🌳' },
    { year: '2024', event: 'Expanded to 100+ countries', icon: '🌍' }
  ];

  const stats = [
    { value: '5M+', label: 'Active Creators', icon: '👥' },
    { value: '50M+', label: 'Monthly Views', icon: '👁️' },
    { value: '$100M+', label: 'Paid to Creators', icon: '💰' },
    { value: '120+', label: 'Countries', icon: '🌍' }
  ];

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '20px',
            padding: spacing.xxl,
            marginBottom: spacing.xl,
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.md
          }}>
            Empowering Creators Worldwide
          </h1>
          <p style={{
            fontSize: fontSize.lg,
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            We're on a mission to democratize content creation and help creators build sustainable careers.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.lg,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: spacing.xs }}>{stat.icon}</div>
              <h3 style={{ fontSize: fontSize.xl, color: '#FF3366', marginBottom: spacing.xs }}>
                {stat.value}
              </h3>
              <p style={{ color: '#888' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: spacing.xl,
            marginBottom: spacing.xl
          }}
        >
          <div>
            <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
              Our Story
            </h2>
            <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
              NexStream was born from a simple observation: creators deserve better. In 2020, our founder Alex Chen 
              realized that existing platforms take too much and give too little back to the people who make them valuable.
            </p>
            <p style={{ color: '#888', lineHeight: 1.8, marginBottom: spacing.md }}>
              We built NexStream to flip the script. With higher revenue shares, transparent policies, and innovative 
              MLM opportunities, we're putting creators first. Today, millions of creators across 120+ countries trust 
              us to help them build their dreams.
            </p>
            <p style={{ color: '#888', lineHeight: 1.8 }}>
              And we're just getting started.
            </p>
          </div>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.md, color: '#4FACFE' }}>
              Our Mission
            </h3>
            <p style={{ color: '#ccc', fontSize: fontSize.lg, fontStyle: 'italic', lineHeight: 1.6 }}>
              "To create a world where anyone with creativity can build a sustainable career doing what they love."
            </p>
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: spacing.xl,
            marginBottom: spacing.xl
          }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.xl, textAlign: 'center' }}>
            Our Journey
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            position: 'relative',
            gap: spacing.md
          }}>
            {milestones.map((milestone, index) => (
              <div key={index} style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#FF3366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto',
                  marginBottom: spacing.md
                }}>
                  {milestone.icon}
                </div>
                <h3 style={{ fontSize: fontSize.lg, color: '#FF3366', marginBottom: spacing.xs }}>
                  {milestone.year}
                </h3>
                <p style={{ color: '#888' }}>{milestone.event}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: spacing.xl }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.xl, textAlign: 'center' }}>
            Meet the Team
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: spacing.lg
          }}>
            {team.map((member, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '10px',
                  padding: spacing.lg,
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  margin: '0 auto',
                  marginBottom: spacing.md
                }}>
                  {member.image}
                </div>
                <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.xs }}>{member.name}</h3>
                <p style={{ color: '#4FACFE', marginBottom: spacing.sm }}>{member.role}</p>
                <p style={{ color: '#888', fontSize: fontSize.sm }}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join Us CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '10px',
            padding: spacing.xxl,
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
            Join the NexStream Family
          </h2>
          <p style={{ fontSize: fontSize.lg, marginBottom: spacing.lg, opacity: 0.9 }}>
            Start your creator journey today
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: 'white',
              border: 'none',
              borderRadius: '30px',
              color: '#FF3366',
              fontSize: fontSize.lg,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Create Free Account
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
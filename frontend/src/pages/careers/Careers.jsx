import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Careers = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const departments = ['all', 'engineering', 'product', 'design', 'marketing', 'sales', 'operations'];

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      department: 'engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build amazing user experiences with React',
      salary: '$120k - $160k',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Backend Developer',
      department: 'engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Scale our backend infrastructure',
      salary: '$130k - $170k',
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'product',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead product development',
      salary: '$110k - $150k',
      posted: '3 days ago'
    },
    {
      id: 4,
      title: 'UX Designer',
      department: 'design',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Design beautiful interfaces',
      salary: '$90k - $130k',
      posted: '5 days ago'
    },
    {
      id: 5,
      title: 'Marketing Manager',
      department: 'marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Drive user growth',
      salary: '$80k - $120k',
      posted: '1 week ago'
    }
  ];

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(j => j.department === selectedDepartment);

  const benefits = [
    { icon: '💰', title: 'Competitive Salary', desc: 'Top market compensation' },
    { icon: '🏥', title: 'Health Insurance', desc: 'Full medical, dental, vision' },
    { icon: '🏠', title: 'Remote First', desc: 'Work from anywhere' },
    { icon: '📈', title: 'Stock Options', desc: 'Equity for all employees' },
    { icon: '🏖️', title: 'Unlimited PTO', desc: 'Take time when you need it' },
    { icon: '📚', title: 'Learning Stipend', desc: '$2,000/year for education' }
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: spacing.xl }}
        >
          <h1 style={{ fontSize: isMobile ? fontSize.xl : fontSize.xxl, marginBottom: spacing.xs }}>
            Join the NexStream Team
          </h1>
          <p style={{ color: '#888', fontSize: fontSize.lg }}>
            Help us build the future of content creation
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            height: '300px',
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '15px',
            marginBottom: spacing.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem'
          }}
        >
          🚀
        </motion.div>

        {/* Why Join Us */}
        <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg, textAlign: 'center' }}>
          Why Join NexStream?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.lg,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>{benefit.icon}</div>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.xs }}>{benefit.title}</h3>
              <p style={{ color: '#888' }}>{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Open Positions */}
        <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
          Open Positions
        </h2>

        {/* Department Filters */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.lg,
          overflowX: 'auto',
          flexWrap: isMobile ? 'nowrap' : 'wrap'
        }}>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: selectedDepartment === dept ? '#FF3366' : '#1a1a1a',
                border: 'none',
                borderRadius: '30px',
                color: selectedDepartment === dept ? 'white' : '#888',
                cursor: 'pointer',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/careers/${job.id}`)}
              style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.lg,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: spacing.md
              }}
            >
              <div>
                <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.xs }}>{job.title}</h3>
                <div style={{ display: 'flex', gap: spacing.md, color: '#888', fontSize: fontSize.sm }}>
                  <span>{job.department}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#43E97B', fontWeight: 'bold', marginBottom: spacing.xs }}>{job.salary}</p>
                <p style={{ color: '#888', fontSize: fontSize.xs }}>{job.posted}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Jobs Found */}
        {filteredJobs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: spacing.xxl,
            background: '#1a1a1a',
            borderRadius: '10px'
          }}>
            <p style={{ color: '#888' }}>No open positions in this department</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: spacing.xl,
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '10px',
            padding: spacing.xl,
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.md }}>
            Don't see the right role?
          </h2>
          <p style={{ marginBottom: spacing.lg }}>
            Send us your resume and we'll keep you in mind for future opportunities
          </p>
          <button
            onClick={() => window.location.href = 'mailto:careers@nexstream.com'}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: 'white',
              border: 'none',
              borderRadius: '30px',
              color: '#FF3366',
              fontSize: fontSize.md,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Send Resume
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;
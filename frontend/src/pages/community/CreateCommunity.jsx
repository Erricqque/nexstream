import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CreateCommunity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'gaming',
    icon: '🎮',
    rules: [''],
    isPrivate: false,
    autoApprove: true
  });

  const categories = [
    'gaming', 'music', 'movies', 'technology', 'art', 
    'education', 'sports', 'lifestyle', 'news', 'other'
  ];

  const icons = ['🎮', '🎵', '🎬', '💻', '🎨', '📚', '⚽', '🌟', '📰', '💬'];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (!user) {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const removeRule = (index) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: newRules });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Mock submission - replace with actual API call
      setTimeout(() => {
        navigate('/community');
      }, 1500);
    } catch (error) {
      console.error('Error creating community:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Create Community
          </h1>
          <p style={{ color: '#888' }}>
            Build a space for people who share your interests
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: spacing.xl,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '10%',
            right: '10%',
            height: '2px',
            background: '#333',
            zIndex: 0
          }} />
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: s <= step ? '#FF3366' : '#1a1a1a',
                border: s <= step ? 'none' : '2px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.xs,
                color: s <= step ? 'white' : '#888'
              }}>
                {s}
              </div>
              <span style={{ color: s <= step ? '#FF3366' : '#888', fontSize: fontSize.xs }}>
                {s === 1 ? 'Basics' : s === 2 ? 'Rules' : 'Settings'}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ marginBottom: spacing.lg }}>
              <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                Community Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Gaming Enthusiasts"
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: fontSize.md
                }}
              />
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What's your community about?"
                rows="4"
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: fontSize.md,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: fontSize.md
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: spacing.lg }}>
              <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                Community Icon
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                gap: spacing.sm
              }}>
                {icons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setFormData({ ...formData, icon })}
                    style={{
                      padding: spacing.md,
                      background: formData.icon === icon ? '#FF3366' : '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      fontSize: '1.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Community Rules */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p style={{ color: '#888', marginBottom: spacing.lg }}>
              Set some ground rules to keep your community healthy
            </p>

            {formData.rules.map((rule, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: spacing.sm,
                marginBottom: spacing.md
              }}>
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder={`Rule ${index + 1}`}
                  style={{
                    flex: 1,
                    padding: spacing.md,
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                {formData.rules.length > 1 && (
                  <button
                    onClick={() => removeRule(index)}
                    style={{
                      padding: spacing.md,
                      background: '#FF3366',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addRule}
              style={{
                width: '100%',
                padding: spacing.md,
                background: 'transparent',
                border: '2px dashed #333',
                borderRadius: '8px',
                color: '#888',
                cursor: 'pointer',
                marginBottom: spacing.lg
              }}
            >
              + Add Rule
            </button>
          </motion.div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg,
              marginBottom: spacing.lg
            }}>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                Privacy Settings
              </h3>

              <div style={{ marginBottom: spacing.md }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>Private Community</p>
                    <p style={{ color: '#888', fontSize: fontSize.sm }}>
                      Only approved members can view and post
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="autoApprove"
                    checked={formData.autoApprove}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>Auto-approve Members</p>
                    <p style={{ color: '#888', fontSize: fontSize.sm }}>
                      Automatically approve new member requests
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div style={{
              background: '#1a1a1a',
              borderRadius: '10px',
              padding: spacing.lg
            }}>
              <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                Summary
              </h3>
              <div style={{ marginBottom: spacing.sm }}>
                <span style={{ color: '#888' }}>Name: </span>
                <span>{formData.name || 'Not set'}</span>
              </div>
              <div style={{ marginBottom: spacing.sm }}>
                <span style={{ color: '#888' }}>Category: </span>
                <span>{formData.category}</span>
              </div>
              <div style={{ marginBottom: spacing.sm }}>
                <span style={{ color: '#888' }}>Rules: </span>
                <span>{formData.rules.filter(r => r).length} rules</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Privacy: </span>
                <span>{formData.isPrivate ? 'Private' : 'Public'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: spacing.xl
        }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/community')}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '30px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            disabled={step === 1 && !formData.name}
            style={{
              padding: `${spacing.md} ${spacing.xl}`,
              background: (step === 1 && !formData.name) ? '#555' : '#FF3366',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontWeight: '600',
              cursor: (step === 1 && !formData.name) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : step === 3 ? 'Create Community' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
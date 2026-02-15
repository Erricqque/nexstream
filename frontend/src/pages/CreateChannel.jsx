import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateChannel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'entertainment'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create slug from channel name
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Navigate to the new channel page
    navigate(`/channel/${slug}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Create Your Channel</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>Start your creator journey today</p>

        <form onSubmit={handleSubmit} style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '30px', 
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#64ffda',
              fontWeight: 'bold'
            }}>
              Channel Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #444',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px'
              }}
              placeholder="My Awesome Channel"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#64ffda',
              fontWeight: 'bold'
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #444',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px',
                fontFamily: 'inherit'
              }}
              placeholder="Tell viewers about your channel..."
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#64ffda',
              fontWeight: 'bold'
            }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #444',
                borderRadius: '5px',
                color: 'white',
                fontSize: '16px'
              }}
            >
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
              <option value="gaming">Gaming</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="news">News</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
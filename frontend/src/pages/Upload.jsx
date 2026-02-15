import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    price: 'free'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate upload
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Upload Content</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>Share your creation with the world</p>

        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '10px' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64ffda' }}>Content Type</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['video', 'music', 'game'].map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64ffda' }}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #333',
                borderRadius: '5px',
                color: 'white'
              }}
              placeholder="Enter title"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64ffda' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #333',
                borderRadius: '5px',
                color: 'white'
              }}
              placeholder="Describe your content..."
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64ffda' }}>Price</label>
            <select
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #333',
                borderRadius: '5px',
                color: 'white'
              }}
            >
              <option value="free">Free</option>
              <option value="0.99">$0.99</option>
              <option value="1.99">$1.99</option>
              <option value="4.99">$4.99</option>
              <option value="9.99">$9.99</option>
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
              cursor: 'pointer'
            }}
          >
            Upload Content
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
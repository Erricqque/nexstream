import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SubAdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [content, setContent] = useState([]);
  const [pricingRules, setPricingRules] = useState({
    basePrice: 4.99,
    discount: 0,
    featured: false,
    category: 'all'
  });

  useEffect(() => {
    // Check if user is sub-admin
    if (!user || user.user_metadata?.role !== 'SUB_ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadChannelData();
  }, [user, navigate]);

  const loadChannelData = async () => {
    // Simulated data - replace with actual API calls
    setChannels([
      { id: 1, name: 'Gaming Channel', owner: 'John Doe', contentCount: 23, revenue: 1234.56 },
      { id: 2, name: 'Music Studio', owner: 'Jane Smith', contentCount: 45, revenue: 2345.67 },
      { id: 3, name: 'Movie Hub', owner: 'Bob Johnson', contentCount: 12, revenue: 3456.78 },
    ]);

    setContent([
      { id: 1, title: 'Epic Gameplay', channel: 'Gaming Channel', price: 4.99, views: 1234, earnings: 432.10 },
      { id: 2, title: 'Popular Song', channel: 'Music Studio', price: 1.99, views: 5678, earnings: 876.54 },
      { id: 3, title: 'Action Movie', channel: 'Movie Hub', price: 9.99, views: 2345, earnings: 1234.56 },
    ]);
  };

  const updateContentPrice = (contentId, newPrice) => {
    // Update price in database
    console.log(`Updating content ${contentId} to $${newPrice}`);
    alert(`Price updated to $${newPrice}`);
  };

  const bulkPriceUpdate = () => {
    alert(`Bulk update: Setting all ${pricingRules.category} content to $${pricingRules.basePrice}`);
  };

  const setFeaturedContent = (contentId) => {
    alert(`Content ${contentId} marked as featured`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Sub-Admin Panel
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          Manage content pricing and featured items
        </p>

        {/* Channel Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {channels.map(channel => (
            <div
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              style={{
                background: selectedChannel?.id === channel.id ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: '15px',
                padding: '20px',
                border: selectedChannel?.id === channel.id ? '2px solid #00b4d8' : '1px solid #333',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{channel.name}</h3>
              <p style={{ color: '#888' }}>Owner: {channel.owner}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                <span>{channel.contentCount} items</span>
                <span style={{ color: '#00b4d8' }}>${channel.revenue}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Bulk Pricing Panel */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Bulk Pricing</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>
                Category
              </label>
              <select
                value={pricingRules.category}
                onChange={(e) => setPricingRules({...pricingRules, category: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white'
                }}
              >
                <option value="all">All Categories</option>
                <option value="video">Videos</option>
                <option value="music">Music</option>
                <option value="game">Games</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>
                Base Price ($)
              </label>
              <input
                type="number"
                value={pricingRules.basePrice}
                onChange={(e) => setPricingRules({...pricingRules, basePrice: parseFloat(e.target.value)})}
                step="0.01"
                min="0.99"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>
                Discount (%)
              </label>
              <input
                type="number"
                value={pricingRules.discount}
                onChange={(e) => setPricingRules({...pricingRules, discount: parseInt(e.target.value)})}
                min="0"
                max="100"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={pricingRules.featured}
                  onChange={(e) => setPricingRules({...pricingRules, featured: e.target.checked})}
                />
                <span>Mark as Featured</span>
              </label>
            </div>

            <button
              onClick={bulkPriceUpdate}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Apply Bulk Update
            </button>
          </div>

          {/* Content List */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            padding: '25px',
            border: '1px solid #333'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Content Management</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Channel</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '15px' }}>{item.title}</td>
                    <td style={{ padding: '15px', color: '#888' }}>{item.channel}</td>
                    <td style={{ padding: '15px' }}>
                      <input
                        type="number"
                        defaultValue={item.price}
                        step="0.01"
                        min="0.99"
                        style={{
                          width: '80px',
                          padding: '5px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          color: '#00b4d8'
                        }}
                        onBlur={(e) => updateContentPrice(item.id, parseFloat(e.target.value))}
                      />
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button
                        onClick={() => setFeaturedContent(item.id)}
                        style={{
                          padding: '5px 10px',
                          background: 'rgba(255,215,0,0.2)',
                          border: '1px solid #FFD700',
                          borderRadius: '5px',
                          color: '#FFD700',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        ⭐ Feature
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Stats */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid #333'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Revenue Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div>
              <p style={{ color: '#888' }}>Total Revenue</p>
              <p style={{ fontSize: '1.8rem', color: '#00b4d8' }}>$12,345.67</p>
            </div>
            <div>
              <p style={{ color: '#888' }}>This Month</p>
              <p style={{ fontSize: '1.8rem', color: '#FFD700' }}>$2,345.67</p>
            </div>
            <div>
              <p style={{ color: '#888' }}>Avg. Price</p>
              <p style={{ fontSize: '1.8rem', color: '#FFA500' }}>$5.99</p>
            </div>
            <div>
              <p style={{ color: '#888' }}>Conversion Rate</p>
              <p style={{ fontSize: '1.8rem', color: '#4CAF50' }}>12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAdminPanel;
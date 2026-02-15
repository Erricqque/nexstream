import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Channel = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [channel, setChannel] = useState(null);
  const [content, setContent] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching channel data
    setTimeout(() => {
      setChannel({
        id: 1,
        name: slug?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'My Awesome Channel',
        description: 'Welcome to my channel! I create amazing content about technology, gaming, and entertainment. Subscribe for regular updates!',
        subscribers: 15234,
        totalViews: 345678,
        joinedDate: '2024-01-15',
        isVerified: true,
        banner: 'https://images.unsplash.com/photo-1536240474400-95dad987ee1b?w=1200',
        avatar: `https://ui-avatars.com/api/?name=${slug || 'Channel'}&background=0ea5e9&color=fff&size=128`,
        socialLinks: {
          youtube: 'https://youtube.com',
          twitter: 'https://twitter.com',
          instagram: 'https://instagram.com'
        }
      });

      // Simulate content data
      setContent([
        { 
          id: 1, 
          title: 'How to Build a React App in 10 Minutes', 
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
          views: 15432,
          likes: 1234,
          comments: 89,
          duration: '10:23',
          uploadedAt: '2024-02-01',
          description: 'Learn how to build a professional React application quickly'
        },
        { 
          id: 2, 
          title: 'Complete Guide to Flutterwave Integration', 
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          views: 8765,
          likes: 987,
          comments: 56,
          duration: '15:47',
          uploadedAt: '2024-01-28',
          description: 'Step by step guide to integrating Flutterwave payments'
        },
        { 
          id: 3, 
          title: 'Top 10 Gaming Moments of 2024', 
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
          views: 23456,
          likes: 2341,
          comments: 234,
          duration: '12:15',
          uploadedAt: '2024-01-20',
          description: 'The most epic gaming moments this year'
        },
        { 
          id: 4, 
          title: 'Music Production Basics', 
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400',
          views: 5432,
          likes: 654,
          comments: 43,
          duration: '20:30',
          uploadedAt: '2024-01-15',
          description: 'Learn the fundamentals of music production'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [slug]);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    // In real app, this would call an API
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0f1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #00b4d8',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#00b4d8' }}>Loading channel...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Channel Banner */}
      <div style={{
        height: '250px',
        background: `url(${channel.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to top, #0a0f1e, transparent)'
        }}></div>
      </div>

      {/* Channel Info Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 30px',
        position: 'relative',
        marginTop: '-60px'
      }}>
        
        {/* Channel Header */}
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-end',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {/* Channel Avatar */}
          <img
            src={channel.avatar}
            alt={channel.name}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '4px solid #00b4d8',
              background: '#0a0f1e',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
          />

          {/* Channel Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>{channel.name}</h1>
              {channel.isVerified && (
                <span style={{
                  background: '#00b4d8',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  ✓ Verified
                </span>
              )}
            </div>
            
            {/* Channel Stats */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00b4d8' }}>
                  {formatNumber(channel.subscribers)}
                </span>
                <span style={{ color: '#888', marginLeft: '5px' }}>subscribers</span>
              </div>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00b4d8' }}>
                  {formatNumber(channel.totalViews)}
                </span>
                <span style={{ color: '#888', marginLeft: '5px' }}>views</span>
              </div>
              <div style={{ color: '#888' }}>
                Joined {new Date(channel.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button
                onClick={handleSubscribe}
                style={{
                  padding: '12px 30px',
                  background: isSubscribed ? '#333' : 'linear-gradient(135deg, #00b4d8, #0077b6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>

              {/* Show Create Content button if this is the user's own channel */}
              {user && user.id === channel.id && (
                <Link
                  to="/real-upload"
                  style={{
                    padding: '12px 30px',
                    background: 'transparent',
                    border: '2px solid #00b4d8',
                    borderRadius: '25px',
                    color: '#00b4d8',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  + Create Content
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Channel Description */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          border: '1px solid #333'
        }}>
          <p style={{ lineHeight: '1.6', color: '#ccc' }}>
            {channel.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '30px',
          borderBottom: '1px solid #333',
          marginBottom: '30px'
        }}>
          {[
            { id: 'videos', label: 'Videos', icon: '🎬' },
            { id: 'shorts', label: 'Shorts', icon: '📱' },
            { id: 'playlists', label: 'Playlists', icon: '📋' },
            { id: 'community', label: 'Community', icon: '👥' },
            { id: 'about', label: 'About', icon: 'ℹ️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '15px 5px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #00b4d8' : '3px solid transparent',
                color: activeTab === tab.id ? '#00b4d8' : '#888',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid - Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            {/* Upload Prompt for Channel Owners */}
            {user && user.id === channel.id && content.length === 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(0,180,216,0.1), rgba(0,119,182,0.1))',
                borderRadius: '15px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '30px',
                border: '2px dashed #00b4d8'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📤</div>
                <h2 style={{ marginBottom: '10px' }}>Your channel is ready!</h2>
                <p style={{ color: '#888', marginBottom: '20px' }}>
                  Start sharing your content with the world. Upload your first video to begin building your audience.
                </p>
                <Link
                  to="/real-upload"
                  style={{
                    padding: '15px 40px',
                    background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}
                >
                  🚀 Upload Your First Video
                </Link>
              </div>
            )}

            {/* Videos Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '25px',
              marginBottom: '40px'
            }}>
              {content.map(video => (
                <Link
                  key={video.id}
                  to={`/content/${video.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid #333'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = '#00b4d8';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#333';
                  }}
                  >
                    {/* Thumbnail with Duration */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '170px',
                          objectFit: 'cover'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '5px',
                        fontSize: '0.8rem'
                      }}>
                        {video.duration}
                      </span>
                    </div>

                    {/* Video Info */}
                    <div style={{ padding: '15px' }}>
                      <h3 style={{
                        margin: '0 0 10px 0',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        lineHeight: '1.4'
                      }}>
                        {video.title}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <img
                          src={channel.avatar}
                          alt={channel.name}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%'
                          }}
                        />
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>{channel.name}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', color: '#888', fontSize: '0.9rem' }}>
                        <span>{formatNumber(video.views)} views</span>
                        <span>•</span>
                        <span>{formatDate(video.uploadedAt)}</span>
                      </div>

                      {/* Engagement Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid #333',
                        fontSize: '0.8rem',
                        color: '#666'
                      }}>
                        <span>👍 {formatNumber(video.likes)}</span>
                        <span>💬 {video.comments}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid #333'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#00b4d8' }}>About this channel</h3>
            
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#888', marginBottom: '10px', fontSize: '0.9rem' }}>Description</h4>
              <p style={{ lineHeight: '1.6' }}>{channel.description}</p>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#888', marginBottom: '10px', fontSize: '0.9rem' }}>Stats</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00b4d8' }}>
                    {formatNumber(channel.subscribers)}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Subscribers</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00b4d8' }}>
                    {formatNumber(channel.totalViews)}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Total Views</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00b4d8' }}>
                    {content.length}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>Videos</div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#888', marginBottom: '10px', fontSize: '0.9rem' }}>Joined</h4>
              <p>{new Date(channel.joinedDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</p>
            </div>
          </div>
        )}

        {/* Other tabs (Shorts, Playlists, Community) - Placeholders */}
        {activeTab !== 'videos' && activeTab !== 'about' && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
              {activeTab === 'shorts' ? '📱' : activeTab === 'playlists' ? '📋' : '👥'}
            </div>
            <h3 style={{ marginBottom: '10px' }}>Coming Soon</h3>
            <p style={{ color: '#888' }}>
              {activeTab === 'shorts' && 'Short-form content is on its way!'}
              {activeTab === 'playlists' && 'Playlists will be available soon.'}
              {activeTab === 'community' && 'Community features are coming soon.'}
            </p>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Channel;
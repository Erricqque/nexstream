import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Channel = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [content, setContent] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadChannelData();
  }, [slug, user]);

  const loadChannelData = async () => {
    setLoading(true);
    try {
      // Get REAL channel data
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .select('*')
        .eq('slug', slug)
        .single();

      if (channelError) throw channelError;
      setChannel(channelData);

      // Check if current user is the owner
      if (user) {
        setIsOwner(user.id === channelData.owner_id);
      }

      // Get REAL content with view counts
      const { data: contentData, error: contentError } = await supabase
        .from('content')
        .select(`
          *,
          content_views(count)
        `)
        .eq('channel_id', channelData.id)
        .order('created_at', { ascending: false });

      if (!contentError) {
        setContent(contentData || []);
      }

      // Get REAL subscriber count
      const { count, error: subError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('channel_id', channelData.id);

      if (!subError) {
        setSubscriberCount(count || 0);
      }

      // Check if current user is subscribed
      if (user) {
        const { data: subData, error: checkError } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('channel_id', channelData.id)
          .eq('subscriber_id', user.id)
          .maybeSingle();

        setIsSubscribed(!!subData);
      }

    } catch (error) {
      console.error('Error loading channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please login to subscribe');
      return;
    }

    try {
      if (isSubscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from('subscriptions')
          .delete()
          .eq('channel_id', channel.id)
          .eq('subscriber_id', user.id);
        
        if (error) throw error;
        setSubscriberCount(prev => prev - 1);
        setIsSubscribed(false);
      } else {
        // Subscribe
        const { error } = await supabase
          .from('subscriptions')
          .insert([{
            channel_id: channel.id,
            subscriber_id: user.id
          }]);
        
        if (error) throw error;
        setSubscriberCount(prev => prev + 1);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to update subscription');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getContentIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'video': return '🎬';
      case 'music': return '🎵';
      case 'game': return '🎮';
      default: return '📹';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #ef4444',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#ef4444' }}>Loading channel...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Channel not found</h1>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>The channel you're looking for doesn't exist.</p>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Banner */}
      <div style={{
        height: '250px',
        background: channel?.banner_url ? `url(${channel.banner_url})` : 'linear-gradient(135deg, #ef4444, #dc2626, #3b82f6)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: 'linear-gradient(to top, #0f0f0f, transparent)'
        }}></div>
      </div>

      {/* Channel Info */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        marginTop: '-70px',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Channel Header */}
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          {/* Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: channel?.avatar_url ? `url(${channel.avatar_url})` : 'linear-gradient(135deg, #ef4444, #dc2626)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '4px solid #0f0f0f',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {!channel?.avatar_url && (channel?.name?.[0]?.toUpperCase() || 'C')}
          </div>

          {/* Details */}
          <div style={{ flex: 1, paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>{channel?.name}</h1>
              {channel?.is_verified && (
                <span style={{
                  background: '#3b82f6',
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
            
            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '10px',
              color: '#9ca3af',
              fontSize: '0.9rem',
              flexWrap: 'wrap'
            }}>
              <span>@{channel?.slug}</span>
              <span>•</span>
              <span>{formatNumber(subscriberCount)} subscribers</span>
              <span>•</span>
              <span>{content.length} videos</span>
              <span>•</span>
              <span>Joined {new Date(channel?.created_at).toLocaleDateString()}</span>
            </div>

            <p style={{
              marginTop: '15px',
              color: '#d1d5db',
              maxWidth: '600px',
              lineHeight: '1.6'
            }}>
              {channel?.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button
            onClick={handleSubscribe}
            style={{
              padding: '12px 30px',
              background: isSubscribed ? '#374151' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.target.style.background = isSubscribed ? '#4b5563' : '#dc2626'}
            onMouseLeave={e => e.target.style.background = isSubscribed ? '#374151' : '#ef4444'}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'} {formatNumber(subscriberCount)}
          </button>

          {isOwner && (
            <Link
              to="/upload"
              style={{
                padding: '12px 30px',
                background: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              + Upload Video
            </Link>
          )}

          <button style={{
            padding: '12px 30px',
            background: '#1f1f1f',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Share
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '30px',
          borderBottom: '1px solid #272727',
          marginBottom: '30px'
        }}>
          {['videos', 'playlists', 'about'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #ef4444' : '2px solid transparent',
                color: activeTab === tab ? 'white' : '#9ca3af',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            {content.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                {isOwner ? (
                  <>
                    <p style={{ color: '#9ca3af', marginBottom: '20px' }}>You haven't uploaded any videos yet</p>
                    <Link
                      to="/upload"
                      style={{
                        padding: '12px 30px',
                        background: '#ef4444',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                      }}
                    >
                      Upload Your First Video
                    </Link>
                  </>
                ) : (
                  <p style={{ color: '#9ca3af' }}>No videos uploaded yet</p>
                )}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '25px',
                marginBottom: '40px'
              }}>
                {content.map(item => (
                  <Link
                    key={item.id}
                    to={`/content/${item.id}`}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <div style={{
                      background: '#1f1f1f',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(239,68,68,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      
                      {/* Thumbnail */}
                      <div style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        background: '#272727',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          getContentIcon(item.type)
                        )}
                        
                        {item.duration && (
                          <span style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            padding: '4px 8px',
                            background: 'rgba(0,0,0,0.8)',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {item.duration}
                          </span>
                        )}
                      </div>

                      {/* Video Info */}
                      <div style={{ padding: '15px' }}>
                        <h3 style={{
                          margin: '0 0 8px 0',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.title}
                        </h3>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '5px',
                          color: '#9ca3af',
                          fontSize: '0.9rem'
                        }}>
                          <span>{formatNumber(item.content_views?.[0]?.count || 0)} views</span>
                          <span>{formatDate(item.created_at)}</span>
                        </div>

                        {item.price > 0 ? (
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: '#fbbf24',
                            color: 'black',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            ${item.price}
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: '#10b981',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div style={{ maxWidth: '800px', paddingBottom: '40px' }}>
            <div style={{
              background: '#1f1f1f',
              borderRadius: '12px',
              padding: '30px'
            }}>
              <h2 style={{ marginBottom: '20px' }}>About</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#9ca3af', marginBottom: '10px', fontSize: '1rem' }}>Description</h3>
                <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {channel?.description || 'No description provided.'}
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '30px',
                paddingTop: '30px',
                borderTop: '1px solid #272727'
              }}>
                <div>
                  <h3 style={{ color: '#9ca3af', marginBottom: '10px', fontSize: '1rem' }}>Joined</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {new Date(channel?.created_at).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <h3 style={{ color: '#9ca3af', marginBottom: '10px', fontSize: '1rem' }}>Total Views</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ef4444' }}>
                    {formatNumber(content.reduce((sum, item) => 
                      sum + (item.content_views?.[0]?.count || 0), 0
                    ))}
                  </p>
                </div>

                <div>
                  <h3 style={{ color: '#9ca3af', marginBottom: '10px', fontSize: '1rem' }}>Subscribers</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {formatNumber(subscriberCount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Playlists Tab (Coming Soon) */}
        {activeTab === 'playlists' && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <p>Playlists coming soon...</p>
          </div>
        )}
      </div>

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
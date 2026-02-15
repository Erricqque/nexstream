import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Content = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Simulate fetching content data
    setTimeout(() => {
      setContent({
        id: id,
        title: 'Amazing Content Title',
        description: 'This is a detailed description of the content. It explains what viewers can expect and why they should watch it. The creator has put a lot of effort into making this amazing!',
        type: 'VIDEO',
        icon: '🎬',
        thumbnail: 'https://images.unsplash.com/photo-1536240474400-95dad987ee1b?w=800',
        views: 12345,
        likes: 567,
        price: 4.99,
        isFree: false,
        channel: {
          id: 1,
          name: 'Awesome Channel',
          slug: 'awesome-channel',
          avatar: 'A'
        },
        createdAt: '2024-01-15'
      });
    }, 500);
  }, [id]);

  if (!content) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
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
          <p style={{ color: '#00b4d8' }}>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '30px'
    }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Video Player Area */}
        {/* Video Player Area */}
<div style={{
  background: '#000',
  borderRadius: '20px',
  overflow: 'hidden',
  aspectRatio: '16/9',
  position: 'relative',
  marginBottom: '30px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
}}>
  <img 
    src={content.thumbnail} 
    alt={content.title}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: '0.7'
    }}
  />
  {/* There might be text here */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  }}>
    <div style={{
      width: '80px',
      height: '80px',
      background: 'rgba(0,180,216,0.9)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      fontSize: '30px'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      ▶
    </div>
    <p style={{ color: 'white', fontSize: '1.2rem' }}>Click to Play</p>
  </div>
</div>

        {/* Title and Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
           <h1 style={{
  fontSize: '3rem',
  margin: '0 0 10px 0',
  fontWeight: '800',
  textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
  background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF69B4, #00b4d8, #0077b6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundSize: '300% 300%',
  animation: 'gradientFlow 5s ease infinite',
  letterSpacing: '-0.5px',
  lineHeight: '1.2'
}}>
  {content.title}
</h1>
            <div style={{ display: 'flex', gap: '20px', color: '#888' }}>
              <span>{content.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{new Date(content.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => setLiked(!liked)}
              style={{
                padding: '12px 30px',
                background: liked ? 'rgba(255,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                border: liked ? '1px solid #ff4444' : '1px solid #333',
                borderRadius: '30px',
                color: liked ? '#ff4444' : 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{liked ? '❤️' : '🤍'}</span>
              Like ({content.likes + (liked ? 1 : 0)})
            </button>

            <button style={{
              padding: '12px 30px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid #333',
              borderRadius: '30px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>↗️</span> Share
            </button>

            {!content.isFree && (
              <Link
                to="/payment"
                state={{
                  content: content,
                  price: content.price,
                  title: content.title
                }}
                style={{ textDecoration: 'none' }}
              >
                <button style={{
                  padding: '12px 40px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'black',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 5px 15px rgba(255,215,0,0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  Buy Now ${content.price}
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Channel Info */}
        <Link
          to={`/channel/${content.channel.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            marginBottom: '30px',
            border: '1px solid #333',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,180,216,0.1)';
            e.currentTarget.style.borderColor = '#00b4d8';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = '#333';
          }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {content.channel.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{content.channel.name}</h3>
              <p style={{ margin: 0, color: '#888' }}>View channel →</p>
            </div>
          </div>
        </Link>

        {/* Description */}
        <div style={{
          padding: '30px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '15px',
          border: '1px solid #333'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: '#00b4d8',
            fontSize: '1.3rem'
          }}>
            Description
          </h3>
          <p style={{ 
            color: '#aaa',
            lineHeight: '1.6',
            fontSize: '1rem',
            margin: 0
          }}>
            {content.description}
          </p>
        </div>
      </div>

      {/* Animation style */}
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

export default Content;
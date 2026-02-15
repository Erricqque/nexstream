import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AIHomeWidget = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState([
    "Welcome to NexStream! I'm your AI assistant 🤖",
    "Create your channel and start earning today!",
    "Need help? I'm here 24/7 to assist you."
  ]);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 1000,
      animation: 'slideIn 0.5s ease'
    }}>
      {/* AI Avatar */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,180,216,0.3)',
        position: 'relative',
        animation: 'pulse 2s infinite'
      }}
      onClick={() => window.location.href = '/ai-assistant'}
      >
        <span style={{ fontSize: '30px' }}>🤖</span>
        
        {/* Notification Dot */}
        <span style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '15px',
          height: '15px',
          background: '#ff4444',
          borderRadius: '50%',
          border: '2px solid #0a0f1e'
        }}></span>
      </div>

      {/* Speech Bubble */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '0',
        width: '250px',
        background: '#1a1a2e',
        borderRadius: '15px',
        padding: '15px',
        border: '1px solid #00b4d8',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'transparent',
            border: 'none',
            color: '#888',
            cursor: 'pointer'
          }}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>

        {/* Message */}
        <p style={{
          color: 'white',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          marginBottom: '10px',
          paddingRight: '15px'
        }}>
          {messages[currentMessage]}
        </p>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
          <Link to="/ai-assistant" style={{
            flex: 1,
            padding: '5px',
            background: 'rgba(0,180,216,0.2)',
            border: '1px solid #00b4d8',
            borderRadius: '5px',
            color: '#00b4d8',
            fontSize: '0.8rem',
            textDecoration: 'none',
            textAlign: 'center'
          }}>
            Chat Now
          </Link>
          <button style={{
            flex: 1,
            padding: '5px',
            background: 'transparent',
            border: '1px solid #333',
            borderRadius: '5px',
            color: '#888',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
          onClick={() => setIsVisible(false)}>
            Later
          </button>
        </div>

        {/* Triangle Pointer */}
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          right: '25px',
          width: '0',
          height: '0',
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid #1a1a2e'
        }}></div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateY(100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(0,180,216,0.7);
            }
            70% {
              box-shadow: 0 0 0 15px rgba(0,180,216,0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(0,180,216,0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AIHomeWidget;
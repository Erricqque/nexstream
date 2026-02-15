import React, { useState } from 'react';

const SimpleChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to NexStream Chat!', sender: 'System' },
    { id: 2, text: 'This is a working chat example', sender: 'System' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'You'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          NexStream Chat
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          Simple working chat example
        </p>

        {/* Messages Container */}
        <div style={{
          height: '500px',
          overflowY: 'auto',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #333'
        }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                background: msg.sender === 'You' ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                borderLeft: msg.sender === 'You' ? '4px solid #00b4d8' : '4px solid #888'
              }}
            >
              <strong style={{ color: '#00b4d8' }}>{msg.sender}:</strong>
              <p style={{ margin: '5px 0 0 0' }}>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '15px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid #333',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </form>

        {/* Status */}
        <p style={{ textAlign: 'center', color: '#4CAF50', marginTop: '20px' }}>
          ✅ Chat is working! Type a message to test.
        </p>
      </div>
    </div>
  );
};

export default SimpleChat;
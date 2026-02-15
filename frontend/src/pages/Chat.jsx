import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load users from database
    fetchUsers();
    
    // Join chat with user info
    socket.emit('user-connected', { 
      userId: user.id, 
      name: user.user_metadata?.full_name || user.email 
    });

    // Listen for messages
    socket.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
      
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('New message', {
          body: `${message.senderName}: ${message.content}`,
          icon: '/logo.png'
        });
      }
    });

    // Listen for typing
    socket.on('user-typing', ({ userId, isTyping }) => {
      if (userId === selectedUser?.id) {
        setTyping(isTyping);
      }
    });

    // Listen for user status
    socket.on('user-status', ({ userId, online }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (online) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('receive-message');
      socket.off('user-typing');
      socket.off('user-status');
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    // Simulated users - replace with API call
    setUsers([
      { id: 2, name: 'John Doe', avatar: '👤', email: 'john@example.com' },
      { id: 3, name: 'Jane Smith', avatar: '👩', email: 'jane@example.com' },
      { id: 4, name: 'Bob Johnson', avatar: '👨', email: 'bob@example.com' },
    ]);
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    // Load chat history
    setMessages([
      { 
        id: 1, 
        senderId: user.id, 
        senderName: user.name,
        content: 'Hey there! How are you?', 
        timestamp: new Date(Date.now() - 3600000) 
      },
      { 
        id: 2, 
        senderId: user.id, 
        senderName: user.name,
        content: 'Check out my new content!', 
        timestamp: new Date(Date.now() - 1800000) 
      },
      { 
        id: 3, 
        senderId: user.id, 
        senderName: user.name,
        content: 'Would love your feedback', 
        timestamp: new Date(Date.now() - 900000) 
      },
    ]);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      id: Date.now(),
      senderId: user.id,
      senderName: user.user_metadata?.full_name || user.email,
      receiverId: selectedUser.id,
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    socket.emit('send-message', message);
    setNewMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', {
      userId: user.id,
      receiverId: selectedUser?.id,
      isTyping: true
    });

    setTimeout(() => {
      socket.emit('typing', {
        userId: user.id,
        receiverId: selectedUser?.id,
        isTyping: false
      });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      display: 'flex',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Users Sidebar */}
      <div style={{
        width: '320px',
        background: 'rgba(0,0,0,0.3)',
        borderRight: '1px solid #333'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #333'
        }}>
          <h2 style={{ margin: 0 }}>Messages</h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px' }}>
            {onlineUsers.size} users online
          </p>
        </div>

        <div style={{ overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
          {users.map(u => (
            <div
              key={u.id}
              onClick={() => selectUser(u)}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid #222',
                background: selectedUser?.id === u.id ? 'rgba(0,180,216,0.2)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => {
                if (selectedUser?.id !== u.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: onlineUsers.has(u.id) ? 'linear-gradient(135deg, #00b4d8, #0077b6)' : '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                position: 'relative'
              }}>
                {u.avatar}
                <span style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: onlineUsers.has(u.id) ? '#4CAF50' : '#888',
                  border: '2px solid #0a0f1e'
                }}></span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{u.name}</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                  {onlineUsers.has(u.id) ? '🟢 Online' : '⚫ Offline'}
                </p>
              </div>
              {onlineUsers.has(u.id) && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4CAF50'
                }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '20px',
              background: 'rgba(0,0,0,0.3)',
              borderBottom: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {selectedUser.avatar}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{selectedUser.name}</h3>
                <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.9rem' }}>
                  {onlineUsers.has(selectedUser.id) ? '🟢 Online' : '⚫ Last seen recently'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 18px',
                    background: msg.senderId === user.id 
                      ? 'linear-gradient(135deg, #00b4d8, #0077b6)'
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: msg.senderId === user.id 
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    color: 'white',
                    wordWrap: 'break-word',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {msg.senderId !== user.id && (
                      <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#00b4d8' }}>
                        {msg.senderName}
                      </p>
                    )}
                    <p style={{ margin: '0 0 5px 0' }}>{msg.content}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.7rem',
                      opacity: 0.7,
                      textAlign: 'right'
                    }}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 18px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '18px',
                    color: '#888',
                    display: 'flex',
                    gap: '5px'
                  }}>
                    <span style={{ animation: 'typing 1s infinite' }}>•</span>
                    <span style={{ animation: 'typing 1s infinite 0.2s' }}>•</span>
                    <span style={{ animation: 'typing 1s infinite 0.4s' }}>•</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{
              padding: '20px',
              background: 'rgba(0,0,0,0.3)',
              borderTop: '1px solid #333',
              display: 'flex',
              gap: '10px'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleTyping}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '15px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #333',
                  borderRadius: '25px',
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
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ marginBottom: '10px' }}>Welcome to NexStream Chat</h2>
              <p>Select a user to start messaging</p>
              <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                {onlineUsers.size} users online now
              </p>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes typing {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}
      </style>
    </div>
  );
};

export default Chat;
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
// import { io } from 'socket.io-client';

// Socket is disabled for now - will be re-enabled when backend is ready
// const socket = io('http://localhost:3001');

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadUsers();
      loadConversations();
      
      // Socket disabled for now
      // socket.emit('user-connected', user.id);

      // socket.on('receive-message', (message) => {
      //   if (message.receiver_id === user.id || message.sender_id === user.id) {
      //     setMessages(prev => [...prev, message]);
      //     scrollToBottom();
      //   }
      // });

      // socket.on('typing', ({ userId, isTyping }) => {
      //   if (userId === selectedChat?.id) {
      //     setTyping(isTyping);
      //   }
      // });

      // socket.on('user-status', ({ userId, online }) => {
      //   setUsers(prev => prev.map(u => 
      //     u.id === userId ? { ...u, online } : u
      //   ));
      // });
    }

    // return () => {
    //   socket.off('receive-message');
    //   socket.off('typing');
    //   socket.off('user-status');
    // };
  }, [user]); // Removed selectedChat dependency since socket is disabled

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading users for chat, current user:', user?.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user?.id);  // Load all users EXCEPT current user
      
      if (error) {
        console.error('Error loading users:', error);
      } else {
        console.log('Loaded users:', data);
        // Add online status (all offline since socket is disabled)
        const usersWithStatus = data?.map(u => ({ ...u, online: false })) || [];
        setUsers(usersWithStatus);
      }
    } catch (error) {
      console.error('Exception loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id(*), receiver:receiver_id(*)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        return;
      }

      // Group by conversation
      const convMap = new Map();
      data?.forEach(msg => {
        const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;
        if (otherUser && !convMap.has(otherUser.id)) {
          convMap.set(otherUser.id, {
            user: otherUser,
            lastMessage: msg,
            unread: !msg.read && msg.receiver_id === user.id
          });
        }
      });

      setConversations(Array.from(convMap.values()));
    } catch (error) {
      console.error('Exception loading conversations:', error);
    }
  };

  const selectUser = async (otherUser) => {
    setSelectedChat(otherUser);
    
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data || []);
      }
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUser.id);

      // Socket disabled for now
      // socket.emit('join-chat', { userId: user.id, receiverId: otherUser.id });
    } catch (error) {
      console.error('Error in selectUser:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user?.id) return;

    const message = {
      sender_id: user.id,
      receiver_id: selectedChat.id,
      content: newMessage,
      read: false,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setMessages(prev => [...prev, data]);
      // socket.emit('send-message', data); // Disabled for now
      setNewMessage('');
      
      // Update conversations list
      loadConversations();
    } catch (error) {
      console.error('Exception sending message:', error);
    }
  };

  const handleTyping = () => {
    // Socket disabled for now
    // socket.emit('typing', {
    //   userId: user.id,
    //   receiverId: selectedChat?.id,
    //   isTyping: true
    // });

    // setTimeout(() => {
    //   socket.emit('typing', {
    //     userId: user.id,
    //     receiverId: selectedChat?.id,
    //     isTyping: false
    //   });
    // }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && users.length === 0) {
    return (
      <div style={{
        height: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      background: '#0f0f0f',
      color: 'white',
      display: 'flex',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      {/* Users Sidebar */}
      <div style={{
        width: '300px',
        background: '#1a1a1a',
        borderRight: '1px solid #2d2d2d',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #2d2d2d'
        }}>
          <h2 style={{ margin: 0 }}>Chats</h2>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.8rem' }}>
            {users.length} user{users.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {users.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#888'
            }}>
              <p>No other users found.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                Create another account to start chatting!
              </p>
            </div>
          ) : (
            users.map(u => (
              <div
                key={u.id}
                onClick={() => selectUser(u)}
                style={{
                  padding: '15px',
                  cursor: 'pointer',
                  background: selectedChat?.id === u.id ? '#2d2d2d' : 'transparent',
                  borderBottom: '1px solid #2d2d2d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => {
                  if (selectedChat?.id !== u.id) {
                    e.currentTarget.style.background = '#252525';
                  }
                }}
                onMouseLeave={e => {
                  if (selectedChat?.id !== u.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name || u.email || 'User'}&background=ef4444&color=fff`}
                    alt=""
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: u.online ? '#4CAF50' : '#888',
                    border: '2px solid #1a1a1a'
                  }}></span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem' }}>
                    {u.full_name || u.email?.split('@')[0] || 'User'}
                  </h4>
                  <p style={{
                    margin: 0,
                    color: '#888',
                    fontSize: '0.8rem'
                  }}>
                    {u.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '20px',
              background: '#1a1a1a',
              borderBottom: '1px solid #2d2d2d',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <img
                src={selectedChat.avatar_url || `https://ui-avatars.com/api/?name=${selectedChat.full_name || selectedChat.email || 'User'}&background=ef4444&color=fff`}
                alt=""
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h3 style={{ margin: 0 }}>
                  {selectedChat.full_name || selectedChat.email?.split('@')[0] || 'User'}
                </h3>
                <p style={{
                  margin: '5px 0 0 0',
                  color: '#888',
                  fontSize: '0.8rem'
                }}>
                  {selectedChat.online ? 'Online' : 'Offline'}
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
              {messages.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#888',
                  padding: '40px'
                }}>
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender_id === user?.id ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '10px 15px',
                      background: msg.sender_id === user?.id ? '#ef4444' : '#2d2d2d',
                      borderRadius: msg.sender_id === user?.id
                        ? '18px 18px 4px 18px'
                        : '18px 18px 18px 4px',
                      color: 'white',
                      wordWrap: 'break-word'
                    }}>
                      <p style={{ margin: '0 0 5px 0' }}>{msg.content}</p>
                      <p style={{
                        margin: 0,
                        fontSize: '0.65rem',
                        opacity: 0.7,
                        textAlign: 'right'
                      }}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {typing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '10px 15px',
                    background: '#2d2d2d',
                    borderRadius: '18px',
                    color: '#888'
                  }}>
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{
              padding: '20px',
              background: '#1a1a1a',
              borderTop: '1px solid #2d2d2d'
            }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    handleTyping();
                    if (e.key === 'Enter') sendMessage();
                  }}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#2d2d2d',
                    border: '1px solid #3d3d3d',
                    borderRadius: '25px',
                    color: 'white',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    padding: '12px 25px',
                    background: !newMessage.trim() ? '#555' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: !newMessage.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    opacity: !newMessage.trim() ? 0.5 : 1
                  }}
                >
                  Send
                </button>
              </div>
            </div>
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
              <h2>Welcome to NexStream Chat</h2>
              <p>Select a user to start messaging</p>
              {users.length === 0 && (
                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                  No other users found. Create another account to chat!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
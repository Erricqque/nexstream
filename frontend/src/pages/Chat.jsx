import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    
    socket.on('receive-message', (message) => {
      if (message.chatId === selectedChat?.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('typing', ({ userId, chatId, isTyping }) => {
      if (chatId === selectedChat?.id && userId !== user.id) {
        setTyping(isTyping);
      }
    });

    return () => {
      socket.off('receive-message');
      socket.off('typing');
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          user:user_id(
            id,
            email,
            full_name,
            avatar_url
          )
        ),
        last_message:messages(
          content,
          created_at,
          sender_id
        )
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false });

    setConversations(data || []);
  };

  const selectChat = async (chat) => {
    setSelectedChat(chat);
    
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: true });

    setMessages(data || []);
    
    socket.emit('join-chat', { chatId: chat.id, userId: user.id });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      chat_id: selectedChat.id,
      sender_id: user.id,
      content: newMessage,
      type: 'text',
      created_at: new Date()
    };

    const { data } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single();

    setMessages(prev => [...prev, data]);
    socket.emit('send-message', { ...data, chatId: selectedChat.id });
    setNewMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', {
      userId: user.id,
      chatId: selectedChat?.id,
      isTyping: true
    });

    setTimeout(() => {
      socket.emit('typing', {
        userId: user.id,
        chatId: selectedChat?.id,
        isTyping: false
      });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      height: '100vh',
      background: '#0f0f0f',
      color: 'white',
      display: 'flex',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Conversations Sidebar */}
      <div style={{
        width: '350px',
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
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map(chat => {
            const otherUser = chat.participants?.find(p => p.user.id !== user.id)?.user;
            return (
              <div
                key={chat.id}
                onClick={() => selectChat(chat)}
                style={{
                  padding: '15px',
                  cursor: 'pointer',
                  background: selectedChat?.id === chat.id ? '#2d2d2d' : 'transparent',
                  borderBottom: '1px solid #2d2d2d',
                  display: 'flex',
                  gap: '15px'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {otherUser?.full_name?.[0] || otherUser?.email?.[0] || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>
                    {otherUser?.full_name || otherUser?.email || 'User'}
                  </h4>
                  <p style={{
                    margin: 0,
                    color: '#888',
                    fontSize: '0.9rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {chat.last_message?.[0]?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })}
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
              gap: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedChat.participants?.find(p => p.user.id !== user.id)?.user?.full_name?.[0] || '?'}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>
                  {selectedChat.participants?.find(p => p.user.id !== user.id)?.user?.full_name || 'User'}
                </h3>
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
                    justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '60%',
                    padding: '12px 16px',
                    background: msg.sender_id === user.id ? '#ef4444' : '#2d2d2d',
                    borderRadius: msg.sender_id === user.id 
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    color: 'white',
                    wordWrap: 'break-word'
                  }}>
                    <p style={{ margin: '0 0 5px 0' }}>{msg.content}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.7rem',
                      opacity: 0.7,
                      textAlign: 'right'
                    }}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px',
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
                    color: 'white'
                  }}
                />
                <button
                  onClick={sendMessage}
                  style={{
                    padding: '12px 25px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer'
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
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
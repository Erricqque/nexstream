import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const AIChat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Store that user wanted to go to AI chat
        localStorage.setItem('redirectAfterLogin', '/ai-chat');
        navigate('/login');
        return;
      }
      setUser(user);
      loadChatHistory(user.id);
      startNewChat();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async (userId) => {
    try {
      const { data } = await supabase
        .from('ai_chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      setChatHistory(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const startNewChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      role: 'assistant',
      content: '👋 Hello! I\'m your NexStream AI assistant. I can help you with:\n\n• Creating and managing your account\n• Uploading and monetizing content\n• Understanding earnings and withdrawals\n• MLM business opportunities\n• Platform features and tips\n\nWhat would you like to know?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setCurrentChatId(null);
  };

  const loadChat = async (chatId) => {
    try {
      const { data } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      setMessages(data || []);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const saveChat = async () => {
    if (!user || messages.length <= 1) return;

    try {
      if (!currentChatId) {
        // Create new chat
        const { data: chat } = await supabase
          .from('ai_chats')
          .insert([{
            user_id: user.id,
            title: messages[1]?.content.substring(0, 50) + '...' || 'New Chat',
            created_at: new Date()
          }])
          .select()
          .single();

        setCurrentChatId(chat.id);
        setChatHistory([chat, ...chatHistory]);

        // Save messages
        const messagesToSave = messages.map(msg => ({
          chat_id: chat.id,
          role: msg.role,
          content: msg.content,
          created_at: msg.timestamp || new Date()
        }));

        await supabase.from('ai_messages').insert(messagesToSave);
      } else {
        // Update existing chat
        await supabase
          .from('ai_messages')
          .delete()
          .eq('chat_id', currentChatId);

        const messagesToSave = messages.map(msg => ({
          chat_id: currentChatId,
          role: msg.role,
          content: msg.content,
          created_at: msg.timestamp || new Date()
        }));

        await supabase.from('ai_messages').insert(messagesToSave);
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || aiLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAiLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        messages: messages.concat(userMessage).map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      await saveChat();
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await supabase
        .from('ai_chats')
        .delete()
        .eq('id', chatId);

      setChatHistory(chatHistory.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
        startNewChat();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #ff3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      display: 'flex',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .sidebar { width: 100% !important; position: fixed !important; z-index: 1000; }
          .chat-area { margin-left: 0 !important; }
        }
      `}</style>

      {/* Sidebar - Chat History */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="sidebar"
        style={{
          width: sidebarOpen ? '300px' : '0',
          background: '#1a1a1a',
          borderRight: '1px solid #333',
          height: '100vh',
          overflow: 'hidden',
          transition: 'width 0.3s',
          position: 'relative'
        }}
      >
        {sidebarOpen && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #333',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Chat History</h2>
              <button
                onClick={startNewChat}
                style={{
                  padding: '8px 12px',
                  background: '#ff3366',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                + New Chat
              </button>
            </div>

            {/* Chat List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {chatHistory.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
                  No chat history yet
                </p>
              ) : (
                chatHistory.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => loadChat(chat.id)}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      background: currentChatId === chat.id ? '#ff3366' : '#2a2a2a',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                  >
                    <p style={{
                      margin: '0 0 5px 0',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {chat.title}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.7rem',
                      color: currentChatId === chat.id ? 'rgba(255,255,255,0.7)' : '#888'
                    }}>
                      {new Date(chat.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        color: currentChatId === chat.id ? 'white' : '#888',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        opacity: 0.5,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={e => e.target.style.opacity = 1}
                      onMouseLeave={e => e.target.style.opacity = 0.5}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* User Info */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {user?.email?.[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {user?.email?.split('@')[0]}
                </p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
          left: sidebarOpen ? '300px' : '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '30px',
          height: '60px',
          background: '#ff3366',
          border: 'none',
          borderRadius: '0 10px 10px 0',
          color: 'white',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'left 0.3s'
        }}
      >
        {sidebarOpen ? '←' : '→'}
      </button>

      {/* Main Chat Area */}
      <div className="chat-area" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0f0f0f',
        marginLeft: sidebarOpen ? '0' : '0'
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '20px 30px',
          background: '#1a1a1a',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
              AI Assistant
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '0.9rem' }}>
              Powered by OpenAI • Your personal NexStream guide
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  🤖
                </div>
              )}
              <div style={{
                maxWidth: '70%',
                padding: '15px 20px',
                background: msg.role === 'user' ? '#ff3366' : '#2a2a2a',
                borderRadius: msg.role === 'user' 
                  ? '20px 20px 4px 20px' 
                  : '20px 20px 20px 4px',
                color: 'white',
                fontSize: '1rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {msg.content}
                <div style={{
                  fontSize: '0.7rem',
                  color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#888',
                  marginTop: '8px',
                  textAlign: 'right'
                }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ff3366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                  textTransform: 'uppercase'
                }}>
                  {user?.email?.[0] || 'U'}
                </div>
              )}
            </motion.div>
          ))}
          {aiLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                🤖
              </div>
              <div style={{
                padding: '15px 20px',
                background: '#2a2a2a',
                borderRadius: '20px 20px 20px 4px',
                color: '#888'
              }}>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Thinking...
                </motion.span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px 30px',
          background: '#1a1a1a',
          borderTop: '1px solid #333'
        }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about NexStream..."
              rows="2"
              style={{
                flex: 1,
                padding: '15px',
                background: '#2a2a2a',
                border: '1px solid #333',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                resize: 'none',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={aiLoading || !input.trim()}
              style={{
                padding: '0 30px',
                background: aiLoading || !input.trim() ? '#555' : 'linear-gradient(135deg, #ff3366, #4facfe)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: aiLoading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Send
            </button>
          </div>
          <p style={{
            color: '#666',
            fontSize: '0.8rem',
            marginTop: '10px',
            textAlign: 'center'
          }}>
            Powered by OpenAI • Your conversations are saved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
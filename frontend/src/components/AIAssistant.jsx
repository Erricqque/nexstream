import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '👋 Hi! I\'m your NexStream AI assistant. I can help you with:\n\n• Uploading and monetizing content\n• Earning money through views\n• MLM business opportunities\n• Withdrawing your earnings\n• Creating playlists and communities\n\nWhat would you like to know?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '😔 Sorry, I encountered an error. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "How do I earn money on NexStream?",
    "What is the MLM program?",
    "How do I withdraw my earnings?",
    "How to upload a video?",
    "Tell me about business accounts"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '380px',
        height: '550px',
        background: '#1a1a2a',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        zIndex: 1000
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #ff3366, #4facfe)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            🤖
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>NexStream AI</h3>
            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>
              Powered by OpenAI • Online
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        background: '#0f0f1a'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#ff3366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                AI
              </div>
            )}
            <div style={{
              maxWidth: msg.role === 'user' ? '80%' : 'calc(80% - 38px)',
              padding: '12px 16px',
              background: msg.role === 'user' ? '#ff3366' : '#2a2a3a',
              borderRadius: msg.role === 'user' 
                ? '18px 18px 4px 18px' 
                : '18px 18px 18px 4px',
              color: 'white',
              fontSize: '0.95rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#ff3366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              fontSize: '0.9rem'
            }}>
              AI
            </div>
            <div style={{
              padding: '12px 16px',
              background: '#2a2a3a',
              borderRadius: '18px 18px 18px 4px',
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

      {/* Suggested Questions */}
      {messages.length < 3 && (
        <div style={{
          padding: '15px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: '#1a1a2a'
        }}>
          <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '10px' }}>
            Suggested questions:
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(q);
                  setTimeout(sendMessage, 100);
                }}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  color: '#aaa',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#ff3366'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '15px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: '#1a1a2a'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about NexStream..."
            rows="1"
            style={{
              flex: 1,
              padding: '12px',
              background: '#2a2a3a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '25px',
              color: 'white',
              fontSize: '0.95rem',
              resize: 'none',
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 25px',
              background: loading || !input.trim() ? '#555' : 'linear-gradient(135deg, #ff3366, #4facfe)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            Send
          </button>
        </div>
        <p style={{
          color: '#666',
          fontSize: '0.7rem',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Powered by OpenAI • Real-time responses
        </p>
      </div>
    </motion.div>
  );
};

export default AIAssistant;
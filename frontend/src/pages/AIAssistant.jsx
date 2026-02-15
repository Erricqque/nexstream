import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '👋 Hello! I\'m your NexStream AI assistant. I can help you with:\n\n• Creating channels and uploading content\n• Understanding how earnings and commissions work\n• Payment processing with Flutterwave\n• Becoming a verified creator or sub-admin\n• Network marketing and referrals\n\nWhat would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    "How do I create a channel?",
    "How much can I earn from my content?",
    "How does the MLM commission work?",
    "How do I get paid?",
    "What's the difference between user and creator?",
    "How do I become a sub-admin?"
  ];

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Call your backend API
      const response = await fetch('http://localhost:5000/api/ai/chat/nexstream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: text })
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle error
        const errorMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `❌ Sorry, I encountered an error: ${data.error || 'Unknown error'}. Please try again.`
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '❌ Sorry, I cannot connect to the AI service right now. Please make sure your backend server is running.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: '👋 Hello! I\'m your NexStream AI assistant. How can I help you today?'
      }
    ]);
    setShowSuggestions(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        background: '#0b1a2e',
        borderBottom: '1px solid #1e2a3a',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            AI
          </div>
          <div>
            <h2 style={{ margin: 0 }}>NexStream AI Assistant</h2>
            <p style={{ margin: '5px 0 0 0', color: '#64ffda', fontSize: '14px' }}>
              Powered by OpenAI GPT
            </p>
          </div>
        </div>
        <button
          onClick={clearConversation}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #1e2a3a',
            borderRadius: '5px',
            color: '#888',
            cursor: 'pointer'
          }}
        >
          New Chat
        </button>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '30px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              marginBottom: '25px',
              gap: '15px'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: msg.role === 'assistant' 
                ? 'linear-gradient(135deg, #00b4d8, #0077b6)' 
                : '#1e2a3a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {msg.role === 'assistant' ? 'AI' : 'U'}
            </div>

            {/* Message Content */}
            <div style={{
              flex: 1,
              lineHeight: '1.6'
            }}>
              <div style={{
                color: msg.role === 'assistant' ? '#e1e1e1' : '#64ffda',
                fontWeight: msg.role === 'assistant' ? 'normal' : 'bold',
                marginBottom: '5px'
              }}>
                {msg.role === 'assistant' ? 'NexStream AI' : 'You'}
              </div>
              <div style={{
                background: msg.role === 'assistant' ? '#0b1a2e' : 'transparent',
                padding: msg.role === 'assistant' ? '15px' : '0',
                borderRadius: '10px',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              AI
            </div>
            <div style={{
              background: '#0b1a2e',
              padding: '15px',
              borderRadius: '10px',
              display: 'flex',
              gap: '5px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#00b4d8',
                borderRadius: '50%',
                animation: 'typing 1.4s infinite'
              }}></span>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#00b4d8',
                borderRadius: '50%',
                animation: 'typing 1.4s infinite 0.2s'
              }}></span>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#00b4d8',
                borderRadius: '50%',
                animation: 'typing 1.4s infinite 0.4s'
              }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && messages.length === 1 && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto 20px',
          padding: '0 30px',
          width: '100%'
        }}>
          <p style={{ color: '#888', marginBottom: '15px' }}>Try asking:</p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                style={{
                  padding: '10px 20px',
                  background: '#0b1a2e',
                  border: '1px solid #1e2a3a',
                  borderRadius: '20px',
                  color: '#e1e1e1',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#1a2a3a'}
                onMouseLeave={e => e.target.style.background = '#0b1a2e'}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={{
        borderTop: '1px solid #1e2a3a',
        padding: '20px 30px',
        background: '#0b1a2e'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          gap: '10px'
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about NexStream..."
            rows="1"
            style={{
              flex: 1,
              padding: '15px',
              background: '#0a0f1e',
              border: '1px solid #1e2a3a',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              resize: 'none',
              fontFamily: 'Arial, sans-serif'
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '0 25px',
              background: !input.trim() || isLoading ? '#1e2a3a' : 'linear-gradient(135deg, #00b4d8, #0077b6)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              opacity: !input.trim() || isLoading ? 0.5 : 1
            }}
          >
            Send
          </button>
        </div>
        <p style={{
          textAlign: 'center',
          color: '#4a5a6a',
          fontSize: '12px',
          marginTop: '10px'
        }}>
          This AI assistant has knowledge about NexStream platform features, earnings, and how to use the platform.
        </p>
      </div>

      {/* Animations */}
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

export default AIAssistant;
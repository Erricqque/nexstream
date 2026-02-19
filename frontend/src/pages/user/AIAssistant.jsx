import React, { useState, useRef, useEffect } from 'react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "👋 Hello! I'm your NexStream AI assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "How do I earn money?",
    "What's the MLM commission?",
    "How to withdraw funds?",
    "Create a channel",
    "Upload content",
    "Business account"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (question) => {
    const text = question || input;
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Generate AI response based on keywords
    setTimeout(() => {
      let response = '';
      const q = text.toLowerCase();

      if (q.includes('earn') || q.includes('money')) {
        response = "You can earn through:\n\n💰 Content sales (set your own prices)\n👥 MLM referrals (10% level 1, 5% level 2, 2.5% level 3)\n💼 Business account (sell products, keep 55%)\n🎬 Channel monetization";
      } else if (q.includes('mlm') || q.includes('referral') || q.includes('commission')) {
        response = "MLM Commission Structure:\n\n• Level 1 (direct referrals): 10%\n• Level 2 (their referrals): 5%\n• Level 3: 2.5%\n\nCommissions are paid automatically when your referrals make purchases.";
      } else if (q.includes('withdraw') || q.includes('funds') || q.includes('mpesa')) {
        response = "To withdraw funds:\n\n1. Go to Wallet section\n2. Enter amount (min $10)\n3. Choose M-Pesa, Airtel, Tigo, or Bank\n4. Submit request\n5. Funds arrive within 24-48 hours";
      } else if (q.includes('channel') || q.includes('create')) {
        response = "To create a channel:\n\n1. Go to Dashboard\n2. Click 'Create Channel'\n3. Add name, description, avatar\n4. Start uploading content!\n\nChannels are free to create.";
      } else if (q.includes('upload')) {
        response = "To upload content:\n\n1. Go to Creator Dashboard\n2. Click 'Upload'\n3. Choose video, music, or game\n4. Add title, description, price\n5. Upload file and thumbnail\n6. Click Publish";
      } else if (q.includes('business')) {
        response = "Business Account benefits:\n\n• Sell products (keep 55%, platform 45%)\n• Add multiple products\n• Track sales analytics\n• Professional storefront\n• Higher earning potential\n\nUpgrade in Settings → Account Type";
      } else {
        response = "I can help you with:\n\n• Earning money\n• MLM commissions\n• Withdrawals\n• Channel creation\n• Content upload\n• Business accounts\n• Platform features\n\nWhat would you like to know?";
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Header */}
      <div style={{
        background: '#1a1a1a',
        borderBottom: '1px solid #2d2d2d',
        padding: '20px 30px'
      }}>
        <h1 style={{ margin: 0, color: '#ef4444' }}>AI Assistant</h1>
        <p style={{ margin: '5px 0 0 0', color: '#888' }}>Ask me anything about NexStream</p>
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
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: '70%',
              padding: '15px 20px',
              background: msg.role === 'user' ? '#ef4444' : '#1f1f1f',
              borderRadius: msg.role === 'user'
                ? '18px 18px 4px 18px'
                : '18px 18px 18px 4px',
              color: 'white',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🤖
            </div>
            <div style={{
              padding: '15px 20px',
              background: '#1f1f1f',
              borderRadius: '18px',
              color: '#888'
            }}>
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{
          padding: '20px 30px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              style={{
                padding: '10px 20px',
                background: '#1f1f1f',
                border: '1px solid #333',
                borderRadius: '30px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.target.style.background = '#2d2d2d'}
              onMouseLeave={e => e.target.style.background = '#1f1f1f'}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        borderTop: '1px solid #2d2d2d',
        padding: '20px 30px',
        background: '#1a1a1a'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            style={{
              flex: 1,
              padding: '15px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: 'white',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            style={{
              padding: '15px 30px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              opacity: loading ? 0.5 : 1
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
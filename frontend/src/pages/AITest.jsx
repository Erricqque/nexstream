import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AITest() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: data.response || data.error || 'No response' 
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>AI Test Page</h1>
      <p>Logged in as: {user?.email}</p>
      
      <div style={{ 
        height: '400px', 
        overflowY: 'scroll', 
        border: '1px solid #333',
        padding: '10px',
        marginBottom: '10px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            margin: '10px 0'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              background: msg.role === 'user' ? '#FF3366' : '#2a2a2a',
              color: 'white',
              borderRadius: '10px'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div>AI is thinking...</div>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: '10px' }}
          placeholder="Ask AI something..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
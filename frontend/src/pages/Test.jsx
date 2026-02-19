import React from 'react';

const Test = () => {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      ✅ React is WORKING! 
      <br />
      If you see this, the problem is elsewhere.
    </div>
  );
};

export default Test;
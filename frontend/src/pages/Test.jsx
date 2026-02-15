import React from 'react';

const Test = () => {
  return React.createElement('div', { 
    style: { 
      backgroundColor: 'blue', 
      color: 'white', 
      padding: '20px',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }
  }, 'NexStream is Working!');
};

export default Test;

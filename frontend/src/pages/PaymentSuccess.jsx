import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const { transactionId, amount, title } = location.state || {
    transactionId: 'TXN' + Math.floor(Math.random() * 1000000),
    amount: 4.99,
    title: 'Content'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        padding: '50px',
        textAlign: 'center',
        maxWidth: '500px',
        border: '1px solid #333',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          background: '#4CAF50',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '40px',
          boxShadow: '0 10px 30px rgba(76,175,80,0.3)'
        }}>
          ✓
        </div>

        <h1 style={{
          fontSize: '2rem',
          marginBottom: '10px',
          color: '#4CAF50'
        }}>
          Payment Successful!
        </h1>

        <p style={{ color: '#888', marginBottom: '30px' }}>
          Thank you for your purchase. You now have access to {title}.
        </p>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>Transaction ID:</span>
            <span style={{ color: '#00b4d8', fontFamily: 'monospace' }}>{transactionId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>Amount paid:</span>
            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>${amount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>Item:</span>
            <span style={{ color: 'white' }}>{title}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link
            to="/dashboard"
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: 'bold'
            }}
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            style={{
              padding: '12px 30px',
              background: 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '30px',
              border: '1px solid #333'
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
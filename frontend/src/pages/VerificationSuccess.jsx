import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const VerificationSuccess = () => {
  const location = useLocation();
  const { transactionId, amount } = location.state || {
    transactionId: 'TXN' + Math.floor(Math.random() * 1000000),
    amount: 18
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '20px',
        padding: '50px',
        textAlign: 'center',
        maxWidth: '500px',
        border: '1px solid #333'
      }}>
        
        {/* Success Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '50px'
        }}>
          ✅
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          You're Verified! 🎉
        </h1>

        <p style={{ color: '#888', marginBottom: '30px' }}>
          Congratulations! Your channel now has the official blue checkmark.
        </p>

        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <span style={{
              width: '40px',
              height: '40px',
              background: '#00b4d8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ✓
            </span>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Verified Badge Added</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>The blue tick now appears on your channel</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <span style={{
              width: '40px',
              height: '40px',
              background: '#FFD700',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              📈
            </span>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>75% Revenue Share</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>Your earnings share has been increased</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{
              width: '40px',
              height: '40px',
              background: '#4CAF50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🛡️
            </span>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Priority Support</div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>You now have access to faster support</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link
            to={`/channel/${localStorage.getItem('currentChannelSlug') || 'my-channel'}`}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '30px',
              fontWeight: 'bold'
            }}
          >
            View Your Verified Channel
          </Link>
          <Link
            to="/dashboard"
            style={{
              padding: '15px 30px',
              background: 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '30px',
              border: '1px solid #333'
            }}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const VerificationPayment = () => {
  const navigate = useNavigate();
  const { user, updateUserVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fixed verification fee (like YouTube's blue tick fee)
  const VERIFICATION_FEE = 18.00; // $18 one-time payment

  // Flutterwave configuration
  const config = {
    public_key: 'FLWPUBK_TEST-fcd4bccac3d8853702e77c7d3019854c-X',
    tx_ref: `nexstream-verify-${Date.now()}`,
    amount: VERIFICATION_FEE,
    currency: 'USD',
    payment_options: 'card,mobilemoney,mpesa',
    customer: {
      email: user?.email || 'customer@nexstream.com',
      phone_number: phoneNumber || '255712345678',
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'NexStream User',
    },
    meta: {
      purpose: 'channel_verification',
      user_id: user?.id,
      user_email: user?.email
    },
    customizations: {
      title: 'NexStream Verification',
      description: 'Blue Tick Verification - One-time payment',
      logo: 'https://your-logo-url.com/logo.png',
    },
    redirect_url: 'http://localhost:5173/verification-success',
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (paymentMethod !== 'card' && !phoneNumber) {
      alert('Please enter your phone number for mobile money');
      return;
    }

    setLoading(true);

    handleFlutterPayment({
      callback: (response) => {
        console.log('Payment callback:', response);
        closePaymentModal();
        
        if (response.status === 'successful') {
          // Update user verification status in database
          updateUserVerification(true, response.transaction_id);
          
          navigate('/verification-success', {
            state: {
              transactionId: response.transaction_id,
              amount: VERIFICATION_FEE,
              verified: true
            }
          });
        }
        setLoading(false);
      },
      onClose: () => {
        console.log('Payment modal closed');
        setLoading(false);
      },
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0b1a2e 50%, #0a0f1e 100%)',
      color: 'white',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '40px'
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
            Get Your Blue Tick
          </h1>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>
            Verify your channel and stand out with the official blue checkmark
          </p>
        </div>

        {/* Benefits Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(0,180,216,0.1)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #00b4d8'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
            <h3 style={{ marginBottom: '5px', color: '#00b4d8' }}>Verified Badge</h3>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Official blue checkmark</p>
          </div>
          <div style={{
            background: 'rgba(255,215,0,0.1)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #FFD700'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📈</div>
            <h3 style={{ marginBottom: '5px', color: '#FFD700' }}>Priority Support</h3>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Faster response times</p>
          </div>
          <div style={{
            background: 'rgba(76,175,80,0.1)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #4CAF50'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
            <h3 style={{ marginBottom: '5px', color: '#4CAF50' }}>75% Revenue Share</h3>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Higher earnings</p>
          </div>
          <div style={{
            background: 'rgba(255,68,68,0.1)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #ff4444'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🛡️</div>
            <h3 style={{ marginBottom: '5px', color: '#ff4444' }}>Protection</h3>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Prevent impersonation</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ color: '#888' }}>Verification Fee</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00b4d8' }}>${VERIFICATION_FEE}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ color: '#888' }}>Account</span>
            <span style={{ color: 'white' }}>{user?.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #333' }}>
            <span style={{ fontWeight: 'bold' }}>Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00b4d8' }}>${VERIFICATION_FEE}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#00b4d8' }}>Select Payment Method</h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px'
          }}>
            {/* Card Payment */}
            <button
              onClick={() => setPaymentMethod('card')}
              style={{
                padding: '20px',
                background: paymentMethod === 'card' ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.03)',
                border: paymentMethod === 'card' ? '2px solid #00b4d8' : '1px solid #333',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💳</div>
              <div style={{ fontWeight: 'bold', color: paymentMethod === 'card' ? '#00b4d8' : 'white' }}>
                Card Payment
              </div>
            </button>

            {/* M-Pesa */}
            <button
              onClick={() => setPaymentMethod('mpesa')}
              style={{
                padding: '20px',
                background: paymentMethod === 'mpesa' ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.03)',
                border: paymentMethod === 'mpesa' ? '2px solid #00b4d8' : '1px solid #333',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📱</div>
              <div style={{ fontWeight: 'bold', color: paymentMethod === 'mpesa' ? '#00b4d8' : 'white' }}>
                M-Pesa
              </div>
            </button>

            {/* Tigo Pesa */}
            <button
              onClick={() => setPaymentMethod('tigo')}
              style={{
                padding: '20px',
                background: paymentMethod === 'tigo' ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.03)',
                border: paymentMethod === 'tigo' ? '2px solid #00b4d8' : '1px solid #333',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📱</div>
              <div style={{ fontWeight: 'bold', color: paymentMethod === 'tigo' ? '#00b4d8' : 'white' }}>
                Tigo Pesa
              </div>
            </button>

            {/* Airtel Money */}
            <button
              onClick={() => setPaymentMethod('airtel')}
              style={{
                padding: '20px',
                background: paymentMethod === 'airtel' ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.03)',
                border: paymentMethod === 'airtel' ? '2px solid #00b4d8' : '1px solid #333',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📱</div>
              <div style={{ fontWeight: 'bold', color: paymentMethod === 'airtel' ? '#00b4d8' : 'white' }}>
                Airtel Money
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Money Phone Input */}
        {paymentMethod !== 'card' && (
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g., 0712345678 or +255712345678"
              style={{
                width: '100%',
                padding: '15px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid #333',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
              Enter your mobile money phone number
            </p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            background: !loading ? 'linear-gradient(135deg, #00b4d8, #0077b6)' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '20px'
          }}
        >
          {loading ? 'Processing...' : `Pay $${VERIFICATION_FEE} & Get Verified`}
        </button>

        {/* Terms */}
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          By proceeding, you agree to our verification terms. This is a one-time payment.
        </p>
      </div>
    </div>
  );
};

export default VerificationPayment;
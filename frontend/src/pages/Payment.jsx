import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { content, price, title } = location.state || { 
    content: null, 
    price: 4.99, 
    title: 'Content' 
  };

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [networkProvider, setNetworkProvider] = useState('');

  // Get the appropriate payment options string based on selection
  const getPaymentOptions = () => {
    switch(paymentMethod) {
      case 'mpesa':
        return 'mpesa';
      case 'tigo':
      case 'airtel':
      case 'halopesa':
        return 'mobilemoneytanzania';
      case 'card':
      default:
        return 'card';
    }
  };

  // Get the correct currency based on payment method
  const getCurrency = () => {
    if (paymentMethod === 'card') {
      return 'USD'; // International cards use USD
    } else {
      return 'TZS'; // Mobile money uses Tanzanian Shillings
    }
  };

  // Flutterwave configuration
  const config = {
    public_key: 'FLWPUBK_TEST-fcd4bccac3d8853702e77c7d3019854c-X',
    tx_ref: `nexstream-${Date.now()}`,
    amount: price,
    currency: getCurrency(),
    payment_options: getPaymentOptions(), // This ensures only the selected method is shown
    customer: {
      email: user?.email || 'customer@nexstream.com',
      phone_number: phoneNumber || '255712345678',
      name: user?.user_metadata?.full_name || 'NexStream User',
    },
    meta: {
      payment_method: paymentMethod,
      content_title: title,
      user_id: user?.id
    },
    customizations: {
      title: 'NexStream',
      description: `Purchase: ${title}`,
      logo: 'https://your-logo-url.com/logo.png',
    },
    // Important: Set redirect URL for post-payment
    redirect_url: 'http://localhost:5173/payment-success',
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    // Validate based on payment method
    if (paymentMethod !== 'card') {
      if (!phoneNumber) {
        alert('Please enter your phone number for mobile money');
        return;
      }
      
      // Validate phone number format (basic)
      const phoneRegex = /^(?:\+255|0)[1-9][0-9]{8}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid Tanzania phone number (e.g., 0712345678 or +255712345678)');
        return;
      }
    }

    setLoading(true);

    handleFlutterPayment({
      callback: (response) => {
        console.log('Payment callback:', response);
        closePaymentModal();
        
        if (response.status === 'successful') {
          navigate('/payment-success', {
            state: {
              transactionId: response.transaction_id,
              amount: price,
              title: title,
              paymentMethod: paymentMethod
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
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Complete Payment
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          Secure payment powered by Flutterwave
        </p>

        {/* Payment Summary */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px',
          border: '1px solid #333'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#00b4d8' }}>Order Summary</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            color: '#aaa'
          }}>
            <span>{title}</span>
            <span>${price} USD</span>
          </div>
          <div style={{
            height: '1px',
            background: '#333',
            margin: '15px 0'
          }}></div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            <span>Total</span>
            <span style={{ color: '#00b4d8' }}>
              {paymentMethod === 'card' ? `$${price} USD` : `${(price * 2500).toFixed(0)} TZS`}
            </span>
          </div>
          {paymentMethod !== 'card' && (
            <p style={{ color: '#ffaa00', fontSize: '0.9rem', marginTop: '10px' }}>
              ⚡ Amount in TZS will be calculated at current exchange rate
            </p>
          )}
        </div>

        {/* Payment Methods Section */}
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
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💳</div>
              <div style={{ fontWeight: 'bold', color: paymentMethod === 'card' ? '#00b4d8' : 'white' }}>
                Card Payment
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                Visa, Mastercard, Amex
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
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                Tanzania, Kenya
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
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                Tanzania
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
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                Tanzania
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Money Details Section */}
        {paymentMethod !== 'card' && (
          <div style={{
            background: 'rgba(0,180,216,0.1)',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            border: '1px solid #00b4d8'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#00b4d8' }}>
              {paymentMethod === 'mpesa' ? 'M-Pesa' : 
               paymentMethod === 'tigo' ? 'Tigo Pesa' : 'Airtel Money'} Details
            </h3>
            
            {/* Phone Number Input */}
            <div style={{ marginBottom: '15px' }}>
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

            {/* Network Selection (if needed) */}
            {paymentMethod === 'airtel' && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>
                  Network Provider
                </label>
                <select
                  value={networkProvider}
                  onChange={(e) => setNetworkProvider(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid #333',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select network</option>
                  <option value="AIRTEL">Airtel Money</option>
                </select>
              </div>
            )}

            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '5px',
              fontSize: '0.9rem',
              color: '#ffaa00'
            }}>
              ⚡ You'll receive a prompt on your phone to enter your PIN
            </div>
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
            marginBottom: '20px',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Processing...' : `Pay with ${paymentMethod === 'card' ? 'Card' : 
            paymentMethod === 'mpesa' ? 'M-Pesa' : 
            paymentMethod === 'tigo' ? 'Tigo Pesa' : 'Airtel Money'}`}
        </button>

        {/* Security Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: '#888',
          fontSize: '0.9rem'
        }}>
          <span>🔒</span>
          <span>Secured by Flutterwave</span>
          <span>•</span>
          <span>256-bit SSL</span>
        </div>

        {/* Test Mode Notice */}
        <div style={{
          marginTop: '20px',
          padding: '10px',
          background: 'rgba(255,215,0,0.1)',
          border: '1px solid #FFD700',
          borderRadius: '5px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#FFD700'
        }}>
          🧪 Test Mode - For mobile money, use any phone number (OTP will be simulated)
        </div>
      </div>
    </div>
  );
};

export default Payment;
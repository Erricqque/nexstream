import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// No import needed - we'll load Flutterwave from CDN

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { price, title } = location.state || { 
    price: 4.99, 
    title: 'Content' 
  };

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Load Flutterwave script dynamically
  const loadFlutterwave = () => {
    return new Promise((resolve) => {
      if (window.FlutterwaveCheckout) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (paymentMethod !== 'card' && !phoneNumber) {
      alert('Please enter your phone number for mobile money');
      return;
    }

    setLoading(true);
    await loadFlutterwave();

    const config = {
      public_key: 'FLWPUBK_TEST-fcd4bccac3d8853702e77c7d3019854c-X',
      tx_ref: `nexstream-${Date.now()}`,
      amount: price,
      currency: 'USD',
      payment_options: 'card,mobilemoney,mpesa',
      customer: {
        email: user?.email || 'customer@nexstream.com',
        phone_number: phoneNumber || '255712345678',
        name: user?.user_metadata?.full_name || 'NexStream User',
      },
      customizations: {
        title: 'NexStream',
        description: `Purchase: ${title}`,
        logo: 'https://your-logo-url.com/logo.png',
      },
      callback: (response) => {
        console.log('Payment callback:', response);
        
        if (response.status === 'successful') {
          navigate('/payment-success', {
            state: {
              transactionId: response.transaction_id,
              amount: price,
              title: title
            }
          });
        }
        setLoading(false);
      },
      onclose: () => {
        console.log('Payment modal closed');
        setLoading(false);
      },
    };

    window.FlutterwaveCheckout(config);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Complete Payment</h1>
        
        <div style={{
          background: '#1f1f1f',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <p><strong>Item:</strong> {title}</p>
          <p><strong>Amount:</strong> ${price}</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? 'Processing...' : `Pay $${price}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function PaymentForm({ amount, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [method, setMethod] = useState('flutterwave');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('method');
  const [details, setDetails] = useState({
    email: user?.email || '',
    phone: '',
    bankCode: '',
    accountNumber: '',
    accountName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStep('processing');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/payments/initialize/' + method, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          email: details.email,
          phone: details.phone,
          currency: 'USD'
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      if (data.success) {
        if (method === 'flutterwave' && data.data?.data?.link) {
          window.location.href = data.data.data.link;
        } else if (method === 'paypal') {
          const approveLink = data.data?.links?.find(l => l.rel === 'approve');
          if (approveLink) {
            window.location.href = approveLink.href;
          } else {
            toast.success('Payment initiated!');
            onSuccess?.(data);
          }
        } else if (method === 'mpesa') {
          toast.success('STK Push sent! Please check your phone and enter PIN');
          setStep('waiting');
          pollPaymentStatus(data.reference);
        }
      }
    } catch (error) {
      toast.error(error.message);
      setStep('method');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (reference) => {
    const token = localStorage.getItem('token');
    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/verify/mpesa/${reference}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          toast.success('Payment completed successfully!');
          onSuccess?.(data);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          toast.error('Payment failed');
          setStep('method');
        }

        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          toast.error('Payment timeout. Please check your transactions.');
          setStep('method');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 4000);
  };

  return (
    <div className="payment-form">
      <h3>Complete Payment</h3>
      <p className="amount">Amount: ${amount}</p>

      {step === 'method' && (
        <>
          <div className="payment-methods">
            <label className={method === 'flutterwave' ? 'active' : ''}>
              <input
                type="radio"
                name="method"
                value="flutterwave"
                checked={method === 'flutterwave'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <img src="/flutterwave.png" alt="Flutterwave" />
              <span>Flutterwave</span>
            </label>

            <label className={method === 'paypal' ? 'active' : ''}>
              <input
                type="radio"
                name="method"
                value="paypal"
                checked={method === 'paypal'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <img src="/paypal.png" alt="PayPal" />
              <span>PayPal</span>
            </label>

            <label className={method === 'mpesa' ? 'active' : ''}>
              <input
                type="radio"
                name="method"
                value="mpesa"
                checked={method === 'mpesa'}
                onChange={(e) => setMethod(e.target.value)}
              />
              <img src="/mpesa.png" alt="M-PESA" />
              <span>M-PESA</span>
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            {method === 'flutterwave' && (
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails({...details, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>
            )}

            {method === 'paypal' && (
              <div className="form-group">
                <label>PayPal Email</label>
                <input
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails({...details, email: e.target.value})}
                  placeholder="your@paypal.com"
                  required
                />
                <small>You'll be redirected to PayPal to complete payment</small>
              </div>
            )}

            {method === 'mpesa' && (
              <div className="form-group">
                <label>M-PESA Phone Number</label>
                <input
                  type="tel"
                  value={details.phone}
                  onChange={(e) => setDetails({...details, phone: e.target.value})}
                  placeholder="254700000000"
                  required
                />
                <small>Enter your Safaricom number. You'll receive an STK push.</small>
              </div>
            )}

            <div className="form-actions">
              <button type="button" onClick={onCancel} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Processing...' : `Pay $${amount}`}
              </button>
            </div>
          </form>
        </>
      )}

      {step === 'processing' && (
        <div className="processing">
          <div className="spinner"></div>
          <p>Processing your payment...</p>
          <p className="small">Please do not close this window</p>
        </div>
      )}

      {step === 'waiting' && (
        <div className="waiting">
          <div className="spinner"></div>
          <p>STK Push sent to {details.phone}</p>
          <p>Please check your phone and enter your M-PESA PIN</p>
          <p className="small">Waiting for confirmation...</p>
        </div>
      )}

      <style jsx>{`
        .payment-form {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        h3 {
          color: white;
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .amount {
          color: #FF3366;
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 2rem;
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .payment-methods label {
          background: #2a2a2a;
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s;
          text-align: center;
        }

        .payment-methods label.active {
          border-color: #FF3366;
          background: #333;
        }

        .payment-methods img {
          width: 100%;
          height: 40px;
          object-fit: contain;
          margin-bottom: 0.5rem;
        }

        .payment-methods span {
          display: block;
          color: #ccc;
          font-size: 0.9rem;
        }

        .payment-methods input {
          display: none;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #ccc;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 6px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #FF3366;
          background: #333;
        }

        .form-group small {
          display: block;
          color: #888;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        button {
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #FF3366;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #ff1f4f;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #2a2a2a;
          color: #ccc;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #333;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .processing, .waiting {
          text-align: center;
          padding: 3rem;
        }

        .processing p, .waiting p {
          color: #ccc;
          margin: 1rem 0;
        }

        .processing .small, .waiting .small {
          color: #888;
          font-size: 0.9rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #2a2a2a;
          border-top-color: #FF3366;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
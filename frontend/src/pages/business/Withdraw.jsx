import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PaymentForm from '../../components/payment/PaymentForm';
import { toast } from 'react-hot-toast';

export default function Withdraw() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('paypal');
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/balance', {
        headers: {
          'Authorization': `Bearer ${token}`, // ← FIXED: Added comma here
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          method,
          amount: parseFloat(amount),
          details
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast.success('Withdrawal request submitted successfully!');
      setAmount('');
      fetchBalance(); // Refresh balance
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showPayment) {
    return (
      <PaymentForm 
        amount={parseFloat(amount)}
        onSuccess={() => {
          setShowPayment(false);
          toast.success('Payment completed!');
          fetchBalance();
        }}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="withdraw-page">
      <div className="container">
        <h1>Withdraw Earnings</h1>
        
        <div className="balance-card">
          <h3>Available Balance</h3>
          <p className="balance">${balance.toFixed(2)}</p>
        </div>

        <div className="withdraw-form">
          <h2>Request Withdrawal</h2>
          
          <div className="info-box">
            <h4>💡 Important Information</h4>
            <ul>
              <li>Minimum withdrawal: $10</li>
              <li>Processing time: 1-3 business days</li>
              <li>Fees: 2% for PayPal, 1.5% for Flutterwave, Free for M-PESA</li>
            </ul>
          </div>

          <form onSubmit={handleWithdraw}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                min="10"
                max={balance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <small>Min: $10 | Max: ${balance.toFixed(2)}</small>
            </div>

            <div className="form-group">
              <label>Withdrawal Method</label>
              <select 
                value={method} 
                onChange={(e) => setMethod(e.target.value)}
                required
              >
                <option value="paypal">PayPal</option>
                <option value="flutterwave">Flutterwave (Bank Transfer)</option>
                <option value="mpesa">M-PESA</option>
              </select>
            </div>

            {method === 'paypal' && (
              <div className="form-group">
                <label>PayPal Email</label>
                <input
                  type="email"
                  value={details.email || ''}
                  onChange={(e) => setDetails({...details, email: e.target.value})}
                  placeholder="your@paypal.com"
                  required
                />
              </div>
            )}

            {method === 'flutterwave' && (
              <>
                <div className="form-group">
                  <label>Bank Country</label>
                  <select
                    value={details.country || 'NG'}
                    onChange={(e) => setDetails({...details, country: e.target.value})}
                    required
                  >
                    <option value="NG">Nigeria</option>
                    <option value="GH">Ghana</option>
                    <option value="KE">Kenya</option>
                    <option value="ZA">South Africa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Bank Code</label>
                  <input
                    type="text"
                    value={details.bankCode || ''}
                    onChange={(e) => setDetails({...details, bankCode: e.target.value})}
                    placeholder="e.g., 044 for Access Bank"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={details.accountNumber || ''}
                    onChange={(e) => setDetails({...details, accountNumber: e.target.value})}
                    placeholder="10-digit account number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={details.accountName || ''}
                    onChange={(e) => setDetails({...details, accountName: e.target.value})}
                    placeholder="Full name on account"
                    required
                  />
                </div>
              </>
            )}

            {method === 'mpesa' && (
              <div className="form-group">
                <label>M-PESA Phone Number</label>
                <input
                  type="tel"
                  value={details.phone || ''}
                  onChange={(e) => setDetails({...details, phone: e.target.value})}
                  placeholder="254700000000"
                  required
                />
                <small>Enter your Safaricom number</small>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !amount || amount < 10 || amount > balance}
              className="btn-withdraw"
            >
              {loading ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
        </div>

        <div className="recent-withdrawals">
          <h3>Recent Withdrawals</h3>
          {/* Add withdrawals list here */}
        </div>
      </div>

      <style jsx>{`
        .withdraw-page {
          min-height: 100vh;
          background: #0f0f0f;
          padding: 2rem 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        h1 {
          color: white;
          margin-bottom: 2rem;
        }

        .balance-card {
          background: linear-gradient(135deg, #FF3366 0%, #4FACFE 100%);
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          text-align: center;
        }

        .balance-card h3 {
          color: rgba(255,255,255,0.9);
          margin-bottom: 0.5rem;
        }

        .balance {
          font-size: 3rem;
          font-weight: bold;
          color: white;
          margin: 0;
        }

        .withdraw-form {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .withdraw-form h2 {
          color: white;
          margin-bottom: 1.5rem;
        }

        .info-box {
          background: #2a2a2a;
          border-left: 4px solid #FF3366;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 2rem;
        }

        .info-box h4 {
          color: white;
          margin: 0 0 0.5rem 0;
        }

        .info-box ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #ccc;
        }

        .info-box li {
          margin: 0.25rem 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #ccc;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 6px;
          color: white;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #FF3366;
        }

        .form-group small {
          display: block;
          color: #888;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .btn-withdraw {
          width: 100%;
          padding: 1rem;
          background: #FF3366;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-withdraw:hover:not(:disabled) {
          background: #ff1f4f;
          transform: translateY(-2px);
        }

        .btn-withdraw:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recent-withdrawals {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 12px;
        }

        .recent-withdrawals h3 {
          color: white;
          margin: 0 0 1rem 0;
        }
      `}</style>
    </div>
  );
}
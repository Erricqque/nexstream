import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mpesa');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      // Load earnings
      const { data: earnings } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', user.id);

      const totalEarnings = earnings?.reduce((s, e) => s + e.amount, 0) || 0;

      // Load withdrawals
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const totalWithdrawn = withdrawals?.reduce((s, w) => s + w.amount, 0) || 0;

      setBalance(totalEarnings - totalWithdrawn);
      setWithdrawals(withdrawals || []);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!amount || amount < 10) {
      alert('Minimum withdrawal is $10');
      return;
    }
    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }
    if (!phone && method !== 'bank') {
      alert('Please enter phone number');
      return;
    }

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert([{
          user_id: user.id,
          amount: parseFloat(amount),
          method,
          phone,
          status: 'pending',
          created_at: new Date()
        }]);

      if (error) throw error;

      alert('Withdrawal request submitted!');
      setAmount('');
      setPhone('');
      loadWalletData();
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Failed to submit withdrawal');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ef4444',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white', background: '#0f0f0f', minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Wallet</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Manage your earnings and withdrawals</p>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444, #3b82f6)',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '40px'
      }}>
        <h2 style={{ marginBottom: '10px', opacity: 0.9 }}>Available Balance</h2>
        <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>${balance.toFixed(2)}</p>
      </div>

      {/* Withdrawal Form */}
      <div style={{
        background: '#1f1f1f',
        borderRadius: '10px',
        padding: '30px',
        marginBottom: '40px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Withdraw Funds</h2>
        
        <div style={{ display: 'grid', gap: '15px', maxWidth: '400px' }}>
          <input
            type="number"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: '12px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: 'white'
            }}
          />

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={{
              padding: '12px',
              background: '#2d2d2d',
              border: '1px solid #3d3d3d',
              borderRadius: '5px',
              color: 'white'
            }}
          >
            <option value="mpesa">M-Pesa</option>
            <option value="airtel">Airtel Money</option>
            <option value="tigo">Tigo Pesa</option>
            <option value="bank">Bank Transfer</option>
          </select>

          {method !== 'bank' && (
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                padding: '12px',
                background: '#2d2d2d',
                border: '1px solid #3d3d3d',
                borderRadius: '5px',
                color: 'white'
              }}
            />
          )}

          <button
            onClick={handleWithdrawal}
            style={{
              padding: '15px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Withdrawal History */}
      <h2 style={{ marginBottom: '20px' }}>Withdrawal History</h2>
      
      {withdrawals.length === 0 ? (
        <div style={{
          background: '#1f1f1f',
          borderRadius: '10px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#888' }}>No withdrawals yet</p>
        </div>
      ) : (
        <div style={{ background: '#1f1f1f', borderRadius: '10px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#2d2d2d' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Method</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid #2d2d2d' }}>
                  <td style={{ padding: '15px', color: '#888' }}>
                    {new Date(w.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>${w.amount}</td>
                  <td style={{ padding: '15px', color: '#888', textTransform: 'uppercase' }}>{w.method}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: w.status === 'completed' ? '#10b981' : w.status === 'pending' ? '#fbbf24' : '#ef4444',
                      color: 'black',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '0.8rem'
                    }}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Wallet;
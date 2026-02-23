import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from 'lucide-react';

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wallet, setWallet] = useState({
    balance: 0,
    currency: 'USD',
    pending_payouts: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWalletData();
  }, [user]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch wallet balance
      const walletResponse = await fetch(`/api/wallet/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const walletData = await walletResponse.json();
      
      // Fetch transactions
      const txResponse = await fetch(`/api/payments/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const txData = await txResponse.json();
      
      setWallet(walletData);
      setTransactions(txData.data || []);
    } catch (error) {
      console.error('Error loading wallet:', error);
      // Mock data for development
      setWallet({ balance: 1250.75, currency: 'USD', pending_payouts: 230.50 });
      setTransactions([
        { id: 1, amount: 50.00, type: 'deposit', status: 'completed', created_at: new Date().toISOString(), description: 'Added funds' },
        { id: 2, amount: 25.50, type: 'earning', status: 'completed', created_at: new Date().toISOString(), description: 'Content earnings' },
        { id: 3, amount: 100.00, type: 'withdrawal', status: 'pending', created_at: new Date().toISOString(), description: 'Withdraw to PayPal' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit': return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'earning': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Wallet</h1>
          <p className="text-white/80">Manage your earnings and transactions</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <WalletIcon className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">Available</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {wallet.currency} {wallet.balance.toFixed(2)}
            </div>
            <p className="text-sm opacity-80">Ready to withdraw</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">Pending</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {wallet.currency} {wallet.pending_payouts.toFixed(2)}
            </div>
            <p className="text-sm opacity-80">Processing</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">Total Earned</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {wallet.currency} {(wallet.balance + wallet.pending_payouts).toFixed(2)}
            </div>
            <p className="text-sm opacity-80">Lifetime earnings</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link to="/business/deposit">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
            >
              <ArrowDownLeft className="w-5 h-5" />
              Add Money
            </motion.button>
          </Link>
          
          <Link to="/business/withdraw">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
            >
              <ArrowUpRight className="w-5 h-5" />
              Withdraw
            </motion.button>
          </Link>
        </div>

        {/* Transactions */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <WalletIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No transactions yet</p>
              <p className="text-sm mt-2">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{tx.description || tx.type}</h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(tx.created_at)} at {formatTime(tx.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-sm text-gray-400">Total Transactions</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">5</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">2</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">1</div>
            <div className="text-sm text-gray-400">This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
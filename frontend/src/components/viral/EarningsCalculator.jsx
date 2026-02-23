import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Video, TrendingUp, Gift } from 'lucide-react';

const EarningsCalculator = () => {
  const [inputs, setInputs] = useState({
    videos: 10,
    views: 1000,
    referrals: 5,
    subscribers: 100
  });

  const [results, setResults] = useState(null);

  const calculateEarnings = () => {
    // Calculation logic
    const adRevenue = inputs.videos * inputs.views * 0.01; // $0.01 per view
    const referralBonus = inputs.referrals * 10; // $10 per referral
    const subscriberValue = inputs.subscribers * 0.5; // $0.50 per subscriber
    const total = adRevenue + referralBonus + subscriberValue;
    const monthly = total * 30;
    const yearly = monthly * 12;

    setResults({
      daily: total,
      weekly: total * 7,
      monthly,
      yearly,
      breakdown: {
        adRevenue,
        referralBonus,
        subscriberValue
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 mb-4">
            💰 EARNINGS CALCULATOR
          </h1>
          <p className="text-xl text-gray-300">
            See your potential earnings on NexStream
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Your Numbers</h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  <Video className="w-4 h-4" /> Videos per day
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={inputs.videos}
                  onChange={(e) => setInputs({...inputs, videos: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-right text-2xl font-bold text-green-400">{inputs.videos}</div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  <TrendingUp className="w-4 h-4" /> Avg views per video
                </label>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="100"
                  value={inputs.views}
                  onChange={(e) => setInputs({...inputs, views: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-right text-2xl font-bold text-blue-400">{inputs.views.toLocaleString()}</div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  <Users className="w-4 h-4" /> Referrals
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputs.referrals}
                  onChange={(e) => setInputs({...inputs, referrals: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-right text-2xl font-bold text-yellow-400">{inputs.referrals}</div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-2">
                  <Gift className="w-4 h-4" /> Subscribers
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={inputs.subscribers}
                  onChange={(e) => setInputs({...inputs, subscribers: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-right text-2xl font-bold text-purple-400">{inputs.subscribers.toLocaleString()}</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={calculateEarnings}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 rounded-lg mt-4"
              >
                Calculate My Earnings 🚀
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          {results && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Your Potential</h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-center">
                  <div className="text-sm opacity-90">Monthly Earnings</div>
                  <div className="text-4xl font-bold">${results.monthly.toFixed(2)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Daily</div>
                    <div className="text-xl font-bold text-green-400">${results.daily.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Weekly</div>
                    <div className="text-xl font-bold text-blue-400">${results.weekly.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Ad Revenue</span>
                      <span className="text-green-400">${results.breakdown.adRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Referral Bonus</span>
                      <span className="text-yellow-400">${results.breakdown.referralBonus.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subscriber Value</span>
                      <span className="text-purple-400">${results.breakdown.subscriberValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-center">
                  <div className="text-sm opacity-90">Yearly Potential</div>
                  <div className="text-3xl font-bold">${results.yearly.toFixed(2)}</div>
                  <button className="mt-2 text-sm underline">Share this result</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Marketing Hooks */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-bold">Top earner this month</div>
            <div className="text-green-400 text-xl">$12,450</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-bold">Average creator earns</div>
            <div className="text-blue-400 text-xl">$1,200/month</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-bold">You're 3 referrals away</div>
            <div className="text-yellow-400 text-xl">from $100 bonus</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCalculator;
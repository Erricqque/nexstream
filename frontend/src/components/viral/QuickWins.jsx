import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, Gift, TrendingUp } from 'lucide-react';

const QuickWins = () => {
  const [wins, setWins] = useState([]);

  useEffect(() => {
    // Generate quick wins based on user data
    setWins([
      {
        id: 1,
        icon: '🎯',
        title: '3 referrals away',
        description: 'from $100 bonus',
        progress: 70,
        action: 'Share now'
      },
      {
        id: 2,
        icon: '📈',
        title: 'Post 2 more videos',
        description: 'to reach Level 3',
        progress: 40,
        action: 'Upload'
      },
      {
        id: 3,
        icon: '⏰',
        title: 'Daily login streak',
        description: '5 days - claim reward',
        progress: 60,
        action: 'Claim'
      },
      {
        id: 4,
        icon: '💬',
        title: 'Reply to comments',
        description: '5 more for badge',
        progress: 30,
        action: 'Engage'
      }
    ]);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-6 backdrop-blur">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Quick Wins
      </h3>

      <div className="space-y-4">
        {wins.map((win) => (
          <motion.div
            key={win.id}
            whileHover={{ scale: 1.02 }}
            className="bg-black/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{win.icon}</span>
                <div>
                  <h4 className="font-semibold">{win.title}</h4>
                  <p className="text-sm text-gray-400">{win.description}</p>
                </div>
              </div>
              <button className="text-xs bg-gradient-to-r from-green-400 to-blue-500 px-3 py-1 rounded-full">
                {win.action}
              </button>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${win.progress}%` }}
                transition={{ duration: 1, delay: win.id * 0.1 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          ⚡ You're just {Math.floor(Math.random() * 5) + 1} actions away from your next reward!
        </p>
      </div>
    </div>
  );
};

export default QuickWins;
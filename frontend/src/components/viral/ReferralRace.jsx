import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Crown, Users, Gift, Zap, Star } from 'lucide-react'; // Added Users import

const ReferralRace = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('2d 14h 23m');

  useEffect(() => {
    loadLeaderboard();
    startCountdown();
  }, []);

  const loadLeaderboard = () => {
    // Mock data
    setLeaderboard([
      { rank: 1, username: 'CryptoKing', referrals: 156, prize: '$500', avatar: '👑', badge: '🥇' },
      { rank: 2, username: 'ViralQueen', referrals: 142, prize: '$300', avatar: '👸', badge: '🥈' },
      { rank: 3, username: 'GrowthMaster', referrals: 138, prize: '$200', avatar: '🧙', badge: '🥉' },
      { rank: 4, username: 'ReferralPro', referrals: 121, prize: '$100', avatar: '⚡', badge: '⭐' },
      { rank: 5, username: 'NetworkStar', referrals: 115, prize: '$50', avatar: '⭐', badge: '⭐' },
      { rank: 6, username: 'SocialGuru', referrals: 98, prize: '-', avatar: '🎯', badge: '🔥' },
      { rank: 7, username: 'TeamPlayer', referrals: 87, prize: '-', avatar: '🤝', badge: '💪' },
      { rank: 8, username: 'RisingStar', referrals: 76, prize: '-', avatar: '🌟', badge: '🌱' },
      { rank: 9, username: 'NewComer', referrals: 65, prize: '-', avatar: '🌱', badge: '🌱' },
      { rank: 10, username: 'Learner', referrals: 54, prize: '-', avatar: '📚', badge: '📚' },
    ]);
    setUserRank({ rank: 42, referrals: 23, nextRank: 41, referralsNeeded: 5 });
  };

  const startCountdown = () => {
    // Update countdown every minute
    const interval = setInterval(() => {
      // Mock countdown update
      setTimeRemaining(prev => {
        // Simple countdown simulation
        const [days, hours, minutes] = prev.split(' ').map(p => parseInt(p) || 0);
        if (minutes > 0) {
          return `${days}d ${hours}h ${minutes-1}m`;
        }
        return prev;
      });
    }, 60000);
    
    return () => clearInterval(interval);
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-4">
            🏁 REFERRAL RACE
          </h1>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-yellow-500/20 backdrop-blur rounded-full px-6 py-2 border border-yellow-500/30">
              <span className="text-yellow-400 font-bold text-xl">$1,150</span>
              <span className="text-gray-300 ml-2">prize pool</span>
            </div>
            <div className="bg-blue-500/20 backdrop-blur rounded-full px-6 py-2 border border-blue-500/30">
              <span className="text-blue-400 font-bold text-xl">{timeRemaining}</span>
              <span className="text-gray-300 ml-2">remaining</span>
            </div>
            <div className="bg-purple-500/20 backdrop-blur rounded-full px-6 py-2 border border-purple-500/30">
              <span className="text-purple-400 font-bold text-xl">247</span>
              <span className="text-gray-300 ml-2">participants</span>
            </div>
          </div>
        </motion.div>

        {/* User Position */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl p-6 mb-8 shadow-xl"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm opacity-90 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Your Position
                </div>
                <div className="text-4xl font-bold">#{userRank.rank}</div>
                <div className="text-sm mt-1 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {userRank.referrals} referrals
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Next Rank #{userRank.nextRank}</div>
                <div className="text-2xl font-bold text-yellow-400">{userRank.referralsNeeded} more needed</div>
                <button className="mt-2 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-sm font-semibold transition-all">
                  Invite Friends 🚀
                </button>
              </div>
            </div>
            <div className="mt-4 bg-white/20 h-3 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(userRank.referrals / (userRank.referrals + userRank.referralsNeeded)) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur rounded-2xl overflow-hidden border border-white/10"
        >
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-purple-600/50 to-pink-600/50 font-semibold">
            <div className="col-span-1">#</div>
            <div className="col-span-6">User</div>
            <div className="col-span-3">Referrals</div>
            <div className="col-span-2">Prize</div>
          </div>

          {/* Rows */}
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-4 p-4 ${
                index % 2 === 0 ? 'bg-white/5' : ''
              } hover:bg-white/10 transition-all cursor-pointer border-t border-white/5`}
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <div className="col-span-1 font-bold flex items-center">
                {user.rank === 1 && <Crown className="w-5 h-5 text-yellow-400" />}
                {user.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                {user.rank === 3 && <Award className="w-5 h-5 text-orange-400" />}
                {user.rank > 3 && user.rank}
              </div>
              <div className="col-span-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRankColor(user.rank)} flex items-center justify-center text-xl shadow-lg`}>
                  {user.avatar}
                </div>
                <div>
                  <span className="font-medium">@{user.username}</span>
                  {user.rank <= 3 && (
                    <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                      Top 3
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-bold text-green-400 text-lg">{user.referrals}</span>
                {user.referrals > 100 && (
                  <TrendingUp className="w-4 h-4 ml-2 text-green-400" />
                )}
              </div>
              <div className="col-span-2">
                {user.prize !== '-' ? (
                  <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold border border-green-500/30">
                    {user.prize}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Race Rules */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-4 backdrop-blur border border-yellow-500/30"
          >
            <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="font-bold mb-2 text-lg">Top Prize</h3>
            <p className="text-sm text-gray-300">1st place wins $500 + Featured Creator badge + Lifetime Premium</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl p-4 backdrop-blur border border-blue-500/30"
          >
            <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-bold mb-2 text-lg">Fastest Grower</h3>
            <p className="text-sm text-gray-300">Most referrals in 24h wins $100 bonus + Viral Badge</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 backdrop-blur border border-purple-500/30"
          >
            <Gift className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="font-bold mb-2 text-lg">Team Bonus</h3>
            <p className="text-sm text-gray-300">Top 10 teams split $500 + Exclusive Discord role</p>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-8 text-center shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-2">Ready to join the race? 🏃‍♂️</h2>
          <p className="mb-6 text-lg opacity-90">Share your referral link and start climbing the leaderboard!</p>
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={`${window.location.origin}/register?ref=YOURCODE`}
                readOnly
                className="w-full bg-white/20 backdrop-blur rounded-lg px-4 py-3 text-white border border-white/30 focus:outline-none focus:border-white/50"
              />
              <Star className="absolute right-3 top-3 w-5 h-5 text-yellow-400" />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/register?ref=YOURCODE`);
                alert('Link copied! Share it with friends 🎉');
              }}
              className="bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Copy Link
            </motion.button>
          </div>
          <p className="mt-4 text-sm opacity-75 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            You're {10 - (userRank?.rank % 10 || 0)} referrals away from the next prize tier!
          </p>
        </motion.div>

        {/* Recent Winners Ticker */}
        <div className="mt-8 bg-black/20 backdrop-blur rounded-lg p-3 overflow-hidden">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-gray-400">Recent winners:</span>
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex gap-4 whitespace-nowrap"
            >
              <span>🎉 @DanceMaster won $50 • </span>
              <span>🎉 @CryptoKing reached 100 referrals • </span>
              <span>🎉 @ViralQueen joined top 3 • </span>
              <span>🎉 @GrowthMaster earned $200 • </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRace;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Zap, Star, Lock, Unlock, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const MysteryBox = () => {
  const { user } = useAuth();
  const [boxes, setBoxes] = useState([
    { id: 1, type: 'common', name: 'Common Box', cost: 0, cooldown: 0, available: true, icon: '📦', color: 'from-gray-600 to-gray-800' },
    { id: 2, type: 'rare', name: 'Rare Box', cost: 100, cooldown: 24, available: true, icon: '🎁', color: 'from-blue-600 to-blue-800' },
    { id: 3, type: 'epic', name: 'Epic Box', cost: 500, cooldown: 48, available: true, icon: '🗃️', color: 'from-purple-600 to-purple-800' },
    { id: 4, type: 'legendary', name: 'Legendary Box', cost: 1000, cooldown: 72, available: true, icon: '💎', color: 'from-yellow-600 to-orange-800' },
  ]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [prize, setPrize] = useState(null);
  const [streak, setStreak] = useState(3);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadUserStreak();
    loadBoxHistory();
  }, [user]);

  const loadUserStreak = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/viral/streak/my-streak', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStreak(data.current_streak || 0);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const loadBoxHistory = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/viral/mystery-box/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setHistory(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const openBox = async (box) => {
    if (!user) {
      toast.error('Please login to open mystery boxes');
      return;
    }

    setSelectedBox(box);
    setIsOpening(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/viral/mystery-box/open', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ box_type: box.type })
      });

      const data = await response.json();

      if (data.success) {
        setPrize(data.prize);
        toast.success(`You won: ${data.prize.prize_name}!`);
        
        if (data.prize.prize_type === 'money') {
          // Trigger wallet refresh
          window.dispatchEvent(new CustomEvent('wallet-updated'));
        }
        
        loadBoxHistory();
        
        setTimeout(() => {
          setIsOpening(false);
          setPrize(null);
          setSelectedBox(null);
        }, 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
      setIsOpening(false);
      setSelectedBox(null);
    }
  };

  const checkInDaily = async () => {
    if (!user) {
      toast.error('Please login to check in');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/viral/streak/checkin', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setStreak(data.streak.current_streak);
        toast.success(`Day ${data.streak.current_streak} streak! 🎉`);
        if (data.first_day) {
          toast.success('You got a free Common Box!');
        }
      }
    } catch (error) {
      toast.error('Failed to check in');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            🎁 MYSTERY BOXES
          </h1>
          
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={checkInDaily}
              className="bg-purple-500/20 backdrop-blur rounded-full px-6 py-3 border border-purple-500/30 flex items-center gap-2"
            >
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-purple-400 font-bold">Daily Check-in</span>
              <span className="bg-yellow-500/30 text-yellow-400 px-2 py-1 rounded-full text-sm">
                {streak} day streak
              </span>
            </motion.button>
            
            <div className="bg-yellow-500/20 backdrop-blur rounded-full px-6 py-3 border border-yellow-500/30 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">2,450 Points</span>
            </div>
          </div>
        </motion.div>

        {/* Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {boxes.map((box) => (
            <motion.div
              key={box.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative cursor-pointer ${!box.available ? 'opacity-50' : ''}`}
              onClick={() => box.available && !isOpening && openBox(box)}
            >
              <div className={`
                rounded-2xl p-6 text-center bg-gradient-to-b ${box.color}
                ${isOpening && selectedBox?.id === box.id ? 'animate-pulse' : ''}
              `}>
                {/* Box Icon */}
                <motion.div
                  animate={isOpening && selectedBox?.id === box.id ? {
                    rotate: [0, 10, -10, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  {box.icon}
                </motion.div>

                {/* Box Info */}
                <h3 className="text-xl font-bold mb-2">{box.name}</h3>
                <p className="text-sm mb-4">
                  {box.cost === 0 ? 'Free' : `${box.cost} points`}
                </p>

                {/* Cooldown */}
                {box.cooldown > 0 && (
                  <div className="text-xs text-gray-300">
                    {box.cooldown}h cooldown
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Opening Animation */}
        <AnimatePresence>
          {isOpening && selectedBox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                {!prize ? (
                  <>
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-8xl mb-8"
                    >
                      {selectedBox.icon}
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">Opening {selectedBox.name}...</h2>
                    <div className="flex justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                      <Zap className="w-6 h-6 text-blue-400 animate-pulse" />
                      <Star className="w-6 h-6 text-purple-400 animate-pulse" />
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <div className="text-8xl mb-4">
                      {prize.prize_type === 'money' ? '💰' : 
                       prize.prize_type === 'points' ? '⭐' : '🎁'}
                    </div>
                    <h2 className="text-4xl font-bold text-green-400 mb-2">
                      You Won!
                    </h2>
                    <p className="text-2xl mb-4">{prize.prize_name}</p>
                    <button
                      onClick={() => {
                        setIsOpening(false);
                        setPrize(null);
                        setSelectedBox(null);
                      }}
                      className="bg-white text-purple-600 font-bold px-6 py-2 rounded-lg"
                    >
                      Awesome!
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Wins */}
        {history.length > 0 && (
          <div className="mt-12 bg-black/30 backdrop-blur rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Recent Wins
            </h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {item.prize_type === 'money' ? '💰' : 
                       item.prize_type === 'points' ? '⭐' : '🎁'}
                    </span>
                    <span>{item.prize_name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Streak */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" /> Daily Streak Bonus
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {[1,2,3,4,5,6,7].map((day) => (
              <div
                key={day}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-lg
                  ${day <= streak ? 'bg-yellow-400 text-purple-900 font-bold' : 'bg-white/20'}
                `}
              >
                {day <= streak ? '⭐' : day}
              </div>
            ))}
          </div>
          <p className="text-sm mt-4 text-center">
            {streak < 7 
              ? `${7 - streak} more days for legendary box!`
              : 'Max streak! Come back tomorrow for more!'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ THIS IS CRITICAL - MUST HAVE DEFAULT EXPORT
export default MysteryBox;
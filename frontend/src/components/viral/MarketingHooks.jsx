import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MarketingHooks = () => {
  const [currentHook, setCurrentHook] = useState(0);

  const hooks = [
    { icon: '💰', text: 'Make money while you scroll', color: 'from-green-400 to-blue-500' },
    { icon: '🎮', text: 'Level up your content game', color: 'from-purple-400 to-pink-500' },
    { icon: '🤝', text: 'Find your perfect creator match', color: 'from-yellow-400 to-orange-500' },
    { icon: '🎁', text: 'Unlock mystery rewards daily', color: 'from-red-400 to-purple-500' },
    { icon: '🔥', text: 'Go viral with trending challenges', color: 'from-orange-400 to-red-500' },
    { icon: '📈', text: 'See your future earnings today', color: 'from-blue-400 to-green-500' },
    { icon: '⭐', text: 'From zero to hero - start now', color: 'from-pink-400 to-yellow-500' },
    { icon: '🔮', text: 'AI predicts your success path', color: 'from-indigo-400 to-purple-500' },
    { icon: '🏆', text: 'Compete with creators worldwide', color: 'from-yellow-400 to-amber-500' },
    { icon: '🎬', text: 'Create like a pro with AI', color: 'from-cyan-400 to-blue-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHook((prev) => (prev + 1) % hooks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHook}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`bg-gradient-to-r ${hooks[currentHook].color} rounded-full px-4 py-2 shadow-lg`}
        >
          <span className="mr-2">{hooks[currentHook].icon}</span>
          <span className="text-white font-medium">{hooks[currentHook].text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MarketingHooks;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Gift, Award, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ViralChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/viral/challenges');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setChallenges(data.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          prize: `$${c.prize_amount}`,
          entries: c.participants || 0,
          daysLeft: Math.max(0, Math.ceil((new Date(c.end_date) - new Date()) / (1000 * 60 * 60 * 24))),
          hashtag: c.hashtag,
          difficulty: c.difficulty,
          participants: c.participants || 0,
          prize_description: c.prize_description
        })));
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      // Mock data
      setChallenges([
        {
          id: 1,
          title: "Dance Challenge 💃",
          description: "Show us your best moves!",
          prize: "$1000",
          entries: 1234,
          daysLeft: 3,
          hashtag: "#NexStreamDance",
          difficulty: "Medium",
          participants: 567
        },
        {
          id: 2,
          title: "Comedy Showdown 😂",
          description: "Make us laugh in 30 seconds",
          prize: "$2000",
          entries: 2341,
          daysLeft: 2,
          hashtag: "#NexStreamComedy",
          difficulty: "Hard",
          participants: 891
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challenge) => {
    if (!user) {
      toast.error('Please login to join challenges');
      return;
    }

    setActiveChallenge(challenge);
  };

  const submitEntry = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/viral/challenges/${activeChallenge.id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entry_url: 'pending' })
      });

      if (response.ok) {
        toast.success(`Successfully joined ${activeChallenge.title}!`);
        loadChallenges();
        setActiveChallenge(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to join challenge');
      }
    } catch (error) {
      toast.error('Error joining challenge');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-4">
            VIRAL CHALLENGES
          </h1>
          <p className="text-xl text-gray-300">
            Compete, win prizes, and go viral! 🏆
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="bg-white/10 rounded-full px-4 py-2">
              <span className="text-yellow-400 font-bold">
                ${challenges.reduce((sum, c) => sum + parseInt(c.prize.replace('$', '')), 0)}
              </span>
              <span className="text-gray-300 ml-2">in prizes</span>
            </div>
            <div className="bg-white/10 rounded-full px-4 py-2">
              <span className="text-green-400 font-bold">
                {challenges.reduce((sum, c) => sum + c.participants, 0)}
              </span>
              <span className="text-gray-300 ml-2">participants</span>
            </div>
          </div>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-2xl p-6 backdrop-blur border border-white/10 hover:border-yellow-400/50 transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => joinChallenge(challenge)}
            >
              {/* Prize Badge */}
              <div className="absolute top-4 right-4 bg-yellow-500 rounded-full px-3 py-1 text-sm font-bold">
                🏆 {challenge.prize}
              </div>

              <h3 className="text-2xl font-bold mb-2">{challenge.title}</h3>
              <p className="text-gray-300 mb-4">{challenge.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <Clock className="w-4 h-4 inline mr-1 text-yellow-400" />
                  <span className="text-sm">{challenge.daysLeft} days left</span>
                </div>
                <div className="bg-black/30 rounded-lg p-2 text-center">
                  <Users className="w-4 h-4 inline mr-1 text-blue-400" />
                  <span className="text-sm">{challenge.participants} joined</span>
                </div>
              </div>

              {/* Hashtag */}
              <div className="bg-pink-500/20 rounded-full px-3 py-1 inline-block">
                <span className="text-pink-300 text-sm">{challenge.hashtag}</span>
              </div>

              {/* Difficulty Badge */}
              <div className={`mt-3 text-xs font-semibold ${
                challenge.difficulty === 'Easy' ? 'text-green-400' :
                challenge.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                ★ {challenge.difficulty}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Challenge Modal */}
        {activeChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50"
            onClick={() => setActiveChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold mb-4">{activeChallenge.title}</h2>
              <p className="text-gray-300 mb-6">{activeChallenge.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span>Prize Pool</span>
                  <span className="text-yellow-400 font-bold text-xl">{activeChallenge.prize}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span>Entries</span>
                  <span className="text-blue-400">{activeChallenge.entries}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span>Time Left</span>
                  <span className="text-green-400">{activeChallenge.daysLeft} days</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span>Hashtag</span>
                  <span className="text-pink-400">{activeChallenge.hashtag}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span>Prize</span>
                  <span className="text-yellow-400">{activeChallenge.prize_description || activeChallenge.prize}</span>
                </div>
              </div>

              <button
                onClick={submitEntry}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 rounded-lg mb-3"
              >
                Join Challenge 🚀
              </button>
              <button
                onClick={() => setActiveChallenge(null)}
                className="w-full bg-white/10 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViralChallenges;
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const TikTokFeed = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState({});
  const videoRefs = useRef([]);
  const controls = useAnimation();

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    // Play current video, pause others
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch(e => console.log('Autoplay prevented:', e));
          // Record view
          recordView(videos[currentIndex]?.id);
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex, videos]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      console.log('Loading real videos from database...');
      
      const response = await fetch('/api/viral/feed');
      
      if (!response.ok) {
        throw new Error('Failed to load videos');
      }
      
      const data = await response.json();
      console.log(`Loaded ${data.length} videos`);
      
      if (data && data.length > 0) {
        setVideos(data);
        
        // Check which videos are liked by current user
        if (user) {
          const token = localStorage.getItem('token');
          // You'd need an endpoint to check liked status
          // For now, we'll just use local state
        }
      } else {
        toast.info('No videos available');
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const recordView = async (videoId) => {
    if (!videoId) return;
    
    try {
      await fetch(`/api/viral/feed/${videoId}/view`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const handleLike = async (videoId) => {
    if (!user) {
      toast.error('Login to like videos');
      return;
    }

    const wasLiked = liked[videoId];
    setLiked(prev => ({ ...prev, [videoId]: !wasLiked }));

    // Optimistic update
    const newVideos = [...videos];
    const videoIndex = newVideos.findIndex(v => v.id === videoId);
    if (videoIndex !== -1) {
      newVideos[videoIndex].likes_count += wasLiked ? -1 : 1;
      setVideos(newVideos);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/viral/feed/${videoId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to like video');
      }

      // If the server response doesn't match our optimistic update, correct it
      if (data.liked === wasLiked) {
        // Revert optimistic update
        newVideos[videoIndex].likes_count += wasLiked ? 1 : -1;
        setVideos(newVideos);
        setLiked(prev => ({ ...prev, [videoId]: wasLiked }));
      }
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like video');
      // Revert optimistic update
      newVideos[videoIndex].likes_count += wasLiked ? 1 : -1;
      setVideos(newVideos);
      setLiked(prev => ({ ...prev, [videoId]: wasLiked }));
    }
  };

  const handleShare = (video) => {
    const shareData = {
      title: video.title,
      text: `Check out this video on NexStream!`,
      url: `${window.location.origin}/content/${video.id}`
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y < -100 && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.y > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      controls.start({ y: 0 });
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num/1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num/1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <Eye className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">No Videos Yet</h2>
        <p className="text-gray-400">Be the first to upload a video!</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          animate={index === currentIndex ? controls : {}}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            y: (index - currentIndex) * 100 + '%',
            zIndex: index === currentIndex ? 10 : 1
          }}
        >
          <video
            ref={el => videoRefs.current[index] = el}
            src={video.video_url}
            poster={video.thumbnail_url}
            loop
            muted={muted}
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          
          {/* Video Info */}
          <div className="absolute bottom-20 left-4 text-white z-20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xl overflow-hidden">
                {video.user?.avatar_url ? (
                  <img src={video.user.avatar_url} alt={video.user.username} className="w-full h-full object-cover" />
                ) : (
                  <span>{video.user?.username?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <h3 className="text-lg font-bold">@{video.user?.username}</h3>
            </div>
            <p className="text-sm mt-1 max-w-xs">{video.title}</p>
          </div>
          
          {/* Side Actions */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-4 z-20">
            <button 
              onClick={() => handleLike(video.id)}
              className="flex flex-col items-center gap-1"
            >
              <div className="bg-black/40 rounded-full p-3 backdrop-blur hover:bg-pink-500/40 transition-all">
                <Heart 
                  className={`w-6 h-6 ${liked[video.id] ? 'fill-pink-500 text-pink-500' : 'text-white'}`} 
                />
              </div>
              <span className="text-white text-xs">{formatNumber(video.likes_count || 0)}</span>
            </button>
            
            <button className="flex flex-col items-center gap-1">
              <div className="bg-black/40 rounded-full p-3 backdrop-blur hover:bg-blue-500/40 transition-all">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs">0</span>
            </button>
            
            <button 
              onClick={() => handleShare(video)}
              className="flex flex-col items-center gap-1"
            >
              <div className="bg-black/40 rounded-full p-3 backdrop-blur hover:bg-green-500/40 transition-all">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs">Share</span>
            </button>
          </div>

          {/* Video Indicator */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
            {videos.map((_, i) => (
              <div
                key={i}
                className={`w-1 h-8 rounded-full transition-all ${
                  i === currentIndex ? 'bg-pink-500 h-12' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      ))}
      
      {/* Sound Toggle */}
      <button 
        onClick={() => setMuted(!muted)}
        className="absolute top-20 right-4 bg-black/40 rounded-full p-3 backdrop-blur z-50 hover:bg-white/20 transition-all"
      >
        {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
      </button>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-40">
        <h1 className="text-2xl font-bold text-center text-white">For You</h1>
      </div>
    </div>
  );
};

export default TikTokFeed;
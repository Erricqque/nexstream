import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  FilmIcon, 
  MusicalNoteIcon, 
  GameControllerIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

const Home = () => {
  const [featuredContent, setFeaturedContent] = useState([]);
  const [trendingChannels, setTrendingChannels] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroVideo] = useState('https://player.vimeo.com/external/371837923.hd.mp4?s=2362c9b7bc1c79a6f1f6d3a3f7b9a9c9d8e7f6a5&profile_id=175');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured content (most viewed)
      const { data: featured } = await supabase
        .from('content')
        .select(`
          *,
          channel:channels(
            name,
            slug,
            logo
          ),
          uploaded_by:users(
            username,
            avatar
          )
        `)
        .eq('status', 'PUBLISHED')
        .order('views', { ascending: false })
        .limit(12);

      // Fetch trending channels
      const { data: channels } = await supabase
        .from('channels')
        .select(`
          *,
          owner:users(
            username,
            avatar
          ),
          content:content(count)
        `)
        .order('total_subscribers', { ascending: false })
        .limit(8);

      // Fetch recent content
      const { data: recent } = await supabase
        .from('content')
        .select(`
          *,
          channel:channels(name, slug, logo)
        `)
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false })
        .limit(10);

      setFeaturedContent(featured || []);
      setTrendingChannels(channels || []);
      setRecentContent(recent || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-xl font-semibold">Loading NexStream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      
      {/* ===== HERO SECTION - CINEMATIC ===== */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
            poster="https://images.unsplash.com/photo-1536240474400-95dad987ee1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-6">
                <SparklesIcon className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-cyan-400 font-medium">The Future of Digital Entertainment</span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  NexStream
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto lg:mx-0">
                Create. Sell. Connect. Earn.
              </p>
              
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                The all-in-one platform where creators build channels, sell content, 
                and connect with fans through real-time chat and network marketing.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/30"
                >
                  Start Your Channel Free
                  <ArrowRightIcon className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/explore"
                  className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white rounded-full font-semibold text-lg border border-gray-600 hover:border-cyan-400 hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
                >
                  Explore Content
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start mt-12">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-gray-400">Active Creators</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-gray-400">Content Items</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">1M+</div>
                  <div className="text-gray-400">Monthly Views</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-24 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Everything You Need to Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Built for creators, designed for growth. No limits, no barriers.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <FilmIcon className="w-12 h-12 text-cyan-400" />,
                title: "Sell Your Content",
                desc: "Upload movies, music, videos and games. Set your own prices and earn directly.",
                color: "from-cyan-500 to-blue-500"
              },
              {
                icon: <ChatBubbleLeftRightIcon className="w-12 h-12 text-blue-400" />,
                title: "Real-Time Chat",
                desc: "Connect with fans instantly. WhatsApp-like messaging with media sharing.",
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: <UserGroupIcon className="w-12 h-12 text-purple-400" />,
                title: "Network Marketing",
                desc: "Built-in MLM system. Refer others and earn lifetime commissions.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <CurrencyDollarIcon className="w-12 h-12 text-pink-400" />,
                title: "Multiple Revenue Streams",
                desc: "Subscriptions, rentals, one-time purchases, tips, and affiliate sales.",
                color: "from-pink-500 to-red-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED CONTENT CAROUSEL ===== */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Trending Now</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">🔥 Most Popular Content</h2>
                <p className="text-gray-400 mt-2">What everyone is watching right now</p>
              </motion.div>
            </div>
            <Link 
              to="/explore" 
              className="group flex items-center text-cyan-400 hover:text-cyan-300 font-semibold mt-4 md:mt-0"
            >
              View All Content
              <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {featuredContent.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                className="group relative cursor-pointer"
              >
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1536240474400-95dad987ee1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-gray-300 text-xs mt-1">{item.channel?.name}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <EyeIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{item.views?.toLocaleString() || '0'} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  {item.price > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      ${item.price}
                    </div>
                  )}
                  
                  {item.is_free && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  )}

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <PlayIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TOP CHANNELS SECTION ===== */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Creator Economy</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">🏆 Top Creator Channels</h2>
            <p className="text-gray-400 mt-2">Join thousands of creators building their business</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trendingChannels.map((channel, index) => (
              <motion.div
                key={channel.id}
                variants={fadeInUp}
                className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={channel.logo || channel.owner?.avatar || 'https://via.placeholder.com/64'}
                      alt={channel.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-cyan-400 transition-all duration-300"
                    />
                    {channel.is_verified && (
                      <CheckBadgeIcon className="w-5 h-5 text-cyan-400 absolute -bottom-1 -right-1 bg-gray-900 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{channel.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {channel.content?.length || 0} {channel.content?.length === 1 ? 'video' : 'videos'}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {channel.description || 'No description provided.'}
                </p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-cyan-400 font-semibold block">
                      {channel.total_subscribers?.toLocaleString() || 0}
                    </span>
                    <span className="text-gray-500 text-xs">subscribers</span>
                  </div>
                  
                  <Link
                    to={`/channel/${channel.slug}`}
                    className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm hover:bg-cyan-500/20 transition-colors border border-cyan-500/30"
                  >
                    Visit Channel
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== RECENT UPLOADS ===== */}
      <section className="py-24 bg-gradient-to-t from-gray-900 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Fresh Content</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">🆓 Recent Uploads</h2>
                <p className="text-gray-400 mt-2">New content added by creators like you</p>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recentContent.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative cursor-pointer"
              >
                <div className="aspect-[9/16] rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1536240474400-95dad987ee1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs font-semibold line-clamp-2">{item.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ClockIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 text-xs">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SparklesIcon className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your Empire?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators already earning on NexStream. 
              Start your channel today, upload your content, and connect with fans worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Create Your Channel Free
              </Link>
              
              <Link
                to="/how-it-works"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-300">
              <span className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 text-cyan-400 mr-2" />
                No credit card required
              </span>
              <span className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 text-cyan-400 mr-2" />
                14-day free trial
              </span>
              <span className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 text-cyan-400 mr-2" />
                Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                NexStream
              </h3>
              <p className="text-gray-400 text-sm">
                Empowering creators to build sustainable businesses through digital content and community.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">For Creators</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/create" className="hover:text-cyan-400">Start Selling</Link></li>
                <li><Link to="/pricing" className="hover:text-cyan-400">Pricing</Link></li>
                <li><Link to="/success" className="hover:text-cyan-400">Success Stories</Link></li>
                <li><Link to="/affiliate" className="hover:text-cyan-400">Affiliate Program</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/movies" className="hover:text-cyan-400">Movies</Link></li>
                <li><Link to="/music" className="hover:text-cyan-400">Music</Link></li>
                <li><Link to="/games" className="hover:text-cyan-400">Games</Link></li>
                <li><Link to="/live" className="hover:text-cyan-400">Live Streams</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/help" className="hover:text-cyan-400">Help Center</Link></li>
                <li><Link to="/community" className="hover:text-cyan-400">Community</Link></li>
                <li><Link to="/blog" className="hover:text-cyan-400">Blog</Link></li>
                <li><Link to="/faq" className="hover:text-cyan-400">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/terms" className="hover:text-cyan-400">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-cyan-400">Privacy</Link></li>
                <li><Link to="/cookies" className="hover:text-cyan-400">Cookies</Link></li>
                <li><Link to="/dmca" className="hover:text-cyan-400">DMCA</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2026 NexStream. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import PlaylistCard from '../../components/playlists/PlaylistCard';
import ProfileEdit from '../../components/ProfileEdit';
import { toast } from 'react-hot-toast';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Gift, 
  Trophy, 
  Award, 
  Zap, 
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Video,
  Heart,
  Share2,
  MessageCircle,
  Eye,
  Play,
  List,
  BarChart,
  Settings,
  LogOut,
  Camera,
  Edit,
  MoreHorizontal,
  Download,
  Upload,
  Copy,
  Check,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Info,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Music,
  Headphones,
  Film,
  Image,
  FileText,
  BookOpen,
  Code,
  Gamepad,
  Briefcase,
  GraduationCap,
  Heart as HeartIcon,
  MessageSquare,
  Share,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info as InfoIcon,
  Loader,
  RefreshCw,
  Trash2,
  Edit3,
  Save,
  Ban,
  Flag,
  Bell,
  BellOff,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Shield,
  CreditCard,
  Percent,
  PieChart,
  LineChart,
  Activity,
  Calendar,
  Users as UsersIcon,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  UserCog,
  CircleUser,
  CircleDollarSign,
  Coins,
  Banknote,
  PiggyBank,
  Landmark,
  Receipt,
  ReceiptText
  // ❌ REMOVED INVALID ICONS:
  // ReceiptCent, ReceiptEuro, ReceiptPound, ReceiptYen, ReceiptSwissFranc,
  // ReceiptRussianRuble, ReceiptIndianRupee, ReceiptJapaneseYen, ReceiptChineseYen,
  // WalletCards, WalletMinimal, CircleUserRound, UserRound, UserRoundPlus,
  // UserRoundCheck, UserRoundX, UserRoundCog, UsersRound
} from 'lucide-react';
import AITips from '../../components/AITips';
import QuickWins from '../../components/viral/QuickWins';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [wallet, setWallet] = useState({ balance: 1250.75, pending: 230.50 });
  const [mlmStats, setMlmStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingCommissions: 0,
    rank: 'Bronze',
    nextRank: 'Silver',
    referralsNeeded: 5
  });
  const [viralStats, setViralStats] = useState({
    challengesJoined: 3,
    raceRank: 42,
    mysteryBoxes: 7,
    dailyStreak: 5
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Load user content
      const { data: contentData } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setContent(contentData || []);

      // Load playlists
      const { data: playlistData } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPlaylists(playlistData || []);

      // Load wallet data with error handling
      try {
        const token = localStorage.getItem('token');
        const walletResponse = await fetch(`/api/wallet/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          setWallet({
            balance: walletData.balance || 1250.75,
            pending: walletData.pending_payouts || 230.50
          });
        } else {
          console.warn('Wallet API returned status:', walletResponse.status);
          // Keep mock data
        }
      } catch (walletError) {
        console.error('Error loading wallet:', walletError);
        // Keep mock data
      }

      // Load MLM stats
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id);

      const { data: earningsData } = await supabase
        .from('mlm_earnings')
        .select('*')
        .eq('user_id', user.id);

      const totalEarned = earningsData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const pending = earningsData?.filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

      setMlmStats({
        totalReferrals: referralsData?.length || 0,
        totalEarnings: totalEarned,
        pendingCommissions: pending,
        rank: totalEarned > 1000 ? 'Gold' : totalEarned > 500 ? 'Silver' : 'Bronze',
        nextRank: totalEarned > 1000 ? 'Platinum' : totalEarned > 500 ? 'Gold' : 'Silver',
        referralsNeeded: 5
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large (max 5MB)');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user.id
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProfile(prev => ({ ...prev, avatar_url: data.url }));
      setImageKey(Date.now());
      toast.success('Profile picture updated!');
      loadDashboardData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  };

  const fontSize = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem'
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #FF3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .profile-image-container {
          position: relative;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 4px solid #FF3366;
          overflow: hidden;
          background-color: #2a2a2a;
          box-shadow: 0 8px 30px rgba(255,51,102,0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .profile-image-container:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(255,51,102,0.6);
        }

        .profile-image-container:hover .upload-overlay {
          opacity: 1;
        }

        .upload-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255,51,102,0.95);
          color: white;
          text-align: center;
          padding: 10px;
          font-size: 13px;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-weight: 600;
          backdrop-filter: blur(5px);
          letter-spacing: 0.5px;
        }

        .upload-spinner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 20;
        }

        .upload-spinner::after {
          content: '';
          width: 40px;
          height: 40px;
          border: 4px solid #FF3366;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .edit-profile-btn {
          padding: 10px 24px;
          background: #FF3366;
          border: none;
          border-radius: 30px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(255,51,102,0.4);
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .edit-profile-btn:hover {
          background: #ff1f4f;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255,51,102,0.5);
        }

        .quick-action-card {
          background: linear-gradient(135deg, rgba(255,51,102,0.1), rgba(79,172,254,0.1));
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .quick-action-card:hover {
          transform: translateY(-5px);
          border-color: #FF3366;
          box-shadow: 0 10px 30px rgba(255,51,102,0.2);
        }
      `}</style>

      {/* Header Banner */}
      <div style={{
        height: '250px',
        background: profile?.banner_url 
          ? `url(${profile.banner_url}) center/cover no-repeat`
          : 'linear-gradient(135deg, #FF3366, #4FACFE)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'
        }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `0 ${spacing.xl}` }}>
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: spacing.xl,
          marginTop: '-100px',
          marginBottom: spacing.xl,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 5
        }}>
          {/* Profile Image */}
          <div 
            className="profile-image-container"
            onClick={() => !uploading && document.getElementById('avatar-upload-input').click()}
          >
            {profile?.avatar_url && !imageError ? (
              <img 
                key={imageKey}
                src={`${profile.avatar_url}?t=${imageKey}`}
                alt={profile?.username || 'Profile'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onLoad={() => setImageError(false)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            
            <div className="upload-overlay">
              <Camera size={16} />
              Change Photo
            </div>

            {uploading && <div className="upload-spinner" />}

            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </div>

          {/* Profile Info */}
          <div style={{ flex: 1, paddingBottom: spacing.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xs, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.2rem', margin: 0, color: 'white', fontWeight: '700' }}>
                {profile?.username || user?.email?.split('@')[0]}
              </h1>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="edit-profile-btn"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
            
            {profile?.bio ? (
              <p style={{ color: '#e0e0e0', marginBottom: spacing.md, fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>
                {profile.bio}
              </p>
            ) : (
              <p style={{ color: '#999', marginBottom: spacing.md, fontSize: '1rem', fontStyle: 'italic' }}>
                No bio yet. Click Edit Profile to add one.
              </p>
            )}
            
            {profile?.thoughts && (
              <div style={{
                background: 'rgba(42,42,42,0.8)',
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: '40px',
                marginBottom: spacing.md,
                display: 'inline-block',
                maxWidth: '100%',
                border: '1px solid #FF3366',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ color: '#FF3366', marginRight: spacing.sm }}>💭</span>
                <span style={{ color: '#fff', fontSize: '1.1rem' }}>{profile.thoughts}</span>
              </div>
            )}

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: spacing.xl, marginTop: spacing.md, color: '#ccc', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FF3366' }}>{content.length}</div>
                <div style={{ fontSize: '0.95rem', color: '#aaa' }}>Videos</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4FACFE' }}>{playlists.length}</div>
                <div style={{ fontSize: '0.95rem', color: '#aaa' }}>Playlists</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#43E97B' }}>{mlmStats.totalReferrals}</div>
                <div style={{ fontSize: '0.95rem', color: '#aaa' }}>Referrals</div>
              </div>
              <Link to="/business/wallet" style={{ textDecoration: 'none' }}>
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#F59E0B' }}>${wallet.balance.toFixed(2)}</div>
                  <div style={{ fontSize: '0.95rem', color: '#aaa' }}>Wallet</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* AI Tips Section */}
        <AITips userData={profile} />

        {/* Quick Wins Section */}
        <QuickWins />

        {/* Quick Action Cards - LINKS TO ALL FEATURES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <Link to="/business/wallet" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div style={{ fontWeight: 'bold' }}>Wallet</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>${wallet.balance}</div>
            </motion.div>
          </Link>

          <Link to="/business/withdraw" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <ArrowUpRight className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div style={{ fontWeight: 'bold' }}>Withdraw</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Get paid</div>
            </motion.div>
          </Link>

          <Link to="/mlm" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div style={{ fontWeight: 'bold' }}>MLM Network</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{mlmStats.totalReferrals} referrals</div>
            </motion.div>
          </Link>

          <Link to="/race" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div style={{ fontWeight: 'bold' }}>Referral Race</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Rank #{viralStats.raceRank}</div>
            </motion.div>
          </Link>

          <Link to="/challenges" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <Award className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <div style={{ fontWeight: 'bold' }}>Challenges</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{viralStats.challengesJoined} joined</div>
            </motion.div>
          </Link>

          <Link to="/mystery" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <Gift className="w-8 h-8 mx-auto mb-2 text-pink-400" />
              <div style={{ fontWeight: 'bold' }}>Mystery Box</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{viralStats.dailyStreak} day streak</div>
            </motion.div>
          </Link>

          <Link to="/calculator" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div style={{ fontWeight: 'bold' }}>Calculator</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Project earnings</div>
            </motion.div>
          </Link>

          <Link to="/feed" style={{ textDecoration: 'none' }}>
            <motion.div whileHover={{ scale: 1.05 }} className="quick-action-card">
              <Film className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <div style={{ fontWeight: 'bold' }}>TikTok Feed</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>Watch & earn</div>
            </motion.div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            title="Total Views"
            value={formatNumber(content.reduce((sum, c) => sum + (c.views_count || 0), 0))}
            color="#FF3366"
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            title="Total Likes"
            value={formatNumber(content.reduce((sum, c) => sum + (c.likes_count || 0), 0))}
            color="#4FACFE"
          />
          <Link to="/mlm" style={{ textDecoration: 'none' }}>
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="MLM Network"
              value={`${mlmStats.totalReferrals}`}
              subtitle={`${mlmStats.totalReferrals} referrals • $${mlmStats.totalEarnings.toFixed(2)} earned`}
              color="#43E97B"
              clickable
            />
          </Link>
          <Link to="/business/wallet" style={{ textDecoration: 'none' }}>
            <StatCard
              icon={<Wallet className="w-6 h-6" />}
              title="Wallet Balance"
              value={`$${wallet.balance.toFixed(2)}`}
              subtitle={`$${wallet.pending.toFixed(2)} pending`}
              color="#F59E0B"
              clickable
            />
          </Link>
        </div>

        {/* MLM Progress Card */}
        <Link to="/mlm" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'linear-gradient(135deg, #43E97B20, #4FACFE20)',
              borderRadius: '16px',
              padding: spacing.lg,
              marginBottom: spacing.xl,
              border: '1px solid #43E97B40',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <div>
                <h3 style={{ fontSize: fontSize.lg, margin: 0, color: '#43E97B' }}>MLM Progress</h3>
                <p style={{ color: '#888', margin: 0 }}>Current Rank: {mlmStats.rank}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: fontSize.xl, fontWeight: 'bold', color: '#43E97B' }}>{mlmStats.referralsNeeded}</div>
                <div style={{ fontSize: fontSize.sm, color: '#888' }}>referrals to {mlmStats.nextRank}</div>
              </div>
            </div>
            <div style={{ height: '8px', background: '#2a2a2a', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(mlmStats.totalReferrals / (mlmStats.totalReferrals + mlmStats.referralsNeeded)) * 100}%` }}
                transition={{ duration: 1 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #43E97B, #4FACFE)' }}
              />
            </div>
          </motion.div>
        </Link>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: spacing.md,
          borderBottom: '1px solid #333',
          marginBottom: spacing.xl,
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          <TabButton
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
            icon={<Film className="w-4 h-4" />}
            label="My Content"
          />
          <TabButton
            active={activeTab === 'playlists'}
            onClick={() => setActiveTab('playlists')}
            icon={<List className="w-4 h-4" />}
            label="Playlists"
          />
          <TabButton
            active={activeTab === 'mlm'}
            onClick={() => setActiveTab('mlm')}
            icon={<Users className="w-4 h-4" />}
            label="MLM Network"
          />
          <TabButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon={<BarChart className="w-4 h-4" />}
            label="Analytics"
          />
        </div>

        {/* Tab Content */}
        {activeTab === 'content' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg,
              flexWrap: 'wrap',
              gap: spacing.md
            }}>
              <h2 style={{ fontSize: fontSize.lg }}>Your Videos</h2>
              <Link to="/upload">
                <button style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: '#FF3366',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs
                }}>
                  <Upload size={16} />
                  Upload New
                </button>
              </Link>
            </div>

            {content.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: spacing.xl,
                background: '#1a1a1a',
                borderRadius: '10px'
              }}>
                <Film size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
                <p style={{ color: '#888' }}>No content yet. Start uploading!</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: spacing.lg
              }}>
                {content.map(item => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg
            }}>
              <h2 style={{ fontSize: fontSize.lg }}>Your Playlists</h2>
            </div>

            {playlists.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: spacing.xl,
                background: '#1a1a1a',
                borderRadius: '10px'
              }}>
                <List size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
                <p style={{ color: '#888' }}>No playlists yet. Create one from any video!</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: spacing.lg
              }}>
                {playlists.map(playlist => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'mlm' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.lg
            }}>
              <h2 style={{ fontSize: fontSize.lg }}>MLM Network</h2>
              <Link to="/mlm">
                <button style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: '#FF3366',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs
                }}>
                  View Full Dashboard
                  <ArrowUpRight size={16} />
                </button>
              </Link>
            </div>

            <div style={{
              background: '#1a1a1a',
              borderRadius: '16px',
              padding: spacing.xl,
              textAlign: 'center',
              border: '1px solid #333'
            }}>
              <Users size={64} style={{ marginBottom: spacing.md, color: '#43E97B' }} />
              <h3 style={{ fontSize: fontSize.lg, marginBottom: spacing.sm, color: '#43E97B' }}>
                Your MLM Network
              </h3>
              <p style={{ color: '#ccc', marginBottom: spacing.lg, fontSize: '1.1rem' }}>
                You have <strong style={{ color: '#43E97B' }}>{mlmStats.totalReferrals}</strong> referrals 
                earning you <strong style={{ color: '#43E97B' }}>${mlmStats.totalEarnings.toFixed(2)}</strong>
              </p>
              <Link to="/mlm">
                <button style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  background: '#43E97B',
                  border: 'none',
                  borderRadius: '30px',
                  color: '#0f0f0f',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  Manage MLM Network
                </button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>Analytics</h2>
            <div style={{
              background: '#1a1a1a',
              borderRadius: '16px',
              padding: spacing.xl,
              textAlign: 'center',
              border: '1px solid #333'
            }}>
              <BarChart size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
              <p style={{ color: '#888' }}>Detailed analytics coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <ProfileEdit 
          onClose={() => setShowProfileEdit(false)}
          onUpdate={(updatedProfile) => {
            setProfile(updatedProfile);
            setShowProfileEdit(false);
            toast.success('Profile updated successfully!');
          }}
        />
      )}
    </div>
  );
};

// ========== COMPONENTS ==========

const StatCard = ({ icon, title, value, subtitle, color, clickable }) => {
  const spacing = { xs: '4px', sm: '8px', md: '16px' };
  const fontSize = { xs: '0.75rem', sm: '0.875rem', lg: '1.25rem' };

  return (
    <motion.div
      whileHover={clickable ? { y: -5 } : {}}
      style={{
        background: '#1a1a1a',
        padding: spacing.md,
        borderRadius: '10px',
        borderLeft: `4px solid ${color}`,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'all 0.3s',
        border: '1px solid #333'
      }}
    >
      <div style={{ marginBottom: spacing.xs }}>{icon}</div>
      <p style={{ color: '#888', fontSize: fontSize.sm, marginBottom: spacing.xs }}>{title}</p>
      <p style={{ fontSize: fontSize.lg, fontWeight: 'bold', color, margin: 0 }}>{value}</p>
      {subtitle && <p style={{ color: '#888', fontSize: fontSize.xs, marginTop: spacing.xs }}>{subtitle}</p>}
    </motion.div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => {
  const spacing = { xs: '4px', sm: '8px', md: '16px' };
  const fontSize = { sm: '0.875rem', md: '1rem' };

  return (
    <button
      onClick={onClick}
      style={{
        padding: `${spacing.sm} 0`,
        marginRight: spacing.md,
        background: 'none',
        border: 'none',
        color: active ? '#FF3366' : '#888',
        cursor: 'pointer',
        borderBottom: active ? '2px solid #FF3366' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        fontSize: fontSize.md,
        fontWeight: active ? '600' : '400'
      }}
    >
      {icon}
      {label}
    </button>
  );
};

const ContentCard = ({ content }) => {
  const navigate = useNavigate();
  const spacing = { xs: '4px', sm: '8px', md: '16px' };
  const fontSize = { xs: '0.75rem', sm: '0.875rem', md: '1rem' };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/content/${content.id}`)}
      style={{
        background: '#1a1a1a',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #333'
      }}
    >
      <div style={{
        height: '140px',
        background: content.thumbnail_url 
          ? `url(${content.thumbnail_url}) center/cover`
          : 'linear-gradient(135deg, #2a2a3a, #1a1a2a)',
        position: 'relative'
      }}>
        {content.views_count > 0 && (
          <div style={{
            position: 'absolute',
            bottom: spacing.xs,
            right: spacing.xs,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: '20px',
            fontSize: fontSize.xs,
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Eye size={12} />
            {content.views_count}
          </div>
        )}
      </div>
      <div style={{ padding: spacing.md }}>
        <h3 style={{ fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.xs, color: 'white' }}>
          {content.title}
        </h3>
        <p style={{ color: '#888', fontSize: fontSize.sm, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Heart size={12} />
          {content.likes_count || 0} likes
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
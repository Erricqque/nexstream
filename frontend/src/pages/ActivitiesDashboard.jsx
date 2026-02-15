import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  EyeIcon, 
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  TrophyIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const ActivitiesDashboard = () => {
  const { user, userProfile, isVerified } = useAuth();
  const [timeframe, setTimeframe] = useState('week');
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    views: 15432,
    likes: 2341,
    comments: 567,
    shares: 234,
    subscribers: 892,
    earnings: 345.67,
    referrals: 23,
    referralEarnings: 78.90
  });

  const [referrals, setReferrals] = useState([
    { id: 1, name: 'John Doe', level: 1, joined: '2026-02-01', earnings: 45.50, active: true, avatar: '👤' },
    { id: 2, name: 'Jane Smith', level: 1, joined: '2026-02-03', earnings: 32.75, active: true, avatar: '👩' },
    { id: 3, name: 'Bob Johnson', level: 2, joined: '2026-02-05', earnings: 18.20, active: true, avatar: '👨' },
    { id: 4, name: 'Alice Brown', level: 2, joined: '2026-02-07', earnings: 12.90, active: false, avatar: '👵' },
    { id: 5, name: 'Charlie Wilson', level: 3, joined: '2026-02-10', earnings: 5.50, active: true, avatar: '👴' },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'view', content: 'Your video "React Tutorial" got 150 views', time: '5 minutes ago', icon: '👁️' },
    { id: 2, type: 'like', content: 'Someone liked your video "Flutterwave Integration"', time: '15 minutes ago', icon: '❤️' },
    { id: 3, type: 'comment', content: 'New comment on "Building a Channel"', time: '1 hour ago', icon: '💬' },
    { id: 4, type: 'subscribe', content: 'You gained 5 new subscribers', time: '3 hours ago', icon: '👥' },
    { id: 5, type: 'referral', content: 'Your referral John made a purchase', time: '5 hours ago', icon: '💰' },
    { id: 6, type: 'earning', content: 'You earned $12.50 from content sales', time: '1 day ago', icon: '💵' },
  ]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      color: 'white',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Activities Dashboard</h1>
          <p style={{ color: '#888' }}>Track your performance, earnings, and network growth</p>
        </div>

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          {['day', 'week', 'month', 'year', 'all'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '8px 20px',
                background: timeframe === t ? 'rgba(0,180,216,0.2)' : 'transparent',
                border: timeframe === t ? '2px solid #00b4d8' : '1px solid #333',
                borderRadius: '20px',
                color: timeframe === t ? '#00b4d8' : '#888',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid #333'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>Total Views</span>
              <EyeIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00b4d8' }}>{stats.views.toLocaleString()}</p>
            <p style={{ color: '#4CAF50', fontSize: '0.9rem' }}>↑ 12% from last {timeframe}</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid #333'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>Engagement</span>
              <HeartIcon className="w-5 h-5 text-pink-400" />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff69b4' }}>{stats.likes.toLocaleString()}</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>{stats.comments} comments · {stats.shares} shares</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid #333'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>Community</span>
              <UserGroupIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>{stats.subscribers.toLocaleString()}</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>subscribers</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid #333'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#888' }}>Earnings</span>
              <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>${stats.earnings.toFixed(2)}</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>+${stats.referralEarnings.toFixed(2)} from referrals</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
          
          {/* Left Column - Recent Activities */}
          <div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid #333',
              marginBottom: '25px'
            }}>
              <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ArrowTrendingUpIcon className="w-6 h-6 text-cyan-400" />
                Recent Activity
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recentActivities.map(activity => (
                  <div key={activity.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '10px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(0,180,216,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ marginBottom: '3px' }}>{activity.content}</p>
                      <p style={{ color: '#888', fontSize: '0.8rem' }}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Performance */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid #333'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Top Performing Content</h2>
              
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  borderBottom: i < 3 ? '1px solid #333' : 'none'
                }}>
                  <div style={{
                    width: '80px',
                    height: '45px',
                    background: '#1a1a2e',
                    borderRadius: '5px'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Video Title {i}</p>
                    <div style={{ display: 'flex', gap: '15px', color: '#888', fontSize: '0.9rem' }}>
                      <span>👁️ 1.2K views</span>
                      <span>❤️ 234 likes</span>
                      <span>💬 56 comments</span>
                    </div>
                  </div>
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>$12.50</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - MLM & Network Marketing */}
          <div>
            {/* Referral Stats */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,180,216,0.1), rgba(0,119,182,0.1))',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid #00b4d8',
              marginBottom: '25px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <TrophyIcon className="w-6 h-6 text-yellow-400" />
                <h2>Network Marketing</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <p style={{ color: '#888', marginBottom: '5px' }}>Total Referrals</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00b4d8' }}>{stats.referrals}</p>
                </div>
                <div>
                  <p style={{ color: '#888', marginBottom: '5px' }}>Referral Earnings</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>${stats.referralEarnings}</p>
                </div>
              </div>

              {/* Commission Structure */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginBottom: '10px', fontSize: '1rem' }}>Commission Structure</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.5rem', color: '#FFD700' }}>10%</span>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>Level 1</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.5rem', color: '#FFA500' }}>5%</span>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>Level 2</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.5rem', color: '#FF69B4' }}>2.5%</span>
                    <p style={{ color: '#888', fontSize: '0.8rem' }}>Level 3</p>
                  </div>
                </div>
              </div>

              {/* Referral Link */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                padding: '15px'
              }}>
                <p style={{ color: '#888', marginBottom: '10px' }}>Your Referral Link</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={`https://nexstream.com/ref/${user?.id?.slice(0,8)}`}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid #333',
                      borderRadius: '5px',
                      color: '#00b4d8'
                    }}
                  />
                  <button style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Referrals List */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '15px',
              padding: '25px',
              border: '1px solid #333'
            }}>
              <h2 style={{ marginBottom: '20px' }}>Your Referrals</h2>
              
              {referrals.map(ref => (
                <div key={ref.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  borderBottom: '1px solid #333'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    {ref.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 'bold' }}>{ref.name}</span>
                      <span style={{
                        color: ref.active ? '#4CAF50' : '#888',
                        fontSize: '0.8rem'
                      }}>
                        {ref.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', color: '#888', fontSize: '0.9rem' }}>
                      <span>Level {ref.level}</span>
                      <span>Joined {new Date(ref.joined).toLocaleDateString()}</span>
                      <span style={{ color: '#4CAF50' }}>${ref.earnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Link to="/affiliate" style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '20px',
                color: '#00b4d8',
                textDecoration: 'none'
              }}>
                View All Referrals →
              </Link>
            </div>
          </div>
        </div>

        {/* Verified Creator Benefits */}
        {isVerified && (
          <div style={{
            marginTop: '30px',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid #FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
                Verified Creator Benefits Active
              </h3>
              <p style={{ color: '#aaa' }}>
                You're enjoying 75% revenue share, priority support, and boosted visibility.
              </p>
            </div>
            <span style={{
              padding: '5px 15px',
              background: '#FFD700',
              borderRadius: '20px',
              color: 'black',
              fontWeight: 'bold'
            }}>
              ✓ Verified
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesDashboard;
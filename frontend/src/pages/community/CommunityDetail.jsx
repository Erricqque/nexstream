import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isMember, setIsMember] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    loadCommunityData();
    return () => window.removeEventListener('resize', handleResize);
  }, [id, user]);

  const loadCommunityData = async () => {
    try {
      // Mock community data
      setCommunity({
        id: parseInt(id),
        name: 'Gaming Enthusiasts',
        description: 'A community for gamers to share experiences, tips, and connect',
        icon: '🎮',
        members: 15420,
        posts: 3421,
        events: 12,
        created: '2023-01-15',
        category: 'Gaming',
        rules: [
          'Be respectful to all members',
          'No spam or self-promotion',
          'Keep content family-friendly',
          'Use appropriate tags'
        ]
      });

      setPosts([
        {
          id: 1,
          title: 'Best RPG Games of 2024',
          content: 'What are your favorite RPG games this year? Share your recommendations!',
          author: 'GameMaster',
          avatar: null,
          likes: 245,
          comments: 56,
          time: '2 hours ago',
          pinned: true
        },
        {
          id: 2,
          title: 'Looking for teammates',
          content: 'Need 2 more players for weekend tournament. DM me!',
          author: 'ProPlayer',
          avatar: null,
          likes: 89,
          comments: 23,
          time: '5 hours ago',
          pinned: false
        },
        {
          id: 3,
          title: 'New Game Release Discussion',
          content: 'Anyone tried the new Zelda game? Thoughts?',
          author: 'NintendoFan',
          avatar: null,
          likes: 156,
          comments: 42,
          time: '1 day ago',
          pinned: false
        }
      ]);

      setMembers([
        { id: 1, name: 'GameMaster', role: 'Admin', joined: 'Jan 2023', active: true },
        { id: 2, name: 'ProPlayer', role: 'Moderator', joined: 'Mar 2023', active: true },
        { id: 3, name: 'NintendoFan', role: 'Member', joined: 'Jun 2023', active: true },
        { id: 4, name: 'PCGamer', role: 'Member', joined: 'Aug 2023', active: false }
      ]);

      setEvents([
        {
          id: 1,
          title: 'Weekend Tournament',
          date: '2024-01-20',
          time: '15:00 UTC',
          attendees: 45,
          description: 'Join our weekly gaming tournament'
        },
        {
          id: 2,
          title: 'Game Night',
          date: '2024-01-22',
          time: '19:00 UTC',
          attendees: 23,
          description: 'Casual gaming session'
        }
      ]);

      setIsMember(true);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = () => {
    setIsMember(!isMember);
  };

  const createPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    const post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: user?.email?.split('@')[0] || 'User',
      likes: 0,
      comments: 0,
      time: 'Just now',
      pinned: false
    };
    
    setPosts([post, ...posts]);
    setShowCreatePost(false);
    setNewPost({ title: '', content: '' });
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
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Community Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
            borderRadius: '15px',
            padding: spacing.xl,
            marginBottom: spacing.xl,
            position: 'relative'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              {community.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: isMobile ? fontSize.xl : fontSize.xxl, marginBottom: spacing.xs }}>
                {community.name}
              </h1>
              <p style={{ opacity: 0.9, marginBottom: spacing.sm }}>{community.description}</p>
              <div style={{
                display: 'flex',
                gap: spacing.lg,
                flexWrap: 'wrap',
                fontSize: fontSize.sm
              }}>
                <span>👥 {community.members.toLocaleString()} members</span>
                <span>📝 {community.posts} posts</span>
                <span>📅 Created {community.created}</span>
                <span>🏷️ {community.category}</span>
              </div>
            </div>
            <button
              onClick={handleJoinLeave}
              style={{
                padding: `${spacing.md} ${spacing.xl}`,
                background: isMember ? 'rgba(255,255,255,0.2)' : '#FF3366',
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                fontSize: fontSize.md,
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {isMember ? 'Leave Community' : 'Join Community'}
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          borderBottom: '1px solid #333',
          overflowX: 'auto',
          paddingBottom: spacing.xs
        }}>
          {['posts', 'events', 'members', 'about'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                background: 'none',
                border: 'none',
                color: activeTab === tab ? '#FF3366' : '#888',
                cursor: 'pointer',
                fontSize: fontSize.md,
                textTransform: 'capitalize',
                borderBottom: activeTab === tab ? '2px solid #FF3366' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.lg
                }}>
                  <h2 style={{ fontSize: fontSize.lg }}>Community Posts</h2>
                  {isMember && (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      style={{
                        padding: `${spacing.sm} ${spacing.lg}`,
                        background: '#FF3366',
                        border: 'none',
                        borderRadius: '20px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      + Create Post
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  {posts.map(post => (
                    <motion.div
                      key={post.id}
                      whileHover={{ scale: 1.01 }}
                      style={{
                        background: '#1a1a1a',
                        borderRadius: '10px',
                        padding: spacing.lg,
                        border: post.pinned ? '1px solid #FF3366' : 'none'
                      }}
                    >
                      {post.pinned && (
                        <span style={{
                          color: '#FF3366',
                          fontSize: fontSize.xs,
                          marginBottom: spacing.xs,
                          display: 'block'
                        }}>
                          📌 Pinned
                        </span>
                      )}
                      <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.sm }}>{post.title}</h3>
                      <p style={{ color: '#888', marginBottom: spacing.md }}>{post.content}</p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: spacing.sm
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          <div style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF3366, #4FACFE)'
                          }} />
                          <span>{post.author}</span>
                          <span style={{ color: '#888', fontSize: fontSize.xs }}>{post.time}</span>
                        </div>
                        <div style={{ display: 'flex', gap: spacing.md }}>
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>Upcoming Events</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                  {events.map(event => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.01 }}
                      style={{
                        background: '#1a1a1a',
                        borderRadius: '10px',
                        padding: spacing.lg
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: spacing.md
                      }}>
                        <div>
                          <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.xs }}>{event.title}</h3>
                          <p style={{ color: '#888', marginBottom: spacing.sm }}>{event.description}</p>
                          <div style={{ display: 'flex', gap: spacing.lg, fontSize: fontSize.sm }}>
                            <span>📅 {event.date}</span>
                            <span>⏰ {event.time}</span>
                            <span>👥 {event.attendees} attending</span>
                          </div>
                        </div>
                        <button
                          style={{
                            padding: `${spacing.sm} ${spacing.lg}`,
                            background: '#4FACFE',
                            border: 'none',
                            borderRadius: '20px',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          Attend
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>Community Members</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: spacing.md
                }}>
                  {members.map(member => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: '#1a1a1a',
                        borderRadius: '10px',
                        padding: spacing.lg,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.md
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        {member.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.xs }}>{member.name}</h3>
                        <p style={{ color: '#888', fontSize: fontSize.sm }}>
                          {member.role} • Joined {member.joined}
                        </p>
                      </div>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: member.active ? '#43E97B' : '#888'
                      }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: spacing.xl
              }}>
                <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>About Community</h2>
                <p style={{ color: '#888', lineHeight: 1.6, marginBottom: spacing.xl }}>
                  {community.description}
                </p>

                <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>Community Rules</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: spacing.xl }}>
                  {community.rules.map((rule, index) => (
                    <li key={index} style={{
                      padding: spacing.sm,
                      borderBottom: '1px solid #333',
                      color: '#888'
                    }}>
                      {index + 1}. {rule}
                    </li>
                  ))}
                </ul>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: spacing.lg
                }}>
                  <div>
                    <p style={{ color: '#888', marginBottom: spacing.xs }}>Created</p>
                    <p>{community.created}</p>
                  </div>
                  <div>
                    <p style={{ color: '#888', marginBottom: spacing.xs }}>Category</p>
                    <p>{community.category}</p>
                  </div>
                  <div>
                    <p style={{ color: '#888', marginBottom: spacing.xs }}>Total Members</p>
                    <p>{community.members.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style={{ color: '#888', marginBottom: spacing.xs }}>Total Posts</p>
                    <p>{community.posts.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Create Post Modal */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: spacing.md
              }}
              onClick={() => setShowCreatePost(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                style={{
                  background: '#1a1a2a',
                  borderRadius: '15px',
                  padding: spacing.xl,
                  width: '100%',
                  maxWidth: '500px'
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ fontSize: fontSize.xl, marginBottom: spacing.lg }}>
                  Create New Post
                </h2>

                <div style={{ marginBottom: spacing.md }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="What's on your mind?"
                    rows="5"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: spacing.md
                }}>
                  <button
                    onClick={createPost}
                    disabled={!newPost.title.trim() || !newPost.content.trim()}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      background: (!newPost.title.trim() || !newPost.content.trim()) ? '#555' : '#FF3366',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: (!newPost.title.trim() || !newPost.content.trim()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Post
                  </button>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    style={{
                      flex: 1,
                      padding: spacing.md,
                      background: 'transparent',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityDetail;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [communityMembers, setCommunityMembers] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const messagesEndRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'gaming',
    isPrivate: false,
    icon: '🎮'
  });

  const categories = [
    'gaming', 'music', 'movies', 'technology', 'art', 'education', 
    'sports', 'lifestyle', 'news', 'entertainment', 'other'
  ];

  const icons = ['🎮', '🎵', '🎬', '💻', '🎨', '📚', '⚽', '🌟', '📰', '🎭', '💬'];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
    };
    window.addEventListener('resize', handleResize);
    loadCommunities();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedCommunity) {
      loadMessages(selectedCommunity.id);
      loadMembers(selectedCommunity.id);
    }
  }, [selectedCommunity]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      
      const { data: allCommunities, error } = await supabase
        .from('communities')
        .select(`
          *,
          members:community_members(count),
          creator:creator_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCommunities(allCommunities || []);

      if (user) {
        const { data: myComs } = await supabase
          .from('community_members')
          .select(`
            community_id,
            communities (*)
          `)
          .eq('user_id', user.id);

        setMyCommunities(myComs?.map(m => m.communities) || []);
      }
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

 const loadMessages = async (communityId) => {
  try {
    // Get messages without complex joins
    const { data, error } = await supabase
      .from('community_messages')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      // Get user profiles separately
      const userIds = [...new Set(data.map(m => m.user_id))];
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      // Combine messages with profiles
      const messagesWithProfiles = await Promise.all(data.map(async (msg) => {
        const profile = profilesData?.find(p => p.id === msg.user_id);
        
        let avatarUrl = null;
        if (profile?.avatar_url) {
          const { data: avatarData } = supabase.storage
            .from('avatars')
            .getPublicUrl(profile.avatar_url);
          avatarUrl = avatarData.publicUrl;
        }

        return {
          ...msg,
          user: profile,
          avatarUrl
        };
      }));

      setMessages(messagesWithProfiles);
    } else {
      setMessages([]);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
};

  const loadMembers = async (communityId) => {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          *,
          user:user_id (
            username,
            avatar_url
          )
        `)
        .eq('community_id', communityId);

      if (error) throw error;

      const membersWithAvatars = await Promise.all(data?.map(async (member) => {
        let avatarUrl = null;
        if (member.user?.avatar_url) {
          const { data: avatarData } = supabase.storage
            .from('avatars')
            .getPublicUrl(member.user.avatar_url);
          avatarUrl = avatarData.publicUrl;
        }
        return {
          ...member,
          avatarUrl
        };
      }) || []);

      setCommunityMembers(membersWithAvatars);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const createCommunity = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!formData.name.trim()) {
      alert('Please enter a community name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('communities')
        .insert([{
          name: formData.name,
          description: formData.description,
          category: formData.category,
          icon: formData.icon,
          is_private: formData.isPrivate,
          creator_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Add creator as member
      await supabase
        .from('community_members')
        .insert([{
          community_id: data.id,
          user_id: user.id,
          role: 'admin'
        }]);

      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'gaming',
        isPrivate: false,
        icon: '🎮'
      });
      
      loadCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community');
    }
  };

  const joinCommunity = async (communityId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_members')
        .insert([{
          community_id: communityId,
          user_id: user.id,
          role: 'member'
        }]);

      if (error) throw error;

      setShowJoinModal(false);
      loadCommunities();
      
      const community = communities.find(c => c.id === communityId);
      setSelectedCommunity(community);
      setActiveTab('my');
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join community');
    }
  };

  const leaveCommunity = async (communityId) => {
    if (!user) return;

    if (window.confirm('Leave this community?')) {
      try {
        await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', user.id);

        if (selectedCommunity?.id === communityId) {
          setSelectedCommunity(null);
        }
        
        loadCommunities();
      } catch (error) {
        console.error('Error leaving community:', error);
      }
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedCommunity || !newMessage.trim()) return;

    try {
      const { data, error } = await supabase
        .from('community_messages')
        .insert([{
          community_id: selectedCommunity.id,
          user_id: user.id,
          content: newMessage
        }])
        .select(`
          *,
          user:user_id (
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      let avatarUrl = null;
      if (data.user?.avatar_url) {
        const { data: avatarData } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.user.avatar_url);
        avatarUrl = avatarData.publicUrl;
      }

      setMessages([...messages, { ...data, avatarUrl }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
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
          border: '4px solid #ff3366',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      color: 'white',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      fontFamily: 'Roboto, sans-serif'
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .community-sidebar { width: 100% !important; height: auto !important; }
          .community-chat { height: calc(100vh - 200px) !important; }
          .mobile-tabs { display: flex !important; }
        }
      `}</style>

      {/* Mobile Tabs */}
      {isMobile && (
        <div className="mobile-tabs" style={{
          display: 'none',
          background: '#1a1a1a',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => setShowSidebar(true)}
            style={{
              flex: 1,
              padding: '15px',
              background: showSidebar ? '#ff3366' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Communities
          </button>
          <button
            onClick={() => setShowSidebar(false)}
            style={{
              flex: 1,
              padding: '15px',
              background: !showSidebar ? '#ff3366' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Chat
          </button>
        </div>
      )}

      {/* Sidebar - Communities List */}
      {(showSidebar || !isMobile) && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="community-sidebar"
          style={{
            width: isMobile ? '100%' : '350px',
            background: '#1a1a1a',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            height: isMobile ? 'auto' : '100vh',
            overflowY: 'auto',
            position: isMobile ? 'relative' : 'sticky',
            top: 0
          }}
        >
          {/* Header */}
          <div style={{
            padding: isMobile ? '15px' : '20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem' }}>Communities</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: isMobile ? '10px 15px' : '8px 16px',
                  background: '#ff3366',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.9rem' : '1rem'
                }}
              >
                + Create
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setActiveTab('discover')}
                style={{
                  padding: isMobile ? '8px 12px' : '8px 16px',
                  background: activeTab === 'discover' ? '#ff3366' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab('my')}
                style={{
                  padding: isMobile ? '8px 12px' : '8px 16px',
                  background: activeTab === 'my' ? '#ff3366' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: isMobile ? '0.8rem' : '0.9rem'
                }}
              >
                My Communities
              </button>
            </div>
          </div>

          {/* Communities List */}
          <div style={{ padding: isMobile ? '10px' : '20px' }}>
            {activeTab === 'discover' ? (
              communities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                  <p>No communities yet</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                    Be the first to create one!
                  </p>
                </div>
              ) : (
                communities.map(community => {
                  const isMember = myCommunities.some(c => c.id === community.id);
                  return (
                    <motion.div
                      key={community.id}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        padding: isMobile ? '12px' : '15px',
                        marginBottom: '10px',
                        background: selectedCommunity?.id === community.id 
                          ? 'rgba(255,51,102,0.1)' 
                          : 'rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: selectedCommunity?.id === community.id 
                          ? '1px solid #ff3366' 
                          : '1px solid rgba(255,255,255,0.05)'
                      }}
                      onClick={() => {
                        setSelectedCommunity(community);
                        if (isMobile) setShowSidebar(false);
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '10px'
                      }}>
                        <div style={{
                          width: isMobile ? '40px' : '48px',
                          height: isMobile ? '40px' : '48px',
                          background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isMobile ? '1.5rem' : '2rem'
                        }}>
                          {community.icon || '🎮'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            marginBottom: '3px' 
                          }}>
                            {community.name}
                          </h3>
                          <p style={{ 
                            color: '#888', 
                            fontSize: isMobile ? '0.7rem' : '0.8rem' 
                          }}>
                            {community.members?.count || 0} members
                          </p>
                        </div>
                      </div>

                      <p style={{
                        color: '#aaa',
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        marginBottom: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {community.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          background: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          fontSize: isMobile ? '0.6rem' : '0.7rem',
                          textTransform: 'capitalize'
                        }}>
                          {community.category}
                        </span>

                        {!isMember && user && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCommunity(community);
                              setShowJoinModal(true);
                            }}
                            style={{
                              padding: isMobile ? '6px 12px' : '5px 10px',
                              background: '#ff3366',
                              border: 'none',
                              borderRadius: '15px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: isMobile ? '0.7rem' : '0.8rem'
                            }}
                          >
                            Join
                          </button>
                        )}
                        {isMember && (
                          <span style={{
                            padding: isMobile ? '6px 12px' : '5px 10px',
                            background: 'rgba(76,175,80,0.2)',
                            border: '1px solid #4CAF50',
                            borderRadius: '15px',
                            color: '#4CAF50',
                            fontSize: isMobile ? '0.7rem' : '0.8rem'
                          }}>
                            Member
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )
            ) : (
              myCommunities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                  <p>You haven't joined any communities yet</p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    style={{
                      marginTop: '15px',
                      padding: isMobile ? '10px 20px' : '8px 16px',
                      background: '#ff3366',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Discover Communities
                  </button>
                </div>
              ) : (
                myCommunities.map(community => (
                  <motion.div
                    key={community.id}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      padding: isMobile ? '12px' : '15px',
                      marginBottom: '10px',
                      background: selectedCommunity?.id === community.id 
                        ? 'rgba(255,51,102,0.1)' 
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: selectedCommunity?.id === community.id 
                        ? '1px solid #ff3366' 
                        : '1px solid rgba(255,255,255,0.05)'
                    }}
                    onClick={() => {
                      setSelectedCommunity(community);
                      if (isMobile) setShowSidebar(false);
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: isMobile ? '40px' : '48px',
                        height: isMobile ? '40px' : '48px',
                        background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '1.5rem' : '2rem'
                      }}>
                        {community.icon || '🎮'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>
                          {community.name}
                        </h3>
                        <p style={{ color: '#888', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                          {community.members?.count || 0} members
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            )}
          </div>
        </motion.div>
      )}

      {/* Chat Area */}
      {(!showSidebar || !isMobile) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="community-chat"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: isMobile ? 'calc(100vh - 120px)' : '100vh',
            background: '#0f0f0f'
          }}
        >
          {selectedCommunity ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: isMobile ? '12px' : '20px',
                background: '#1a1a1a',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isMobile && (
                    <button
                      onClick={() => setShowSidebar(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.2rem',
                        cursor: 'pointer'
                      }}
                    >
                      ←
                    </button>
                  )}
                  <div>
                    <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
                      {selectedCommunity.name}
                    </h2>
                    <p style={{ color: '#888', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                      {communityMembers.length} members • {selectedCommunity.category}
                    </p>
                  </div>
                </div>

                {myCommunities.some(c => c.id === selectedCommunity.id) && (
                  <button
                    onClick={() => leaveCommunity(selectedCommunity.id)}
                    style={{
                      padding: isMobile ? '6px 12px' : '8px 16px',
                      background: '#ff3366',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}
                  >
                    Leave
                  </button>
                )}
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: isMobile ? '15px' : '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {messages.map((msg, index) => {
                  const isOwn = msg.user_id === user?.id;
                  const showAvatar = index === 0 || 
                    messages[index - 1]?.user_id !== msg.user_id;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: isOwn ? 'flex-end' : 'flex-start',
                        marginBottom: showAvatar ? '15px' : '5px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: isOwn ? 'row-reverse' : 'row',
                        alignItems: 'flex-end',
                        gap: '10px',
                        maxWidth: isMobile ? '85%' : '70%'
                      }}>
                        {!isOwn && showAvatar && (
                          <div style={{
                            width: isMobile ? '30px' : '36px',
                            height: isMobile ? '30px' : '36px',
                            borderRadius: '50%',
                            background: msg.avatarUrl 
                              ? `url(${msg.avatarUrl}) center/cover`
                              : 'linear-gradient(135deg, #ff3366, #4facfe)',
                            flexShrink: 0
                          }} />
                        )}
                        {!isOwn && !showAvatar && <div style={{ width: isMobile ? '30px' : '36px' }} />}

                        <div>
                          {!isOwn && showAvatar && (
                            <p style={{
                              fontSize: isMobile ? '0.7rem' : '0.8rem',
                              color: '#888',
                              marginBottom: '4px',
                              marginLeft: '5px'
                            }}>
                              {msg.user?.username}
                            </p>
                          )}
                          <div style={{
                            padding: isMobile ? '10px 12px' : '12px 16px',
                            background: isOwn ? '#ff3366' : 'rgba(255,255,255,0.1)',
                            borderRadius: isOwn
                              ? isMobile ? '18px 4px 18px 18px' : '20px 4px 20px 20px'
                              : isMobile ? '4px 18px 18px 18px' : '4px 20px 20px 20px',
                            color: 'white',
                            wordWrap: 'break-word'
                          }}>
                            <p style={{ 
                              fontSize: isMobile ? '0.9rem' : '1rem',
                              marginBottom: '4px' 
                            }}>
                              {msg.content}
                            </p>
                            <p style={{
                              fontSize: isMobile ? '0.6rem' : '0.7rem',
                              opacity: 0.7,
                              textAlign: 'right'
                            }}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{
                padding: isMobile ? '12px' : '20px',
                background: '#1a1a1a',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: isMobile ? '12px' : '15px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: isMobile ? '20px' : '25px',
                      color: 'white',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      padding: isMobile ? '12px 20px' : '15px 25px',
                      background: !newMessage.trim() ? '#555' : '#ff3366',
                      border: 'none',
                      borderRadius: isMobile ? '20px' : '25px',
                      color: 'white',
                      cursor: !newMessage.trim() ? 'not-allowed' : 'pointer',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      opacity: !newMessage.trim() ? 0.5 : 1
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: isMobile ? '3rem' : '4rem', marginBottom: '20px' }}>💬</div>
                <h2>Welcome to NexStream Communities</h2>
                <p style={{ marginTop: '10px' }}>
                  Select a community to start chatting
                </p>
                {!user && (
                  <Link to="/login">
                    <button style={{
                      marginTop: '20px',
                      padding: isMobile ? '12px 24px' : '10px 20px',
                      background: '#ff3366',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      cursor: 'pointer'
                    }}>
                      Login to Join Communities
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
              padding: '20px'
            }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              style={{
                background: '#1a1a2a',
                borderRadius: '20px',
                padding: isMobile ? '25px' : '40px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ 
                fontSize: isMobile ? '1.5rem' : '2rem',
                marginBottom: '20px' 
              }}>
                Create Community
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ color: '#888', marginBottom: '5px', display: 'block' }}>
                    Community Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Gaming Enthusiasts"
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px' : '15px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#888', marginBottom: '5px', display: 'block' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What's your community about?"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px' : '15px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#888', marginBottom: '5px', display: 'block' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px' : '15px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ color: '#888', marginBottom: '5px', display: 'block' }}>
                    Icon
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                    gap: '10px'
                  }}>
                    {icons.map(icon => (
                      <div
                        key={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        style={{
                          padding: '10px',
                          background: formData.icon === icon ? '#ff3366' : 'rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <label style={{ color: '#888' }}>Make this community private</label>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  marginTop: '20px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    onClick={createCommunity}
                    style={{
                      flex: 1,
                      padding: isMobile ? '12px' : '15px',
                      background: 'linear-gradient(135deg, #ff3366, #4facfe)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Create Community
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      flex: 1,
                      padding: isMobile ? '12px' : '15px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Community Modal */}
      <AnimatePresence>
        {showJoinModal && selectedCommunity && (
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
              padding: '20px'
            }}
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              style={{
                background: '#1a1a2a',
                borderRadius: '20px',
                padding: isMobile ? '25px' : '40px',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ 
                fontSize: '4rem', 
                marginBottom: '20px' 
              }}>
                {selectedCommunity.icon || '🎮'}
              </div>
              <h2 style={{ marginBottom: '10px' }}>{selectedCommunity.name}</h2>
              <p style={{ color: '#888', marginBottom: '20px' }}>
                {selectedCommunity.description}
              </p>
              <p style={{ color: '#aaa', marginBottom: '30px' }}>
                {selectedCommunity.members?.count || 0} members • {selectedCommunity.category}
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '10px',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <button
                  onClick={() => joinCommunity(selectedCommunity.id)}
                  style={{
                    flex: 1,
                    padding: isMobile ? '12px' : '15px',
                    background: '#ff3366',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Join Community
                </button>
                <button
                  onClick={() => setShowJoinModal(false)}
                  style={{
                    flex: 1,
                    padding: isMobile ? '12px' : '15px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
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
  );
};

export default Community;
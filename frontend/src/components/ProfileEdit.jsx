import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileEdit({ onClose, onUpdate }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    thoughts: '',
    location: '',
    website: '',
    avatar_url: '',
    banner_url: '',
    twitter: '',
    instagram: '',
    facebook: '',
    youtube: '',
    soundcloud: '',
    spotify: '',
    tiktok: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/profile/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      if (data) {
        setProfile(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large (max 10MB)');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('banner', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/banner', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': user.id
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProfile(prev => ({ ...prev, banner_url: data.url }));
      toast.success('Banner updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success('Profile updated successfully!');
      onUpdate?.(data);
      onClose?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  };

  return (
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: spacing.md,
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        style={{
          background: '#1a1a1a',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Banner Preview */}
        <div style={{
          height: '150px',
          background: profile.banner_url 
            ? `url(${profile.banner_url}) center/cover no-repeat`
            : 'linear-gradient(135deg, #FF3366, #4FACFE)',
          position: 'relative'
        }}>
          <label style={{
            position: 'absolute',
            bottom: spacing.sm,
            right: spacing.sm,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: `${spacing.xs} ${spacing.md}`,
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            backdropFilter: 'blur(5px)'
          }}>
            📷 Change Banner
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              hidden
            />
          </label>
        </div>

        {/* Avatar Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-50px',
          marginBottom: spacing.md
        }}>
          <div style={{
            position: 'relative',
            width: '100px',
            height: '100px'
          }}>
            <img
              src={profile.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #1a1a1a'
              }}
            />
            <label style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#FF3366',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid white'
            }}>
              📸
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                hidden
              />
            </label>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: spacing.md,
            right: spacing.md,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          ✕
        </button>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: spacing.xs,
          padding: `0 ${spacing.lg}`,
          borderBottom: '1px solid #333',
          overflowX: 'auto'
        }}>
          {[
            { id: 'basic', label: 'Basic Info', icon: '👤' },
            { id: 'thoughts', label: 'Thoughts', icon: '💭' },
            { id: 'social', label: 'Social Links', icon: '🔗' },
            { id: 'sounds', label: 'Music/Sounds', icon: '🎵' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? '#FF3366' : '#888',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #FF3366' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          padding: spacing.lg,
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 300px)'
        }}>
          <AnimatePresence mode="wait">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: 'white'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: 'white'
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows="3"
                    placeholder="Tell us about yourself..."
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: 'white',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    placeholder="City, Country"
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: 'white'
                    }}
                  />
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    placeholder="https://yourwebsite.com"
                    style={{
                      width: '100%',
                      padding: spacing.sm,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '6px',
                      color: 'white'
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Thoughts Tab */}
            {activeTab === 'thoughts' && (
              <motion.div
                key="thoughts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{
                  background: '#2a2a2a',
                  borderRadius: '12px',
                  padding: spacing.lg,
                  marginBottom: spacing.lg
                }}>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.md }}>
                    💭 What's on your mind?
                  </label>
                  <textarea
                    value={profile.thoughts}
                    onChange={(e) => setProfile({...profile, thoughts: e.target.value})}
                    rows="4"
                    placeholder="Share your current thoughts, mood, or status..."
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#1a1a1a',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1.1rem',
                      resize: 'vertical'
                    }}
                  />
                  <p style={{ color: '#888', fontSize: '0.9rem', marginTop: spacing.xs }}>
                    This will appear as a speech bubble on your profile
                  </p>
                </div>
              </motion.div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'grid', gap: spacing.md }}>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                      🐦 Twitter
                    </label>
                    <input
                      type="text"
                      value={profile.twitter}
                      onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                      placeholder="@username"
                      style={{
                        width: '100%',
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                      📷 Instagram
                    </label>
                    <input
                      type="text"
                      value={profile.instagram}
                      onChange={(e) => setProfile({...profile, instagram: e.target.value})}
                      placeholder="@username"
                      style={{
                        width: '100%',
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                      👤 Facebook
                    </label>
                    <input
                      type="text"
                      value={profile.facebook}
                      onChange={(e) => setProfile({...profile, facebook: e.target.value})}
                      placeholder="username"
                      style={{
                        width: '100%',
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                      ▶️ YouTube
                    </label>
                    <input
                      type="text"
                      value={profile.youtube}
                      onChange={(e) => setProfile({...profile, youtube: e.target.value})}
                      placeholder="@channel"
                      style={{
                        width: '100%',
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                      ⏰ TikTok
                    </label>
                    <input
                      type="text"
                      value={profile.tiktok}
                      onChange={(e) => setProfile({...profile, tiktok: e.target.value})}
                      placeholder="@username"
                      style={{
                        width: '100%',
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sounds/Music Tab */}
            {activeTab === 'sounds' && (
              <motion.div
                key="sounds"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'grid', gap: spacing.md }}>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                      🎵 SoundCloud
                    </label>
                    <input
                      type="text"
                      value={profile.soundcloud}
                      onChange={(e) => setProfile({...profile, soundcloud: e.target.value})}
                      placeholder="username"
                      style={{
                        width: '100%',
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: spacing.xs }}>
                      🟢 Spotify
                    </label>
                    <input
                      type="text"
                      value={profile.spotify}
                      onChange={(e) => setProfile({...profile, spotify: e.target.value})}
                      placeholder="artist/playlist ID"
                      style={{
                        width: '100%',
                        padding: spacing.sm,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div style={{
                    background: '#2a2a2a',
                    borderRadius: '8px',
                    padding: spacing.md,
                    marginTop: spacing.md
                  }}>
                    <p style={{ color: '#888', margin: 0 }}>
                      🎧 Future: Upload your own sounds and music tracks
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            gap: spacing.md,
            justifyContent: 'flex-end',
            marginTop: spacing.xl,
            paddingTop: spacing.md,
            borderTop: '1px solid #333'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: '#2a2a2a',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: '#FF3366',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
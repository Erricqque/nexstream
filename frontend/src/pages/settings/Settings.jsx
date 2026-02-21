import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form States
  const [profileForm, setProfileForm] = useState({
    username: '',
    full_name: '',
    bio: '',
    website: '',
    location: '',
    phone: ''
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailComments: true,
    emailSubscriptions: true,
    emailMessages: true,
    emailMarketing: false,
    pushComments: true,
    pushSubscriptions: true,
    pushMessages: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showSubscribers: true,
    showEarnings: false,
    allowMessages: true
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    checkUser();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      await loadProfile(user.id);
      await loadPaymentMethods(user.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setProfileForm({
      username: data?.username || '',
      full_name: data?.full_name || '',
      bio: data?.bio || '',
      website: data?.website || '',
      location: data?.location || '',
      phone: data?.phone || ''
    });
  };

  const loadPaymentMethods = async (userId) => {
    setPaymentMethods([
      { id: 1, type: 'paypal', email: 'user@example.com', default: true },
      { id: 2, type: 'bank', account: '****1234', default: false }
    ]);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    setUploadingAvatar(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: fileName })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccessMessage('Profile picture updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrorMessage('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      if (avatarFile) {
        await uploadAvatar();
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileForm.username,
          full_name: profileForm.full_name,
          bio: profileForm.bio,
          website: profileForm.website,
          location: profileForm.location,
          phone: profileForm.phone,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: securityForm.newPassword
      });

      if (error) throw error;

      setSuccessMessage('Password changed successfully');
      setSecurityForm({
        ...securityForm,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'account', label: 'Account', icon: '⚙️' }
  ];

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
          width: isMobile ? '40px' : '50px',
          height: isMobile ? '40px' : '50px',
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
      fontFamily: 'Inter, sans-serif',
      padding: `${spacing.xl} ${isMobile ? spacing.md : spacing.xl}`
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={containerStyle}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xl }}
        >
          <h1 style={{
            fontSize: isMobile ? fontSize.xl : fontSize.xxl,
            marginBottom: spacing.xs
          }}>
            Settings
          </h1>
          <p style={{ color: '#888' }}>
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Mobile Tab Selector */}
        {isMobile && (
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{
              width: '100%',
              padding: spacing.md,
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '10px',
              color: 'white',
              fontSize: fontSize.md,
              marginBottom: spacing.lg
            }}
          >
            {tabs.map(tab => (
              <option key={tab.id} value={tab.id}>
                {tab.icon} {tab.label}
              </option>
            ))}
          </select>
        )}

        {/* Desktop Tabs */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            gap: spacing.sm,
            borderBottom: '1px solid #333',
            marginBottom: spacing.xl,
            overflowX: 'auto'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  background: activeTab === tab.id ? '#FF3366' : 'transparent',
                  border: 'none',
                  borderRadius: '10px 10px 0 0',
                  color: activeTab === tab.id ? 'white' : '#888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  fontSize: fontSize.md
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(67,233,123,0.1)',
                border: '1px solid #43E97B',
                borderRadius: '10px',
                padding: spacing.md,
                marginBottom: spacing.lg,
                color: '#43E97B',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
            >
              <span>✅</span>
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(255,51,102,0.1)',
                border: '1px solid #FF3366',
                borderRadius: '10px',
                padding: spacing.md,
                marginBottom: spacing.lg,
                color: '#FF3366',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm
              }}
            >
              <span>⚠️</span>
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: isMobile ? spacing.lg : spacing.xl
            }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                Profile Information
              </h2>

              {/* Avatar Upload */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                gap: spacing.xl,
                marginBottom: spacing.xl
              }}>
                <div style={{
                  width: isMobile ? '100px' : '120px',
                  height: isMobile ? '100px' : '120px',
                  borderRadius: '50%',
                  background: avatarPreview 
                    ? `url(${avatarPreview}) center/cover`
                    : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  border: '4px solid #333',
                  position: 'relative'
                }}>
                  {uploadingAvatar && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        border: '3px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    style={{
                      display: 'inline-block',
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '30px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: fontSize.sm,
                      marginBottom: spacing.sm
                    }}
                  >
                    Choose New Photo
                  </label>
                  <p style={{ color: '#888', fontSize: fontSize.xs }}>
                    Recommended: Square JPG or PNG, at least 500x500px
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: spacing.lg
              }}>
                <div>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  />
                </div>

                <div style={{ gridColumn: isMobile ? '1' : '1/-1' }}>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Bio
                  </label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: fontSize.md,
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    placeholder="https://example.com"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="City, Country"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    style={{
                      width: '100%',
                      padding: spacing.md,
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: fontSize.md
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: spacing.xl
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveProfile}
                  disabled={saving}
                  style={{
                    padding: `${spacing.md} ${spacing.xl}`,
                    background: saving ? '#555' : '#FF3366',
                    border: 'none',
                    borderRadius: '30px',
                    color: 'white',
                    fontSize: fontSize.md,
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: isMobile ? spacing.lg : spacing.xl
            }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                Security Settings
              </h2>

              <div style={{ marginBottom: spacing.xl }}>
                <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                  Change Password
                </h3>

                <div style={{
                  display: 'grid',
                  gap: spacing.lg,
                  maxWidth: '500px'
                }}>
                  <div>
                    <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: fontSize.md
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        background: '#2a2a2a',
                        border: '1px solid #333',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: fontSize.md
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#888', display: 'block', marginBottom: spacing.xs }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        background: '#2a2a2a',
                        border: securityForm.confirmPassword && securityForm.newPassword !== securityForm.confirmPassword
                          ? '1px solid #FF3366'
                          : '1px solid #333',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: fontSize.md
                      }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={changePassword}
                    disabled={saving}
                    style={{
                      padding: `${spacing.md} ${spacing.xl}`,
                      background: saving ? '#555' : '#FF3366',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: fontSize.md,
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </motion.button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                  Two-Factor Authentication
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: spacing.lg,
                  background: '#2a2a2a',
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                  gap: spacing.md
                }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>
                      {securityForm.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
                    </p>
                    <p style={{ color: '#888', fontSize: fontSize.xs }}>
                      {securityForm.twoFactorEnabled 
                        ? 'Your account is protected with two-factor authentication'
                        : 'Add an extra layer of security to your account'}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSecurityForm({
                      ...securityForm,
                      twoFactorEnabled: !securityForm.twoFactorEnabled
                    })}
                    style={{
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: securityForm.twoFactorEnabled ? '#43E97B' : '#FF3366',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: fontSize.sm,
                      cursor: 'pointer'
                    }}
                  >
                    {securityForm.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: isMobile ? spacing.lg : spacing.xl
            }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                Notification Preferences
              </h2>

              <div style={{ marginBottom: spacing.xl }}>
                <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                  Email Notifications
                </h3>

                {[
                  { id: 'emailComments', label: 'Comments on your content' },
                  { id: 'emailSubscriptions', label: 'New subscribers' },
                  { id: 'emailMessages', label: 'Direct messages' },
                  { id: 'emailMarketing', label: 'Marketing and updates' }
                ].map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: `${spacing.md} 0`,
                      borderBottom: '1px solid #333',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.id]}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [item.id]: e.target.checked
                      })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ color: '#fff' }}>{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: fontSize.md, marginBottom: spacing.md }}>
                  Push Notifications
                </h3>

                {[
                  { id: 'pushComments', label: 'Comments' },
                  { id: 'pushSubscriptions', label: 'Subscriptions' },
                  { id: 'pushMessages', label: 'Messages' }
                ].map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      padding: `${spacing.md} 0`,
                      borderBottom: '1px solid #333',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.id]}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [item.id]: e.target.checked
                      })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ color: '#fff' }}>{item.label}</span>
                  </label>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: spacing.xl
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: `${spacing.md} ${spacing.xl}`,
                    background: '#FF3366',
                    border: 'none',
                    borderRadius: '30px',
                    color: 'white',
                    fontSize: fontSize.md,
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Save Preferences
                </motion.button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: isMobile ? spacing.lg : spacing.xl
            }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                Privacy Settings
              </h2>

              {[
                { id: 'profilePublic', label: 'Public profile', desc: 'Allow anyone to view your profile' },
                { id: 'showSubscribers', label: 'Show subscriber count', desc: 'Display your subscriber count publicly' },
                { id: 'showEarnings', label: 'Show earnings', desc: 'Display your earnings on your profile' },
                { id: 'allowMessages', label: 'Allow direct messages', desc: 'Let other users send you messages' }
              ].map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: `${spacing.md} 0`,
                    borderBottom: '1px solid #333',
                    flexWrap: 'wrap',
                    gap: spacing.md
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>
                      {item.label}
                    </p>
                    <p style={{ color: '#888', fontSize: fontSize.xs }}>
                      {item.desc}
                    </p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                    <input
                      type="checkbox"
                      checked={privacySettings[item.id]}
                      onChange={(e) => setPrivacySettings({
                        ...privacySettings,
                        [item.id]: e.target.checked
                      })}
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0,
                        position: 'absolute'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: privacySettings[item.id] ? '#FF3366' : '#333',
                      borderRadius: '24px',
                      transition: '0.3s',
                      '::before': {
                        position: 'absolute',
                        content: '""',
                        height: '20px',
                        width: '20px',
                        left: privacySettings[item.id] ? '26px' : '4px',
                        bottom: '2px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.3s'
                      }
                    }} />
                  </label>
                </div>
              ))}

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: spacing.xl
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: `${spacing.md} ${spacing.xl}`,
                    background: '#FF3366',
                    border: 'none',
                    borderRadius: '30px',
                    color: 'white',
                    fontSize: fontSize.md,
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Save Privacy Settings
                </motion.button>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === 'payments' && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: isMobile ? spacing.lg : spacing.xl
            }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                Payment Methods
              </h2>

              <div style={{ marginBottom: spacing.xl }}>
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: spacing.lg,
                      background: '#2a2a2a',
                      borderRadius: '10px',
                      marginBottom: spacing.md,
                      flexWrap: 'wrap',
                      gap: spacing.md
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {method.type === 'paypal' ? '📧' : '🏦'}
                      </span>
                      <div>
                        <p style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                          {method.type}
                        </p>
                        <p style={{ color: '#888', fontSize: fontSize.xs }}>
                          {method.email || method.account}
                        </p>
                      </div>
                    </div>
                    {method.default && (
                      <span style={{
                        padding: `${spacing.xs} ${spacing.md}`,
                        background: '#43E97B',
                        borderRadius: '20px',
                        fontSize: fontSize.xs,
                        color: 'white'
                      }}>
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: spacing.lg,
                  background: 'transparent',
                  border: '2px dashed #333',
                  borderRadius: '10px',
                  color: '#888',
                  fontSize: fontSize.md,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.md
                }}
              >
                <span>➕</span>
                Add Payment Method
              </motion.button>

              <div style={{
                marginTop: spacing.xl,
                padding: spacing.lg,
                background: 'rgba(79,172,254,0.1)',
                borderRadius: '10px'
              }}>
                <p style={{ color: '#4FACFE', fontWeight: 'bold', marginBottom: spacing.xs }}>
                  Secure Payments
                </p>
                <p style={{ color: '#888', fontSize: fontSize.xs }}>
                  All payment information is encrypted and securely processed. We support PayPal, Flutterwave, and bank transfers.
                </p>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '15px',
              padding: isMobile ? spacing.lg : spacing.xl
            }}>
              <h2 style={{ fontSize: fontSize.lg, marginBottom: spacing.lg }}>
                Account Settings
              </h2>

              <div style={{
                padding: spacing.lg,
                background: '#2a2a2a',
                borderRadius: '10px',
                marginBottom: spacing.lg
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: spacing.md
                }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>Email Address</p>
                    <p style={{ color: '#888' }}>{user?.email}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: '#4FACFE',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: fontSize.sm,
                      cursor: 'pointer'
                    }}
                  >
                    Change Email
                  </motion.button>
                </div>
              </div>

              <div style={{
                padding: spacing.lg,
                background: '#2a2a2a',
                borderRadius: '10px',
                marginBottom: spacing.xl
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: spacing.sm }}>Account Type</p>
                <p style={{ color: '#888', marginBottom: spacing.md }}>Free Creator Account</p>
                
                <div style={{
                  background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  padding: spacing.lg,
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: fontSize.lg, fontWeight: 'bold', marginBottom: spacing.xs }}>
                    Upgrade to Pro
                  </p>
                  <p style={{ marginBottom: spacing.md, opacity: 0.9 }}>
                    Get 90% revenue share, custom domains, and priority support
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: `${spacing.sm} ${spacing.xl}`,
                      background: 'white',
                      border: 'none',
                      borderRadius: '30px',
                      color: '#FF3366',
                      fontSize: fontSize.md,
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    View Plans →
                  </motion.button>
                </div>
              </div>

              {/* Danger Zone */}
              <div style={{
                border: '1px solid rgba(255,51,102,0.3)',
                borderRadius: '10px',
                padding: spacing.lg
              }}>
                <h3 style={{ color: '#FF3366', marginBottom: spacing.md }}>Danger Zone</h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: spacing.md
                }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>Deactivate Account</p>
                    <p style={{ color: '#888', fontSize: fontSize.xs }}>
                      This will hide your profile and content. You can reactivate anytime.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: 'transparent',
                      border: '1px solid #FF3366',
                      borderRadius: '20px',
                      color: '#FF3366',
                      fontSize: fontSize.sm,
                      cursor: 'pointer'
                    }}
                  >
                    Deactivate
                  </motion.button>
                </div>

                <div style={{
                  marginTop: spacing.lg,
                  paddingTop: spacing.lg,
                  borderTop: '1px solid #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: spacing.md
                }}>
                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: spacing.xs, color: '#FF3366' }}>
                      Delete Account Permanently
                    </p>
                    <p style={{ color: '#888', fontSize: fontSize.xs }}>
                      This action cannot be undone. All your data will be permanently removed.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: `${spacing.sm} ${spacing.lg}`,
                      background: '#FF3366',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: fontSize.sm,
                      cursor: 'pointer'
                    }}
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const containerStyle = {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto'
};

export default Settings;
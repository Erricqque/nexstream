import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CameraIcon, UserCircleIcon, BellIcon, ShieldCheckIcon, CurrencyDollarIcon, KeyIcon } from '@heroicons/react/24/outline';

const ChannelSettings = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile, isVerified } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    displayName: '',
    username: '',
    description: '',
    location: '',
    website: '',
    email: '',
    avatar: null,
    banner: null
  });

  // Channel settings
  const [channelData, setChannelData] = useState({
    channelName: '',
    channelDescription: '',
    channelKeywords: '',
    channelCountry: '',
    channelLanguage: 'en',
    autoTranslate: false,
    matureContent: false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    commentNotifications: true,
    subscriberNotifications: true,
    mentionNotifications: true,
    weeklyDigest: false
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showSubscribers: true,
    showViewCount: true,
    allowComments: true,
    allowRatings: true,
    saveHistory: true,
    personalizedAds: false
  });

  // Monetization settings (for verified creators)
  const [monetizationSettings, setMonetizationSettings] = useState({
    adsEnabled: isVerified,
    channelMemberships: isVerified,
    superChat: isVerified,
    merchandise: isVerified,
    paymentMethod: '',
    taxInfo: '',
    payoutThreshold: 50
  });

  useEffect(() => {
    // Load user data
    if (userProfile) {
      setProfileData({
        displayName: userProfile.full_name || '',
        username: userProfile.username || '',
        description: userProfile.description || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        email: user?.email || '',
        avatar: null,
        banner: null
      });

      setChannelData({
        channelName: userProfile.channel_name || userProfile.full_name || '',
        channelDescription: userProfile.channel_description || '',
        channelKeywords: userProfile.channel_keywords || '',
        channelCountry: userProfile.country || '',
        channelLanguage: userProfile.language || 'en',
        autoTranslate: userProfile.auto_translate || false,
        matureContent: userProfile.mature_content || false
      });
    }
  }, [userProfile, user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleChannelChange = (e) => {
    setChannelData({
      ...channelData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handlePrivacyChange = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
  };

  const handleMonetizationChange = (e) => {
    setMonetizationSettings({
      ...monetizationSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        avatar: URL.createObjectURL(file)
      });
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        banner: URL.createObjectURL(file)
      });
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateProfile({
        full_name: profileData.displayName,
        username: profileData.username,
        description: profileData.description,
        location: profileData.location,
        website: profileData.website,
        channel_name: channelData.channelName,
        channel_description: channelData.channelDescription,
        channel_keywords: channelData.channelKeywords,
        country: channelData.channelCountry,
        language: channelData.channelLanguage
      });
      
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <UserCircleIcon className="w-5 h-5" /> },
    { id: 'channel', name: 'Channel', icon: <CameraIcon className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
    { id: 'privacy', name: 'Privacy', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'monetization', name: 'Monetization', icon: <CurrencyDollarIcon className="w-5 h-5" /> }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      color: 'white',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Channel Settings</h1>
          <p style={{ color: '#888' }}>Manage your channel, profile, and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div style={{
            background: 'rgba(76,175,80,0.1)',
            border: '1px solid #4CAF50',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#4CAF50'
          }}>
            ✅ {success}
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(255,68,68,0.1)',
            border: '1px solid #ff4444',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#ff4444'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '30px' }}>
          
          {/* Sidebar Tabs */}
          <div style={{
            width: '250px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '20px',
            border: '1px solid #333',
            height: 'fit-content'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  background: activeTab === tab.id ? 'rgba(0,180,216,0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  color: activeTab === tab.id ? '#00b4d8' : '#888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '5px',
                  fontSize: '1rem'
                }}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: '30px',
            border: '1px solid #333'
          }}>
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ marginBottom: '20px', color: '#00b4d8' }}>Profile Settings</h2>
                
                {/* Avatar & Banner */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{
                    height: '150px',
                    background: profileData.banner ? `url(${profileData.banner})` : '#1a1a2e',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '10px',
                    position: 'relative',
                    marginBottom: '20px'
                  }}>
                    <button
                      onClick={() => document.getElementById('banner-upload').click()}
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        padding: '8px 15px',
                        background: 'rgba(0,0,0,0.7)',
                        border: '1px solid #00b4d8',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Change Banner
                    </button>
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={profileData.avatar || `https://ui-avatars.com/api/?name=${profileData.displayName || 'User'}&background=0ea5e9&color=fff&size=128`}
                        alt="Avatar"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          border: '3px solid #00b4d8'
                        }}
                      />
                      <button
                        onClick={() => document.getElementById('avatar-upload').click()}
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '30px',
                          height: '30px',
                          background: '#00b4d8',
                          border: 'none',
                          borderRadius: '50%',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        📷
                      </button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#888', marginBottom: '5px' }}>Channel avatar</p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>Recommended: 800x800px, JPG or PNG</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Display Name</label>
                    <input
                      type="text"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleProfileChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Username</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '#666', marginRight: '5px' }}>@</span>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Bio</label>
                    <textarea
                      name="description"
                      value={profileData.description}
                      onChange={handleProfileChange}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white',
                        resize: 'vertical'
                      }}
                      placeholder="Tell viewers about your channel..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Website</label>
                      <input
                        type="url"
                        name="website"
                        value={profileData.website}
                        onChange={handleProfileChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Email (private)</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.1)',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#666',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Channel Tab */}
            {activeTab === 'channel' && (
              <div>
                <h2 style={{ marginBottom: '20px', color: '#00b4d8' }}>Channel Settings</h2>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Channel Name</label>
                    <input
                      type="text"
                      name="channelName"
                      value={channelData.channelName}
                      onChange={handleChannelChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Channel Description</label>
                    <textarea
                      name="channelDescription"
                      value={channelData.channelDescription}
                      onChange={handleChannelChange}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      placeholder="Describe what your channel is about..."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Channel Keywords (comma separated)</label>
                    <input
                      type="text"
                      name="channelKeywords"
                      value={channelData.channelKeywords}
                      onChange={handleChannelChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      placeholder="gaming, tutorials, entertainment"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Country</label>
                      <select
                        name="channelCountry"
                        value={channelData.channelCountry}
                        onChange={handleChannelChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      >
                        <option value="">Select country</option>
                        <option value="TZ">Tanzania</option>
                        <option value="KE">Kenya</option>
                        <option value="UG">Uganda</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Language</label>
                      <select
                        name="channelLanguage"
                        value={channelData.channelLanguage}
                        onChange={handleChannelChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      >
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                        <option value="fr">French</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="autoTranslate"
                      checked={channelData.autoTranslate}
                      onChange={() => setChannelData({...channelData, autoTranslate: !channelData.autoTranslate})}
                    />
                    <label htmlFor="autoTranslate">Auto-translate comments to my language</label>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="matureContent"
                      checked={channelData.matureContent}
                      onChange={() => setChannelData({...channelData, matureContent: !channelData.matureContent})}
                    />
                    <label htmlFor="matureContent">This channel contains mature content (18+)</label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ marginBottom: '20px', color: '#00b4d8' }}>Notification Settings</h2>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  {[
                    { id: 'emailNotifications', label: 'Email notifications' },
                    { id: 'pushNotifications', label: 'Push notifications' },
                    { id: 'commentNotifications', label: 'Comments on my videos' },
                    { id: 'subscriberNotifications', label: 'New subscribers' },
                    { id: 'mentionNotifications', label: 'Mentions' },
                    { id: 'weeklyDigest', label: 'Weekly digest email' }
                  ].map(setting => (
                    <div key={setting.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        id={setting.id}
                        checked={notificationSettings[setting.id]}
                        onChange={() => handleNotificationChange(setting.id)}
                      />
                      <label htmlFor={setting.id}>{setting.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ marginBottom: '20px', color: '#00b4d8' }}>Privacy Settings</h2>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  {[
                    { id: 'showSubscribers', label: 'Show subscriber count' },
                    { id: 'showViewCount', label: 'Show view count' },
                    { id: 'allowComments', label: 'Allow comments on my videos' },
                    { id: 'allowRatings', label: 'Allow ratings/likes' },
                    { id: 'saveHistory', label: 'Save watch history' },
                    { id: 'personalizedAds', label: 'Personalized ads' }
                  ].map(setting => (
                    <div key={setting.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        id={setting.id}
                        checked={privacySettings[setting.id]}
                        onChange={() => handlePrivacyChange(setting.id)}
                      />
                      <label htmlFor={setting.id}>{setting.label}</label>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#888' }}>Data & Privacy</h3>
                  <button style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid #ff4444',
                    borderRadius: '5px',
                    color: '#ff4444',
                    cursor: 'pointer'
                  }}>
                    Download my data
                  </button>
                  <button style={{
                    marginLeft: '10px',
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid #ff4444',
                    borderRadius: '5px',
                    color: '#ff4444',
                    cursor: 'pointer'
                  }}>
                    Delete my account
                  </button>
                </div>
              </div>
            )}

            {/* Monetization Tab */}
            {activeTab === 'monetization' && (
              <div>
                <h2 style={{ marginBottom: '20px', color: '#00b4d8' }}>Monetization</h2>
                
                {!isVerified ? (
                  <div style={{
                    background: 'rgba(255,215,0,0.1)',
                    border: '1px solid #FFD700',
                    borderRadius: '10px',
                    padding: '30px',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ marginBottom: '10px' }}>Get Verified to Monetize</h3>
                    <p style={{ color: '#888', marginBottom: '20px' }}>
                      Verified creators can earn from ads, memberships, and merchandise.
                    </p>
                    <button
                      onClick={() => navigate('/verification-payment')}
                      style={{
                        padding: '12px 30px',
                        background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Get Verified Now
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div style={{
                      background: 'rgba(76,175,80,0.1)',
                      border: '1px solid #4CAF50',
                      borderRadius: '10px',
                      padding: '20px'
                    }}>
                      <h3 style={{ color: '#4CAF50', marginBottom: '10px' }}>✅ You are verified!</h3>
                      <p>You can now monetize your content through various channels.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                      {[
                        { label: 'Ads', enabled: monetizationSettings.adsEnabled },
                        { label: 'Channel Memberships', enabled: monetizationSettings.channelMemberships },
                        { label: 'Super Chat', enabled: monetizationSettings.superChat },
                        { label: 'Merchandise', enabled: monetizationSettings.merchandise }
                      ].map(item => (
                        <div key={item.label} style={{
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '10px',
                          padding: '15px',
                          border: '1px solid #333'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{item.label}</span>
                            <span style={{
                              color: item.enabled ? '#4CAF50' : '#888',
                              fontWeight: 'bold'
                            }}>
                              {item.enabled ? 'Enabled ✓' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <h3 style={{ marginBottom: '15px', color: '#888' }}>Payout Settings</h3>
                      
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Payment Method</label>
                        <select
                          name="paymentMethod"
                          value={monetizationSettings.paymentMethod}
                          onChange={handleMonetizationChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        >
                          <option value="">Select payment method</option>
                          <option value="mpesa">M-Pesa</option>
                          <option value="bank">Bank Transfer</option>
                          <option value="paypal">PayPal</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Payout Threshold ($)</label>
                        <input
                          type="number"
                          name="payoutThreshold"
                          value={monetizationSettings.payoutThreshold}
                          onChange={handleMonetizationChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
              <button
                onClick={saveProfile}
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                onClick={() => navigate(`/channel/${profileData.username || 'channel'}`)}
                style={{
                  padding: '12px 30px',
                  background: 'transparent',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                View Channel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSettings;
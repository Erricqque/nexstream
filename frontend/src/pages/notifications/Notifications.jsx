import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    if (user) {
      loadNotifications();
    } else {
      navigate('/login');
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loadNotifications = async () => {
    try {
      // Mock notifications - replace with real data from your notifications table
      setNotifications([
        {
          id: 1,
          type: 'like',
          message: 'John Doe liked your video "My Latest Vlog"',
          time: '2 minutes ago',
          read: false,
          avatar: null,
          link: '/content/123'
        },
        {
          id: 2,
          type: 'comment',
          message: 'Jane Smith commented: "Great content!"',
          time: '1 hour ago',
          read: false,
          avatar: null,
          link: '/content/123'
        },
        {
          id: 3,
          type: 'subscribe',
          message: 'Mike Johnson subscribed to your channel',
          time: '3 hours ago',
          read: true,
          avatar: null,
          link: '/profile/mike'
        },
        {
          id: 4,
          type: 'earning',
          message: 'You earned $25.50 from video views',
          time: '1 day ago',
          read: true,
          avatar: null,
          link: '/earnings'
        },
        {
          id: 5,
          type: 'mention',
          message: 'Sarah Wilson mentioned you in a comment',
          time: '2 days ago',
          read: true,
          avatar: null,
          link: '/content/456'
        }
      ]);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const clearAll = async () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'subscribe': return '🔔';
      case 'earning': return '💰';
      case 'mention': return '@';
      default: return '📌';
    }
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

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <p>Please log in to view notifications</p>
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
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
          flexWrap: 'wrap',
          gap: spacing.md
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? fontSize.xl : fontSize.xxl,
              marginBottom: spacing.xs
            }}>
              Notifications
            </h1>
            <p style={{ color: '#888' }}>
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: spacing.sm }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: 'transparent',
                  border: '1px solid #FF3366',
                  borderRadius: '20px',
                  color: '#FF3366',
                  cursor: 'pointer',
                  fontSize: fontSize.sm
                }}
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: 'transparent',
                  border: '1px solid #666',
                  borderRadius: '20px',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: fontSize.sm
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: spacing.sm,
          marginBottom: spacing.xl,
          borderBottom: '1px solid #333',
          paddingBottom: spacing.md
        }}>
          {['all', 'unread', 'read'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                background: filter === f ? '#FF3366' : 'transparent',
                border: 'none',
                borderRadius: '20px',
                color: filter === f ? 'white' : '#888',
                cursor: 'pointer',
                fontSize: fontSize.sm,
                textTransform: 'capitalize'
              }}
            >
              {f} {f === 'unread' && `(${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xl }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #FF3366',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: spacing.xl,
            background: '#1a1a1a',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>🔔</div>
            <h3 style={{ marginBottom: spacing.sm }}>No notifications</h3>
            <p style={{ color: '#888' }}>
              {filter === 'unread' ? 'You have no unread notifications' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.lg,
                  background: notification.read ? '#1a1a1a' : '#2a2a2a',
                  borderRadius: '10px',
                  marginBottom: spacing.sm,
                  cursor: 'pointer',
                  position: 'relative',
                  border: !notification.read ? '1px solid #FF3366' : 'none'
                }}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.link) navigate(notification.link);
                }}
              >
                {/* Unread Indicator */}
                {!notification.read && (
                  <div style={{
                    position: 'absolute',
                    left: '-2px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '70%',
                    background: '#FF3366',
                    borderRadius: '2px'
                  }} />
                )}

                {/* Icon/Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: notification.avatar 
                    ? `url(${notification.avatar}) center/cover`
                    : 'linear-gradient(135deg, #FF3366, #4FACFE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  {!notification.avatar && getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    marginBottom: spacing.xs,
                    color: notification.read ? '#888' : 'white'
                  }}>
                    {notification.message}
                  </p>
                  <p style={{
                    fontSize: fontSize.xs,
                    color: '#666'
                  }}>
                    {notification.time}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: spacing.xs }}>
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      style={{
                        padding: spacing.sm,
                        background: 'transparent',
                        border: 'none',
                        color: '#4FACFE',
                        cursor: 'pointer',
                        fontSize: fontSize.sm
                      }}
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={{
                      padding: spacing.sm,
                      background: 'transparent',
                      border: 'none',
                      color: '#FF3366',
                      cursor: 'pointer',
                      fontSize: fontSize.sm
                    }}
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
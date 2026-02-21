import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const SubscribeButton = ({ channelId }) => {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (channelId) {
      loadSubscribers();
    }
  }, [channelId, user]);

  const loadSubscribers = async () => {
    try {
      // Get subscriber count
      const { count } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('channel_id', channelId);

      setSubscriberCount(count || 0);

      // Check if user is subscribed
      if (user) {
        const { data } = await supabase
          .from('subscribers')
          .select('*')
          .eq('channel_id', channelId)
          .eq('subscriber_id', user.id)
          .maybeSingle();

        setSubscribed(!!data);
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please login to subscribe');
      return;
    }

    if (user.id === channelId) return;

    try {
      if (subscribed) {
        // Unsubscribe
        const { error } = await supabase
          .from('subscribers')
          .delete()
          .eq('channel_id', channelId)
          .eq('subscriber_id', user.id);

        if (error) throw error;
        setSubscribed(false);
        setSubscriberCount(prev => prev - 1);
      } else {
        // Subscribe
        const { error } = await supabase
          .from('subscribers')
          .insert([{
            channel_id: channelId,
            subscriber_id: user.id
          }]);

        if (error) throw error;
        setSubscribed(true);
        setSubscriberCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling subscribe:', error);
    }
  };

  if (user?.id === channelId) return null;

  const buttonStyle = {
    padding: '8px 16px',
    background: subscribed ? '#2a2a2a' : '#FF3366',
    border: subscribed ? '1px solid #333' : 'none',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: loading ? 'wait' : 'pointer',
    transition: 'all 0.2s',
    minWidth: '100px'
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      style={buttonStyle}
      onMouseEnter={e => !loading && !subscribed && (e.target.style.background = '#ff4d4d')}
      onMouseLeave={e => !loading && !subscribed && (e.target.style.background = '#FF3366')}
    >
      {loading ? '...' : subscribed ? '✓ Subscribed' : 'Subscribe'} {subscriberCount > 0 && ` • ${subscriberCount}`}
    </button>
  );
};

export default SubscribeButton;
import { supabase } from '../lib/supabase';

export const statsService = {
  // Get real user count
  async getTotalUsers() {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching user count:', error);
      return 0;
    }
  },

  // Get real content count
  async getTotalContent() {
    try {
      const { count, error } = await supabase
        .from('content')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching content count:', error);
      return 0;
    }
  },

  // Get real views count
  async getTotalViews() {
    try {
      const { data, error } = await supabase
        .from('views')
        .select('count');
      
      if (error) throw error;
      
      const total = data?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
      return total;
    } catch (error) {
      console.error('Error fetching views:', error);
      return 0;
    }
  },

  // Get real earnings
  async getTotalEarnings() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');
      
      if (error) throw error;
      
      const total = data?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
      return total;
    } catch (error) {
      console.error('Error fetching earnings:', error);
      return 0;
    }
  },

  // Get user-specific stats
  async getUserStats(userId) {
    try {
      const [contentCount, viewsData, earningsData] = await Promise.all([
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('views').select('count').eq('user_id', userId),
        supabase.from('transactions').select('amount').eq('user_id', userId).eq('status', 'completed')
      ]);
      
      return {
        content: contentCount.count || 0,
        views: viewsData.data?.reduce((sum, v) => sum + (v.count || 0), 0) || 0,
        earnings: earningsData.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { content: 0, views: 0, earnings: 0 };
    }
  },

  // Get admin stats
  async getAdminStats() {
    try {
      const [users, content, views, revenue] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('content').select('*', { count: 'exact', head: true }),
        supabase.from('views').select('count'),
        supabase.from('transactions').select('amount').eq('status', 'completed')
      ]);
      
      return {
        totalUsers: users.count || 0,
        totalContent: content.count || 0,
        totalViews: views.data?.reduce((sum, v) => sum + (v.count || 0), 0) || 0,
        totalRevenue: revenue.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return { totalUsers: 0, totalContent: 0, totalViews: 0, totalRevenue: 0 };
    }
  },

  // Get channel stats
  async getChannelStats(channelId) {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('views_count')
        .eq('channel_id', channelId);
      
      if (error) throw error;
      
      const totalViews = data?.reduce((sum, item) => sum + (item.views_count || 0), 0) || 0;
      return { totalViews, totalContent: data?.length || 0 };
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      return { totalViews: 0, totalContent: 0 };
    }
  }
};
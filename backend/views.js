// views.js - Unique View Tracking
const { supabase } = require('./supabaseClient');

async function trackContentView(contentId, userId, ipAddress = null) {
  console.log(`Tracking view for content ${contentId} by user ${userId || 'anonymous'}`);
  
  try {
    // Check for existing view in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    let query = supabase
      .from('content_views')
      .select('id')
      .eq('content_id', contentId)
      .gte('viewed_at', oneDayAgo.toISOString());
    
    if (userId) {
      // Logged-in user - check by user_id
      query = query.eq('user_id', userId);
    } else if (ipAddress) {
      // Anonymous user - check by ip_address
      query = query.eq('ip_address', ipAddress);
    } else {
      // No way to track uniqueness
      return await incrementViewCount(contentId);
    }
    
    const { data: existing, error: checkError } = await query;
    
    if (checkError) {
      console.error('Error checking existing view:', checkError);
      return await incrementViewCount(contentId);
    }
    
    if (existing && existing.length > 0) {
      console.log('View already recorded in last 24 hours');
      return { unique: false, message: 'Already viewed recently' };
    }
    
    // Record new unique view
    const { error: insertError } = await supabase
      .from('content_views')
      .insert([{
        content_id: contentId,
        user_id: userId || null,
        ip_address: ipAddress || null,
        viewed_at: new Date()
      }]);
      
    if (insertError) {
      console.error('Error inserting view:', insertError);
    }
    
    // Increment view count
    return await incrementViewCount(contentId);
    
  } catch (error) {
    console.error('Error in trackContentView:', error);
    return await incrementViewCount(contentId);
  }
}

async function incrementViewCount(contentId) {
  try {
    const { data, error } = await supabase.rpc('increment_content_views', {
      content_id: contentId
    });
    
    if (error) {
      console.error('Error incrementing view count:', error);
      return { success: false, views: null };
    }
    
    return { success: true, views: data };
    
  } catch (error) {
    console.error('Error in incrementViewCount:', error);
    return { success: false, views: null };
  }
}

async function getContentViewStats(contentId) {
  try {
    // Get total views
    const { count: totalViews, error: totalError } = await supabase
      .from('content_views')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', contentId);
      
    if (totalError) throw totalError;
    
    // Get unique viewers (by user_id)
    const { count: uniqueViewers, error: uniqueError } = await supabase
      .from('content_views')
      .select('user_id', { count: 'exact', head: true })
      .eq('content_id', contentId)
      .not('user_id', 'is', null);
      
    if (uniqueError) throw uniqueError;
    
    // Get views by day for last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { data: dailyViews, error: dailyError } = await supabase
      .from('content_views')
      .select('viewed_at')
      .eq('content_id', contentId)
      .gte('viewed_at', sevenDaysAgo.toISOString());
      
    if (dailyError) throw dailyError;
    
    // Aggregate by day
    const viewsByDay = {};
    dailyViews?.forEach(view => {
      const day = new Date(view.viewed_at).toISOString().split('T')[0];
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    });
    
    return {
      totalViews,
      uniqueViewers,
      viewsByDay,
      dailyAverage: dailyViews ? Math.round(dailyViews.length / 7) : 0
    };
    
  } catch (error) {
    console.error('Error getting view stats:', error);
    return null;
  }
}

module.exports = { trackContentView, getContentViewStats };
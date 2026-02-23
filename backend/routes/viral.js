// ========== REAL TIKTOK FEED - CONNECTED TO CONTENT TABLE ==========
router.get('/feed', async (req, res) => {
  console.log('📱 [TikTok Feed] Fetching real content...');
  
  try {
    // Get real content from database
    const { data, error } = await supabase
      .from('content')
      .select(`
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        views_count,
        likes_count,
        created_at,
        user_id,
        profiles:user_id (
          username,
          avatar_url,
          full_name
        )
      `)
      .eq('status', 'approved')
      .eq('content_type', 'video')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`✅ Found ${data?.length || 0} videos`);

    // Format the data for the frontend
    const formattedVideos = (data || []).map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      views_count: video.views_count || 0,
      likes_count: video.likes_count || 0,
      created_at: video.created_at,
      user: {
        id: video.user_id,
        username: video.profiles?.username || 'Anonymous',
        avatar_url: video.profiles?.avatar_url,
        full_name: video.profiles?.full_name
      }
    }));

    res.json(formattedVideos);

  } catch (error) {
    console.error('❌ Feed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add endpoint to like a video
router.post('/feed/:videoId/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { videoId } = req.params;

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('content_id', videoId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('content_id', videoId)
        .eq('user_id', user.id);

      await supabase
        .from('content')
        .update({ likes_count: supabase.raw('GREATEST(likes_count - 1, 0)') })
        .eq('id', videoId);

      res.json({ liked: false });
    } else {
      // Like
      await supabase
        .from('likes')
        .insert([{ content_id: videoId, user_id: user.id }]);

      await supabase
        .from('content')
        .update({ likes_count: supabase.raw('likes_count + 1') })
        .eq('id', videoId);

      res.json({ liked: true });
    }

  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add endpoint to increment view count
router.post('/feed/:videoId/view', async (req, res) => {
  try {
    const { videoId } = req.params;

    await supabase
      .from('content')
      .update({ views_count: supabase.raw('views_count + 1') })
      .eq('id', videoId);

    res.json({ success: true });
  } catch (error) {
    console.error('View count error:', error);
    res.status(500).json({ error: error.message });
  }
});
import { supabase } from './supabase';

export const searchService = {
  searchStreams: async (query: string) => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:streamer_id(id, username, display_name, avatar_url),
        stream_categories(name),
        stream_tags(tag)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_live', true)
      .limit(50);
    return { data, error };
  },

  searchStreamers: async (query: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
      .eq('is_streamer', true)
      .limit(20);
    return { data, error };
  },

  searchCategories: async (query: string) => {
    const { data, error } = await supabase
      .from('stream_categories')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);
    return { data, error };
  },

  globalSearch: async (query: string) => {
    const [streamsResult, streamersResult, categoriesResult] = await Promise.all([
      searchService.searchStreams(query),
      searchService.searchStreamers(query),
      searchService.searchCategories(query),
    ]);

    return {
      streams: streamsResult.data || [],
      streamers: streamersResult.data || [],
      categories: categoriesResult.data || [],
      error: streamsResult.error || streamersResult.error || categoriesResult.error,
    };
  },

  getTrendingStreams: async (limit = 20) => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:streamer_id(id, username, display_name, avatar_url),
        stream_categories(name)
      `)
      .eq('is_live', true)
      .order('viewer_count', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  getRecommendedStreams: async (userId: string, limit = 20) => {
    const { data: following } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', userId);

    const followingIds = following?.map(f => f.following_id) || [];

    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:streamer_id(id, username, display_name, avatar_url),
        stream_categories(name)
      `)
      .eq('is_live', true)
      .in('streamer_id', followingIds.length > 0 ? followingIds : [''])
      .order('viewer_count', { ascending: false })
      .limit(limit);

    return { data, error };
  },
};

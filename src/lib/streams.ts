import { supabase } from './supabase';

export const streamService = {
  getLiveStreams: async (limit = 50) => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:streamer_id(id, username, display_name, avatar_url, is_verified),
        stream_categories(name),
        stream_tags(tag),
        ai_highlights(id)
      `)
      .eq('is_live', true)
      .order('viewer_count', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  getStreamById: async (streamId: string) => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:streamer_id(id, username, display_name, avatar_url, is_verified, follower_count, total_views),
        stream_categories(name),
        stream_tags(tag),
        ai_highlights(*),
        clips(*)
      `)
      .eq('id', streamId)
      .maybeSingle();
    return { data, error };
  },

  getStreamsByCategory: async (categoryId: string, limit = 20) => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:streamer_id(id, username, display_name, avatar_url),
        stream_tags(tag)
      `)
      .eq('category_id', categoryId)
      .eq('is_live', true)
      .limit(limit);
    return { data, error };
  },

  getStreamerStreams: async (streamerId: string) => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        stream_categories(name),
        stream_tags(tag)
      `)
      .eq('streamer_id', streamerId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createStream: async (streamerId: string, title: string, categoryId: string, tags: string[]) => {
    const streamKey = `live_${Math.random().toString(36).substring(2, 15)}`;
    const rtmpUrl = `rtmp://ingest.streamflow.tv/live`;

    const { data: stream, error: streamError } = await supabase
      .from('streams')
      .insert({
        streamer_id: streamerId,
        title,
        category_id: categoryId,
        stream_key: streamKey,
        rtmp_url: rtmpUrl,
        is_live: false,
      })
      .select()
      .single();

    if (streamError || !stream) {
      return { data: null, error: streamError };
    }

    const tagInserts = tags.map(tag => ({
      stream_id: stream.id,
      tag,
    }));

    if (tagInserts.length > 0) {
      await supabase.from('stream_tags').insert(tagInserts);
    }

    return { data: stream, error: null };
  },

  updateStream: async (streamId: string, updates: {
    title?: string;
    description?: string;
    is_live?: boolean;
    viewer_count?: number;
    peak_viewer_count?: number;
  }) => {
    const { data, error } = await supabase
      .from('streams')
      .update(updates)
      .eq('id', streamId)
      .select()
      .single();
    return { data, error };
  },

  endStream: async (streamId: string) => {
    const { data, error } = await supabase
      .from('streams')
      .update({ is_live: false, ended_at: new Date().toISOString() })
      .eq('id', streamId)
      .select()
      .single();
    return { data, error };
  },

  getCategories: async () => {
    const { data, error } = await supabase
      .from('stream_categories')
      .select('*')
      .order('name');
    return { data, error };
  },

  searchStreams: async (query: string) => {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        profiles:streamer_id(username, display_name, avatar_url),
        stream_categories(name),
        stream_tags(tag)
      `)
      .eq('is_live', true)
      .or(`title.ilike.%${query}%,profiles.display_name.ilike.%${query}%`)
      .limit(20);
    return { data, error };
  },
};

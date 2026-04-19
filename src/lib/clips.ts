import { supabase } from './supabase';

export const clipService = {
  createClip: async (streamId: string, creatorId: string, title: string, startTimestamp: number, endTimestamp: number) => {
    const { data, error } = await supabase
      .from('clips')
      .insert({
        stream_id: streamId,
        creator_id: creatorId,
        title,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        video_url: `https://clips.streamflow.tv/${streamId}/${startTimestamp}-${endTimestamp}`,
        thumbnail_url: `https://thumbs.streamflow.tv/${streamId}/${startTimestamp}.jpg`,
      })
      .select()
      .single();
    return { data, error };
  },

  getStreamClips: async (streamId: string, limit = 20) => {
    const { data, error } = await supabase
      .from('clips')
      .select(`
        *,
        profiles:creator_id(username, display_name, avatar_url)
      `)
      .eq('stream_id', streamId)
      .order('view_count', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  getStreamerClips: async (streamerId: string, limit = 30) => {
    const { data, error } = await supabase
      .from('clips')
      .select(`
        *,
        streams(title, streamer_id)
      `)
      .eq('streams.streamer_id', streamerId)
      .order('view_count', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  incrementClipViews: async (clipId: string) => {
    const { data, error } = await supabase.rpc('increment_clip_views', { clip_id: clipId });
    return { data, error };
  },

  deleteClip: async (clipId: string, userId: string) => {
    const { error } = await supabase
      .from('clips')
      .delete()
      .eq('id', clipId)
      .eq('creator_id', userId);
    return { error };
  },
};

import { supabase } from './supabase';

export const chatService = {
  sendMessage: async (streamId: string, userId: string, message: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        stream_id: streamId,
        user_id: userId,
        message,
      })
      .select()
      .single();
    return { data, error };
  },

  getStreamChat: async (streamId: string, limit = 100) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles:user_id(id, username, display_name, avatar_url)
      `)
      .eq('stream_id', streamId)
      .eq('is_moderated', false)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  getFlaggedMessages: async (streamId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles:user_id(username, display_name)
      `)
      .eq('stream_id', streamId)
      .eq('is_moderated', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  moderateMessage: async (messageId: string, reason: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .update({ is_moderated: true, moderation_reason: reason })
      .eq('id', messageId)
      .select()
      .single();
    return { data, error };
  },

  deleteMessage: async (messageId: string) => {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);
    return { error };
  },

  getMessageCount: async (streamId: string) => {
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('stream_id', streamId);
    return { count, error };
  },
};

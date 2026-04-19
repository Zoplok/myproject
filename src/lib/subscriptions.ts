import { supabase } from './supabase';

export const subscriptionService = {
  subscribe: async (subscriberId: string, streamerId: string, tier: 1 | 2 | 3 = 1) => {
    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        subscriber_id: subscriberId,
        streamer_id: streamerId,
        tier,
      })
      .select()
      .single();
    return { data, error };
  },

  unsubscribe: async (subscriberId: string, streamerId: string) => {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('subscriber_id', subscriberId)
      .eq('streamer_id', streamerId);
    return { error };
  },

  isSubscribed: async (subscriberId: string, streamerId: string) => {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('subscriber_id', subscriberId)
      .eq('streamer_id', streamerId)
      .maybeSingle();
    return { isSubscribed: !!data, tier: data?.tier, error };
  },

  getStreamerSubscribers: async (streamerId: string) => {
    const { count, error } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact' })
      .eq('streamer_id', streamerId);
    return { count: count ?? 0, error };
  },

  donate: async (donorId: string, streamerId: string, amount: number, message?: string, streamId?: string) => {
    const { data, error } = await supabase
      .from('donations')
      .insert({
        donor_id: donorId,
        streamer_id: streamerId,
        stream_id: streamId,
        amount,
        message,
      })
      .select()
      .single();
    return { data, error };
  },

  getStreamDonations: async (streamId: string) => {
    const { data, error } = await supabase
      .from('donations')
      .select('*, profiles:donor_id(username, display_name, avatar_url)')
      .eq('stream_id', streamId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getStreamerTotalDonations: async (streamerId: string) => {
    const { data, error } = await supabase
      .from('donations')
      .select('amount')
      .eq('streamer_id', streamerId);

    const total = data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
    return { total, error };
  },
};

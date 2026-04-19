import { supabase } from './supabase';

export const followerService = {
  follow: async (followerId: string, followingId: string) => {
    const { data, error } = await supabase
      .from('followers')
      .insert({ follower_id: followerId, following_id: followingId })
      .select()
      .single();

    if (!error) {
      await supabase.rpc('increment_follower_count', { user_id: followingId });
    }

    return { data, error };
  },

  unfollow: async (followerId: string, followingId: string) => {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (!error) {
      await supabase.rpc('decrement_follower_count', { user_id: followingId });
    }

    return { error };
  },

  isFollowing: async (followerId: string, followingId: string) => {
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
    return { isFollowing: !!data, error };
  },

  getFollowers: async (userId: string) => {
    const { data, error } = await supabase
      .from('followers')
      .select('profiles:follower_id(*)')
      .eq('following_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getFollowing: async (userId: string) => {
    const { data, error } = await supabase
      .from('followers')
      .select('profiles:following_id(*)')
      .eq('follower_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  getFollowerCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact' })
      .eq('following_id', userId);
    return { count: count ?? 0, error };
  },

  getFollowingCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact' })
      .eq('follower_id', userId);
    return { count: count ?? 0, error };
  },
};

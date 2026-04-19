import { supabase } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export const authService = {
  signUp: async (email: string, password: string, username: string, displayName: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
        },
      },
    });

    if (!error && data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: displayName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        is_streamer: false,
      });
    }

    return { user: data.user, session: data.session, error };
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, session: data.session, error };
  },

  signOut: async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  },

  getCurrentSession: async (): Promise<Session | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session ?? null;
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });
  },

  updateProfile: async (userId: string, updates: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    banner_url?: string;
    is_streamer?: boolean;
  }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    return { data, error };
  },

  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return { data, error };
  },
};

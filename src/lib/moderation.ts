import { supabase } from './supabase';

export const moderationService = {
  checkMessage: async (message: string) => {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-moderation`;

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  generateHighlights: async (streamDuration: number) => {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-highlights`;

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ streamDuration }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getStreamAnalytics: async (streamId: string) => {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stream-analytics`;

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ streamId }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  askAI: async (question: string, streamId: string) => {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ question, streamId }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

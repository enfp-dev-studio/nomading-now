import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, nickname: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
          },
        },
      });
      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        // Clear local storage on auth error
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('sb-')) {
              localStorage.removeItem(key);
            }
          });
        }
      }
      
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear local storage regardless of error
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get current user error:', error);
        // Clear corrupted session data
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('sb-')) {
              localStorage.removeItem(key);
            }
          });
        }
      }
      
      return { data, error };
    } catch (error) {
      console.error('Get current user error:', error);
      return { data: { user: null }, error };
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      // Handle auth errors
      if (event === 'SIGNED_OUT' && session === null) {
        // Clear local storage when signed out
        if (typeof window !== 'undefined') {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('sb-')) {
              localStorage.removeItem(key);
            }
          });
        }
      }
      
      callback(event, session);
    });
  },

  // Helper function to clear corrupted session data
  clearSession: () => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
          console.log('Cleared corrupted session key:', key);
        }
      });
    }
  },
};
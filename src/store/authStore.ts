import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  user_metadata: {
    [key: string]: unknown;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email before signing in.');
        }
        throw error;
      }
      
      if (!data?.user) {
        throw new Error('No user data received');
      }
      
      if (!data.user.email_confirmed_at) {
        throw new Error('Please confirm your email before signing in.');
      }
      
      // Ensure we have the latest session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user) {
        set({ user: sessionData.session.user as User });
      } else {
        set({ user: data.user as User });
      }
      
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://jobauction.vercel.app/auth/callback',
        },
      });
      
      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please sign in or use the "Resend confirmation email" option.');
        }
        throw error;
      }
      
      if (!data.user) {
        throw new Error('Failed to create account. Please try again.');
      }
      
      set({ user: data.user as User });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  resendConfirmationEmail: async (email: string) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: 'https://jobauction.vercel.app/auth/callback',
        },
      });
      
      if (error) {
        if (error.message.includes('already confirmed')) {
          throw new Error('This email is already confirmed. Please sign in.');
        }
        throw error;
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  checkSession: async () => {
    try {
      set({ isLoading: true });
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        set({ user: null });
        return;
      }
      
      if (session?.user) {
        set({ user: session.user as User });
      } else {
        set({ user: null });
      }
    } catch (error) {
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
})); 
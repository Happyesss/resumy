import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Local storage helpers
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper functions for common operations
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getUserProfile = async (authUserId: string) => {
  console.log('[getUserProfile] Fetching profile for:', authUserId);

  try {
    // Simple, direct query to get user profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error) {
      console.error('[getUserProfile] Error fetching user profile:', error);
      throw error;
    }

    if (!data) {
      throw new Error('User profile not found');
    }

    console.log('[getUserProfile] Successfully fetched profile');
    return data;
  } catch (err) {
    console.error('[getUserProfile] Exception:', err);
    throw err;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  // Check if we need to manually create the user profile
  // This is a safeguard in case the database trigger doesn't work
  try {
    if (data.user) {
      // Wait a moment for the database trigger to work
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Try to get the profile
      const { error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError && profileError.code === 'PGRST116') {
        console.log(
          '[signUpWithEmail] Profile not found after signup, creating manually'
        );

        await supabase.from('users').insert({
          auth_user_id: data.user.id,
          email: email,
          full_name: fullName,
        });

        console.log('[signUpWithEmail] Manually created user profile');
      }
    }
  } catch (profileCreationError) {
    console.error(
      '[signUpWithEmail] Error ensuring profile exists:',
      profileCreationError
    );
    // We don't throw here because the auth signup was successful
    // The profile can be created later when needed
  }

  return data;
};

export const signInWithProvider = async (provider: 'google' | 'github') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
};

// Storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
};

// Realtime subscription helper
export const subscribeToResumeChanges = (
  resumeId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`resume-${resumeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'resumes',
        filter: `id=eq.${resumeId}`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'resume_sections',
        filter: `resume_id=eq.${resumeId}`,
      },
      callback
    )
    .subscribe();
};
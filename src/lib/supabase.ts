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
  console.log('[getUserProfile] About to query users table for:', authUserId);

  // Debug Supabase configuration
  console.log(
    '[getUserProfile] Supabase URL check:',
    supabaseUrl
      ? `URL exists (${supabaseUrl.substring(0, 10)}...)`
      : 'URL is missing'
  );
  console.log(
    '[getUserProfile] Supabase Key check:',
    supabaseAnonKey ? 'Key exists' : 'Key is missing'
  );

  // Check online status
  if (typeof window !== 'undefined' && window.navigator && !navigator.onLine) {
    console.log('[getUserProfile] Browser reports offline status');
  }

  // Check network connectivity with a simple health check
  try {
    console.log('[getUserProfile] Testing Supabase connectivity...');

    // We'll use a direct fetch to bypass Supabase client if there are issues
    let connectedToSupabase = false;
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/users?select=count`,
        {
          method: 'HEAD',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          // Short timeout to quickly detect network issues
          signal: AbortSignal.timeout(3000),
        }
      );

      console.log(
        '[getUserProfile] Direct fetch status:',
        response.status,
        response.ok
      );
      connectedToSupabase = response.ok;
    } catch (fetchError) {
      console.error(
        '[getUserProfile] Direct fetch failed:',
        fetchError instanceof Error ? fetchError.message : String(fetchError)
      );
    }

    if (!connectedToSupabase) {
      console.log(
        '[getUserProfile] Server might be unreachable, trying to work with cached data'
      );
    }

    // Try through the Supabase client
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('count')
      .limit(0);

    console.log(
      '[getUserProfile] Health check result:',
      healthCheck ? 'Success' : 'Failed',
      healthError
    );

    if (healthError) {
      console.error('[getUserProfile] Supabase connection issue:', healthError);
      console.log('[getUserProfile] Will still attempt to get profile...');
    }

    // Check for cached profile first
    const cachedProfileKey = `user_profile_${authUserId}`;
    const cachedProfile = getLocalStorage<any>(cachedProfileKey, null);
    let cachedProfileAge = 0;

    if (cachedProfile) {
      console.log('[getUserProfile] Found cached profile for:', authUserId);

      // Check how old the cache is
      if (cachedProfile.cached_at) {
        cachedProfileAge =
          Date.now() - new Date(cachedProfile.cached_at).getTime();
        console.log(
          `[getUserProfile] Cache age: ${Math.round(
            cachedProfileAge / 1000 / 60
          )} minutes`
        );
      }
    }

    // Always try to get the existing profile regardless of health check
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    console.log('[getUserProfile] Query result:', data, error);

    // If we got fresh data, cache it
    if (data) {
      const profileToCache = {
        ...data,
        cached_at: new Date().toISOString(),
      };
      setLocalStorage(cachedProfileKey, profileToCache);
      console.log('[getUserProfile] Updated profile cache');
    }

    if (error) {
      // If the profile doesn't exist, or if there's a connection issue, handle it
      console.log('[getUserProfile] Error details:', error.code, error.message);

      // If we have a relatively fresh cache (less than 1 hour old), use it as fallback
      if (cachedProfile && cachedProfileAge < 3600000) {
        console.log('[getUserProfile] Using cached profile as fallback');
        // Strip out the cached_at field
        const { cached_at, ...profileWithoutCache } = cachedProfile;
        return profileWithoutCache;
      }

      if (
        error.code === 'PGRST116' ||
        error.message?.includes('network') ||
        error.message?.includes('Failed to fetch')
      ) {
        console.log(
          '[getUserProfile] Profile not found or network issue, attempting direct auth approach'
        );

        // Try a different approach - get the user's authentication data
        console.log('[getUserProfile] Calling auth.getUser()...');
        const authUserResponse = await supabase.auth.getUser();
        console.log(
          '[getUserProfile] Auth user response:',
          authUserResponse.data?.user?.id ? 'Has user' : 'No user',
          authUserResponse.error ? 'Has error' : 'No error'
        );

        if (authUserResponse.error) {
          console.error(
            '[getUserProfile] Auth API error:',
            authUserResponse.error
          );
          throw new Error(`Auth API error: ${authUserResponse.error.message}`);
        }

        if (!authUserResponse.data.user) {
          throw new Error('Cannot create profile: Auth user not found');
        }

        // Try to create a profile as a fallback
        console.log(
          '[getUserProfile] Attempting to create/get profile through direct API call'
        );

        // First check if user profile exists with a raw request approach
        try {
          // Create a new profile
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert({
              auth_user_id: authUserId,
              email: authUserResponse.data.user.email || '',
              full_name:
                authUserResponse.data.user.user_metadata.full_name ||
                authUserResponse.data.user.email?.split('@')[0] ||
                'User',
            })
            .select('*')
            .single();

          if (insertError) {
            // If insert fails, it might be because the profile already exists (conflict)
            console.log(
              '[getUserProfile] Insert attempt failed, trying to get existing profile:',
              insertError
            );

            // Try one more direct query
            const { data: existingProfile, error: finalError } = await supabase
              .from('users')
              .select('*')
              .eq('auth_user_id', authUserId)
              .single();

            if (finalError || !existingProfile) {
              console.error(
                '[getUserProfile] Final attempt failed:',
                finalError
              );

              // Create a dummy profile as last resort
              const fallbackProfile = {
                id: 'temp-' + Date.now(),
                auth_user_id: authUserId,
                email: authUserResponse.data.user.email || 'unknown@email.com',
                full_name:
                  authUserResponse.data.user.user_metadata.full_name ||
                  'Temporary User',
                avatar_url: null,
                subscription_tier: 'free',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };

              // Cache this temporary profile
              setLocalStorage(cachedProfileKey, {
                ...fallbackProfile,
                cached_at: new Date().toISOString(),
                is_temporary: true,
              });

              console.log(
                '[getUserProfile] Created and cached another temporary profile'
              );
              return fallbackProfile;
            }

            console.log(
              '[getUserProfile] Found existing profile in final attempt'
            );
            return existingProfile;
          }

          console.log('[getUserProfile] Created new profile:', newProfile);
          return newProfile;
        } catch (criticalError) {
          console.error(
            '[getUserProfile] Critical error during profile handling:',
            criticalError
          );

          // Create a fallback user profile object to prevent the app from breaking
          const fallbackProfile = {
            id: 'temp-' + Date.now(),
            auth_user_id: authUserId,
            email: authUserResponse.data.user.email || 'unknown@email.com',
            full_name:
              authUserResponse.data.user.user_metadata.full_name ||
              'Temporary User',
            avatar_url: null,
            subscription_tier: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Cache this temporary profile
          setLocalStorage(cachedProfileKey, {
            ...fallbackProfile,
            cached_at: new Date().toISOString(),
            is_temporary: true,
          });

          console.log('[getUserProfile] Created and cached temporary profile');
          return fallbackProfile;
        }
      } else {
        // For other errors, throw them
        console.error('[getUserProfile] Error fetching user profile:', error);
        throw error;
      }
    }

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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  supabase,
  getUserProfile,
  signInWithEmail,
  signUpWithEmail,
  signInWithProvider,
  signOut,
} from '../lib/supabase';
import { Database } from '../types/database';
import { useLocalStorage } from '../hooks/useLocalStorage';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use local storage to cache the user profile for offline access
  const [cachedProfile, setCachedProfile] = useLocalStorage<UserProfile | null>(
    'cached_user_profile',
    null
  );

  // Enhanced setProfile function that also updates the cache
  const updateProfileWithCache = (newProfile: UserProfile | null) => {
    setProfile(newProfile);
    if (newProfile) {
      setCachedProfile(newProfile);
      console.log('User profile cached to local storage');
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');

        // First check connectivity to Supabase
        try {
          console.log('Testing Supabase connectivity...');
          // Use a simple request to test connectivity
          try {
            const { error: healthError } = await supabase
              .from('users')
              .select('count')
              .limit(1);

            console.log(
              'Health check result:',
              healthError
                ? `Error: ${healthError.message}`
                : 'Connection successful'
            );
          } catch (networkError) {
            console.error('Network error during health check:', networkError);
          }
        } catch (healthError) {
          console.error('Error during health check:', healthError);
        }

        // Get the current session
        console.log('Attempting to get current session...');
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          console.log('Error details:', error.message, error.status);
        }

        if (mounted) {
          if (session?.user) {
            console.log('Found existing session for user:', session.user.email);
            setUser(session.user);

            // Try to get user profile, but don't block on it
            try {
              console.log(
                'Attempting to fetch user profile for:',
                session.user.id
              );

              // Add detailed network debugging
              if (navigator.onLine === false) {
                console.warn(
                  'Browser reports device is offline! Will retry when online.'
                );
              }

              console.log(
                'Network status check:',
                navigator.onLine ? 'Online' : 'Offline'
              );

              // Try with timeout to prevent hanging requests
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(
                  () => reject(new Error('Profile fetch timed out')),
                  5000
                );
              });

              const userProfile = await Promise.race([
                getUserProfile(session.user.id),
                timeoutPromise,
              ]);

              if (mounted) {
                console.log(
                  'User profile loaded successfully:',
                  userProfile.email
                );
                updateProfileWithCache(userProfile);
              }
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
              // Log error details with type checking
              console.log(
                'Error details:',
                profileError instanceof Error
                  ? profileError.name
                  : 'Unknown error',
                profileError instanceof Error
                  ? profileError.message
                  : String(profileError),
                profileError instanceof Error && 'code' in profileError
                  ? (profileError as any).code
                  : 'no-code',
                profileError instanceof Error
                  ? profileError.stack
                    ? 'Has stack'
                    : 'No stack'
                  : 'Not an Error object'
              );

              let retryCount = 0;
              const maxRetries = 3;

              const retryWithBackoff = async () => {
                if (!mounted || retryCount >= maxRetries) return;

                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                retryCount++;

                console.log(
                  `Init - retry ${retryCount}/${maxRetries} after ${delay}ms...`
                );

                setTimeout(async () => {
                  if (!mounted) return;

                  try {
                    console.log('Retrying profile fetch after delay...');
                    const retryProfile = await getUserProfile(session.user.id);
                    console.log(
                      'Retry successful, profile loaded:',
                      retryProfile.email
                    );
                    updateProfileWithCache(retryProfile);
                  } catch (retryError) {
                    console.error(
                      `Init retry ${retryCount} failed:`,
                      retryError
                    );
                    if (retryCount < maxRetries) {
                      retryWithBackoff();
                    } else {
                      console.log('Init - max retries reached');
                    }
                  }
                }, delay);
              };

              retryWithBackoff();
            }
          } else {
            console.log('No existing session found');
          }

          // Always set loading to false after initial check
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, !!session?.user);

      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setProfile(null);
        return;
      }

      // Log additional debug info about the session
      if (session?.user) {
        console.log('Session user details:', {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          lastSignIn: session.user.last_sign_in_at,
          hasMetadata: !!session.user.user_metadata,
        });
      }

      if (session?.user) {
        setUser(session.user);

        // Try to fetch profile for signed in users
        try {
          console.log(
            'Auth state changed - attempting to fetch profile for:',
            session.user.id
          );

          // Check if we have a cached profile we can use immediately
          if (cachedProfile && cachedProfile.auth_user_id === session.user.id) {
            console.log(
              'Found cached profile, using it while fresh data loads'
            );
            updateProfileWithCache(cachedProfile); // Use cached data immediately
          }

          // Check network status before making the API call
          if (navigator.onLine === false) {
            console.log(
              'Device is offline! Using cached data and will retry when online...'
            );

            // If we have a cached profile, use it
            if (
              cachedProfile &&
              cachedProfile.auth_user_id === session.user.id
            ) {
              console.log(
                'Using cached profile while offline:',
                cachedProfile.email
              );
              updateProfileWithCache(cachedProfile);
            }

            // Add an event listener to retry when back online
            const retryWhenOnline = async () => {
              console.log('Device is back online, retrying profile fetch...');
              try {
                const onlineProfile = await getUserProfile(session.user.id);
                if (mounted) {
                  console.log('Online retry successful:', onlineProfile.email);
                  updateProfileWithCache(onlineProfile);
                }
              } catch (onlineError) {
                console.error('Online retry failed:', onlineError);
              } finally {
                window.removeEventListener('online', retryWhenOnline);
              }
            };

            window.addEventListener('online', retryWhenOnline);
            throw new Error('Device is offline');
          }

          // Try with timeout to prevent hanging requests
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error('Profile fetch timed out')),
              5000
            );
          });

          const userProfile = await Promise.race([
            getUserProfile(session.user.id),
            timeoutPromise,
          ]);

          if (mounted) {
            console.log(
              'Auth state change - profile loaded successfully:',
              userProfile.email
            );
            updateProfileWithCache(userProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile on auth change:', error);
          console.log(
            'Auth state change - attempting to recover/create profile...'
          );

          // Try again after a short delay with increasing delays (exponential backoff)
          let retryCount = 0;
          const maxRetries = 3;

          const retryWithBackoff = async () => {
            if (!mounted || retryCount >= maxRetries) return;

            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
            retryCount++;

            console.log(
              `Auth state change - retry ${retryCount}/${maxRetries} after ${delay}ms...`
            );

            setTimeout(async () => {
              if (!mounted) return;

              try {
                console.log('Auth state change - retrying profile fetch...');
                const retryProfile = await getUserProfile(session.user.id);
                console.log(
                  'Auth state change - retry successful, profile loaded:',
                  retryProfile.email
                );
                updateProfileWithCache(retryProfile);
              } catch (retryError) {
                console.error(
                  `Auth state change - retry ${retryCount} failed:`,
                  retryError
                );
                if (retryCount < maxRetries) {
                  retryWithBackoff();
                } else {
                  console.log('Auth state change - max retries reached');
                }
              }
            }, delay);
          };

          retryWithBackoff();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      // Auth state change will handle setting user/profile
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      // Auth state change will handle setting user/profile
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithProvider = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
      // Auth state change will handle setting user/profile
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      // Auth state change will handle clearing user/profile
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('auth_user_id', user.id);

      if (error) throw error;

      const updatedProfile = { ...profile, ...updates };
      updateProfileWithCache(updatedProfile);

      return updatedProfile;
    } catch (updateError) {
      console.error('Error updating profile:', updateError);

      // If we're offline, optimistically update the local profile and cache
      // but mark it for sync when back online
      if (!navigator.onLine) {
        console.log('Offline mode: Optimistically updating profile locally');
        const updatedProfile = { ...profile, ...updates };
        updateProfileWithCache(updatedProfile);

        // Store pending changes to sync when online
        localStorage.setItem(
          'pending_profile_updates',
          JSON.stringify(updates)
        );

        // Add listener to sync when back online
        const syncWhenOnline = async () => {
          try {
            console.log('Back online, syncing pending profile changes');
            const pendingUpdates = JSON.parse(
              localStorage.getItem('pending_profile_updates') || '{}'
            );

            const { error: syncError } = await supabase
              .from('users')
              .update(pendingUpdates)
              .eq('auth_user_id', user.id);

            if (syncError) throw syncError;

            // Clear pending updates after successful sync
            localStorage.removeItem('pending_profile_updates');
            console.log('Pending profile changes synced successfully');
          } catch (syncError) {
            console.error('Error syncing pending profile changes:', syncError);
          } finally {
            window.removeEventListener('online', syncWhenOnline);
          }
        };

        window.addEventListener('online', syncWhenOnline);
        return updatedProfile;
      }

      throw updateError;
    }
  };

  const value = {
    user,
    profile,
    login,
    signup,
    loginWithProvider,
    logout,
    resetPassword,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

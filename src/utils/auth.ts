import { headers } from 'next/headers';
import AuthCache from './auth-cache';
import { createClient } from './supabase/server';

// Cache the auth check using React cache()
export async function getAuthenticatedUser() {
  const headersList = await headers();
  const requestId = headersList.get('x-request-id');
  const userId = headersList.get('x-user-id');
  
  // If we have a request ID and user ID in headers, check cache first
  if (requestId && userId) {
    const cachedUser = AuthCache.get(requestId);
    if (cachedUser) {
      return {
        id: cachedUser.id,
        email: cachedUser.email
      };
    }
  }

  try {
    // If not in cache, get from Supabase
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // Handle specific auth errors
    if (error) {
      console.error('Auth error in getAuthenticatedUser:', error.message, error.code);
      
      // Handle refresh token errors specifically
      if (
        error.message?.includes('refresh token') || 
        error.message?.includes('already used') ||
        error.code === 'refresh_token_already_used' ||
        error.code === 'invalid_refresh_token'
      ) {
        // Try to sign out the user to clear their session
        await supabase.auth.signOut();
        throw new Error('Session expired: ' + error.message);
      }
      
      throw error;
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    // If we have a request ID, cache the result
    if (requestId) {
      AuthCache.set(requestId, {
        id: user.id,
        email: user.email || null,
        timestamp: Date.now()
      });
    }

    return user;
  } catch (err) {
    console.error('Error in getAuthenticatedUser:', err);
    throw new Error('User not authenticated');
  }
}

// Helper to get user ID with error handling
export const getUserId = async () => {
  const user = await getAuthenticatedUser();
  return user.id;
}; 
import { createBrowserClient } from '@supabase/ssr'
import { AuthError } from '@supabase/supabase-js'

// Create a global variable to store the most recent auth error
let lastAuthError: AuthError | null = null

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Set up special handling for refresh token errors
        detectSessionInUrl: true,
        flowType: 'pkce',
        autoRefreshToken: true,
      }
    }
  )
  
  // Listen for auth state changes after creating the client
  if (typeof window !== 'undefined') {
    // Only run on client side
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.warn('Token refresh failed, session is null')
        // Could redirect to login here
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      }
    })
    
    // Handle error by checking session periodically
    const checkSessionInterval = setInterval(async () => {
      try {
        const { error } = await client.auth.getSession()
        if (error) {
          console.error('Session check error:', error)
          lastAuthError = error
        }
      } catch (e) {
        if (e instanceof AuthError) {
          lastAuthError = e
        }
      }
    }, 60000) // Check every minute
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(checkSessionInterval)
      subscription.unsubscribe()
    })
  }
  
  return client
}

// Export function to get the most recent auth error
export function getLastAuthError() {
  return lastAuthError
}
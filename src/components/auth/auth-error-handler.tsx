'use client'

import { createClient } from '@/utils/supabase/client'
import { AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

/**
 * Component that handles authentication errors globally
 * This component should be placed near the root of your application
 */
export default function AuthErrorHandler() {
  const router = useRouter()
  const supabase = createClient()
  
  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle sign out events, let successful logins flow naturally
      if (event === 'SIGNED_OUT') {
        // User signed out, redirect to login
        router.push('/auth/login')
      }
      
      // Handle token refresh errors from URL parameters
      if (typeof window !== 'undefined' && window.location.search.includes('error=token_refresh_error')) {
        toast.error('Your session has expired. Please log in again.')
        // Clear the error from URL
        window.history.replaceState({}, '', window.location.pathname)
      }
    })

    // Set up an interval to check authentication status (less frequent to avoid conflicts)
    const checkInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          handleAuthError(error)
        }
      } catch (err) {
        if (err instanceof AuthError) {
          handleAuthError(err)
        }
      }
    }, 300000) // Check every 5 minutes instead of every minute

    // Function to handle authentication errors
    const handleAuthError = (error: AuthError) => {
      console.error('Supabase Auth Error:', error)
      
      // Handle refresh token errors
      if (
        error.message.includes('refresh token') || 
        error.message.includes('already used') ||
        error.code === 'refresh_token_already_used' ||
        error.code === 'invalid_refresh_token'
      ) {
        // Show a toast notification
        toast.error('Session expired. Please log in again.')
        
        // Sign out and redirect to login
        supabase.auth.signOut().then(() => {
          router.push('/auth/login')
        })
      }
    }

    // Clean up subscription and interval when component unmounts
    return () => {
      subscription.unsubscribe()
      clearInterval(checkInterval)
    }
  }, [router, supabase])

  // This component doesn't render anything
  return null
}

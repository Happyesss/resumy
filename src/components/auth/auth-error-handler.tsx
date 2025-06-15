'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { AuthError } from '@supabase/supabase-js'

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
      if (event === 'SIGNED_OUT') {
        // User signed out, redirect to login
        router.push('/auth/login')
      }
      
      // If there's a token error in the URL, show a message
      if (window.location.search.includes('error=token_refresh_error')) {
        toast.error('Your session has expired. Please log in again.')
      }
    })

    // Set up an interval to check authentication status
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
    }, 60000) // Check every minute

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

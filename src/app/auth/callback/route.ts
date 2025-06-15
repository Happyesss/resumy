
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors in the callback URL
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    // Redirect to login page with error information
    return NextResponse.redirect(new URL(`/auth/login?error=${error}&error_description=${encodeURIComponent(errorDescription || '')}`, requestUrl.origin))
  }

  if (code) {
    try {
      // Ensure you pass cookies correctly. For App Router, it's a function.
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        // Redirect to login with error
        return NextResponse.redirect(
          new URL(`/auth/login?error=exchange_failed&error_description=${encodeURIComponent(error.message)}`, requestUrl.origin)
        )
      }
    } catch (err) {
      console.error('Unexpected error during auth code exchange:', err)
      // Redirect to login with generic error
      return NextResponse.redirect(
        new URL('/auth/login?error=unexpected&error_description=Authentication+failed', requestUrl.origin)
      )
    }
  }

  // URL to redirect to after sign in process completes
  // If 'next' is provided and is a relative path, use it.
  // Otherwise, default to the root.
  const redirectPath = (next && next.startsWith('/')) ? next : '/'
  
  // Construct the full redirect URL
  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
} 



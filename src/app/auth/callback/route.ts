
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  console.log('🔍 Auth callback - requestUrl.href:', requestUrl.href)
  console.log('🔍 Auth callback - requestUrl.origin:', requestUrl.origin)
  console.log('🔍 Auth callback - headers.host:', request.headers.get('host'))
  
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const state = requestUrl.searchParams.get('state')

  // Validate state parameter exists for OAuth callbacks (CSRF protection)
  // Note: Supabase handles state validation internally, but we log for debugging
  if (code && !state) {
    console.warn('OAuth callback received without state parameter - potential security issue')
  }

  // Handle errors in the callback URL
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
    
    // Handle specific OAuth errors with user-friendly messages
    const friendlyError = error;
    let friendlyDescription = errorDescription || '';
    
    // LinkedIn specific errors
    if (error === 'access_denied') {
      friendlyDescription = 'You cancelled the sign-in process. Please try again if you want to continue.';
    } else if (error === 'user_cancelled_login' || error === 'user_cancelled_authorize') {
      friendlyDescription = 'Sign-in was cancelled. Please try again.';
    } else if (error === 'invalid_request') {
      friendlyDescription = 'Invalid authentication request. Please try again.';
    } else if (error === 'unauthorized_client') {
      friendlyDescription = 'This application is not authorized. Please contact support.';
    } else if (error === 'server_error') {
      friendlyDescription = 'The authentication server encountered an error. Please try again later.';
    } else if (error === 'temporarily_unavailable') {
      friendlyDescription = 'The authentication service is temporarily unavailable. Please try again later.';
    }
    
    // Redirect to login page with error information
    return NextResponse.redirect(new URL(`/auth/login?error=${friendlyError}&error_description=${encodeURIComponent(friendlyDescription)}`, siteUrl))
  }

  if (code) {
    try {
      // Ensure you pass cookies correctly. For App Router, it's a function.
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
        // Redirect to login with error
        return NextResponse.redirect(
          new URL(`/auth/login?error=exchange_failed&error_description=${encodeURIComponent(error.message)}`, siteUrl)
        )
      }
    } catch (err) {
      console.error('Unexpected error during auth code exchange:', err)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
      // Redirect to login with generic error
      return NextResponse.redirect(
        new URL('/auth/login?error=unexpected&error_description=Authentication+failed', siteUrl)
      )
    }
  }

  // URL to redirect to after sign in process completes
  // If 'next' is provided and is a relative path, use it.
  // Otherwise, default to the root.
  const redirectPath = (next && next.startsWith('/')) ? next : '/'
  
  // Force use of NEXT_PUBLIC_SITE_URL instead of requestUrl.origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
  console.log('🔍 Auth callback - siteUrl:', siteUrl)
  console.log('🔍 Auth callback - redirectPath:', redirectPath)
  console.log('🔍 Auth callback - final redirect URL:', `${siteUrl}${redirectPath}`)
  
  // Construct the full redirect URL
  return NextResponse.redirect(new URL(redirectPath, siteUrl))
} 



import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

function resolveSiteOrigin(request: NextRequest, requestUrl: URL): string {
  const envSiteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (envSiteUrl) {
    try {
      return new URL(envSiteUrl).origin
    } catch {
      console.warn('Invalid SITE_URL/NEXT_PUBLIC_SITE_URL value, falling back to request origin:', envSiteUrl)
    }
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (host) {
    const proto = request.headers.get('x-forwarded-proto') ||
      (host.includes('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')
    return `${proto}://${host}`
  }

  return requestUrl.origin
}

function getSafeRedirectPath(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/'
  }

  return next
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const siteOrigin = resolveSiteOrigin(request, requestUrl)
  try {
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
      return NextResponse.redirect(
        new URL(`/auth/login?error=${friendlyError}&error_description=${encodeURIComponent(friendlyDescription)}`, siteOrigin)
      )
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
            new URL(`/auth/login?error=exchange_failed&error_description=${encodeURIComponent(error.message)}`, siteOrigin)
          )
        }
      } catch (err) {
        console.error('Unexpected error during auth code exchange:', err)
        // Redirect to login with generic error
        return NextResponse.redirect(
          new URL('/auth/login?error=unexpected&error_description=Authentication+failed', siteOrigin)
        )
      }
    }

    // URL to redirect to after sign in process completes
    // If 'next' is provided and is a relative path, use it.
    // Otherwise, default to the root.
    const redirectPath = getSafeRedirectPath(next)
    
    console.log('🔍 Auth callback - siteOrigin:', siteOrigin)
    console.log('🔍 Auth callback - redirectPath:', redirectPath)
    console.log('🔍 Auth callback - final redirect URL:', `${siteOrigin}${redirectPath}`)
    
    // Construct the full redirect URL
    return NextResponse.redirect(new URL(redirectPath, siteOrigin))
  } catch (err) {
    console.error('Unhandled auth callback error:', err)
    return NextResponse.redirect(
      new URL('/auth/login?error=callback_failed&error_description=Authentication+failed', siteOrigin)
    )
  }
} 



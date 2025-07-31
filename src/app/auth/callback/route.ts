
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

  // Handle errors in the callback URL
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
    // Redirect to login page with error information
    return NextResponse.redirect(new URL(`/auth/login?error=${error}&error_description=${encodeURIComponent(errorDescription || '')}`, siteUrl))
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



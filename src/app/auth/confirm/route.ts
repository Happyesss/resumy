import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle errors in the URL
  if (error) {
    console.error('Auth confirm error:', error, errorDescription);
    return NextResponse.redirect(new URL(`/auth/login?error=${error}&error_description=${encodeURIComponent(errorDescription || '')}`, request.url))
  }

  const supabase = await createClient()

  // Handle OAuth callback flow (when code is present)
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        return NextResponse.redirect(
          new URL(`/auth/login?error=exchange_failed&error_description=${encodeURIComponent(error.message)}`, request.url)
        )
      }
      
      // Success - redirect to next or dashboard
      redirect(next.startsWith('/') ? next : '/dashboard')
    } catch (err) {
      console.error('Unexpected error during auth code exchange:', err)
      return NextResponse.redirect(
        new URL('/auth/login?error=unexpected&error_description=Authentication+failed', request.url)
      )
    }
  }

  // Handle email OTP verification flow (when token_hash and type are present)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next.startsWith('/') ? next : '/dashboard')
    } else {
      console.error('Error verifying OTP:', error.message)
      return NextResponse.redirect(
        new URL(`/auth/login?error=otp_verification_failed&error_description=${encodeURIComponent(error.message)}`, request.url)
      )
    }
  }

  // If no valid parameters, redirect to login page with error parameter
  redirect('/auth/login?error=email_confirmation_failed')
}
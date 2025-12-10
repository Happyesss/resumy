import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Debug logging
  console.log('🔍 Middleware running on:', request.nextUrl.pathname)
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
    error: userError, // Capture error from getUser()
  } = await supabase.auth.getUser()
  
  // Debug logging
  console.log('👤 User authenticated:', !!user)
  if (userError) {
    console.warn('⚠️ Error getting user:', userError.message, userError.code);
    
    // Handle refresh token errors
    if (
      userError.message.includes('invalid refresh token') || 
      userError.message.includes('already used') || 
      userError.code === 'refresh_token_already_used' ||
      userError.code === 'invalid_refresh_token'
    ) {
      console.warn('🔁 Invalid or used refresh token detected. Signing out user and redirecting to login.');
      
      // Sign out the user
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error('Error during sign out:', signOutError);
        // Continue with redirect anyway, even if signOut fails
      }
      
      // Create redirect response with proper headers
      const signOutResponse = NextResponse.redirect(new URL('/auth/login', request.url), {
        status: 302, // Ensure we use 302 for redirect
      });
      
      // Clear all potential Supabase auth cookies
      const cookiesToClear = [
        'sb-access-token', 
        'sb-refresh-token',
        'supabase-auth-token',
        '__session'
      ];
      
      cookiesToClear.forEach(cookieName => {
        // Delete cookies with default options
        signOutResponse.cookies.delete(cookieName);
        
        // Clear with path options - using proper syntax for Next.js cookies
        const options: { path?: string } = { path: '/' };
        signOutResponse.cookies.set({
          name: cookieName,
          value: '',
          maxAge: 0,
          ...options
        });
        
        // Also clear with /auth path
        signOutResponse.cookies.set({
          name: cookieName,
          value: '',
          maxAge: 0,
          path: '/auth'
        });
      });
      
      console.log('🚪 Redirecting to login after clearing auth cookies');
      return signOutResponse;
    }
    
    // For other errors, log them but continue
    console.error('Other auth error:', userError.message);
  }

  // Create a new headers object with the existing headers
  // Given an incoming request...
  const requestHeaders = new Headers(request.headers)


  // Create new response with enriched headers
  supabaseResponse = NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  })

  supabaseResponse.cookies.set('show-banner', 'false')

  // Check if user is authenticated and redirect if needed
  if (!user) {
    // Allow access to auth pages and public pages for unauthenticated users
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth/')
    const isPublicPage = request.nextUrl.pathname === '/' || 
                        request.nextUrl.pathname === '/privacy' || 
                        request.nextUrl.pathname === '/terms'
    
    if (isAuthPage || isPublicPage) {
      console.log('✅ Allowing access to public/auth page:', request.nextUrl.pathname)
      return supabaseResponse
    }
    
    // If not authenticated and trying to access protected route, redirect to landing page
    console.log('🚫 Redirecting unauthenticated user to landing page')
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  console.log('✅ User authenticated, allowing access')

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
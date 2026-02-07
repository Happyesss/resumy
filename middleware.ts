import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request)
  } catch (error) {
    // Prevent middleware crashes from taking down the server
    console.error('Middleware error:', error instanceof Error ? error.message : error)
    
    // For API/Server Action requests, return a proper error response instead of crashing
    if (
      request.headers.get('next-action') ||
      request.headers.get('content-type')?.includes('multipart/form-data') ||
      request.nextUrl.pathname.startsWith('/api/')
    ) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
    
    // For page requests, let Next.js handle the error
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/webhooks (webhook endpoints)
     * - $ (base URL / landing page)
     * Run on all other routes to protect them
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
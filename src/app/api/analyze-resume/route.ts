import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This endpoint is deprecated - redirect to the page instead
    return NextResponse.redirect(new URL('/analyze-resume', request.url), 302);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.redirect(new URL('/analyze-resume', request.url), 302);
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Analyze Resume API',
      instructions: 'Use the /analyze-resume page with the client-side form instead.'
    }
  );
}

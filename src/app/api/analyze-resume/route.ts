import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This endpoint is a fallback for any accidental POST requests
    // The actual functionality is handled by server actions
    return NextResponse.json(
      { 
        error: 'This endpoint is deprecated. Please use the client-side form instead.',
        redirect: '/analyze-resume'
      },
      { status: 404 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
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

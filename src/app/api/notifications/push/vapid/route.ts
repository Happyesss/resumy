import { NextResponse } from 'next/server';

// GET - Get VAPID public key for push notifications
export async function GET() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidPublicKey) {
    return NextResponse.json(
      { success: false, error: 'Push notifications not configured' },
      { status: 503 }
    );
  }

  return NextResponse.json({
    success: true,
    publicKey: vapidPublicKey,
  });
}

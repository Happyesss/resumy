import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch shares for user
    const { data: shares, error } = await supabase
      .from('resume_shares')
      .select('id, view_count, is_active')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching share summary:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
    }

    const totalViews = (shares || []).reduce((s: number, r: { view_count?: number }) => s + (r.view_count || 0), 0);
    const totalShares = (shares || []).length;
    const activeShares = (shares || []).filter((s: { is_active?: boolean }) => s.is_active).length;

    return NextResponse.json({
      success: true,
      summary: { totalViews, totalShares, activeShares },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('shareId');

    if (!shareId) {
      return NextResponse.json({ success: false, error: 'shareId is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Get the share and verify ownership (shareId is the share_id field, not the id field)
    const { data: share, error: shareError } = await supabase
      .from('resume_shares')
      .select('id, share_id, resume_id')
      .eq('share_id', shareId)
      .eq('user_id', user.id)
      .single();

    if (shareError || !share) {
      return NextResponse.json({ success: false, error: 'Share not found' }, { status: 404 });
    }

    // Get analytics data for this share
    const { data: analytics, error: analyticsError } = await supabase
      .from('share_view_analytics')
      .select('*')
      .eq('share_id', share.id)
      .single();

    if (analyticsError || !analytics) {
      return NextResponse.json({
        success: true,
        logs: [],
        totalViews: 0,
      });
    }

    // Build detailed logs from arrays
    const logs: Array<{
      id: string;
      viewedAt: string;
      deviceType: string;
      browser: string;
      country: string;
      referrer: string;
      os: string;
    }> = [];

    const viewedAtTimes = analytics.viewed_at_times || [];
    const deviceTypes = analytics.device_types || [];
    const browsers = analytics.browsers || [];
    const countries = analytics.countries || [];
    const referrers = analytics.referrer_domains || [];
    const operatingSystems = analytics.operating_systems || [];

    // Create a log entry for each view
    viewedAtTimes.forEach((viewedAt: string, index: number) => {
      logs.push({
        id: `${share.id}-${index}`,
        viewedAt,
        deviceType: deviceTypes[index] || 'desktop',
        browser: browsers[index] || 'Unknown',
        country: countries[index] || 'Unknown',
        referrer: referrers[index] || 'Direct',
        os: operatingSystems[index] || '',
      });
    });

    // Sort by most recent first
    logs.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());

    return NextResponse.json({
      success: true,
      logs,
      totalViews: analytics.total_views || logs.length,
    });
  } catch (err) {
    console.error('Error fetching view logs:', err);
    return NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 });
  }
}

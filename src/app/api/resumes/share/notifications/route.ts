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

    // Get user's last_viewed_notifications timestamp from profiles or a dedicated field
    // For now, we'll use localStorage on the client side to track last seen
    // Get all shares for user with their analytics
    const { data: shares, error: sharesError } = await supabase
      .from('resume_shares')
      .select(`
        id,
        share_id,
        resume_id,
        view_count,
        last_viewed_at,
        created_at
      `)
      .eq('user_id', user.id);

    if (sharesError) {
      console.error('Error fetching shares:', sharesError);
      return NextResponse.json({ success: false, error: 'Failed to fetch shares' }, { status: 500 });
    }

    if (!shares || shares.length === 0) {
      return NextResponse.json({
        success: true,
        notifications: [],
        unviewedCount: 0,
        totalViews: 0,
      });
    }

    // Get resume names
    const resumeIds = shares.map(s => s.resume_id);
    const { data: resumes } = await supabase
      .from('resumes')
      .select('id, name, first_name, last_name')
      .in('id', resumeIds);

    const resumeMap = new Map(resumes?.map(r => [r.id, r]) || []);

    // Get analytics for each share
    const shareIds = shares.map(s => s.id);
    const { data: analytics } = await supabase
      .from('share_view_analytics')
      .select('*')
      .in('share_id', shareIds);

    const analyticsMap = new Map(analytics?.map(a => [a.share_id, a]) || []);

    // Build notification list from recent views
    const notifications: Array<{
      id: string;
      shareId: string;
      resumeId: string;
      resumeName: string;
      viewedAt: string;
      deviceType: string;
      country: string;
      browser: string;
      referrer: string;
    }> = [];

    shares.forEach(share => {
      const analytics = analyticsMap.get(share.id);
      const resume = resumeMap.get(share.resume_id);
      const resumeName = resume?.name || `${resume?.first_name || ''} ${resume?.last_name || ''}`.trim() || 'Unknown Resume';

      if (analytics && analytics.viewed_at_times && analytics.viewed_at_times.length > 0) {
        // Create a notification for each view
        analytics.viewed_at_times.forEach((viewedAt: string, index: number) => {
          notifications.push({
            id: `${share.id}-${index}`,
            shareId: share.share_id,
            resumeId: share.resume_id,
            resumeName,
            viewedAt,
            deviceType: analytics.device_types?.[index] || 'unknown',
            country: analytics.countries?.[index] || 'Unknown',
            browser: analytics.browsers?.[index] || 'Unknown',
            referrer: analytics.referrer_domains?.[index] || 'Direct',
          });
        });
      }
    });

    // Sort by most recent first
    notifications.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());

    // Calculate total views
    const totalViews = shares.reduce((sum, s) => sum + (s.view_count || 0), 0);

    return NextResponse.json({
      success: true,
      notifications: notifications.slice(0, 50), // Limit to 50 most recent
      unviewedCount: notifications.length,
      totalViews,
    });
  } catch (err) {
    console.error('Error in notifications API:', err);
    return NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 });
  }
}

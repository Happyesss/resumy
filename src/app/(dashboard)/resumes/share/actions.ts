"use server";

import { createClient } from "@/utils/supabase/server";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

// Type for share
interface Share {
  id: string;
  resume_id: string;
  user_id: string;
  share_id: string;
  is_active: boolean;
  is_public: boolean;
  allow_indexing: boolean;
  view_count: number;
  custom_slug: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  last_viewed_at: string | null;
}

// Generate a short, URL-safe unique ID
function generateShareId(): string {
  return nanoid(10);
}

// Create a new share link for a resume
export async function createShareLink(resumeId: string): Promise<{
  success: boolean;
  share?: Share;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if resume belongs to user
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("id")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .single();

    if (resumeError || !resume) {
      return { success: false, error: "Resume not found" };
    }

    // Check if share already exists
    const { data: existingShare } = await supabase
      .from("resume_shares")
      .select("*")
      .eq("resume_id", resumeId)
      .eq("user_id", user.id)
      .single();

    if (existingShare) {
      return { success: true, share: existingShare };
    }

    // Create new share
    const shareId = generateShareId();
    const { data: newShare, error: insertError } = await supabase
      .from("resume_shares")
      .insert({
        resume_id: resumeId,
        user_id: user.id,
        share_id: shareId,
        is_active: true,
        is_public: true,
        allow_indexing: false,
        view_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating share:", insertError);
      return { success: false, error: "Failed to create share link" };
    }

    revalidatePath("/resumes/share");
    return { success: true, share: newShare };
  } catch (error) {
    console.error("Error in createShareLink:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Toggle share active status
export async function toggleShareStatus(
  shareId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Update share status
    const { error } = await supabase
      .from("resume_shares")
      .update({ is_active: isActive })
      .eq("id", shareId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating share status:", error);
      return { success: false, error: "Failed to update share status" };
    }

    revalidatePath("/resumes/share");
    return { success: true };
  } catch (error) {
    console.error("Error in toggleShareStatus:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Delete a share link
export async function deleteShare(
  shareId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Delete share
    const { error } = await supabase
      .from("resume_shares")
      .delete()
      .eq("id", shareId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting share:", error);
      return { success: false, error: "Failed to delete share" };
    }

    revalidatePath("/resumes/share");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteShare:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Update share settings
export async function updateShareSettings(
  shareId: string,
  settings: {
    custom_slug?: string | null;
    allow_indexing?: boolean;
    expires_at?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Validate custom slug if provided
    if (settings.custom_slug) {
      // Check if slug is already taken
      const { data: existingSlug } = await supabase
        .from("resume_shares")
        .select("id")
        .eq("custom_slug", settings.custom_slug)
        .neq("id", shareId)
        .single();

      if (existingSlug) {
        return { success: false, error: "This custom URL is already taken" };
      }
    }

    // Update share settings
    const { error } = await supabase
      .from("resume_shares")
      .update(settings)
      .eq("id", shareId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating share settings:", error);
      return { success: false, error: "Failed to update settings" };
    }

    revalidatePath("/resumes/share");
    return { success: true };
  } catch (error) {
    console.error("Error in updateShareSettings:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Regenerate share ID
export async function regenerateShareId(
  shareId: string
): Promise<{ success: boolean; newShareId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Generate new share ID
    const newShareId = generateShareId();

    // Update share
    const { error } = await supabase
      .from("resume_shares")
      .update({ share_id: newShareId })
      .eq("id", shareId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error regenerating share ID:", error);
      return { success: false, error: "Failed to regenerate share link" };
    }

    revalidatePath("/resumes/share");
    return { success: true, newShareId };
  } catch (error) {
    console.error("Error in regenerateShareId:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Get share analytics
export async function getShareAnalytics(shareId: string): Promise<{
  success: boolean;
  analytics?: {
    totalViews: number;
    viewsToday: number;
    viewsLast7Days: number;
    viewsLast30Days: number;
    deviceBreakdown: { device_type: string; count: number }[];
    topReferrers: { referrer_domain: string; count: number }[];
    topCountries: { country: string; count: number }[];
    uniqueVisitors: number;
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify share belongs to user
    const { data: share, error: shareError } = await supabase
      .from("resume_shares")
      .select("id, view_count")
      .eq("id", shareId)
      .eq("user_id", user.id)
      .single();

    if (shareError || !share) {
      return { success: false, error: "Share not found" };
    }

    // Get analytics from new consolidated table
    const { data: analytics } = await supabase
      .from("share_view_analytics")
      .select("*")
      .eq("share_id", shareId)
      .single();

    if (!analytics) {
      return {
        success: true,
        analytics: {
          totalViews: share.view_count,
          viewsToday: 0,
          viewsLast7Days: 0,
          viewsLast30Days: 0,
          deviceBreakdown: [],
          topReferrers: [],
          topCountries: [],
          uniqueVisitors: 0,
        },
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate time-based stats from viewed_at_times array
    const viewedAtTimes = analytics.viewed_at_times || [];
    const viewsToday = viewedAtTimes.filter(
      (t: string) => new Date(t) >= today
    ).length;
    const viewsLast7Days = viewedAtTimes.filter(
      (t: string) => new Date(t) >= last7Days
    ).length;
    const viewsLast30Days = viewedAtTimes.filter(
      (t: string) => new Date(t) >= last30Days
    ).length;

    // Device breakdown from device_types array
    const deviceTypes = analytics.device_types || [];
    const deviceCounts = deviceTypes.reduce((acc: Record<string, number>, device: string) => {
      const d = device || "unknown";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device_type, count]) => ({ device_type, count }))
      .sort((a, b) => b.count - a.count);

    // Top referrers from referrer_domains array
    const referrerDomains = analytics.referrer_domains || [];
    const referrerCounts = referrerDomains.reduce((acc: Record<string, number>, ref: string) => {
      const r = ref || "direct";
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer_domain, count]) => ({ referrer_domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top countries from countries array
    const countries = analytics.countries || [];
    const countryCounts = countries.reduce((acc: Record<string, number>, country: string) => {
      const c = country || "Unknown";
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Unique visitors from session_ids array
    const sessionIds = analytics.session_ids || [];
    const uniqueVisitors = new Set(sessionIds).size;

    return {
      success: true,
      analytics: {
        totalViews: share.view_count,
        viewsToday,
        viewsLast7Days,
        viewsLast30Days,
        deviceBreakdown,
        topReferrers,
        topCountries,
        uniqueVisitors,
      },
    };
  } catch (error) {
    console.error("Error in getShareAnalytics:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Get aggregated analytics for all user's shares
export async function getAggregatedAnalytics(): Promise<{
  success: boolean;
  analytics?: {
    deviceBreakdown: { device_type: string; count: number; percentage: number }[];
    topReferrers: { referrer_domain: string; count: number }[];
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get all share IDs for this user
    const { data: shares } = await supabase
      .from("resume_shares")
      .select("id")
      .eq("user_id", user.id);

    if (!shares || shares.length === 0) {
      return {
        success: true,
        analytics: {
          deviceBreakdown: [],
          topReferrers: [],
        },
      };
    }

    const shareIds = shares.map((s) => s.id);

    // Get all analytics for user's shares from new table
    const { data: analyticsData } = await supabase
      .from("share_view_analytics")
      .select("device_types, referrer_domains")
      .in("share_id", shareIds);

    if (!analyticsData || analyticsData.length === 0) {
      return {
        success: true,
        analytics: {
          deviceBreakdown: [],
          topReferrers: [],
        },
      };
    }

    // Flatten all device_types arrays and count
    const allDeviceTypes = analyticsData.flatMap((a) => a.device_types || []);
    const deviceCounts = allDeviceTypes.reduce((acc: Record<string, number>, device: string) => {
      const d = device || "unknown";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDeviceEvents = allDeviceTypes.length;
    
    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device_type, count]) => ({
        device_type,
        count,
        percentage: totalDeviceEvents > 0 ? Math.round((count / totalDeviceEvents) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Flatten all referrer_domains arrays and count
    const allReferrerDomains = analyticsData.flatMap((a) => a.referrer_domains || []);
    const referrerCounts = allReferrerDomains.reduce((acc: Record<string, number>, ref: string) => {
      const r = ref || "direct";
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer_domain, count]) => ({ referrer_domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      success: true,
      analytics: {
        deviceBreakdown,
        topReferrers,
      },
    };
  } catch (error) {
    console.error("Error in getAggregatedAnalytics:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

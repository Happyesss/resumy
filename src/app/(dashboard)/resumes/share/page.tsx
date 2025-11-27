import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShareManagementContent } from "./share-management-content";

export const metadata: Metadata = {
  title: "Share Resumes | Resumy",
  description: "Manage your shared resume links, view analytics, and control who can see your resumes.",
  robots: {
    index: false,
    follow: false,
  },
};

async function getResumesWithShares() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Fetch all resumes
  const { data: resumes, error: resumesError } = await supabase
    .from("resumes")
    .select("id, name, first_name, last_name, target_role, template, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (resumesError) {
    console.error("Error fetching resumes:", resumesError);
    return { resumes: [], shares: [], user, deviceAnalytics: [] };
  }

  // Fetch all shares for this user
  const { data: shares, error: sharesError } = await supabase
    .from("resume_shares")
    .select("*")
    .eq("user_id", user.id);

  if (sharesError) {
    console.error("Error fetching shares:", sharesError);
    return { resumes: resumes || [], shares: [], user, deviceAnalytics: [] };
  }

  // Fetch aggregated device analytics from new analytics table
  let deviceAnalytics: { device_type: string; count: number; percentage: number }[] = [];
  
  if (shares && shares.length > 0) {
    const shareIds = shares.map((s) => s.id);
    
    const { data: analyticsData } = await supabase
      .from("share_view_analytics")
      .select("device_types")
      .in("share_id", shareIds);

    if (analyticsData && analyticsData.length > 0) {
      // Flatten all device_types arrays and count occurrences
      const allDeviceTypes = analyticsData.flatMap((a) => a.device_types || []);
      
      const deviceCounts = allDeviceTypes.reduce((acc, device) => {
        const d = device || "unknown";
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalEvents = allDeviceTypes.length;
      
      deviceAnalytics = Object.entries(deviceCounts)
        .map(([device_type, count]) => ({
          device_type,
          count: count as number,
          percentage: totalEvents > 0 ? Math.round((count as number / totalEvents) * 100) : 0,
        }))
        .sort((a, b) => (b.count as number) - (a.count as number));
    }
  }

  return { resumes: resumes || [], shares: shares || [], user, deviceAnalytics };
}

export default async function ShareManagementPage() {
  const data = await getResumesWithShares();

  if (!data) {
    redirect("/auth/login");
  }

  const { resumes, shares, user, deviceAnalytics } = data;

  return (
    <main className="min-h-screen relative pb-12 bg-black">
      <div className="relative z-10">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <ShareManagementContent 
            resumes={resumes} 
            shares={shares} 
            userId={user.id}
            deviceAnalytics={deviceAnalytics}
          />
        </div>
      </div>
    </main>
  );
}

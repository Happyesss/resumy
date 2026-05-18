import { cacheKey, getCache, setCache, TTL } from "@/lib/redis";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = cacheKey.recentResumes(user.id);
    const cached = await getCache<{ id: string; name: string; target_role: string; created_at: string; is_base_resume: boolean }[]>(key);
    if (cached) return NextResponse.json({ resumes: cached });

    // Get user's most recent resumes
    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("id, name, target_role, created_at, is_base_resume")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching resumes:", error);
      return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
    }

    const result = resumes || [];
    await setCache(key, result, TTL.RECENT_RESUMES);
    return NextResponse.json({ resumes: result });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

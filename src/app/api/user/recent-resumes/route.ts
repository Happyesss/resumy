import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json({ resumes: resumes || [] });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

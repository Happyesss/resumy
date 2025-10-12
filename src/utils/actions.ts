'use server'

import { createClient } from "@/utils/supabase/server";
import { Profile, Resume } from "@/lib/types";

interface DashboardData {
  profile: Profile | null;
  displayName: string | null;
  baseResumes: Resume[];
  tailoredResumes: Resume[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  try {
    // Fetch profile data
    let profile;
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    profile = data;

    // Ensure email is always populated from the authenticated user
    if (profile && !profile.email && user.email) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ email: user.email })
        .eq('user_id', user.id);
      
      if (!updateError) {
        profile.email = user.email;
      }
    }

    // If profile doesn't exist, create one
    if (profileError?.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          first_name: null,
          last_name: null,
          email: user.email,
          phone_number: null,
          location: null,
          website: null,
          linkedin_url: null,
          github_url: null,
          work_experience: [],
          education: [],
          skills: [],
          projects: [],
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        throw new Error('Error creating user profile');
      }

      profile = newProfile;
    } else if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error('Error fetching dashboard data');
    }

    // Add display_name from Supabase user metadata to profile
    const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || null;

    // Fetch resumes data
    const { data: resumes, error: resumesError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id);

    if (resumesError) {
      console.error('Error fetching resumes:', resumesError);
      throw new Error('Error fetching dashboard data');
    }

    const baseResumes = resumes?.filter(resume => resume.is_base_resume) ?? [];
    const tailoredResumes = resumes?.filter(resume => !resume.is_base_resume) ?? [];

    const baseResumesData = baseResumes.map(resume => ({
      ...resume,
      type: 'base' as const
    }));

    const tailoredResumesData = tailoredResumes.map(resume => ({
      ...resume,
      type: 'tailored' as const
    }));

    return {
      profile,
      displayName,
      baseResumes: baseResumesData,
      tailoredResumes: tailoredResumesData
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'User not authenticated') {
      return {
        profile: null,
        displayName: null,
        baseResumes: [],
        tailoredResumes: []
      };
    }
    throw error;
  }
}





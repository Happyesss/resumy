'use server'

import { createClient } from "@/utils/supabase/server";
import { Profile, Resume, WorkExperience, Education, Skill, Project } from "@/lib/types";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { simplifiedResumeSchema } from "@/lib/zod-schemas";
import { AIConfig } from "@/utils/ai-tools";
import { generateObject } from "ai";
import { initializeAIClient } from "@/utils/ai-tools";
import { resumeScoreSchema } from "@/lib/zod-schemas";
import { RESUME_LIMIT } from "@/lib/constants";


//  SUPABASE ACTIONS
export async function getResumeById(resumeId: string): Promise<{ resume: Resume; profile: Profile } | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  try {
    const [resumeResult, profileResult] = await Promise.all([
      supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ]);

    if (resumeResult.error || !resumeResult.data) {
      return null;
    }

    if (profileResult.error || !profileResult.data) {
      return null;
    }

    return { 
      resume: resumeResult.data, 
      profile: profileResult.data 
    };
  } catch (error) {
    return null;
  }
}

export async function updateResume(resumeId: string, data: Partial<Resume>): Promise<Resume> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  const { data: resume, error: updateError } = await supabase
    .from('resumes')
    .update(data)
    .eq('id', resumeId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    throw new Error('Failed to update resume');
  }

  return resume;
}

export async function deleteResume(resumeId: string): Promise<void> {
    const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('id, name, job_id, is_base_resume')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !resume) {
      throw new Error('Resume not found or access denied');
    }

    if (!resume.is_base_resume && resume.job_id) {
      // Check if there are other resumes referencing this job
      const { data: otherResumes, error: countError } = await supabase
        .from('resumes')
        .select('id')
        .eq('job_id', resume.job_id)
        .neq('id', resumeId); // Exclude the resume being deleted

      if (countError) {
        console.error('Failed to check for other resumes:', countError);
      } else if (!otherResumes || otherResumes.length === 0) {
        // Only delete the job if no other resumes reference it
        const { error: jobDeleteError } = await supabase
          .from('jobs')
          .delete()
          .eq('id', resume.job_id)
          .eq('user_id', user.id);

        if (jobDeleteError) {
          console.error('Failed to delete associated job:', jobDeleteError);
        }
      }
    }

    const { error: deleteError } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId)
      .eq('user_id', user.id);

    if (deleteError) {
      throw new Error('Failed to delete resume');
    }

    revalidatePath('/', 'layout');
    revalidatePath('/resumes', 'layout');
    revalidatePath('/dashboard', 'layout');
    revalidatePath('/resumes/base', 'layout');
    revalidatePath('/resumes/tailored', 'layout');
    revalidatePath('/jobs', 'layout');

  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to delete resume');
  }
}

export async function createBaseResume(
  name: string, 
  importOption: 'import-profile' | 'fresh' | 'import-resume' = 'import-profile',
  selectedContent?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    location?: string;
    website?: string;
    linkedin_url?: string;
    github_url?: string;
    work_experience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
  }
): Promise<Resume> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  // Check resume limit
  const totalResumesCount = await countResumes('all');
  
  if (totalResumesCount >= RESUME_LIMIT) {
    throw new Error(`You have reached the maximum limit of ${RESUME_LIMIT} resumes. Please delete an existing resume to create a new one.`);
  }

  let profile = null;
  if (importOption !== 'fresh') {
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }
    profile = data;
  }

  const newResume: Partial<Resume> = {
    user_id: user.id,
    name,
    target_role: name,
    is_base_resume: true,
  professional_summary: '',
    first_name: importOption === 'import-resume' ? selectedContent?.first_name || '' : importOption === 'fresh' ? '' : profile?.first_name || '',
    last_name: importOption === 'import-resume' ? selectedContent?.last_name || '' : importOption === 'fresh' ? '' : profile?.last_name || '',
    email: importOption === 'import-resume' ? selectedContent?.email || '' : importOption === 'fresh' ? '' : profile?.email || '',
    phone_number: importOption === 'import-resume' ? selectedContent?.phone_number || '' : importOption === 'fresh' ? '' : profile?.phone_number || '',
    location: importOption === 'import-resume' ? selectedContent?.location || '' : importOption === 'fresh' ? '' : profile?.location || '',
    website: importOption === 'import-resume' ? selectedContent?.website || '' : importOption === 'fresh' ? '' : profile?.website || '',
    linkedin_url: importOption === 'import-resume' ? selectedContent?.linkedin_url || '' : importOption === 'fresh' ? '' : profile?.linkedin_url || '',
    github_url: importOption === 'import-resume' ? selectedContent?.github_url || '' : importOption === 'fresh' ? '' : profile?.github_url || '',
    work_experience: (importOption === 'import-profile' || importOption === 'import-resume') && selectedContent 
      ? selectedContent.work_experience
      : [],
    education: (importOption === 'import-profile' || importOption === 'import-resume') && selectedContent
      ? selectedContent.education
      : [],
    skills: (importOption === 'import-profile' || importOption === 'import-resume') && selectedContent
      ? selectedContent.skills
      : [],
    projects: (importOption === 'import-profile' || importOption === 'import-resume') && selectedContent
      ? selectedContent.projects
      : [],
    section_order: [
      'professional_summary',
      'work_experience',
      'education',
      'skills',
      'projects',
    ],
    section_configs: {
      work_experience: { visible: (selectedContent?.work_experience?.length ?? 0) > 0 },
      education: { visible: (selectedContent?.education?.length ?? 0) > 0 },
      skills: { visible: (selectedContent?.skills?.length ?? 0) > 0 },
      projects: { visible: (selectedContent?.projects?.length ?? 0) > 0 },
    }
  };

  const { data: resume, error: createError } = await supabase
    .from('resumes')
    .insert([newResume])
    .select()
    .single();

  if (createError) {
    console.error('\nDatabase Insert Error:', {
      code: createError.code,
      message: createError.message,
      details: createError.details,
      hint: createError.hint
    });
    throw new Error(`Failed to create resume: ${createError.message}`);
  }

  if (!resume) {
    console.error('\nNo resume data returned after insert');
    throw new Error('Resume creation failed: No data returned');
  }

  return resume;
}

export async function createTailoredResume(
  baseResume: Resume,
  jobId: string | null,
  jobTitle: string,
  companyName: string,
  tailoredContent: z.infer<typeof simplifiedResumeSchema>
) {
  console.log('[createTailoredResume] Received jobId:', jobId);
  console.log('[createTailoredResume] baseResume ID:', baseResume?.id);
  console.log('[createTailoredResume] Is jobId valid UUID?:', /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(jobId || ''));

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Check resume limit
  const totalResumesCount = await countResumes('all');
  
  if (totalResumesCount >= RESUME_LIMIT) {
    throw new Error(`You have reached the maximum limit of ${RESUME_LIMIT} resumes. Please delete an existing resume to create a new one.`);
  }

  // Extract the ID from base resume to prevent duplicate ID error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _baseId, ...baseResumeWithoutId } = baseResume;

  // Ensure all properties of tailoredContent are properly initialized
  const normalizedTailoredContent = {
    ...tailoredContent,
    work_experience: (tailoredContent.work_experience || []).map(exp => ({
      company: exp.company || '',
      position: exp.position || '',
      location: exp.location || '',
      date: exp.date || '',
      description: Array.isArray(exp.description) ? exp.description.map(desc => desc || '') : [],
      technologies: Array.isArray(exp.technologies) ? exp.technologies : []
    })),
    education: (tailoredContent.education || []),
    skills: (tailoredContent.skills || []),
    projects: (tailoredContent.projects || []),
  };

  const newResume = {
    // Start with all fields from base resume (except ID) to ensure nothing is lost
    ...baseResumeWithoutId,
    // Override with normalized fields from tailored content
    ...normalizedTailoredContent,
    // Ensure required fields are set correctly
    user_id: user.id,
    job_id: jobId,
    is_base_resume: false,
    // Override with fields from base resume that should be preserved
    first_name: tailoredContent.first_name || baseResume.first_name,
    last_name: tailoredContent.last_name || baseResume.last_name,
    email: tailoredContent.email || baseResume.email,
    phone_number: tailoredContent.phone_number || baseResume.phone_number,
    location: tailoredContent.location || baseResume.location,
    website: tailoredContent.website || baseResume.website,
    linkedin_url: tailoredContent.linkedin_url || baseResume.linkedin_url,
    github_url: tailoredContent.github_url || baseResume.github_url,
    // Ensure section configurations are preserved
    section_configs: baseResume.section_configs,
    section_order: baseResume.section_order,
    // Ensure work experience is properly transferred
    work_experience: tailoredContent.work_experience?.map(exp => ({
      ...exp,
      description: exp.description || []
    })) || baseResume.work_experience || [],
    // Ensure other sections are properly transferred
    education: tailoredContent.education || baseResume.education || [],
    skills: tailoredContent.skills || baseResume.skills || [],
    projects: tailoredContent.projects || baseResume.projects || [],
    // Set the resume title/name
    resume_title: `${jobTitle} at ${companyName}`,
    name: `${jobTitle} at ${companyName}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('resumes')
    .insert([newResume])
    .select()
    .single();

  if (error) {
    console.error('Error creating tailored resume:', error);
    
    // Provide more specific error messages based on error codes
    if (error.code === '23505') {
      throw new Error('A resume with this information already exists. Please try again with different details.');
    } else if (error.code === '23503') {
      throw new Error('Referenced job or user does not exist. Please check your job information.');
    } else {
      throw error;
    }
  }
  
  return data;
}

export async function copyResume(resumeId: string): Promise<Resume> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  // Check resume limit
  const totalResumesCount = await countResumes('all');
  
  if (totalResumesCount >= RESUME_LIMIT) {
    throw new Error(`You have reached the maximum limit of ${RESUME_LIMIT} resumes. Please delete an existing resume to create a new one.`);
  }

  const { data: sourceResume, error: fetchError } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !sourceResume) {
    throw new Error('Resume not found or access denied');
  }

  // Exclude auto-generated fields that shouldn't be copied
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at: _created_at, updated_at: _updated_at, ...resumeDataToCopy } = sourceResume;

  let newJobId = null;

  // If this is a tailored resume with a job, create a copy of the job as well
  if (!sourceResume.is_base_resume && sourceResume.job_id) {
    const { data: sourceJob, error: jobFetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', sourceResume.job_id)
      .eq('user_id', user.id)
      .single();

    if (!jobFetchError && sourceJob) {
      // Create a copy of the job
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _jobId, created_at: _jobCreated, updated_at: _jobUpdated, ...jobDataToCopy } = sourceJob;
      
      const { data: newJob, error: jobCreateError } = await supabase
        .from('jobs')
        .insert([{
          ...jobDataToCopy,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (!jobCreateError && newJob) {
        newJobId = newJob.id;
      }
    }
  }

  const newResume = {
    ...resumeDataToCopy,
    name: `${sourceResume.name} (Copy)`,
    job_id: newJobId, // Use the new job ID if we created one, otherwise null
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: copiedResume, error: createError } = await supabase
    .from('resumes')
    .insert([newResume])
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to copy resume: ${createError.message}`);
  }

  if (!copiedResume) {
    throw new Error('Resume creation failed: No data returned');
  }

  revalidatePath('/', 'layout');
  revalidatePath('/resumes', 'layout');
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/resumes/base', 'layout');
  revalidatePath('/resumes/tailored', 'layout');

  return copiedResume;
}

export async function countResumes(type: 'base' | 'tailored' | 'all'): Promise<number> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (type !== 'all') {
    query = query.eq('is_base_resume', type === 'base');
  }

  const { count, error: countError } = await query;

  if (countError) {
    throw new Error('Failed to count resumes');
  }

  return count || 0;
}


export async function generateResumeScore(
  resume: Resume, 
  config?: AIConfig
) {
  try {
    const aiClient = initializeAIClient(config);
    console.log("RESUME IS", resume);

    const { object } = await generateObject({
      model: aiClient,
      schema: resumeScoreSchema,
      prompt: `
      You are a professional resume reviewer. Analyze this resume and provide a comprehensive score breakdown.

      Resume to analyze: ${JSON.stringify(resume)}

      Please provide scores for:
      
      1. Overall Score (0-100): A holistic assessment
      2. Completeness: 
         - Contact Information: Check if email, phone_number, location are present and filled. Award full points (100) if email, phone_number, and location all have values. Deduct 10-15 points for each missing field.
         - Detail Level: Assess if work experience, skills, and education have sufficient detail
      3. Impact Score:
         - Active Voice Usage: Look for action verbs and active voice
         - Quantified Achievements: Check for numbers, percentages, and measurable results
      4. Role Match:
         - Skills Relevance: How relevant are the listed skills
         - Experience Alignment: How well does experience match typical job requirements
         - Education Fit: How appropriate is the education level
      5. Miscellaneous: Provide exactly 3 additional metrics such as:
         - keywordOptimization: Use of industry keywords
         - formatting: Visual appeal and structure
         - lengthAppropriate: Appropriate length for experience level

      Each score should be 0-100 with a clear reason explaining the rating.
      Provide 3-5 overall improvement suggestions.
      
      Be specific and constructive in your feedback.
      
      IMPORTANT: Make sure to include the miscellaneous section with exactly 3 metrics in the following format:
      "miscellaneous": {
        "keywordOptimization": {
          "score": 85,
          "reason": "Good use of industry keywords but could add more variation"
        },
        "formatting": {
          "score": 90,
          "reason": "Clean layout and professional appearance"
        },
        "lengthAppropriate": {
          "score": 75,
          "reason": "Good length for experience level but could be more concise"
        }
      }
      `
    });

    console.log("THE OUTPUTTED object", object);
    
    // Validate the response has required fields
    if (!object.overallScore || !object.completeness || !object.impactScore || !object.roleMatch) {
      throw new Error('Invalid AI response: missing required score fields');
    }
    
    return object;
  } catch (error) {
    console.error('Error SCORING resume:', error);
    throw error;
  }
}

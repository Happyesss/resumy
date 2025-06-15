'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { simplifiedJobSchema } from "@/lib/zod-schemas";
import type { Job } from "@/lib/types";
import { z } from "zod";
import { JobListingParams } from "./schema";

// Temporary mapper to handle database column name differences
function mapDbJobToJob(dbJob: any): Job {
  return {
    id: dbJob.id,
    user_id: dbJob.user_id,
    company_name: dbJob.company_name || dbJob.company || '',
    position_title: dbJob.position_title || dbJob.title || '',
    job_url: dbJob.job_url,
    description: dbJob.description,
    location: dbJob.location,
    salary_range: dbJob.salary_range,
    keywords: dbJob.keywords || [],
    work_location: dbJob.work_location,
    employment_type: dbJob.employment_type,
    created_at: dbJob.created_at,
    updated_at: dbJob.updated_at,
    is_active: dbJob.is_active !== undefined ? dbJob.is_active : true
  };
}

export async function createJob(jobListing: z.infer<typeof simplifiedJobSchema>) {
  
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const jobData = {
    user_id: user.id,
    // Map new field names to existing database columns temporarily
    company: jobListing.company_name,
    title: jobListing.position_title,
    job_url: jobListing.job_url,
    description: jobListing.description,
    // These fields will be ignored if they don't exist in the database
    ...(jobListing.location && { location: jobListing.location }),
    ...(jobListing.salary_range && { salary_range: jobListing.salary_range }),
    ...(jobListing.keywords && { keywords: jobListing.keywords }),
    ...(jobListing.work_location && { work_location: jobListing.work_location }),
    ...(jobListing.employment_type && { employment_type: jobListing.employment_type })
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()
    .single();

  if (error) {
    console.error('[createJob] Error creating job:', error);
    throw error;
  }
  
  return mapDbJobToJob(data);
}

export async function deleteJob(jobId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  // First, get all resumes that reference this job
  const { data: affectedResumes } = await supabase
    .from('resumes')
    .select('id')
    .eq('job_id', jobId);

  // Delete the job
  const { error: deleteError } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (deleteError) {
    console.error('Delete error:', deleteError);
    throw new Error('Failed to delete job');
  }

  // Revalidate all affected resume paths
  affectedResumes?.forEach(resume => {
    revalidatePath(`/resumes/${resume.id}`);
  });
  
  // Also revalidate the general paths
  revalidatePath('/', 'layout');
  revalidatePath('/resumes', 'layout');
}


export async function getJobListings({ 
  page = 1, 
  pageSize = 10, 
  filters 
}: JobListingParams) {
  const supabase = await createClient();

  // Calculate offset
  const offset = (page - 1) * pageSize;

  // Start building the query
  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters if they exist (only for columns that exist in the database)
  if (filters) {
    // Skip these filters if the columns don't exist yet
    try {
      if (filters.workLocation) {
        query = query.eq('work_location', filters.workLocation);
      }
      if (filters.employmentType) {
        query = query.eq('employment_type', filters.employmentType);
      }
      if (filters.keywords && filters.keywords.length > 0) {
        query = query.contains('keywords', filters.keywords);
      }
    } catch (error) {
      console.log('Some filter columns may not exist yet, skipping advanced filters');
    }
  }

  // Add pagination
  const { data: jobs, error, count } = await query
    .range(offset, offset + pageSize - 1);

  if (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch job listings');
  }

  return {
    jobs: jobs?.map(mapDbJobToJob) || [],
    totalCount: count ?? 0,
    currentPage: page,
    totalPages: Math.ceil((count ?? 0) / pageSize)
  };
}

export async function deleteTailoredJob(jobId: string): Promise<void> {
  const supabase = await createClient();

  // Just delete the job instead of marking as inactive since is_active column might not exist
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (error) {
    throw new Error('Failed to delete job');
  }

  revalidatePath('/', 'layout');
}

export async function createEmptyJob(): Promise<Job> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const emptyJob = {
    user_id: user.id,
    // Use database column names
    company: 'New Company',
    title: 'New Position',
    job_url: null,
    description: null
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert([emptyJob])
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job');
  }

  revalidatePath('/', 'layout');
  return mapDbJobToJob(data);
}
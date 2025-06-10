// This file contains functions for managing profile data in Supabase

import { supabase } from './supabase';
import { Database } from '../types/database';

// Interfaces for the profile sections
export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl?: string;
}

// Helper function to get the database user ID from auth user ID
const getDatabaseUserId = async (authUserId: string): Promise<string> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', authUserId)
    .single();
    
  if (error) throw error;
  if (!user) throw new Error('User not found in database');
  
  return user.id;
};

// Generic function to fetch profile sections
export const fetchProfileSections = async <T>(authUserId: string, sectionType: string): Promise<T[]> => {
  try {
    // Get the database user ID
    const userId = await getDatabaseUserId(authUserId);
    
    // First, check if the user has any resumes
    const { data: resumes, error: resumeError } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (resumeError) throw resumeError;
    
    // If no resume exists, create one
    let resumeId: string;
    if (resumes && resumes.length > 0) {
      resumeId = resumes[0].id;
    } else {
      const { data: newResume, error: createError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          title: 'Main Resume',
          is_public: false,
          view_count: 0,
          download_count: 0
        })
        .select('id')
        .single();
        
      if (createError) throw createError;
      if (!newResume) throw new Error('Failed to create resume');
      
      resumeId = newResume.id;
    }
    
    // Fetch the section data using limit(1) instead of single()
    const { data, error } = await supabase
      .from('resume_sections')
      .select('content')
      .eq('resume_id', resumeId)
      .eq('section_type', sectionType)
      .limit(1);
      
    if (error) throw error;
    
    // Check if data array is empty or null
    if (!data || data.length === 0) {
      return [] as T[];
    }
    
    return data[0].content || [] as T[];
  } catch (error) {
    console.error(`Error fetching ${sectionType}:`, error);
    return [] as T[];
  }
};

// Generic function to update profile sections
export const updateProfileSection = async <T>(
  authUserId: string, 
  sectionType: string,
  content: T[]
): Promise<void> => {
  try {
    // Get the database user ID
    const userId = await getDatabaseUserId(authUserId);
    
    // First, get the user's resume id
    const { data: resumes, error: resumeError } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
      
    if (resumeError) throw resumeError;
    
    // If no resume exists, create one
    let resumeId: string;
    if (resumes && resumes.length > 0) {
      resumeId = resumes[0].id;
    } else {
      const { data: newResume, error: createError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          title: 'Main Resume',
          is_public: false,
          view_count: 0,
          download_count: 0
        })
        .select('id')
        .single();
        
      if (createError) throw createError;
      if (!newResume) throw new Error('Failed to create resume');
      
      resumeId = newResume.id;
    }
    
    // Check if section exists using limit(1) instead of single()
    const { data: existingSections, error: checkError } = await supabase
      .from('resume_sections')
      .select('id')
      .eq('resume_id', resumeId)
      .eq('section_type', sectionType)
      .limit(1);
      
    if (checkError) throw checkError;
    
    // If section already exists, update it
    if (existingSections && existingSections.length > 0) {
      const { error: updateError } = await supabase
        .from('resume_sections')
        .update({ content })
        .eq('id', existingSections[0].id);
        
      if (updateError) throw updateError;
    } else {
      // Otherwise, create a new section
      const { error: insertError } = await supabase
        .from('resume_sections')
        .insert({
          resume_id: resumeId,
          section_type: sectionType,
          content,
          display_order: 0,
          is_visible: true
        });
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error(`Error updating ${sectionType}:`, error);
    throw error;
  }
};

// Helper functions for specific section types
export const fetchWorkExperience = async (authUserId: string): Promise<WorkExperience[]> => {
  return fetchProfileSections<WorkExperience>(authUserId, 'work_experience');
};

export const updateWorkExperience = async (authUserId: string, workExperience: WorkExperience[]): Promise<void> => {
  return updateProfileSection<WorkExperience>(authUserId, 'work_experience', workExperience);
};

export const fetchEducation = async (authUserId: string): Promise<Education[]> => {
  return fetchProfileSections<Education>(authUserId, 'education');
};

export const updateEducation = async (authUserId: string, education: Education[]): Promise<void> => {
  return updateProfileSection<Education>(authUserId, 'education', education);
};

export const fetchSkills = async (authUserId: string): Promise<Skill[]> => {
  return fetchProfileSections<Skill>(authUserId, 'skills');
};

export const updateSkills = async (authUserId: string, skills: Skill[]): Promise<void> => {
  return updateProfileSection<Skill>(authUserId, 'skills', skills);
};

export const fetchProjects = async (authUserId: string): Promise<Project[]> => {
  return fetchProfileSections<Project>(authUserId, 'projects');
};

export const updateProjects = async (authUserId: string, projects: Project[]): Promise<void> => {
  return updateProfileSection<Project>(authUserId, 'projects', projects);
};
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database } from '../types/database';

type Resume = Database['public']['Tables']['resumes']['Row'];
type ResumeInsert = Database['public']['Tables']['resumes']['Insert'];
type ResumeUpdate = Database['public']['Tables']['resumes']['Update'];

export const useResumes = () => {
  const { profile, user, isLoading: authLoading } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = async () => {
    // Don't fetch if we don't have a user or if auth is still loading
    if (!user || authLoading) {
      setResumes([]);
      setIsLoading(false);
      return;
    }

    // If we have a user but no profile, we can still try to fetch resumes
    // using the user's auth ID directly
    if (!profile) {
      console.log('No profile found, but user exists. Attempting to fetch resumes...');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('resumes')
        .select('*')
        .order('last_modified', { ascending: false });

      // If we have a profile, use the profile ID
      if (profile) {
        query = query.eq('user_id', profile.id);
      } else {
        // If no profile but we have a user, try to find resumes by looking up the user
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();
        
        if (userData) {
          query = query.eq('user_id', userData.id);
        } else {
          // No user profile found, return empty array
          setResumes([]);
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setResumes(data || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch resumes');
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async (resumeData: Omit<ResumeInsert, 'user_id'>) => {
    if (!profile) throw new Error('No user profile found');

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        ...resumeData,
        user_id: profile.id
      })
      .select()
      .single();

    if (error) throw error;
    
    setResumes(prev => [data, ...prev]);
    return data;
  };

  const updateResume = async (id: string, updates: ResumeUpdate) => {
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setResumes(prev => prev.map(resume => 
      resume.id === id ? data : resume
    ));
    return data;
  };

  const deleteResume = async (id: string) => {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setResumes(prev => prev.filter(resume => resume.id !== id));
  };

  const duplicateResume = async (id: string) => {
    const originalResume = resumes.find(r => r.id === id);
    if (!originalResume) throw new Error('Resume not found');

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: originalResume.user_id,
        title: `${originalResume.title} (Copy)`,
        template_id: originalResume.template_id,
        content: originalResume.content
      })
      .select()
      .single();

    if (error) throw error;

    setResumes(prev => [data, ...prev]);
    return data;
  };

  const incrementViewCount = async (id: string) => {
    const { error } = await supabase.rpc('increment_view_count', { resume_id: id });
    if (error) console.error('Failed to increment view count:', error);
  };

  const incrementDownloadCount = async (id: string) => {
    const { error } = await supabase.rpc('increment_download_count', { resume_id: id });
    if (error) console.error('Failed to increment download count:', error);
  };

  useEffect(() => {
    // Only fetch when auth is not loading
    if (!authLoading) {
      fetchResumes();
    }
  }, [profile, user, authLoading]);

  return {
    resumes,
    isLoading,
    error,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    incrementViewCount,
    incrementDownloadCount,
    refetch: fetchResumes
  };
};
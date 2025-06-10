import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type ResumeShare = Database['public']['Tables']['resume_shares']['Row'];

export const useResumeSharing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createShareLink = async (resumeId: string, expiresInDays?: number) => {
    try {
      setIsLoading(true);
      
      const expiresAt = expiresInDays 
        ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase
        .from('resume_shares')
        .insert({
          resume_id: resumeId,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/shared/${data.share_token}`;
      return { ...data, shareUrl };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create share link');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSharedResume = async (shareToken: string) => {
    try {
      setIsLoading(true);

      // Get share record and increment view count
      const { data: shareData, error: shareError } = await supabase
        .from('resume_shares')
        .select(`
          *,
          resumes (
            *,
            resume_sections (*)
          )
        `)
        .eq('share_token', shareToken)
        .eq('is_active', true)
        .single();

      if (shareError) throw shareError;

      // Check if expired
      if (shareData.expires_at && new Date(shareData.expires_at) < new Date()) {
        throw new Error('This share link has expired');
      }

      // Increment view count
      await supabase
        .from('resume_shares')
        .update({ view_count: supabase.sql`view_count + 1` })
        .eq('id', shareData.id);

      return shareData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shared resume');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getResumeShares = async (resumeId: string) => {
    try {
      const { data, error } = await supabase
        .from('resume_shares')
        .select('*')
        .eq('resume_id', resumeId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch share links');
      throw err;
    }
  };

  const deactivateShareLink = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from('resume_shares')
        .update({ is_active: false })
        .eq('id', shareId);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate share link');
      throw err;
    }
  };

  return {
    isLoading,
    error,
    createShareLink,
    getSharedResume,
    getResumeShares,
    deactivateShareLink
  };
};
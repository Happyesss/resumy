import { useState, useEffect, useCallback } from 'react';
import { supabase, subscribeToResumeChanges } from '../lib/supabase';
import { Database } from '../types/database';

type Resume = Database['public']['Tables']['resumes']['Row'];
type ResumeSection = Database['public']['Tables']['resume_sections']['Row'];

export const useResumeEditor = (resumeId: string) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-save functionality
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchResumeData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch resume
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (resumeError) throw resumeError;
      setResume(resumeData);

      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('resume_sections')
        .select('*')
        .eq('resume_id', resumeId)
        .order('display_order');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resume data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = async (updates: Partial<Resume>) => {
    if (!resume) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', resumeId);

      if (error) throw error;

      setResume(prev => prev ? { ...prev, ...updates } : null);
      setLastSaved(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const saveSection = async (sectionId: string, content: any) => {
    try {
      const { error } = await supabase
        .from('resume_sections')
        .update({ content })
        .eq('id', sectionId);

      if (error) throw error;

      setSections(prev => prev.map(section =>
        section.id === sectionId ? { ...section, content } : section
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    }
  };

  const createSection = async (sectionType: ResumeSection['section_type'], content: any = {}) => {
    try {
      const maxOrder = Math.max(...sections.map(s => s.display_order), -1);
      
      const { data, error } = await supabase
        .from('resume_sections')
        .insert({
          resume_id: resumeId,
          section_type: sectionType,
          content,
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;

      setSections(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create section');
      throw err;
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('resume_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      setSections(prev => prev.filter(section => section.id !== sectionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete section');
    }
  };

  const reorderSections = async (newOrder: string[]) => {
    try {
      const updates = newOrder.map((sectionId, index) => ({
        id: sectionId,
        display_order: index
      }));

      for (const update of updates) {
        await supabase
          .from('resume_sections')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setSections(prev => {
        const reordered = [...prev];
        reordered.sort((a, b) => {
          const aIndex = newOrder.indexOf(a.id);
          const bIndex = newOrder.indexOf(b.id);
          return aIndex - bIndex;
        });
        return reordered.map((section, index) => ({
          ...section,
          display_order: index
        }));
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder sections');
    }
  };

  // Auto-save with debouncing
  const scheduleAutoSave = useCallback((updates: Partial<Resume>) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      saveResume(updates);
    }, 2000); // Auto-save after 2 seconds of inactivity

    setAutoSaveTimeout(timeout);
  }, [autoSaveTimeout]);

  const updateResumeContent = (updates: Partial<Resume>) => {
    if (!resume) return;
    
    setResume(prev => prev ? { ...prev, ...updates } : null);
    scheduleAutoSave(updates);
  };

  const updateSectionContent = (sectionId: string, content: any) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId ? { ...section, content } : section
    ));

    // Auto-save section after delay
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      saveSection(sectionId, content);
    }, 1000);

    setAutoSaveTimeout(timeout);
  };

  useEffect(() => {
    fetchResumeData();

    // Set up real-time subscription
    const subscription = subscribeToResumeChanges(resumeId, (payload) => {
      console.log('Real-time update:', payload);
      // Handle real-time updates here
      fetchResumeData();
    });

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      subscription.unsubscribe();
    };
  }, [resumeId]);

  return {
    resume,
    sections,
    isLoading,
    isSaving,
    lastSaved,
    error,
    updateResumeContent,
    updateSectionContent,
    saveResume,
    createSection,
    deleteSection,
    reorderSections,
    refetch: fetchResumeData
  };
};
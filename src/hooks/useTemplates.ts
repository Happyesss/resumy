import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Template = Database['public']['Tables']['templates']['Row'];

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_active', true)
        .order('download_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplateById = async (id: string) => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  const incrementTemplateDownload = async (id: string) => {
    const { error } = await supabase.rpc('increment_template_download', { template_id: id });
    if (error) console.error('Failed to increment template download count:', error);
  };

  const getTemplatesByCategory = (category?: string) => {
    if (!category || category === 'all') return templates;
    return templates.filter(template => template.category === category);
  };

  const getFeaturedTemplates = () => {
    return templates
      .filter(template => template.download_count > 5000)
      .slice(0, 6);
  };

  const getPremiumTemplates = () => {
    return templates.filter(template => template.is_premium);
  };

  const getFreeTemplates = () => {
    return templates.filter(template => !template.is_premium);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    error,
    getTemplateById,
    incrementTemplateDownload,
    getTemplatesByCategory,
    getFeaturedTemplates,
    getPremiumTemplates,
    getFreeTemplates,
    refetch: fetchTemplates
  };
};
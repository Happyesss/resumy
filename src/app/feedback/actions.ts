'use server';

import {
    Feedback,
    FeedbackFormData, FeedbackPriority, FeedbackStatus, FeedbackSubmitResponse, FeedbackType
} from '@/lib/feedback-types';
import { createClient, createServiceClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const FEEDBACK_BUCKET = 'feedback-screenshots';

/**
 * Upload a screenshot to Supabase Storage
 */
export async function uploadFeedbackScreenshot(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only PNG, JPG, GIF, and WebP are allowed.' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 5MB.' };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'png';
    const fileName = `feedback_${timestamp}_${randomString}.${extension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(FEEDBACK_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Failed to upload file' };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(FEEDBACK_BUCKET)
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload screenshot error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Submit feedback/bug report
 */
export async function submitFeedback(
  data: FeedbackFormData,
  screenshotUrl?: string | null
): Promise<FeedbackSubmitResponse> {
  try {
    const supabase = await createClient();
    
    // Get current user (optional - allow anonymous feedback)
    const { data: { user } } = await supabase.auth.getUser();

    // Prepare feedback data
    const feedbackData = {
      user_id: user?.id || null,
      user_email: user?.email || null,
      type: data.type,
      priority: data.priority,
      title: data.title,
      description: data.description,
      screenshot_url: screenshotUrl || null,
      status: 'pending' as FeedbackStatus,
    };

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert(feedbackData)
      .select('id')
      .single();

    if (error) {
      console.error('Submit feedback error:', error);
      return { success: false, message: 'Failed to submit feedback. Please try again.' };
    }

    return { 
      success: true, 
      message: 'Thank you for your feedback! We appreciate your input.',
      feedback_id: feedback.id
    };
  } catch (error) {
    console.error('Submit feedback error:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Get all feedback (admin only)
 */
export async function getAllFeedback(filters?: {
  type?: FeedbackType;
  status?: FeedbackStatus;
  priority?: FeedbackPriority;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Feedback[]; total: number; error?: string }> {
  try {
    const supabase = await createServiceClient();
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('feedback')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Order by created_at desc and apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error('Get feedback error:', error);
      return { data: [], total: 0, error: 'Failed to fetch feedback' };
    }

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error('Get feedback error:', error);
    return { data: [], total: 0, error: 'An unexpected error occurred' };
  }
}

/**
 * Update feedback status (admin only)
 */
export async function updateFeedbackStatus(
  feedbackId: string,
  status: FeedbackStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    const { error } = await supabase
      .from('feedback')
      .update({ status })
      .eq('id', feedbackId);

    if (error) {
      console.error('Update feedback error:', error);
      return { success: false, error: 'Failed to update feedback' };
    }

    revalidatePath('/admin/feedback');
    return { success: true };
  } catch (error) {
    console.error('Update feedback error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete feedback (admin only)
 */
export async function deleteFeedback(
  feedbackId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServiceClient();

    // First, get the feedback to check for screenshot
    const { data: feedback } = await supabase
      .from('feedback')
      .select('screenshot_url')
      .eq('id', feedbackId)
      .single();

    // Delete screenshot from storage if exists
    if (feedback?.screenshot_url) {
      const fileName = feedback.screenshot_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from(FEEDBACK_BUCKET)
          .remove([fileName]);
      }
    }

    // Delete the feedback record
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', feedbackId);

    if (error) {
      console.error('Delete feedback error:', error);
      return { success: false, error: 'Failed to delete feedback' };
    }

    revalidatePath('/admin/feedback');
    return { success: true };
  } catch (error) {
    console.error('Delete feedback error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get feedback statistics (admin only)
 */
export async function getFeedbackStats(): Promise<{
  total: number;
  pending: number;
  in_review: number;
  in_progress: number;
  resolved: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
}> {
  try {
    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from('feedback')
      .select('status, type, priority');

    if (error) {
      console.error('Get feedback stats error:', error);
      return {
        total: 0,
        pending: 0,
        in_review: 0,
        in_progress: 0,
        resolved: 0,
        by_type: {},
        by_priority: {},
      };
    }

    const stats = {
      total: data.length,
      pending: data.filter(f => f.status === 'pending').length,
      in_review: data.filter(f => f.status === 'in_review').length,
      in_progress: data.filter(f => f.status === 'in_progress').length,
      resolved: data.filter(f => f.status === 'resolved').length,
      by_type: {} as Record<string, number>,
      by_priority: {} as Record<string, number>,
    };

    // Count by type
    data.forEach(f => {
      stats.by_type[f.type] = (stats.by_type[f.type] || 0) + 1;
      stats.by_priority[f.priority] = (stats.by_priority[f.priority] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Get feedback stats error:', error);
    return {
      total: 0,
      pending: 0,
      in_review: 0,
      in_progress: 0,
      resolved: 0,
      by_type: {},
      by_priority: {},
    };
  }
}

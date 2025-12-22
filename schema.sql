-- Resumy Database Schema
-- This file contains all the SQL statements needed to set up the Resumy database schema
-- Run this against your PostgreSQL database to create all required tables

-- First, ensure the UUID extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  position_title text NOT NULL,
  company_name text NULL,
  description text NULL,
  job_url text NULL,
  location text NULL,
  salary_range text NULL,
  keywords jsonb NULL DEFAULT '[]'::jsonb,
  work_location text NULL CHECK (work_location IN ('remote', 'in_person', 'hybrid')),
  employment_type text NULL CHECK (employment_type IN ('full_time', 'part_time', 'co_op', 'internship', 'contract')),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT jobs_pkey PRIMARY KEY (id),
  CONSTRAINT jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create updated_at trigger for jobs
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE
UPDATE ON jobs FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  job_id uuid NULL,
  is_base_resume boolean NULL DEFAULT false,
  type text NOT NULL DEFAULT 'base' CHECK (type IN ('base', 'tailored')),
  name text NOT NULL,
  first_name text NULL,
  last_name text NULL,
  email text NULL,
  phone_number text NULL,
  location text NULL,
  website text NULL,
  linkedin_url text NULL,
  github_url text NULL,
  professional_summary text NULL,
  work_experience jsonb NULL DEFAULT '[]'::jsonb,
  education jsonb NULL DEFAULT '[]'::jsonb,
  skills jsonb NULL DEFAULT '[]'::jsonb,
  projects jsonb NULL DEFAULT '[]'::jsonb,
  certifications jsonb NULL DEFAULT '[]'::jsonb,
  section_order jsonb NULL DEFAULT '["professional_summary", "work_experience", "skills", "projects", "education", "certifications"]'::jsonb,
  section_configs jsonb NULL DEFAULT '{"skills": {"style": "grouped", "visible": true}, "projects": {"visible": true, "max_items": 3}, "education": {"visible": true, "max_items": null}, "certifications": {"visible": true}, "work_experience": {"visible": true, "max_items": null}}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  resume_title text NULL,
  target_role text NULL,
  document_settings jsonb NULL DEFAULT '{"header_name_size": 24, "skills_margin_top": 2, "document_font_size": 10, "projects_margin_top": 2, "skills_item_spacing": 2, "document_line_height": 1.5, "education_margin_top": 2, "skills_margin_bottom": 2, "experience_margin_top": 2, "projects_item_spacing": 4, "education_item_spacing": 4, "projects_margin_bottom": 2, "education_margin_bottom": 2, "experience_item_spacing": 4, "document_margin_vertical": 36, "experience_margin_bottom": 2, "skills_margin_horizontal": 0, "document_margin_horizontal": 36, "header_name_bottom_spacing": 24, "projects_margin_horizontal": 0, "education_margin_horizontal": 0, "experience_margin_horizontal": 0}'::jsonb,
  has_cover_letter boolean NOT NULL DEFAULT false,
  cover_letter jsonb NULL,
  template text NULL DEFAULT 'default' CHECK (template IN ('default', 'classic', 'classic-1', 'modern', 'modern-1', 'modern-2', 'creative', 'creative-modern', 'creative-minimal', 'minimal', 'minimal-1', 'ca-professional')),
  CONSTRAINT resumes_pkey PRIMARY KEY (id),
  CONSTRAINT resumes_job_id_fkey FOREIGN KEY (job_id) REFERENCES jobs(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create updated_at trigger for resumes
DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;
CREATE TRIGGER update_resumes_updated_at BEFORE
UPDATE ON resumes FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid NOT NULL,
  first_name text NULL,
  last_name text NULL,
  email text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  phone_number text NULL,
  location text NULL,
  website text NULL,
  linkedin_url text NULL,
  github_url text NULL,
  work_experience jsonb NULL DEFAULT '[]'::jsonb,
  education jsonb NULL DEFAULT '[]'::jsonb,
  skills jsonb NULL DEFAULT '[]'::jsonb,
  projects jsonb NULL DEFAULT '[]'::jsonb,
  certifications jsonb NULL DEFAULT '[]'::jsonb,
  CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT profiles_user_id_key UNIQUE (user_id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create updated_at trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Setup Row Level Security (RLS) Policies
-- These policies ensure users can only access their own data

-- Subscriptions RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_policy ON public.subscriptions
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Resumes RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY resumes_policy ON public.resumes
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Jobs RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY jobs_policy ON public.jobs
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_policy ON public.profiles
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Resume Shares table (for public sharing links)
CREATE TABLE IF NOT EXISTS public.resume_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_id TEXT NOT NULL UNIQUE,
  custom_slug TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  allow_indexing BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for resume_shares
CREATE INDEX IF NOT EXISTS idx_resume_shares_share_id ON public.resume_shares(share_id);
CREATE INDEX IF NOT EXISTS idx_resume_shares_user_id ON public.resume_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_shares_resume_id ON public.resume_shares(resume_id);

-- Resume Shares RLS
ALTER TABLE public.resume_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shares" ON public.resume_shares
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy for public read access to active shares (for share viewer app)
CREATE POLICY "Public can read active shares" ON public.resume_shares
  FOR SELECT USING (is_active = true);

-- Share View Analytics table (consolidated - one row per share with arrays)
CREATE TABLE IF NOT EXISTS public.share_view_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID NOT NULL REFERENCES public.resume_shares(id) ON DELETE CASCADE,
  device_types TEXT[] DEFAULT '{}',
  browsers TEXT[] DEFAULT '{}',
  operating_systems TEXT[] DEFAULT '{}',
  referrers TEXT[] DEFAULT '{}',
  referrer_domains TEXT[] DEFAULT '{}',
  countries TEXT[] DEFAULT '{}',
  session_ids TEXT[] DEFAULT '{}',
  viewed_at_times TIMESTAMPTZ[] DEFAULT '{}',
  total_views INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(share_id)
);

-- Index for share_view_analytics
CREATE INDEX IF NOT EXISTS idx_share_view_analytics_share_id ON public.share_view_analytics(share_id);

-- Share View Analytics RLS
ALTER TABLE public.share_view_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.share_view_analytics
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Users can read own share analytics" ON public.share_view_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.resume_shares 
      WHERE resume_shares.id = share_view_analytics.share_id 
      AND resume_shares.user_id = auth.uid()
    )
  );

-- Function to increment share view count atomically
CREATE OR REPLACE FUNCTION increment_share_view_count(p_share_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.resume_shares
  SET view_count = view_count + 1, 
      last_viewed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_share_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for resumes to allow public read when shared
CREATE POLICY "Public can read shared resumes" ON public.resumes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.resume_shares 
      WHERE resume_shares.resume_id = resumes.id 
      AND resume_shares.is_active = true
    )
  );

-- =====================================================
-- FEEDBACK AND BUG REPORTING SYSTEM
-- =====================================================

-- Feedback table - stores all user feedback, bug reports, and feature requests
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'improvement', 'general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'in_progress', 'resolved', 'closed', 'wont_fix')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for feedback table
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON public.feedback(priority);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Create updated_at trigger for feedback
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at BEFORE
UPDATE ON feedback FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Feedback RLS Policies
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous) to insert feedback
CREATE POLICY "Anyone can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT USING (
    user_id = auth.uid() OR
    user_id IS NULL -- Allow viewing anonymous feedback for admins
  );

-- Service role (admin) can do everything
CREATE POLICY "Service role full access to feedback" ON public.feedback
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- NOTIFICATIONS SYSTEM
-- =====================================================

-- Notifications table - stores all user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('resume_view', 'share_created', 'system', 'reminder', 'achievement')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Notifications RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

-- Service role can insert notifications (for system-generated notifications)
CREATE POLICY "Service role can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Push Subscriptions table - stores browser push notification subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for push_subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);

-- Create updated_at trigger for push_subscriptions
DROP TRIGGER IF EXISTS update_push_subscriptions_updated_at ON public.push_subscriptions;
CREATE TRIGGER update_push_subscriptions_updated_at BEFORE
UPDATE ON push_subscriptions FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Push Subscriptions RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own push subscriptions
CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to create a notification when resume is viewed
CREATE OR REPLACE FUNCTION create_resume_view_notification()
RETURNS TRIGGER AS $$
DECLARE
  share_owner_id UUID;
  resume_name TEXT;
  share_record RECORD;
BEGIN
  -- Get share owner and resume info
  SELECT rs.user_id, r.name INTO share_owner_id, resume_name
  FROM public.resume_shares rs
  JOIN public.resumes r ON r.id = rs.resume_id
  WHERE rs.id = NEW.share_id;
  
  -- Create notification for the share owner
  IF share_owner_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
      share_owner_id,
      'resume_view',
      'Resume Viewed',
      format('Your resume "%s" was just viewed', COALESCE(resume_name, 'Untitled')),
      jsonb_build_object(
        'share_id', NEW.share_id,
        'device_type', NEW.device_types[array_length(NEW.device_types, 1)],
        'country', NEW.countries[array_length(NEW.countries, 1)],
        'browser', NEW.browsers[array_length(NEW.browsers, 1)],
        'viewed_at', NEW.viewed_at_times[array_length(NEW.viewed_at_times, 1)]
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification on resume view (INSERT only - new views)
DROP TRIGGER IF EXISTS on_resume_view_notification_insert ON public.share_view_analytics;
CREATE TRIGGER on_resume_view_notification_insert
  AFTER INSERT ON public.share_view_analytics
  FOR EACH ROW
  EXECUTE FUNCTION create_resume_view_notification();

-- Trigger to create notification on resume view (UPDATE only - when view count increases)
DROP TRIGGER IF EXISTS on_resume_view_notification_update ON public.share_view_analytics;
CREATE TRIGGER on_resume_view_notification_update
  AFTER UPDATE ON public.share_view_analytics
  FOR EACH ROW
  WHEN (NEW.total_views > OLD.total_views)
  EXECUTE FUNCTION create_resume_view_notification();

-- Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
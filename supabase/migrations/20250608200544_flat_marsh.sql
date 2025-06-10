/*
  # Resume Builder Database Schema

  1. New Tables
    - `users` - Extended user profiles linked to auth.users
    - `resumes` - Resume documents with metadata and analytics
    - `resume_sections` - Individual resume sections with ordering
    - `templates` - Resume templates with categories and ratings
    - `resume_shares` - Public sharing functionality
    - `resume_versions` - Version history tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Public read access for templates and shared resumes

  3. Functions & Triggers
    - Auto-create user profiles on signup
    - Auto-update timestamps
    - Auto-create resume versions on content changes
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Resume',
  template_id uuid,
  content jsonb DEFAULT '{}',
  is_public boolean DEFAULT false,
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now()
);

-- Resume sections table
CREATE TABLE IF NOT EXISTS resume_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  section_type text NOT NULL CHECK (section_type IN ('personal_info', 'summary', 'work_experience', 'education', 'skills', 'projects', 'certifications', 'custom')),
  content jsonb NOT NULL DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL, -- Add slug for template identification
  description text,
  category text NOT NULL CHECK (category IN ('modern', 'creative', 'professional', 'executive', 'technical')),
  preview_image text,
  structure jsonb NOT NULL DEFAULT '{}',
  is_premium boolean DEFAULT false,
  is_active boolean DEFAULT true,
  download_count integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resume shares table for public sharing
CREATE TABLE IF NOT EXISTS resume_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  share_token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Resume versions table for version history
CREATE TABLE IF NOT EXISTS resume_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(resume_id, version_number)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Resumes policies
CREATE POLICY "Users can read own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Public can read shared resumes"
  ON resumes
  FOR SELECT
  TO anon
  USING (is_public = true);

-- Resume sections policies
CREATE POLICY "Users can manage own resume sections"
  ON resume_sections
  FOR ALL
  TO authenticated
  USING (resume_id IN (
    SELECT id FROM resumes 
    WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  ));

CREATE POLICY "Public can read sections of shared resumes"
  ON resume_sections
  FOR SELECT
  TO anon
  USING (resume_id IN (SELECT id FROM resumes WHERE is_public = true));

-- Templates policies (public read access)
CREATE POLICY "Anyone can read active templates"
  ON templates
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Resume shares policies
CREATE POLICY "Users can manage own resume shares"
  ON resume_shares
  FOR ALL
  TO authenticated
  USING (resume_id IN (
    SELECT id FROM resumes 
    WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  ));

CREATE POLICY "Public can read active shares"
  ON resume_shares
  FOR SELECT
  TO anon
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Resume versions policies
CREATE POLICY "Users can manage own resume versions"
  ON resume_versions
  FOR ALL
  TO authenticated
  USING (resume_id IN (
    SELECT id FROM resumes 
    WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  ));

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_sections_updated_at BEFORE UPDATE ON resume_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create user profile on auth signup
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Function to create resume version on update
CREATE OR REPLACE FUNCTION create_resume_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    INSERT INTO resume_versions (resume_id, version_number, content)
    VALUES (
      NEW.id,
      COALESCE((
        SELECT MAX(version_number) + 1 
        FROM resume_versions 
        WHERE resume_id = NEW.id
      ), 1),
      OLD.content
    );
  END IF;
  
  NEW.last_modified = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create resume version on update
CREATE TRIGGER create_resume_version_trigger
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION create_resume_version();

-- Insert default templates with proper UUIDs
INSERT INTO templates (name, slug, description, category, structure, is_premium, rating, download_count) VALUES
(
  'Modern Professional',
  'modern-professional',
  'Clean, minimalist design perfect for corporate environments',
  'modern',
  '{"sections": ["personal_info", "summary", "work_experience", "education", "skills"], "layout": "single_column", "colors": {"primary": "#2563EB", "secondary": "#64748B"}}',
  false,
  4.8,
  15420
),
(
  'Creative Portfolio',
  'creative-portfolio',
  'Eye-catching design for creative professionals',
  'creative',
  '{"sections": ["personal_info", "summary", "work_experience", "projects", "skills"], "layout": "two_column", "colors": {"primary": "#7C3AED", "secondary": "#EC4899"}}',
  true,
  4.7,
  8930
),
(
  'Executive Premium',
  'executive-premium',
  'Sophisticated layout for senior leadership positions',
  'executive',
  '{"sections": ["personal_info", "summary", "work_experience", "education", "certifications"], "layout": "traditional", "colors": {"primary": "#1F2937", "secondary": "#6B7280"}}',
  true,
  4.9,
  12340
),
(
  'Technical Specialist',
  'technical-specialist',
  'Optimized for IT and engineering professionals',
  'technical',
  '{"sections": ["personal_info", "summary", "work_experience", "skills", "projects", "certifications"], "layout": "technical", "colors": {"primary": "#059669", "secondary": "#6B7280"}}',
  false,
  4.6,
  9870
),
(
  'Startup Dynamic',
  'startup-dynamic',
  'Modern and energetic design for innovative companies',
  'modern',
  '{"sections": ["personal_info", "summary", "work_experience", "projects", "skills"], "layout": "dynamic", "colors": {"primary": "#DC2626", "secondary": "#F59E0B"}}',
  false,
  4.5,
  7650
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_template_id ON resumes(template_id);
CREATE INDEX IF NOT EXISTS idx_resume_sections_resume_id ON resume_sections(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_sections_order ON resume_sections(resume_id, display_order);
CREATE INDEX IF NOT EXISTS idx_resume_shares_token ON resume_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id, version_number);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
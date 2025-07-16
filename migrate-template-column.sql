-- Migration script to add the template column to the resumes table
-- This fixes the error: "Could not find the 'template' column of 'resumes' in the schema cache"

-- Add the template column to the resumes table
ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS template text 
CHECK (template IN ('default', 'classic', 'classic-1', 'modern', 'modern-1', 'modern-2', 'creative', 'creative-1', 'creative-2', 'minimal', 'minimal-1'))
DEFAULT 'default';

-- Update existing resumes to have a default template value
UPDATE public.resumes 
SET template = 'default' 
WHERE template IS NULL;

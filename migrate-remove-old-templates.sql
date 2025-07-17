-- Migration script to remove old template IDs and update existing resumes
-- This updates any resumes using the removed 'creative-1' or 'creative-2' templates

-- Update existing resumes using removed templates to use 'creative-modern' instead
UPDATE public.resumes 
SET template = 'creative-modern' 
WHERE template IN ('creative-1', 'creative-2');

-- Drop the old constraint
ALTER TABLE public.resumes 
DROP CONSTRAINT IF EXISTS resumes_template_check;

-- Add the updated constraint with new template IDs
ALTER TABLE public.resumes 
ADD CONSTRAINT resumes_template_check 
CHECK (template IN ('default', 'classic', 'classic-1', 'modern', 'modern-1', 'modern-2', 'creative', 'creative-modern', 'creative-minimal', 'minimal', 'minimal-1'));

-- Verify the changes
SELECT DISTINCT template FROM public.resumes WHERE template IS NOT NULL;

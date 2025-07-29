-- Add type column to resumes table
-- This migration adds a 'type' column to distinguish between base and tailored resumes

ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('base', 'tailored'));

-- Update existing records based on is_base_resume
UPDATE public.resumes 
SET type = CASE 
    WHEN is_base_resume = true THEN 'base'
    WHEN is_base_resume = false THEN 'tailored'
    ELSE 'base'
END
WHERE type IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE public.resumes 
ALTER COLUMN type SET NOT NULL;

-- Set default value for new records
ALTER TABLE public.resumes 
ALTER COLUMN type SET DEFAULT 'base';
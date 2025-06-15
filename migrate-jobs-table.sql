-- Migration script to update the jobs table to match the expected schema
-- Run this against your database to add the missing columns

-- Add the new columns if they don't exist
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS position_title text,
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS salary_range text,
ADD COLUMN IF NOT EXISTS keywords jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS work_location text CHECK (work_location IN ('remote', 'in_person', 'hybrid')),
ADD COLUMN IF NOT EXISTS employment_type text CHECK (employment_type IN ('full_time', 'part_time', 'co_op', 'internship', 'contract'));

-- Copy data from old columns to new columns
UPDATE public.jobs 
SET 
  position_title = COALESCE(title, position_title),
  company_name = COALESCE(company, company_name)
WHERE position_title IS NULL OR company_name IS NULL;

-- Make position_title NOT NULL after copying data
ALTER TABLE public.jobs 
ALTER COLUMN position_title SET NOT NULL;

-- Optionally, drop the old columns (uncomment if you want to remove them)
-- ALTER TABLE public.jobs DROP COLUMN IF EXISTS title;
-- ALTER TABLE public.jobs DROP COLUMN IF EXISTS company;

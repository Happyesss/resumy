// Migration utility to update the jobs table schema
// Run this with: node migrate-jobs.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationSQL = `
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

-- Make position_title NOT NULL after copying data (only if there are existing records)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'position_title') THEN
    ALTER TABLE public.jobs ALTER COLUMN position_title SET NOT NULL;
  END IF;
END
$$;
`;

async function runMigration() {
  try {
    console.log('Running jobs table migration...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
    console.log('Result:', data);
    
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();

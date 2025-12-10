import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST() {
  try {
    console.log('Starting jobs table check...')
    
    // Check current table structure by trying to select with the new column names
    const { data: _testData, error: testError } = await supabase
      .from('jobs')
      .select('id, company_name, position_title')
      .limit(1)
    
    if (testError) {
      if (testError.message.includes('column') && testError.message.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Database schema needs to be updated',
          message: 'Please run the SQL migration in your Supabase SQL editor',
          sql: `
-- Run this SQL in your Supabase SQL Editor:
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS position_title text,
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS salary_range text,
ADD COLUMN IF NOT EXISTS keywords jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS work_location text,
ADD COLUMN IF NOT EXISTS employment_type text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Copy data from old columns:
UPDATE public.jobs 
SET 
  position_title = COALESCE(position_title, title),
  company_name = COALESCE(company_name, company)
WHERE (position_title IS NULL AND title IS NOT NULL) 
   OR (company_name IS NULL AND company IS NOT NULL);
          `
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: 'Database error', 
        details: testError.message 
      }, { status: 500 })
    }
    
    // If we get here, the columns exist
    console.log('✓ Database schema is up to date')
    
    // Check if we have any jobs
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(5)
    
    if (jobsError) {
      return NextResponse.json({ 
        error: 'Failed to query jobs', 
        details: jobsError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Database schema is up to date!',
      sampleJobs: jobsData?.length || 0,
      availableColumns: jobsData?.[0] ? Object.keys(jobsData[0]) : []
    })
    
  } catch (error) {
    console.error('Migration check failed:', error)
    return NextResponse.json({ 
      error: 'Migration check failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

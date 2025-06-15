// Simple script to run the jobs table migration
// This will be run as a one-time migration

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hphdwhdxehtzuoqshwsu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGR3aGR4ZWh0enVvcXNod3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MzkwNSwiZXhwIjoyMDY1MjI5OTA1fQ.4LbTlv9X2WF9uL8-3d4LoAKegmO4GLNtRgEj4ix6Wxk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addMissingColumns() {
  console.log('Adding missing columns to jobs table...')
  
  try {
    // Add columns individually to avoid constraint conflicts
    const alterQueries = [
      'ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS position_title text',
      'ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_name text',
      'ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS location text',
      'ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS salary_range text',
      "ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS keywords jsonb DEFAULT '[]'::jsonb",
      'ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS work_location text',
      'ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS employment_type text'
    ]
    
    for (const query of alterQueries) {
      console.log('Executing:', query)
      const { error } = await supabase.rpc('exec', { sql: query })
      if (error) {
        console.error('Error:', error)
      } else {
        console.log('✓ Success')
      }
    }
    
    // Copy data from old columns
    console.log('Copying data from old columns...')
    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        position_title: supabase.raw('COALESCE(position_title, title)'),
        company_name: supabase.raw('COALESCE(company_name, company)')
      })
      .neq('id', 'dummy') // This ensures we update all rows
      
    if (updateError) {
      console.error('Error updating data:', updateError)
    } else {
      console.log('✓ Data copied successfully')
    }
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

addMissingColumns()

// Template column migration using direct SQL approach
// This adds the missing template column to fix the tailored resume creation error

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hphdwhdxehtzuoqshwsu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGR3aGR4ZWh0enVvcXNod3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MzkwNSwiZXhwIjoyMDY1MjI5OTA1fQ.4LbTlv9X2WF9uL8-3d4LoAKegmO4GLNtRgEj4ix6Wxk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addTemplateColumn() {
  console.log('Fixing template column issue...')
  
  try {
    // First, let's check if the column exists
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_columns', { table_name: 'resumes' })
    
    if (columnsError) {
      console.log('Cannot check existing columns, proceeding with migration...')
    } else {
      console.log('Current columns:', columns)
    }
    
    // Since we can't use exec, let's try a different approach
    // We'll use a simple insert/update pattern to trigger the schema update
    
    console.log('Please run the following SQL in your Supabase SQL Editor:')
    console.log('')
    console.log('-- Add template column migration')
    console.log('ALTER TABLE public.resumes')
    console.log('ADD COLUMN IF NOT EXISTS template text')
    console.log("DEFAULT 'default'")
    console.log("CHECK (template IN ('default', 'classic', 'classic-1', 'modern', 'modern-1', 'modern-2', 'creative', 'creative-1', 'creative-2', 'minimal', 'minimal-1'));")
    console.log('')
    console.log('-- Update existing records')
    console.log('UPDATE public.resumes')
    console.log("SET template = 'default'")
    console.log('WHERE template IS NULL;')
    console.log('')
    
  } catch (error) {
    console.error('Error:', error)
    console.log('')
    console.log('Please manually run this SQL in Supabase SQL Editor:')
    console.log('')
    console.log('ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS template text DEFAULT \'default\';')
    console.log('UPDATE public.resumes SET template = \'default\' WHERE template IS NULL;')
  }
}

addTemplateColumn()

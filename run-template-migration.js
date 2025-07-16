// Simple script to run the template column migration
// This will add the missing template column to the resumes table

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hphdwhdxehtzuoqshwsu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGR3aGR4ZWh0enVvcXNod3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MzkwNSwiZXhwIjoyMDY1MjI5OTA1fQ.4LbTlv9X2WF9uL8-3d4LoAKegmO4GLNtRgEj4ix6Wxk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addTemplateColumn() {
  console.log('Adding template column to resumes table...')
  
  try {
    // Add template column
    const addColumnQuery = `
      ALTER TABLE public.resumes 
      ADD COLUMN IF NOT EXISTS template text 
      DEFAULT 'default'
    `
    
    console.log('Executing:', addColumnQuery)
    const { error: addError } = await supabase.rpc('exec', { sql: addColumnQuery })
    if (addError) {
      console.error('Error adding column:', addError)
      return
    }
    
    // Add check constraint for template values
    const addConstraintQuery = `
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'resumes_template_check'
        ) THEN
          ALTER TABLE public.resumes 
          ADD CONSTRAINT resumes_template_check 
          CHECK (template IN ('default', 'classic', 'classic-1', 'modern', 'modern-1', 'modern-2', 'creative', 'creative-1', 'creative-2', 'minimal', 'minimal-1'));
        END IF;
      END $$;
    `
    
    console.log('Executing constraint:', addConstraintQuery)
    const { error: constraintError } = await supabase.rpc('exec', { sql: addConstraintQuery })
    if (constraintError) {
      console.error('Error adding constraint:', constraintError)
      return
    }
    
    // Update existing records to have default template
    const updateQuery = `
      UPDATE public.resumes 
      SET template = 'default' 
      WHERE template IS NULL
    `
    
    console.log('Executing update:', updateQuery)
    const { error: updateError } = await supabase.rpc('exec', { sql: updateQuery })
    if (updateError) {
      console.error('Error updating records:', updateError)
      return
    }
    
    console.log('✅ Template column migration completed successfully!')
    console.log('The resumes table now has a template column with default value "default"')
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

addTemplateColumn()

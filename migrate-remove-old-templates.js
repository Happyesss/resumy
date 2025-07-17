// Migration script to remove old creative templates and update existing data

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hphdwhdxehtzuoqshwsu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGR3aGR4ZWh0enVvcXNod3N1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY1MzkwNSwiZXhwIjoyMDY1MjI5OTA1fQ.4LbTlv9X2WF9uL8-3d4LoAKegmO4GLNtRgEj4ix6Wxk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateOldTemplates() {
  console.log('Starting migration to remove old creative templates...')
  
  try {
    // First, check if there are any resumes using the old templates
    const { data: existingResumes, error: checkError } = await supabase
      .from('resumes')
      .select('id, template')
      .in('template', ['creative-1', 'creative-2'])

    if (checkError) {
      console.error('Error checking existing templates:', checkError)
      return
    }

    console.log(`Found ${existingResumes?.length || 0} resumes using old templates`)

    if (existingResumes && existingResumes.length > 0) {
      // Update resumes using old templates to use 'creative-modern'
      const { error: updateError } = await supabase
        .from('resumes')
        .update({ template: 'creative-modern' })
        .in('template', ['creative-1', 'creative-2'])

      if (updateError) {
        console.error('Error updating resumes:', updateError)
        return
      }

      console.log(`Successfully updated ${existingResumes.length} resumes to use 'creative-modern' template`)
    }

    console.log('Migration completed successfully!')
    console.log('')
    console.log('Note: If you need to update the database constraint, run the following SQL:')
    console.log('ALTER TABLE public.resumes DROP CONSTRAINT IF EXISTS resumes_template_check;')
    console.log("ALTER TABLE public.resumes ADD CONSTRAINT resumes_template_check CHECK (template IN ('default', 'classic', 'classic-1', 'modern', 'modern-1', 'modern-2', 'creative', 'creative-modern', 'creative-minimal', 'minimal', 'minimal-1'));")

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrateOldTemplates()

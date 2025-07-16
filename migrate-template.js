/**
 * Migration runner for adding the template column to the resumes table
 * Run this script to fix the "Could not find the 'template' column" error
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Read the migration SQL file
    const migrationSQL = readFileSync(join(__dirname, 'migrate-template-column.sql'), 'utf8');
    
    console.log('Running template column migration...');
    console.log('SQL to execute:', migrationSQL);
    
    // Execute the migration directly with individual statements
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim());
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() });
        if (error) {
          console.error('Statement failed:', error);
          throw error;
        }
      }
    }
    
    console.log('Migration completed successfully!');
    console.log('The template column has been added to the resumes table.');
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration().catch(console.error);

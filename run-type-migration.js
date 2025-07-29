const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// You need to manually set these values for now
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your actual Supabase URL
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY'; // Replace with your actual service role key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Starting type column migration...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'migrate-type-column.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 100) + '...');
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement.trim() 
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_supabase_sql_executor')
            .insert({ query: statement.trim() });
            
          if (directError) {
            console.error('Error executing statement:', error);
            throw error;
          }
        }
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
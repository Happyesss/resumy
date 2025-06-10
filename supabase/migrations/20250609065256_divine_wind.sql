/*
  # Change template_id column from uuid to text

  1. Changes
    - Modify `resumes.template_id` column from uuid to text to match application usage
    - Update foreign key constraint to reference templates.slug instead of templates.id
    - This aligns the database with the application's use of descriptive template IDs

  2. Security
    - Maintains existing RLS policies
    - Preserves all existing data relationships
*/

-- First, drop the existing foreign key constraint
ALTER TABLE resumes DROP CONSTRAINT IF EXISTS resumes_template_id_fkey;

-- Change the template_id column type from uuid to text
ALTER TABLE resumes ALTER COLUMN template_id TYPE text USING template_id::text;

-- Add new foreign key constraint referencing templates.slug
ALTER TABLE resumes ADD CONSTRAINT resumes_template_id_fkey 
  FOREIGN KEY (template_id) REFERENCES templates(slug) ON DELETE SET NULL;

-- Update the index to work with text type
DROP INDEX IF EXISTS idx_resumes_template_id;
CREATE INDEX idx_resumes_template_id ON resumes USING btree (template_id);
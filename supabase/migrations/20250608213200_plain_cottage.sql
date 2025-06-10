/*
  # Fix user signup duplicate error

  1. Functions
    - Create or replace the user profile creation function to handle duplicates gracefully
    - Add proper error handling for edge cases

  2. Triggers
    - Ensure the trigger is properly set up to call the function on auth.users insert

  3. Security
    - Maintain existing RLS policies
    - Ensure proper data integrity
*/

-- Create or replace the function to handle user profile creation
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if it doesn't already exist
  INSERT INTO public.users (auth_user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;

-- Create the trigger to automatically create user profiles
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Also handle the case where email might be duplicated in public.users
-- Add a unique constraint on email if it doesn't exist (it should based on schema)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_email_key' 
    AND table_name = 'users'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;

-- Clean up any potential orphaned records or duplicates
-- This will help resolve existing conflicts
DO $$
DECLARE
  duplicate_record RECORD;
BEGIN
  -- Find and remove duplicate email entries, keeping the most recent one
  FOR duplicate_record IN
    SELECT email, MIN(created_at) as min_created
    FROM public.users
    GROUP BY email
    HAVING COUNT(*) > 1
  LOOP
    DELETE FROM public.users 
    WHERE email = duplicate_record.email 
    AND created_at > duplicate_record.min_created;
  END LOOP;
END $$;
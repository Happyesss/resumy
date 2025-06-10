/*
  # Create user profile trigger

  1. Functions
    - `create_user_profile()` - Automatically creates a user profile when a new auth user is created
  
  2. Triggers
    - Trigger on `auth.users` table to call the function after insert
  
  3. Security
    - Ensures every authenticated user gets a corresponding profile in public.users table
*/

-- Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();
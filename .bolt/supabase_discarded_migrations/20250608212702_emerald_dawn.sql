/*
  # Fix subscription_tier default value

  1. Changes
    - Ensure the subscription_tier column has a proper default value of 'free'
    - This resolves the "Database error saving new user" issue during signup

  2. Security
    - No changes to existing RLS policies
    - Maintains existing table structure and constraints
*/

-- Ensure the subscription_tier column has the correct default value
ALTER TABLE public.users 
ALTER COLUMN subscription_tier SET DEFAULT 'free';

-- Also ensure the column allows the default to be used
ALTER TABLE public.users 
ALTER COLUMN subscription_tier SET NOT NULL;
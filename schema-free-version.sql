 -- Simplified Resumy Database Schema
-- Create or update the subscriptions table
-- Makes sure all users get 'pro' access by default
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id uuid PRIMARY KEY,
  subscription_plan text DEFAULT 'pro',
  subscription_status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Migration for updating existing records
-- Sets all users to 'pro' plan
DO $$
BEGIN
  -- Set all existing subscription records to pro
  UPDATE public.subscriptions 
  SET 
    subscription_plan = 'pro',
    subscription_status = 'active',
    updated_at = NOW();

  -- Insert pro subscription for users who don't have one
  INSERT INTO public.subscriptions (user_id, subscription_plan, subscription_status)
  SELECT auth.users.id, 'pro', 'active'
  FROM auth.users
  LEFT JOIN public.subscriptions ON auth.users.id = public.subscriptions.user_id
  WHERE public.subscriptions.user_id IS NULL;
END $$;

-- Setup Row Level Security (RLS) Policy for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS subscriptions_policy ON public.subscriptions
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Drop any Stripe-related tables if they exist
DROP TABLE IF EXISTS public.stripe_customers CASCADE;
DROP TABLE IF EXISTS public.stripe_subscriptions CASCADE;
DROP TABLE IF EXISTS public.stripe_products CASCADE;
DROP TABLE IF EXISTS public.stripe_prices CASCADE;
DROP TABLE IF EXISTS public.stripe_webhooks CASCADE;

-- Create updated_at trigger for subscriptions if it doesn't exist
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_subscriptions_updated_at();

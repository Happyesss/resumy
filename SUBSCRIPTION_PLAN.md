# Subscription System Implementation Plan

## Overview

This document outlines the complete implementation plan for adding a three-tier subscription system to Resumy with Stripe payment integration. The system will manage resume limits and AI request credits while keeping the AI resume analyzer free for all users.

---

## Subscription Tiers

### Free Plan
- **Resume Limit:** 4 resumes (base + tailored combined)
- **AI Credits:** 100 requests per month
- **Resume Analyzer:** Unlimited (free for all)
- **Cost:** $0/month
- **Target:** General users, casual job seekers

### Pro Plan
- **Resume Limit:** 8 resumes (base + tailored combined)
- **AI Credits:** 250 requests per month
- **Resume Analyzer:** Unlimited (free for all)
- **Cost:** $9.99/month via Stripe
- **Target:** Active job seekers, professionals

### Student Plan
- **Resume Limit:** 8 resumes (same as Pro)
- **AI Credits:** 250 requests per month (same as Pro)
- **Resume Analyzer:** Unlimited (free for all)
- **Cost:** $0/month (Pro features for free)
- **Target:** Students with verified educational email addresses
- **Verification:** Automatic based on email domain (.edu, .ac.in, .edu.au, etc.)

---

## Key Principles

1. **AI Resume Analyzer is Always Free:** The resume analysis feature (`/analyze-resume`) remains completely free and unlimited for all users regardless of their subscription tier.

2. **Credits Reset Monthly:** AI credits reset on the first day of each month to the plan's limit (100 for free, 250 for pro/student).

3. **Combined Resume Limits:** Total resumes (base + tailored) count toward the limit, not separated by type.

4. **Automatic Student Verification:** Users with educational email domains are automatically upgraded to student plan.

5. **Grandfather Existing Users:** Users with more than 4 resumes at migration time keep their current count.

---

## Implementation Steps

### 1. Database Schema Setup

**File:** `schema.sql`

Create two new tables:

#### `subscriptions` Table
```sql
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'student')),
  stripe_customer_id TEXT NULL,
  stripe_subscription_id TEXT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  
  -- AI Credits Management
  ai_credits_remaining INTEGER NOT NULL DEFAULT 100,
  ai_credits_limit INTEGER NOT NULL DEFAULT 100,
  ai_credits_reset_date TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW() + interval '1 month'),
  
  -- Resume Limits
  resume_limit INTEGER NOT NULL DEFAULT 4,
  
  -- Billing Period
  current_period_start TIMESTAMPTZ NULL,
  current_period_end TIMESTAMPTZ NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  
  -- Student Verification
  student_email_verified BOOLEAN DEFAULT false,
  student_verified_at TIMESTAMPTZ NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_reset_date ON public.subscriptions(ai_credits_reset_date);

-- RLS Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role full access" ON public.subscriptions
  FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### `ai_request_logs` Table
```sql
CREATE TABLE IF NOT EXISTS public.ai_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'tailor_resume', 'generate_summary', 'chat', 'analyze_resume', etc.
  feature TEXT NOT NULL, -- 'resume_builder', 'resume_analyzer', 'chat', etc.
  credits_used INTEGER NOT NULL DEFAULT 1,
  success BOOLEAN DEFAULT true,
  error_message TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_request_logs_user_id ON public.ai_request_logs(user_id);
CREATE INDEX idx_ai_request_logs_created_at ON public.ai_request_logs(created_at DESC);
CREATE INDEX idx_ai_request_logs_feature ON public.ai_request_logs(feature);

-- RLS Policies
ALTER TABLE public.ai_request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs" ON public.ai_request_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role full access to logs" ON public.ai_request_logs
  FOR ALL USING (true) WITH CHECK (true);
```

#### Auto-create Free Subscription on Signup
```sql
-- Function to create default subscription
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
DECLARE
  is_student BOOLEAN;
  plan TEXT;
  credits INTEGER;
  resume_lim INTEGER;
BEGIN
  -- Check if email is educational
  is_student := EXISTS (
    SELECT 1 FROM unnest(ARRAY['.edu', '.ac.in', '.edu.in', '.ac.uk', '.edu.au', 
                                '.edu.de', '.edu.fr', '.ac.kr', '.ac.jp']) AS domain
    WHERE NEW.email LIKE '%' || domain
  );
  
  -- Set plan based on email
  IF is_student THEN
    plan := 'student';
    credits := 250;
    resume_lim := 8;
  ELSE
    plan := 'free';
    credits := 100;
    resume_lim := 4;
  END IF;
  
  -- Create subscription
  INSERT INTO public.subscriptions (
    user_id,
    plan_type,
    ai_credits_remaining,
    ai_credits_limit,
    resume_limit,
    student_email_verified,
    student_verified_at,
    status
  ) VALUES (
    NEW.id,
    plan,
    credits,
    credits,
    resume_lim,
    is_student,
    CASE WHEN is_student THEN NOW() ELSE NULL END,
    'active'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();
```

---

### 2. Subscription Service Layer

**File:** `src/lib/subscription.ts`

```typescript
import { createClient } from '@/utils/supabase/server';

// Plan limits configuration
export const PLAN_LIMITS = {
  free: { resumes: 4, aiCredits: 100 },
  pro: { resumes: 8, aiCredits: 250 },
  student: { resumes: 8, aiCredits: 250 }
} as const;

export const STRIPE_PRICES = {
  pro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
} as const;

export type PlanType = 'free' | 'pro' | 'student';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  ai_credits_remaining: number;
  ai_credits_limit: number;
  ai_credits_reset_date: string;
  resume_limit: number;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  student_email_verified: boolean;
  student_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageStats {
  resumes_used: number;
  resumes_limit: number;
  ai_credits_remaining: number;
  ai_credits_limit: number;
  ai_credits_reset_date: string;
  plan_type: PlanType;
  can_create_resume: boolean;
  can_use_ai: boolean;
}

/**
 * Get user's subscription details
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
  
  return data;
}

/**
 * Check if user can create more resumes
 */
export async function checkResumeLimit(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;
  
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error counting resumes:', error);
    return false;
  }
  
  return (count || 0) < subscription.resume_limit;
}

/**
 * Check if user has AI credits available
 * Always returns true for resume_analyzer feature
 */
export async function checkAICredits(
  userId: string, 
  feature: string = 'general'
): Promise<boolean> {
  // Resume analyzer is always free and unlimited
  if (feature === 'resume_analyzer') {
    return true;
  }
  
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;
  
  // Check if credits need to be reset
  const now = new Date();
  const resetDate = new Date(subscription.ai_credits_reset_date);
  
  if (now >= resetDate) {
    await resetMonthlyCredits(userId);
    // Re-fetch subscription after reset
    const updatedSub = await getUserSubscription(userId);
    return (updatedSub?.ai_credits_remaining || 0) > 0;
  }
  
  return subscription.ai_credits_remaining > 0;
}

/**
 * Deduct AI credits from user's account
 * Skips deduction for resume_analyzer feature
 */
export async function deductAICredits(
  userId: string,
  amount: number = 1,
  feature: string = 'general',
  requestType: string = 'unknown'
): Promise<boolean> {
  const supabase = await createClient();
  
  // Log the request regardless of whether it's free
  await supabase.from('ai_request_logs').insert({
    user_id: userId,
    request_type: requestType,
    feature: feature,
    credits_used: feature === 'resume_analyzer' ? 0 : amount,
    success: true
  });
  
  // Resume analyzer is always free - don't deduct credits
  if (feature === 'resume_analyzer') {
    return true;
  }
  
  // Check and reset credits if needed
  const hasCredits = await checkAICredits(userId, feature);
  if (!hasCredits) {
    return false;
  }
  
  // Deduct credits
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      ai_credits_remaining: supabase.rpc('decrement_credits', { 
        amount: amount 
      })
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
  
  return true;
}

/**
 * Reset monthly AI credits to plan limit
 */
export async function resetMonthlyCredits(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return;
  
  const supabase = await createClient();
  
  // Calculate next reset date (first day of next month)
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  nextMonth.setHours(0, 0, 0, 0);
  
  await supabase
    .from('subscriptions')
    .update({
      ai_credits_remaining: subscription.ai_credits_limit,
      ai_credits_reset_date: nextMonth.toISOString()
    })
    .eq('user_id', userId);
}

/**
 * Get user's usage statistics
 */
export async function getUsageStats(userId: string): Promise<UsageStats | null> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return null;
  
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error counting resumes:', error);
    return null;
  }
  
  const resumesUsed = count || 0;
  
  return {
    resumes_used: resumesUsed,
    resumes_limit: subscription.resume_limit,
    ai_credits_remaining: subscription.ai_credits_remaining,
    ai_credits_limit: subscription.ai_credits_limit,
    ai_credits_reset_date: subscription.ai_credits_reset_date,
    plan_type: subscription.plan_type,
    can_create_resume: resumesUsed < subscription.resume_limit,
    can_use_ai: subscription.ai_credits_remaining > 0
  };
}

/**
 * Check if email is from educational institution
 */
export function isStudentEmail(email: string): boolean {
  const educationalDomains = [
    '.edu', '.ac.in', '.edu.in', '.ac.uk', '.edu.au',
    '.edu.de', '.edu.fr', '.ac.kr', '.ac.jp'
  ];
  
  const emailLower = email.toLowerCase();
  return educationalDomains.some(domain => emailLower.endsWith(domain));
}

/**
 * Upgrade or change user's subscription plan
 */
export async function upgradeToPlan(
  userId: string,
  planType: PlanType,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
): Promise<boolean> {
  const supabase = await createClient();
  const limits = PLAN_LIMITS[planType];
  
  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan_type: planType,
      resume_limit: limits.resumes,
      ai_credits_limit: limits.aiCredits,
      ai_credits_remaining: limits.aiCredits,
      stripe_customer_id: stripeCustomerId || null,
      stripe_subscription_id: stripeSubscriptionId || null,
      status: 'active'
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error upgrading plan:', error);
    return false;
  }
  
  return true;
}

/**
 * Verify student email and upgrade to student plan
 */
export async function verifyStudentEmail(userId: string, email: string): Promise<boolean> {
  if (!isStudentEmail(email)) {
    return false;
  }
  
  const supabase = await createClient();
  const limits = PLAN_LIMITS.student;
  
  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan_type: 'student',
      resume_limit: limits.resumes,
      ai_credits_limit: limits.aiCredits,
      ai_credits_remaining: limits.aiCredits,
      student_email_verified: true,
      student_verified_at: new Date().toISOString(),
      status: 'active'
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error verifying student email:', error);
    return false;
  }
  
  return true;
}
```

---

### 3. Stripe Integration

#### Install Stripe (Already Installed)
```bash
pnpm add stripe @stripe/stripe-js @stripe/react-stripe-js
```

#### Environment Variables

Add to `.env.local`:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### API Route: Checkout Session

**File:** `src/app/api/stripe/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { getUserSubscription } from '@/lib/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user already has Pro subscription
    const subscription = await getUserSubscription(user.id);
    if (subscription?.plan_type === 'pro') {
      return NextResponse.json(
        { error: 'Already subscribed to Pro' },
        { status: 400 }
      );
    }
    
    // Create or retrieve Stripe customer
    let customerId = subscription?.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      });
      customerId = customer.id;
    }
    
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?upgrade=canceled`,
      metadata: {
        supabase_user_id: user.id
      }
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

#### API Route: Webhook Handler

**File:** `src/app/api/stripe/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { upgradeToPlan } from '@/lib/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  const supabase = await createClient();
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        
        if (userId && session.subscription) {
          await upgradeToPlan(
            userId,
            'pro',
            session.customer as string,
            session.subscription as string
          );
          
          await supabase
            .from('subscriptions')
            .update({
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('user_id', userId);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        
        if (userId) {
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status === 'active' ? 'active' : 'canceled',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end
            })
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const { data } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();
        
        if (data?.user_id) {
          await upgradeToPlan(data.user_id, 'free');
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'active' })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
```

#### API Route: Customer Portal

**File:** `src/app/api/stripe/portal/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { getUserSubscription } from '@/lib/subscription';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const subscription = await getUserSubscription(user.id);
    
    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      );
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
```

---

### 4. Update Existing Code to Use Subscriptions

#### Replace AI Request Limit Logic

**File:** `src/lib/ai-request-limit.ts`

Replace entire file content with subscription-based logic:

```typescript
'use server';

import { checkAICredits, deductAICredits } from './subscription';
import { createClient } from '@/utils/supabase/server';

/**
 * Check if user has reached AI request limit
 * Always returns false for resume_analyzer feature (unlimited)
 */
export async function hasReachedAILimit(
  userId?: string,
  feature: string = 'general'
): Promise<boolean> {
  if (!userId) return true;
  
  // Resume analyzer is always free and unlimited
  if (feature === 'resume_analyzer') {
    return false;
  }
  
  const hasCredits = await checkAICredits(userId, feature);
  return !hasCredits;
}

/**
 * Get remaining AI requests for user
 */
export async function getRemainingAIRequests(userId?: string): Promise<number> {
  if (!userId) return 0;
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('ai_credits_remaining')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) return 0;
  
  return data.ai_credits_remaining;
}

/**
 * Get AI request limit for user's plan
 */
export async function getAIRequestLimit(userId?: string): Promise<number> {
  if (!userId) return 0;
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('ai_credits_limit')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) return 0;
  
  return data.ai_credits_limit;
}

/**
 * Increment AI usage and deduct credits
 * Skips for resume_analyzer feature
 */
export async function incrementAIUsage(
  userId?: string,
  feature: string = 'general',
  requestType: string = 'unknown'
): Promise<boolean> {
  if (!userId) return false;
  
  return await deductAICredits(userId, 1, feature, requestType);
}

/**
 * Reset AI usage (for testing only)
 */
export async function resetAIUsage(userId?: string): Promise<void> {
  if (!userId) return;
  
  const supabase = await createClient();
  await supabase
    .from('subscriptions')
    .update({ ai_credits_remaining: 0 })
    .eq('user_id', userId);
}
```

#### Update Resume Actions

**File:** `src/utils/actions/resumes/actions.ts`

Update imports and limit checks:

```typescript
import { checkResumeLimit } from '@/lib/subscription';

// In createBaseResume function, replace:
// const totalResumesCount = await countResumes('all');
// const resumeLimit = getResumeLimit(user.email);
// if (totalResumesCount >= resumeLimit) { ... }

// With:
const canCreate = await checkResumeLimit(user.id);
if (!canCreate) {
  throw new Error('You have reached your resume limit. Please upgrade to Pro for more resumes or delete an existing resume.');
}

// Apply same changes to:
// - createTailoredResume()
// - copyResume()
```

#### Update Resume Analysis Actions (Keep Free)

**File:** `src/app/analyze-resume/actions/*`

Ensure all AI calls pass `feature: 'resume_analyzer'`:

```typescript
import { incrementAIUsage } from '@/lib/ai-request-limit';

// Before any AI call:
await incrementAIUsage(user.id, 'resume_analyzer', 'analyze_resume');
// This will log the request but NOT deduct credits
```

---

### 5. UI Components

#### Pricing Cards Component

**File:** `src/components/subscription/PricingCards.tsx`

```typescript
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PricingCardsProps {
  currentPlan?: 'free' | 'pro' | 'student';
}

export function PricingCards({ currentPlan = 'free' }: PricingCardsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST'
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const features = {
    free: [
      '4 resumes',
      '100 AI requests per month',
      'Unlimited resume analysis',
      'All templates',
      'PDF export'
    ],
    pro: [
      '8 resumes',
      '250 AI requests per month',
      'Unlimited resume analysis',
      'All templates',
      'PDF export',
      'Priority support'
    ],
    student: [
      '8 resumes (Pro features)',
      '250 AI requests per month',
      'Unlimited resume analysis',
      'All templates',
      'PDF export',
      'Verified .edu email required'
    ]
  };
  
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Free Plan */}
      <Card className={currentPlan === 'free' ? 'border-primary' : ''}>
        <CardHeader>
          <CardTitle>Free</CardTitle>
          <CardDescription>
            <span className="text-3xl font-bold">$0</span>/month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.free.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {currentPlan === 'free' && (
            <Badge variant="secondary">Current Plan</Badge>
          )}
        </CardFooter>
      </Card>
      
      {/* Pro Plan */}
      <Card className={currentPlan === 'pro' ? 'border-primary' : ''}>
        <CardHeader>
          <Badge className="w-fit mb-2">Most Popular</Badge>
          <CardTitle>Pro</CardTitle>
          <CardDescription>
            <span className="text-3xl font-bold">$9.99</span>/month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.pro.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {currentPlan === 'pro' ? (
            <Badge variant="secondary">Current Plan</Badge>
          ) : (
            <Button 
              onClick={handleUpgrade} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Upgrade to Pro'}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Student Plan */}
      <Card className={currentPlan === 'student' ? 'border-primary' : ''}>
        <CardHeader>
          <Badge className="w-fit mb-2" variant="outline">For Students</Badge>
          <CardTitle>Student</CardTitle>
          <CardDescription>
            <span className="text-3xl font-bold">Free</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.student.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {currentPlan === 'student' ? (
            <Badge variant="secondary">Current Plan</Badge>
          ) : (
            <Button 
              variant="outline"
              onClick={() => router.push('/profile')}
              className="w-full"
            >
              Verify Student Email
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
```

#### Usage Dashboard Component

**File:** `src/components/subscription/UsageDashboard.tsx`

```typescript
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { UsageStats } from '@/lib/subscription';

interface UsageDashboardProps {
  stats: UsageStats;
}

export function UsageDashboard({ stats }: UsageDashboardProps) {
  const resumePercentage = (stats.resumes_used / stats.resumes_limit) * 100;
  const creditsPercentage = (stats.ai_credits_remaining / stats.ai_credits_limit) * 100;
  const resetDate = new Date(stats.ai_credits_reset_date).toLocaleDateString();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subscription</CardTitle>
            <Badge variant={stats.plan_type === 'pro' ? 'default' : 'secondary'}>
              {stats.plan_type.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resume Usage */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Resumes</span>
              <span className="text-sm text-muted-foreground">
                {stats.resumes_used}/{stats.resumes_limit}
              </span>
            </div>
            <Progress value={resumePercentage} />
          </div>
          
          {/* AI Credits */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">AI Credits</span>
              <span className="text-sm text-muted-foreground">
                {stats.ai_credits_remaining}/{stats.ai_credits_limit}
              </span>
            </div>
            <Progress value={creditsPercentage} />
            <p className="text-xs text-muted-foreground mt-1">
              Resets on {resetDate}
            </p>
          </div>
          
          {/* Resume Analyzer Banner */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-semibold">Resume Analyzer</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Unlimited analysis for all users • Always free
            </p>
          </div>
          
          {/* Upgrade CTA */}
          {stats.plan_type === 'free' && (
            <Button className="w-full" variant="default">
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 6. Migration Script for Existing Users

**File:** `src/scripts/migrate-users-to-subscriptions.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { isStudentEmail } from '../lib/subscription';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateUsersToSubscriptions() {
  console.log('Starting user migration to subscriptions...');
  
  // Fetch all users
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }
  
  let migrated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const user of users.users) {
    try {
      // Check if subscription already exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (existingSub) {
        console.log(`Skipping user ${user.email} - subscription exists`);
        skipped++;
        continue;
      }
      
      // Count existing resumes
      const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      const currentResumeCount = resumeCount || 0;
      
      // Determine plan and limits
      const isStudent = user.email ? isStudentEmail(user.email) : false;
      let planType: 'free' | 'student' = 'free';
      let aiCredits = 100;
      let resumeLimit = 4;
      
      if (isStudent) {
        planType = 'student';
        aiCredits = 250;
        resumeLimit = 8;
      } else if (currentResumeCount > 4) {
        // Grandfather users with more than 4 resumes
        resumeLimit = currentResumeCount;
        console.log(`Grandfathering user ${user.email} with ${currentResumeCount} resumes`);
      }
      
      // Calculate next reset date (first day of next month)
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);
      
      // Create subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_type: planType,
          ai_credits_remaining: aiCredits,
          ai_credits_limit: aiCredits,
          ai_credits_reset_date: nextMonth.toISOString(),
          resume_limit: resumeLimit,
          status: 'active',
          student_email_verified: isStudent,
          student_verified_at: isStudent ? new Date().toISOString() : null
        });
      
      if (insertError) {
        console.error(`Error creating subscription for ${user.email}:`, insertError);
        errors++;
      } else {
        console.log(`✓ Migrated ${user.email} to ${planType} plan with ${resumeLimit} resume limit`);
        migrated++;
      }
      
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
      errors++;
    }
  }
  
  console.log('\nMigration complete!');
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

migrateUsersToSubscriptions();
```

**Run migration:**
```bash
pnpm tsx src/scripts/migrate-users-to-subscriptions.ts
```

---

### 7. Testing Checklist

- [ ] Database schema created and RLS policies working
- [ ] Free user can create exactly 4 resumes
- [ ] Pro user can create exactly 8 resumes
- [ ] Student user can create exactly 8 resumes
- [ ] Free user has 100 AI credits per month
- [ ] Pro user has 250 AI credits per month
- [ ] Student user has 250 AI credits per month
- [ ] AI credits reset on first day of month
- [ ] Resume analyzer never deducts credits (always free)
- [ ] Resume analyzer works for all users unlimited
- [ ] Student email auto-detected on signup
- [ ] Stripe checkout creates Pro subscription
- [ ] Stripe webhook handles subscription events
- [ ] Canceled subscription downgrades to free
- [ ] Billing portal allows subscription management
- [ ] Migration script handles existing users
- [ ] Grandfathering preserves >4 resumes
- [ ] UI shows correct plan badge
- [ ] Usage dashboard displays accurate stats
- [ ] Upgrade dialog appears when limits reached

---

## Environment Setup Instructions

### Stripe Setup

1. **Create Stripe Account:** Sign up at https://stripe.com

2. **Create Product and Price:**
   - Go to Products → Create Product
   - Name: "Resumy Pro"
   - Pricing: $9.99/month recurring
   - Copy the Price ID (starts with `price_`)

3. **Get API Keys:**
   - Go to Developers → API Keys
   - Copy "Publishable key" (starts with `pk_`)
   - Copy "Secret key" (starts with `sk_`)

4. **Set up Webhook:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy webhook signing secret (starts with `whsec_`)

5. **Add to `.env.local`:**
```bash
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
```

### Supabase Setup

Run the SQL from this document in Supabase SQL Editor to create tables, triggers, and policies.

---

## Support and Maintenance

### Monthly Credit Resets

Credits are reset automatically when users make requests (on-demand check). For optimization, consider adding a daily cron job using Supabase Edge Functions.

### Student Verification Renewal

Students should reverify annually. Add a check in the middleware:
- If `student_verified_at` is >12 months ago, prompt for reverification
- Send email reminders at 11 months

### Monitoring

Track important metrics:
- Subscription conversions (free → pro)
- Student verification rate
- AI credit usage patterns
- Resume analyzer usage (even though free)
- Churn rate

---

## Future Enhancements

1. **Annual Pro Plan:** Offer discounted annual subscription ($99/year = ~17% off)
2. **Team Plans:** Allow organizations to manage multiple users
3. **Usage Analytics:** Dashboard showing AI request history and patterns
4. **Credit Top-ups:** Allow purchasing additional AI credits without plan upgrade
5. **International Pricing:** Regional pricing for different markets
6. **Referral Program:** Give bonus credits for referring friends
7. **Enterprise Plan:** Custom limits and white-label options for universities

---

## Rollback Plan

If issues arise:

1. Keep old localStorage-based limit system as fallback
2. Add feature flag to switch between old/new system
3. Maintain both code paths during transition period
4. Can disable Stripe integration without breaking core features

---

**Document Version:** 1.0  
**Last Updated:** December 11, 2025  
**Status:** Ready for Implementation

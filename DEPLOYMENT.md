# Resumy Deployment Guide

This guide covers deployment options for the main Resumy app.

## Option 1: Vercel

1. Import repository in Vercel.
2. Add required environment variables from `.env.example`.
3. Set build command to `pnpm build`.
4. Deploy and verify core routes, auth, and API calls.

## Option 2: Cloudflare (OpenNext on Workers)

This repo is configured for Cloudflare with OpenNext.

### Prerequisites

- Cloudflare account and Wrangler authentication (`wrangler login`)
- Node.js 20+
- pnpm

### Scripts

- `pnpm build:cf` builds worker assets via OpenNext
- `pnpm preview:cf` runs a local worker preview
- `pnpm deploy:cf` builds and deploys with Wrangler
- `pnpm cf-typegen` generates `cloudflare-env.d.ts`

### Deploy Steps

1. Install dependencies:

```bash
pnpm install
```

2. Build for Cloudflare:

```bash
pnpm build:cf
```

3. Preview locally in a Cloudflare-like runtime:

```bash
pnpm preview:cf
```

4. Deploy:

```bash
pnpm deploy:cf
```

### Required Environment Variables

Set these in Cloudflare Workers Builds (or via Wrangler secrets/vars):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SHARE_URL`

Optional variables:

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `ENABLE_MIGRATION_ROUTE`
- `MIGRATION_ROUTE_TOKEN`

## Verification Checklist

- Auth login/logout works
- Resume create/edit/save works
- AI generation routes return expected output
- Analyze resume upload path works
- Share links open correctly and analytics still update in share service
- Notifications and push registration are functional

## Notes

- Cloudflare full-stack Next.js deployments are handled via the OpenNext adapter.
- Static-only Next.js on Pages is a different flow and is not enough for this app's API-heavy runtime.

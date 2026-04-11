# Resumy

AI-powered resume builder built with Next.js 15, Supabase, and the Vercel AI SDK.

Resumy helps users create base resumes, generate tailored resumes for specific jobs, improve content with AI, analyze ATS readiness, generate cover letters and cold emails, and share resumes with view analytics.

## Repository Standards

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

These files are included so GitHub can show the built-in top repository tabs for README, Code of conduct, and Contributing.

## Preview

![Resumy Dashboard](public/images/Dashboard.png)

## Core Features

- Resume workspace with base and tailored resume flows
- Rich resume editor with live preview and autosave
- AI assistant for section improvements and resume editing help
- ATS analysis with scoring, keyword insights, and recommendations
- Cover letter editor and cold email generation
- Resume template gallery and template switching
- Public resume sharing with view analytics
- Browser push notifications for share activity
- Feedback/bug reporting system
- Supabase authentication and row-level security

## Tech Stack

- Framework: Next.js 15 (App Router), React 19, TypeScript
- UI: Tailwind CSS, Radix UI, shadcn-style components
- Data/Auth: Supabase (Postgres + Auth + RLS)
- AI: Vercel AI SDK with provider support (Google, OpenAI, Anthropic, Groq, DeepSeek, xAI)
- Infra utilities: Upstash Redis for rate limiting and related operations

## Project Structure

```text
src/
  app/                 # Routes, layouts, and API endpoints
  components/          # UI and feature components
  hooks/               # Custom React hooks
  lib/                 # Core libraries, constants, schemas, utilities
  utils/               # Server/client helpers, actions, Supabase utilities
  types/               # Shared TypeScript types
public/                # Static assets (images, templates, icons)
schema.sql             # Database schema and policies
```

## Getting Started

### 1. Prerequisites

- Node.js 20+
- pnpm (recommended), npm, or yarn
- Supabase project
- At least one AI provider API key (for AI features)

### 2. Install Dependencies

```bash
git clone https://github.com/Happyesss/resumyy.git
cd resumyy
pnpm install
```

### 3. Configure Environment Variables

Copy the example file and update values.

```bash
cp .env.example .env.local
```

Minimum required variables:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Optional but recommended:

```env
UPSTASH_REDIS_REST_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
NEXT_PUBLIC_SHARE_URL="http://localhost:3001"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

### 4. Set Up Database

Run [schema.sql](schema.sql) in your Supabase SQL editor to create tables, indexes, triggers, and RLS policies.

### 5. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000.

## Available Scripts

```bash
pnpm dev         # Start dev server (Turbopack)
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Lint
pnpm lint:fix    # Lint and fix
pnpm type-check  # TypeScript type check
```

## Documentation

- Setup details: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Deployment details: [DEPLOYMENT.md](DEPLOYMENT.md)
- Subscription/reference notes: [SUBSCRIPTION_PLAN.md](SUBSCRIPTION_PLAN.md)

## Contributing

Contributions are welcome.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Important: All contributions must flow through the dev branch. Do not open pull requests directly against main.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE).

# Resumy Setup Guide

This guide will help you set up and run the Resumy application locally. Resumy is a free and open-source AI-powered resume builder that uses Gemini API for AI features.

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Supabase account (optional, for authentication)
- Gemini API key

## Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/resume-lm.git
cd resume-lm
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (Required)
DATABASE_URL=postgresql://user:password@localhost:5432/resumy

# Authentication (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini API (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key
```

4. **Set up the database**

Run the SQL scripts to create the necessary tables:

```bash
psql -U your_username -d resumy -f schema.sql
psql -U your_username -d resumy -f schema-free-version.sql
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000)

## Setting Up Your API Key

1. After registering and logging in, go to the Settings page
2. Click on the "API Keys" tab
3. Add your Gemini API key in the designated field
4. Click Save

## Features

- Create unlimited base and tailored resumes
- AI-powered content suggestions and improvements
- Cover letter generation
- PDF export
- Job application tracking
- Interactive AI writing assistant

## Troubleshooting

- **Database Connection Issues**: Make sure your PostgreSQL service is running and the DATABASE_URL is correct
- **API Key Errors**: Verify that your Gemini API key is valid and has not expired
- **Authentication Problems**: Check your Supabase configuration and ensure the keys are correct

## Contact and Support

For support, bug reports, or feature requests, please open an issue on the GitHub repository.

---

Enjoy using Resumy! Thank you for supporting open source software.

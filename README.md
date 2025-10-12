<div align="center">
  <img src="public/logo.png" alt="Resumy Logo" width="120" height="120"/>
  <h1>Resumy - AI-Powered Resume Builder</h1>
  <p><strong>Create professional, ATS-optimized resumes with the power of AI</strong></p>
  
  [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
  
  <h3>🚀 <a href="https://resumy.live">Try Live Demo</a></h3>
</div>

---

## 🌟 Overview

**Resumy** is a completely **free**, AI-powered resume builder that helps job seekers create professional, ATS-optimized resumes tailored for specific job applications. With our intuitive interface and advanced AI integration, you can build unlimited resumes without any subscriptions or payments.

<div align="center">
  <img src="public/images/Dashboard.png" alt="Resumy Dashboard" width="800"/>
  <p><em>Modern, intuitive dashboard for managing all your resumes</em></p>
</div>

## ✨ Key Features

### 📊 Advanced Resume Analysis & Optimization
<div align="center">
  <img src="public/images/analyze.png" alt="Resume Analysis" width="700"/>
  <p><em>Advanced resume analysis and optimization features</em></p>
</div>

- **🎯 ATS Scoring System**: Real-time feedback to optimize resume compatibility
- **📈 Performance Analytics**: Track how well your resume performs against job requirements
- **🔍 Content Analysis**: Deep analysis of keywords, formatting, and structure
- **💡 Smart Suggestions**: AI-powered recommendations for content improvement
- **📊 Compatibility Reports**: Detailed insights on ATS-friendliness

### 🎯 Intelligent Resume Management
<div align="center">
  <img src="public/images/editorImage.png" alt="Resume Editor Interface" width="700"/>
  <p><em>Powerful resume editor with real-time AI suggestions</em></p>
</div>

- **📝 Two-Tier System**: Create base resumes and generate tailored versions for specific jobs
- **💼 Comprehensive Sections**: Work experience, education, projects, skills, and more
- **🎨 Professional Templates**: Clean, modern designs that pass ATS systems
- **📱 Mobile-First Design**: Responsive interface that works everywhere

### 🤖 AI-Powered Intelligence
<div align="center">
  <img src="public/images/SS Chat.png" alt="AI Chat Assistant" width="700"/>
  <p><em>Interactive AI assistant for personalized resume guidance</em></p>
</div>

- **💡 Smart Content Suggestions**: AI-generated content for all resume sections
- **🎯 Job Analysis**: Intelligent parsing of job descriptions for optimization
- **💬 Interactive Assistant**: Real-time chat support for resume improvement
- **✨ Content Enhancement**: Automatic suggestions for better phrasing and impact

### 📧 Advanced Features
<div align="center">
  <img src="public/images/coldmail.png" alt="Cold Email Generation" width="350"/>
  <img src="public/images/coverletter.png" alt="Cover Letter Builder" width="350"/>
</div>
<p align="center"><em>AI-powered cold email generation and cover letter creation</em></p>

- **📧 Cold Email Generation**: AI-crafted outreach emails for networking
- **📝 Cover Letter Builder**: Integrated cover letter creation synchronized with resume data
- **� Data Synchronization**: Seamless integration between all documents
- **📁 Export Options**: Multiple format support for all generated documents

### 🔐 Enterprise-Grade Security
- **🔒 Row Level Security**: Advanced database protection with Supabase RLS
- **🚀 Server-Side Rendering**: Fast, secure Next.js 15 App Router implementation
- **📄 Real-Time PDF Generation**: Instant preview and export capabilities
- **🔄 Live Updates**: Real-time synchronization across all features

### 💎 Completely Free
- **🆓 No Subscriptions**: Unlimited access to all features forever
- **🔑 Bring Your Own API**: Use your Google Gemini API key for AI features
- **📱 Unlimited Usage**: Create as many resumes as you need
- **🌟 Full Feature Access**: No premium tiers or hidden limitations

## 🛠️ Technology Stack

<div align="center">
  <img src="public/images/templates.png" alt="Resume Templates" width="700"/>
  <p><em>Professional templates built with modern web technologies</em></p>
</div>

### 🎨 Frontend Technologies
```
├── ⚡ Next.js 15          # App Router & Server Components
├── ⚛️ React 19           # Latest React features
├── 📘 TypeScript         # Type-safe development
├── 🎨 Tailwind CSS       # Utility-first styling
├── 🧩 Shadcn UI          # Beautiful component library
├── 📄 React PDF          # Client-side PDF generation
└── 🎭 Framer Motion      # Smooth animations
```

### 🧠 AI & Backend Services
```
├── 🤖 Google Gemini API  # Advanced AI processing
├── 🔄 Server Actions     # Type-safe server functions
├── 📊 Structured Data    # JSON-based data format
├── 🔍 Intelligent Parsing # Job description analysis
└── 💡 Content Generation # AI-powered suggestions
```

### �️ Database & Authentication
```
├── 🐘 PostgreSQL         # Robust relational database
├── 🔒 Supabase RLS       # Row Level Security
├── 🔐 Supabase Auth      # Authentication system
├── 👤 User Profiles      # Comprehensive user management
└── 📊 Real-time Sync     # Live data updates
```

### 🎨 Design Philosophy
- **🌊 Layered Depth**: Multi-level visual hierarchy with translucent layers
- **⚡ Organic Motion**: Subtle, purposeful animations that enhance UX
- **🎯 Focused Layout**: Strategic white space for improved content digestion
- **🔄 Consistent Interaction**: Predictable and intuitive user interface patterns

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 18+** and **npm/pnpm**
- **Supabase Account** (free tier available)
- **Google Gemini API Key** (for AI features)

### 1️⃣ Clone & Install
```bash
# Clone the repository
git clone https://github.com/Happyesss/resumyy.git
cd resumyy

# Install dependencies (recommended: pnpm)
pnpm install
# or npm install
```

### 2️⃣ Environment Setup
```bash
# Copy environment template
cp .env.example .env.local
```

**Required Environment Variables:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3️⃣ Database Setup

<details>
<summary>🔧 <strong>Supabase Database Configuration</strong></summary>

**Option A: Supabase Dashboard (Recommended)**
1. Create a new [Supabase project](https://supabase.com/dashboard)
2. Navigate to **SQL Editor** in your dashboard
3. Copy the contents of `schema.sql` from this repository
4. Paste and execute the SQL script

**Option B: Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push database schema
supabase db push
```

**Database Tables Created:**
- `profiles` - User profile and professional information
- `resumes` - Resume data and content
- `jobs` - Job descriptions for resume tailoring
</details>

### 4️⃣ Development Server
```bash
# Start development server with Turbopack
pnpm dev

# Or with npm
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** to see Resumy in action!

---

### 📋 Additional Commands
```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Production build
pnpm build
pnpm start
```

## 🏗️ Development Status

### ✅ Production Ready Features
- **🎯 Resume Management**: Complete CRUD operations for resumes and profiles
- **🤖 AI Integration**: Full Gemini API integration with content generation
- **📄 PDF Export**: High-quality PDF generation with custom templates
- **🔐 Authentication**: Secure user management with Supabase Auth
- **📱 Responsive Design**: Mobile-first approach with modern UI/UX
- **⚡ Performance**: Optimized with Next.js 15 and Server Components
- **🔒 Security**: Row Level Security (RLS) and data protection

### 🚧 Upcoming Features
- **🎨 Template Library**: Additional professional resume templates
- **� Analytics Dashboard**: Resume performance tracking and insights
- **🔗 Integration Hub**: LinkedIn import, job board connections
- **🎯 Advanced AI**: Enhanced tailoring algorithms and suggestions
- **� Career Tools**: Interview prep, salary insights, career guidance

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🛠️ Development Setup
1. Fork the repository
2. Follow the [Quick Start Guide](#-quick-start-guide) above
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes and test thoroughly
5. Submit a pull request with a clear description

### � Contribution Guidelines
- **Code Style**: Follow the existing TypeScript and React patterns
- **Testing**: Ensure all features work across different browsers
- **Documentation**: Update README and inline comments as needed
- **Performance**: Maintain fast loading times and responsive design

### 🐛 Bug Reports & Feature Requests
- Use GitHub Issues for bug reports and feature requests
- Provide detailed descriptions and reproduction steps
- Include screenshots or screen recordings when helpful

---

## 📋 License

<div align="center">
  
### Apache License 2.0

This project is open source and available under the [Apache License 2.0](LICENSE)

<table>
  <tr>
    <td align="center">
      <h4>✅ Permissions</h4>
      <ul align="left">
        <li>Commercial use</li>
        <li>Modification</li>
        <li>Distribution</li>
        <li>Patent use</li>
        <li>Private use</li>
      </ul>
    </td>
    <td align="center">
      <h4>📋 Conditions</h4>
      <ul align="left">
        <li>License and copyright notice</li>
        <li>State changes</li>
      </ul>
    </td>
    <td align="center">
      <h4>❌ Limitations</h4>
      <ul align="left">
        <li>Liability</li>
        <li>Warranty</li>
      </ul>
    </td>
  </tr>
</table>

<p><em>You are free to use, modify, and distribute this software for any purpose, including commercial use.</em></p>

</div>

---

<div align="center">
  <h3>🌟 Star this repository if you find it helpful!</h3>
  <p>Built with ❤️ by the open-source community</p>
  
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Powered%20by-Next.js-black" alt="Powered by Next.js"/>
    </a>
    <a href="https://supabase.com">
      <img src="https://img.shields.io/badge/Database-Supabase-green" alt="Database by Supabase"/>
    </a>
    <a href="https://ai.google.dev">
      <img src="https://img.shields.io/badge/AI-Google%20Gemini-blue" alt="AI by Google Gemini"/>
    </a>
  </p>
</div>

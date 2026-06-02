import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://resumy.live'
  const now = new Date()

  return [
    // ─── Core pages (highest priority) ───────────────────────────────────────
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/analyze-resume`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },

    // ─── Auth pages ───────────────────────────────────────────────────────────
    {
      url: `${baseUrl}/auth/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // ─── Legal ───────────────────────────────────────────────────────────────
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },

    // ─── SEO landing pages — short keywords ──────────────────────────────────
    {
      url: `${baseUrl}/free-resume-builder`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.98,
    },
    {
      url: `${baseUrl}/ai-resume-builder`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.97,
    },
    {
      url: `${baseUrl}/resume-maker`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/resume-templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.93,
    },
    {
      url: `${baseUrl}/cv-maker`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/ats-resume-builder`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.92,
    },
    {
      url: `${baseUrl}/resume-checker`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/resume-scanner`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/online-resume-builder`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.93,
    },
    {
      url: `${baseUrl}/professional-resume-builder`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.91,
    },

    // ─── Competitor alternatives (high intent) ────────────────────────────────
    {
      url: `${baseUrl}/free-resume-builder-no-watermark`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.92,
    },
    {
      url: `${baseUrl}/free-resume-builder-no-sign-up`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.91,
    },
    {
      url: `${baseUrl}/alternatives/zety-alternative`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/alternatives/novoresume-alternative`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/alternatives/resume-io-alternative`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/alternatives/canva-resume-alternative`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/alternatives/kickresume-alternative`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.84,
    },

    // ─── Industry-specific resume pages ──────────────────────────────────────
    {
      url: `${baseUrl}/resume-templates/software-engineer`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/resume-templates/data-scientist`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.84,
    },
    {
      url: `${baseUrl}/resume-templates/product-manager`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.83,
    },
    {
      url: `${baseUrl}/resume-templates/marketing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/resume-templates/finance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/resume-templates/healthcare`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.82,
    },
    {
      url: `${baseUrl}/resume-templates/nursing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.81,
    },
    {
      url: `${baseUrl}/resume-templates/teacher`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.81,
    },
    {
      url: `${baseUrl}/resume-templates/fresher`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.83,
    },
    {
      url: `${baseUrl}/resume-templates/student`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.83,
    },
    {
      url: `${baseUrl}/resume-templates/executive`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.81,
    },
    {
      url: `${baseUrl}/resume-templates/remote-work`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },

    // ─── Long-tail SEO guide pages ────────────────────────────────────────────
    {
      url: `${baseUrl}/guides/how-to-make-a-resume`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.92,
    },
    {
      url: `${baseUrl}/guides/how-to-write-a-resume`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.91,
    },
    {
      url: `${baseUrl}/guides/ats-resume`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/guides/resume-writing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/guides/ats-friendly-resume`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.89,
    },
    {
      url: `${baseUrl}/guides/resume-tips-2025`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/guides/resume-keywords`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/guides/resume-summary-examples`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${baseUrl}/guides/resume-objective-examples`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/guides/resume-for-freshers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/guides/resume-for-career-change`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/guides/what-to-put-on-a-resume`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${baseUrl}/guides/resume-format-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${baseUrl}/guides/best-resume-format`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/guides/ai-resume-builder-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/guides/free-resume-builder-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/guides/how-to-pass-ats`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${baseUrl}/guides/resume-action-verbs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.84,
    },
    {
      url: `${baseUrl}/guides/resume-skills-section`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.84,
    },
    {
      url: `${baseUrl}/guides/cover-letter-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.83,
    },
    {
      url: `${baseUrl}/guides/linkedin-profile-tips`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },
    {
      url: `${baseUrl}/guides/job-search-tips`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.80,
    },

    // ─── Blog ─────────────────────────────────────────────────────────────────
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.92,
    },
    ...getAllPosts().map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.88,
    })),
  ]
}

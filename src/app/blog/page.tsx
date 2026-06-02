import { BlogCard } from '@/components/blog/blog-card';
import { Footer } from '@/components/layout/footer';
import { getAllPosts, getFeaturedPosts, CATEGORY_COLORS } from '@/lib/blog-data';
import type { BlogCategory } from '@/lib/blog-data';
import { BookOpen, Rss } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Resume & ATS Tips, Career Advice | Resumy',
  description:
    'Expert guides on ATS resume optimization, free resume builders, job search strategy, and career tips. Everything you need to land more interviews in 2025.',
  keywords: [
    'resume tips',
    'ATS resume guide',
    'how to beat ATS',
    'free resume builder tips',
    'career advice 2025',
    'resume writing guide',
    'job search tips',
    'ATS optimization',
    'resume keywords guide',
    'professional resume tips',
  ],
  openGraph: {
    title: 'Blog — Resume & ATS Tips | Resumy',
    description:
      'Expert guides on ATS optimization, resume writing, and career advice. Free from Resumy.',
    type: 'website',
    url: 'https://resumy.live/blog',
  },
  alternates: { canonical: 'https://resumy.live/blog' },
};

const ALL_CATEGORIES: BlogCategory[] = [
  'ATS Guide',
  'Resume Tips',
  'Career Advice',
  'AI Tools',
  'Job Search',
  'Templates',
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const activeCategory = category as BlogCategory | undefined;

  const filteredPosts = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts;

  const nonFeaturedFiltered = activeCategory
    ? filteredPosts
    : filteredPosts.filter((p) => !p.featured);

  return (
    <>
      <main className="min-h-screen bg-[#050505]">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 pb-20 px-4">
          {/* Background glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300 mb-6">
              <Rss className="h-3.5 w-3.5" />
              Resume & Career Intelligence
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              The Resume &amp;{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                ATS Playbook
              </span>
            </h1>

            <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Expert guides on beating ATS, writing resumes that get interviews,
              and building a career that compounds. All completely free.
            </p>

            <div className="flex items-center justify-center gap-3 text-sm text-white/40">
              <BookOpen className="h-4 w-4" />
              <span>{allPosts.length} articles</span>
              <span>·</span>
              <span>Updated weekly</span>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* ── Featured posts (only when no category filter) ──────────────── */}
          {!activeCategory && featuredPosts.length > 0 && (
            <section className="mb-16">
              <SectionLabel>Featured</SectionLabel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
                {featuredPosts.slice(0, 2).map((post) => (
                  <BlogCard key={post.slug} post={post} variant="featured" />
                ))}
              </div>
            </section>
          )}

          {/* ── Category filter ────────────────────────────────────────────── */}
          <section className="mb-10">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                  !activeCategory
                    ? 'border-purple-500/50 bg-purple-500/15 text-purple-300'
                    : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/80'
                }`}
              >
                All
              </Link>
              {ALL_CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                    activeCategory === cat
                      ? `${CATEGORY_COLORS[cat]} border-opacity-50`
                      : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>

          {/* ── Post grid ─────────────────────────────────────────────────── */}
          <section>
            {activeCategory && (
              <SectionLabel>{activeCategory}</SectionLabel>
            )}
            {!activeCategory && <SectionLabel>All Articles</SectionLabel>}

            {filteredPosts.length === 0 ? (
              <p className="mt-10 text-white/40 text-center py-20">
                No articles in this category yet. Check back soon.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {nonFeaturedFiltered.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </section>

          {/* ── Bottom CTA ────────────────────────────────────────────────── */}
          <section className="mt-20 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Put the knowledge to work
            </h2>
            <p className="text-white/55 mb-7 max-w-lg mx-auto">
              Build an ATS-optimized resume with Resumy — completely free, no
              credit card, no paywall.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/home"
                className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-3 transition-colors duration-200 text-sm"
              >
                Build Your Resume Free →
              </Link>
              <Link
                href="/analyze-resume"
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 font-medium px-8 py-3 transition-colors duration-200 text-sm"
              >
                Check ATS Score Free
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-1">
      {children}
    </h2>
  );
}

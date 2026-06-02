import { BlogCard } from '@/components/blog/blog-card';
import { BlogFAQSection, BlogSection } from '@/components/blog/blog-content';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { Footer } from '@/components/layout/footer';
import {
  CATEGORY_COLORS,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from '@/lib/blog-data';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://resumy.live/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
  };
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────

function buildArticleSchema(post: ReturnType<typeof getPostBySlug>) {
  if (!post) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Organization', name: post.author, url: 'https://resumy.live' },
    publisher: {
      '@type': 'Organization',
      name: 'Resumy',
      logo: { '@type': 'ImageObject', url: 'https://resumy.live/favicon/site.webmanifest' },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://resumy.live/blog/${post.slug}` },
    keywords: post.keywords.join(', '),
  };
}

function buildFAQSchema(post: ReturnType<typeof getPostBySlug>) {
  if (!post || post.faq.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.relatedSlugs);
  const categoryStyle = CATEGORY_COLORS[post.category];

  // Build TOC entries from sections + FAQ
  const tocEntries = [
    ...post.sections.map((s) => ({ id: s.id, title: s.title, level: 2 })),
    ...(post.faq.length > 0 ? [{ id: 'faq', title: 'FAQ', level: 2 }] : []),
  ];

  const articleSchema = buildArticleSchema(post);
  const faqSchema = buildFAQSchema(post);

  return (
    <>
      {articleSchema && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <ReadingProgress />

      <main className="min-h-screen bg-[#050505]">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <header className="relative overflow-hidden pt-24 pb-14 px-4">
          {/* Gradient backdrop */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${post.coverGradient} opacity-[0.07]`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-20"
            style={{
              background:
                'radial-gradient(ellipse, rgb(139,92,246), transparent)',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Blog
              </Link>
              <span className="text-white/20">/</span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryStyle}`}>
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.1] mb-6">
              {post.title}
            </h1>

            <p className="text-white/55 text-lg leading-relaxed mb-8">
              {post.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
              <span className="text-white/20">Updated {formatDate(post.updatedAt)}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── Body: ToC + Content ────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex gap-10 lg:gap-16 items-start">
            {/* Left: sticky ToC (desktop) */}
            <TableOfContents sections={tocEntries} variant="desktop" />

            {/* Right: article */}
            <article className="min-w-0 flex-1 max-w-3xl">
              {/* Mobile ToC */}
              <TableOfContents sections={tocEntries} variant="mobile" />

              {/* Sections */}
              {post.sections.map((section) => (
                <BlogSection key={section.id} section={section} />
              ))}

              {/* FAQ */}
              <BlogFAQSection items={post.faq} />

              {/* Article footer */}
              <div className="mt-14 pt-8 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/40">
                    Published by{' '}
                    <span className="text-white/70 font-medium">{post.author}</span>
                  </div>
                  <ShareButton title={post.title} />
                </div>
              </div>

              {/* Inline CTA */}
              <div className="mt-10 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-purple-500/20 p-2.5">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-1">
                      Ready to put this into practice?
                    </h3>
                    <p className="text-sm text-white/55 mb-4">
                      Build an ATS-optimized resume with Resumy for free — no credit
                      card, no subscription, no paywall.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/home"
                        className="rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
                      >
                        Build Resume Free →
                      </Link>
                      <Link
                        href="/analyze-resume"
                        className="rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium px-5 py-2.5 transition-colors"
                      >
                        Check ATS Score
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* ── Related posts ──────────────────────────────────────────── */}
          {relatedPosts.length > 0 && (
            <section className="mt-20">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedPosts.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function ShareButton({ title: _title }: { title: string }) {
  // Server component — only renders the icon; interactivity added via CSS/attr
  return (
    <button
      type="button"
      aria-label="Share this article"
      className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
      onClick={undefined} // handled client-side if needed
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}

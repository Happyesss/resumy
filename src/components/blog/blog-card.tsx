'use client';

import { CATEGORY_COLORS } from '@/lib/blog-data';
import type { BlogPost } from '@/lib/blog-data';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const categoryStyle = CATEGORY_COLORS[post.category];

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-purple-500/10">
          {/* Gradient top bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${post.coverGradient}`} />

          <div className="p-8 md:p-10 lg:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${categoryStyle}`}>
                {post.category}
              </span>
              <span className="text-white/30 text-xs">Featured</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight mb-4 group-hover:text-purple-200 transition-colors duration-200">
              {post.title}
            </h2>

            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-white/40 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min read
                </span>
              </div>
              <span className="flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all duration-200">
                Read article
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="flex items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]">
          <div className={`mt-1 h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br ${post.coverGradient} opacity-80`} />
          <div className="min-w-0">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium mb-1.5 ${categoryStyle}`}>
              {post.category}
            </span>
            <h3 className="text-sm font-medium text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
              {post.title}
            </h3>
            <p className="mt-1 text-xs text-white/40 flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {post.readTime} min
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-0.5">
        {/* Color bar */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${post.coverGradient}`} />

        {/* Gradient header */}
        <div className={`h-32 bg-gradient-to-br ${post.coverGradient} opacity-20 relative`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="flex flex-col flex-1 p-6 -mt-8 relative z-10">
          <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium mb-3 ${categoryStyle}`}>
            {post.category}
          </span>

          <h2 className="text-base font-semibold text-white leading-snug mb-2 line-clamp-3 group-hover:text-purple-200 transition-colors duration-200">
            {post.title}
          </h2>

          <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 text-white/35 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} min
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
      </article>
    </Link>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

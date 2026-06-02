'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

interface TocEntry {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  sections: TocEntry[];
  className?: string;
  variant?: 'desktop' | 'mobile' | 'both';
}

export function TableOfContents({
  sections,
  className,
  variant = 'both',
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false); // for mobile accordion
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the topmost visible section
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length > 0) {
      setActiveId(visible[0].target.id);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    });

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections, handleIntersect]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  if (sections.length === 0) return null;

  return (
    <>
      {(variant === 'desktop' || variant === 'both') && (
        <aside
          className={cn(
            'hidden lg:block sticky top-24 self-start w-64 xl:w-72 shrink-0',
            className
          )}
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              On this page
            </p>
            <nav>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={cn(
                        'w-full text-left text-sm leading-snug rounded-lg px-3 py-2 transition-all duration-150',
                        section.level === 2 ? 'pl-3' : 'pl-6',
                        activeId === section.id
                          ? 'bg-purple-500/15 text-purple-300 font-medium'
                          : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      )}

      {(variant === 'mobile' || variant === 'both') && (
        <div className="lg:hidden mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-medium text-white/70"
          >
            <span className="flex items-center gap-2">
              <List className="h-4 w-4 text-purple-400" />
              Table of Contents
            </span>
            <span
              className={cn(
                'text-white/40 transition-transform duration-200',
                isOpen ? 'rotate-180' : ''
              )}
            >
              ▾
            </span>
          </button>
          {isOpen && (
            <nav className="px-4 pb-4">
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollTo(section.id)}
                      className={cn(
                        'w-full text-left text-sm leading-snug rounded-lg px-3 py-2 transition-all duration-150',
                        section.level === 2 ? 'pl-3' : 'pl-6',
                        activeId === section.id
                          ? 'bg-purple-500/15 text-purple-300 font-medium'
                          : 'text-white/45 hover:text-white/80'
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}
    </>
  );
}

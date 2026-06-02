import type { BlogSection, BlogFAQ } from '@/lib/blog-data';
import { ChevronDown } from 'lucide-react';

// ─── Single section ───────────────────────────────────────────────────────────

interface SectionProps {
  section: BlogSection;
}

export function BlogSection({ section }: SectionProps) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-5 mt-12 first:mt-0 flex items-start gap-3 before:content-[''] before:mt-2 before:block before:w-3 before:h-3 before:rounded-sm before:bg-gradient-to-br before:from-purple-500 before:to-indigo-600 before:shrink-0">
        {section.title}
      </h2>
      <div
        className="blog-prose"
        // Content is hardcoded static HTML — safe to use
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

interface FAQProps {
  items: BlogFAQ[];
}

export function BlogFAQSection({ items }: FAQProps) {
  if (items.length === 0) return null;
  return (
    <section id="faq" className="scroll-mt-24 mt-14">
      <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-6 flex items-start gap-3 before:content-[''] before:mt-2 before:block before:w-3 before:h-3 before:rounded-sm before:bg-gradient-to-br before:from-purple-500 before:to-indigo-600 before:shrink-0">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <FAQItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-200 open:border-purple-500/20 open:bg-purple-500/5">
      <summary className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 text-sm font-medium text-white/80 list-none select-none">
        <span className="leading-snug">{question}</span>
        <ChevronDown className="h-4 w-4 shrink-0 mt-0.5 text-white/40 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

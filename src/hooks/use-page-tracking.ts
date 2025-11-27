'use client';

import { pageview } from '@/lib/analytics';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);
}

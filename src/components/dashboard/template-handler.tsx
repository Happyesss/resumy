'use client';

import { CreateBaseResumeDialog } from '@/components/resume/management/dialogs/create-base-resume-dialog';
import { Button } from '@/components/ui/button';
import { Profile } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TemplateHandlerProps {
  profile: Profile;
}

export function TemplateHandler({ profile }: TemplateHandlerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [_shouldShow, setShouldShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  const shouldCreateBase = searchParams?.get('createBase') === 'true';
  const _templateId = searchParams?.get('template');

  useEffect(() => {
    setMounted(true);
    setShouldShow(shouldCreateBase);
  }, [shouldCreateBase]);

  useEffect(() => {
    // Auto-trigger dialog if URL parameters are present
    if (mounted && shouldCreateBase) {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        const button = document.getElementById('template-dialog-trigger');
        if (button) {
          button.click();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [mounted, shouldCreateBase]);

  const _handleAfterCreate = () => {
    // Clean up URL parameters after dialog closes
    const url = new URL(window.location.href);
    url.searchParams.delete('createBase');
    url.searchParams.delete('template');
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return null;
  }

  return (
    <CreateBaseResumeDialog profile={profile}>
      <Button 
        id="template-dialog-trigger"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        Hidden Trigger
      </Button>
    </CreateBaseResumeDialog>
  );
}

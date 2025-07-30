// Google Analytics utility functions
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-TXWV913LE4';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Common tracking events for the resume builder
export const trackResumeEvent = {
  // Resume creation events
  startResumeCreation: () => event({
    action: 'start_resume_creation',
    category: 'Resume',
  }),
  
  completeResumeCreation: () => event({
    action: 'complete_resume_creation',
    category: 'Resume',
  }),
  
  downloadResume: (format: string) => event({
    action: 'download_resume',
    category: 'Resume',
    label: format,
  }),
  
  // Template events
  selectTemplate: (templateName: string) => event({
    action: 'select_template',
    category: 'Template',
    label: templateName,
  }),
  
  // AI events
  useAIAssistance: (feature: string) => event({
    action: 'use_ai_assistance',
    category: 'AI',
    label: feature,
  }),
  
  // User engagement
  signUp: () => event({
    action: 'sign_up',
    category: 'User',
  }),
  
  signIn: () => event({
    action: 'sign_in',
    category: 'User',
  }),
  
  // Cover letter events
  createCoverLetter: () => event({
    action: 'create_cover_letter',
    category: 'Cover Letter',
  }),
  
  // Analysis events
  analyzeResume: () => event({
    action: 'analyze_resume',
    category: 'Analysis',
  }),
};

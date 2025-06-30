/**
 * Resume Preview Component
 * 
 * This component generates a PDF resume using @react-pdf/renderer and displays it using react-pdf.
 * It supports two variants: base and tailored resumes, with consistent styling and layout.
 * The PDF is generated client-side and updates whenever the resume data changes.
 */

"use client";

import { Resume } from "@/lib/types";
import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from './resume-pdf-document';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

// Import required CSS for react-pdf
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Cache for storing generated PDFs
const pdfCache = new Map<string, { url: string; timestamp: number }>();

// Cache cleanup interval (5 minutes)
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000;

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION_TIME = 30 * 60 * 1000;

/**
 * Generate a simple hash from the resume content
 * This is used as a cache key for PDF generation
 */
function generateResumeHash(resume: Resume): string {
  const content = JSON.stringify({
    basic: {
      name: `${resume.first_name} ${resume.last_name}`,
      contact: [resume.email, resume.phone_number, resume.location, resume.website, resume.linkedin_url, resume.github_url],
    },
    sections: {
      skills: resume.skills,
      experience: resume.work_experience,
      projects: resume.projects,
      education: resume.education,
    },
    settings: {},
  });
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Cleanup expired cache entries
 */
function cleanupCache() {
  const now = Date.now();
  for (const [hash, { url, timestamp }] of pdfCache.entries()) {
    if (now - timestamp > CACHE_EXPIRATION_TIME) {
      URL.revokeObjectURL(url);
      pdfCache.delete(hash);
    }
  }
}

// Setup cache cleanup interval
if (typeof window !== 'undefined') {
  setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);
}

// Add custom styles for PDF annotations to ensure links are clickable
const customStyles = `
  .react-pdf__Page__annotations {
    pointer-events: auto !important;
    z-index: 10 !important;
  }
  .react-pdf__Page__annotations.annotationLayer {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
`;

interface ResumePreviewProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
  containerWidth: number;  // This is now expected to be a percentage (0-100)
}

/**
 * ResumePreview Component
 * 
 * Displays a PDF preview of the resume using react-pdf.
 * Handles PDF generation and responsive display.
 */
export const ResumePreview = memo(function ResumePreview({ resume, variant = 'base', containerWidth }: ResumePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const debouncedWidth = useDebouncedValue(containerWidth, 300); // Increased debounce time
  

  // Convert percentage to pixels based on parent container
  const getPixelWidth = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    return debouncedWidth;
  }, [debouncedWidth]);

  // Generate resume hash for caching - memoized to prevent unnecessary recalculations
  const resumeHash = useMemo(() => generateResumeHash(resume), [resume]);

  // Add styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Generate or retrieve PDF from cache
  useEffect(() => {
    let currentUrl: string | null = null;

    async function generatePDF() {
      try {
        // Validate resume data before generating PDF
        if (!resume || typeof resume !== 'object') {
          console.warn('Invalid resume data provided to PDF generator');
          return;
        }

        // Ensure all required array fields exist and are arrays
        const validatedResume = {
          ...resume,
          first_name: resume.first_name || 'First',
          last_name: resume.last_name || 'Last', 
          email: resume.email || '',
          phone_number: resume.phone_number || '',
          location: resume.location || '',
          website: resume.website || '',
          linkedin_url: resume.linkedin_url || '',
          github_url: resume.github_url || '',
          work_experience: Array.isArray(resume.work_experience) ? resume.work_experience : [],
          education: Array.isArray(resume.education) ? resume.education : [],
          projects: Array.isArray(resume.projects) ? resume.projects : [],
          skills: Array.isArray(resume.skills) ? resume.skills : [],
        };

        // Check cache first
        const cached = pdfCache.get(resumeHash);
        if (cached) {
          currentUrl = cached.url;
          setUrl(cached.url);
          return;
        }

        // Generate new PDF if not in cache with try-catch for PDF generation
        let blob;
        try {
          blob = await pdf(<ResumePDFDocument resume={validatedResume} variant={variant} />).toBlob();
        } catch (pdfError) {
          console.warn('PDF component rendering error (non-critical):', pdfError);
          return; // Exit gracefully if PDF can't be generated
        }
        
        const newUrl = URL.createObjectURL(blob);
        currentUrl = newUrl;
        
        // Store in cache with timestamp
        pdfCache.set(resumeHash, { url: newUrl, timestamp: Date.now() });
        setUrl(newUrl);
      } catch (error) {
        console.error('PDF generation error:', error);
        // Don't throw error, just log it as PDF preview is not critical
      }
    }

    generatePDF();

    // Cleanup function
    return () => {
      if (currentUrl && !pdfCache.has(resumeHash)) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [resumeHash, variant, resume]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Final cleanup of this component's URL if not in cache
      if (url && !pdfCache.has(resumeHash)) {
        URL.revokeObjectURL(url);
      }
    };
  }, [resumeHash, url]);

  // Add state for text layer visibility with better management
  const [shouldRenderTextLayer, setShouldRenderTextLayer] = useState(false);
  const [textLayerTimeout, setTextLayerTimeout] = useState<NodeJS.Timeout | null>(null);

  // Modify Page component to conditionally render text layer
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    
    // Clear any existing timeout
    if (textLayerTimeout) {
      clearTimeout(textLayerTimeout);
    }
    
    // Enable text layer after document is stable with longer delay
    const timeout = setTimeout(() => {
      setShouldRenderTextLayer(true);
      setTextLayerTimeout(null);
    }, 2000);
    
    setTextLayerTimeout(timeout);
  }

  // Disable text layer during updates and cleanup timeouts
  useEffect(() => {
    setShouldRenderTextLayer(false);
    
    // Clear any pending text layer timeout
    if (textLayerTimeout) {
      clearTimeout(textLayerTimeout);
      setTextLayerTimeout(null);
    }
  }, [resumeHash, variant]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (textLayerTimeout) {
        clearTimeout(textLayerTimeout);
      }
    };
  }, [textLayerTimeout]);

  // Show loading state while PDF is being generated
  if (!url) {
    return (
      <div className="w-full aspect-[8.5/11] bg-white shadow-lg p-8">
        <div className="space-y-0 animate-pulse">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200  w-1/3 mx-auto" />
            <div className="flex justify-center gap-4">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>

          {/* Summary skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          </div>

          {/* Experience skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-48" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          </div>

          {/* Education skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-40" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display the generated PDF using react-pdf with better error handling
  return (
    <div className=" h-full relative bg-black/15">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            console.error('PDF load error:', error);
            // Don't show TextLayer errors to user as they're not critical
          }}
          className="relative h-full   "
          externalLinkTarget="_blank"
          loading={
            <div className="w-full aspect-[8.5/11] bg-white  p-8">
              <div className="space-y-24 animate-pulse">
                {/* Header skeleton */}
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto" />
                  <div className="flex justify-center gap-4">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>

                {/* Summary skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>

                {/* Experience skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="h-3 bg-gray-200 rounded w-48" />
                          <div className="h-3 bg-gray-200 rounded w-24" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="h-3 bg-gray-200 rounded w-40" />
                          <div className="h-3 bg-gray-200 rounded w-24" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="mb-4 shadow-xl "
              width={getPixelWidth()}
              renderAnnotationLayer={true}
              renderTextLayer={shouldRenderTextLayer}
              onRenderError={(error) => {
                // Silently handle TextLayer errors - they're not critical for PDF display
                if (error.message?.includes('TextLayer')) {
                  console.warn('TextLayer warning (non-critical):', error.message);
                } else {
                  console.error('PDF render error:', error);
                }
              }}
            />
          ))}
        </Document>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to determine if re-render is needed
  return (
    prevProps.resume === nextProps.resume &&
    prevProps.variant === nextProps.variant &&
    prevProps.containerWidth === nextProps.containerWidth
  );
}); 
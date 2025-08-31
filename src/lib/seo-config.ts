import { Metadata } from 'next';

// Additional SEO metadata for better logo recognition
export const logoMetadata: Metadata = {
  other: {
    // Additional logo-related meta tags
    'og:logo': 'https://resumy.live/logo.png',
    'twitter:image:src': 'https://resumy.live/logo.png',
    'og:image:secure_url': 'https://resumy.live/logo.png',
    'og:image:type': 'image/png',
    'og:image:width': '512',
    'og:image:height': '512',
    // Apple specific
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    // Microsoft
    'msapplication-TileImage': '/logo.png',
  }
};

export function generateBrandLdJson() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://resumy.live/#organization",
        "name": "Resumy",
        "url": "https://resumy.live",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://resumy.live/logo.png",
          "url": "https://resumy.live/logo.png",
          "contentUrl": "https://resumy.live/logo.png",
          "width": 512,
          "height": 512,
          "caption": "Resumy Logo"
        },
        "image": {
          "@id": "https://resumy.live/logo.png"
        },
        "sameAs": [
          "https://twitter.com/resumy",
          "https://linkedin.com/company/resumy"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://resumy.live/#website",
        "url": "https://resumy.live",
        "name": "Resumy - Free AI Resume Builder",
        "description": "Create professional, ATS-optimized resumes for free with Resumy's AI-powered resume builder.",
        "publisher": {
          "@id": "https://resumy.live/#organization"
        },
        "inLanguage": "en-US"
      }
    ]
  };
}

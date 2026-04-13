import type { NextConfig } from 'next'

const isCloudflareBuild = process.env.CLOUDFLARE === '1' || process.env.CF_PAGES === '1'
 
const nextConfig: NextConfig = {
  // Increase server actions body size limit for file uploads (default 1MB is too small)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Remove only console.log in production, keep console.error and console.warn for debugging
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  
  // Enable static optimization
  trailingSlash: false,
  
  // SEO and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Ensure favicon is properly served
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.ico',
      },
    ]
  },
  
  // Optimize images
  images: {
    // Disable Next image optimization when building for Cloudflare.
    unoptimized: isCloudflareBuild,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
  },
  
  // Disable ESLint during builds (for deployment)
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Disable TypeScript checks during builds (for deployment)
  typescript: {
    ignoreBuildErrors: false,
  },
}
 
export default nextConfig
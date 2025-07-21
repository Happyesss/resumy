import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // ...
    },
  },
  // Remove console logs in production for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  
  // Performance optimizations
  swcMinify: true,
  
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
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
 
export default nextConfig
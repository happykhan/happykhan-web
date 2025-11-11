/** @type {import('next').NextConfig} */

/**
 * Redirect old numbered post and microbinfie URLs to their new list pages
 */
export default {
  // Enable typed routes for App Router
  typedRoutes: true,
  images: {
    // Enable image optimization with AVIF and WebP support
    formats: ['image/avif', 'image/webp'],
    // Configure device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: '/posts/:id(\\d+)',
        destination: '/posts/',
        permanent: true,
      },
      {
        source: '/posts',
        has: [
          {
            type: 'query',
            key: 'page',
          },
        ],
        destination: '/posts/',
        permanent: true,
      },
      {
        source: '/microbinfie/:id(\\d+)',
        destination: '/microbinfie/',
        permanent: true,
      },
    ];
  }
};

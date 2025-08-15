// next.config.mjs

import pkg from './next-i18next.config.cjs';

const { i18n } = pkg;

// Read your Supabase URL at build time to allow Storage images
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let SUPABASE_HOSTNAME = '';
try {
  SUPABASE_HOSTNAME = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : '';
} catch {
  // leave empty if the env var isn't set or malformed
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  experimental: {
    forceLocale: false, // Important for manual locale handling via middleware
  },
  images: {
    // Add any external hosts you load images from
    remotePatterns: [
      // Unsplash (your seed data)
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },

      // Supabase Storage (public bucket access)
      ...(SUPABASE_HOSTNAME
        ? [{
            protocol: 'https',
            hostname: SUPABASE_HOSTNAME,
            // Public bucket path (adjust if you use a different bucket or path)
            pathname: '/storage/v1/object/public/**',
          }]
        : []),

      // (Optional) add more providers here if you start using them:
      // { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      // { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

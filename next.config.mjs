// next.config.mjs

import pkg from './next-i18next.config.cjs';

const { i18n } = pkg;

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  experimental: {
    forceLocale: false, // Important for manual locale handling via middleware
  },
};

export default nextConfig;

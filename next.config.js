// This file intentionally left minimal - configuration is in next.config.ts
// next.config.ts takes precedence over next.config.mjs in Next.js 16
const { imageHosts } = require('./image-hosts.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: imageHosts,
  },
  turbopack: {},
};

module.exports = nextConfig;
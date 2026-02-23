import type { NextConfig } from "next";
import { imageHosts } from './image-hosts.config.js';

const nextConfig: NextConfig = {
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

export default nextConfig;
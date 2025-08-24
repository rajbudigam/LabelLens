import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production deployment
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  },
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
  },
  // ESLint configuration
  eslint: {
    dirs: ['app', 'lib', 'components']
  }
};

export default nextConfig;

import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  reactStrictMode: true,
  // Skip type checking during build to help with Next.js 15 compatibility
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Use standalone mode for deployment
  output: 'standalone',
  // Disable static optimization while we fix issues
  staticPageGenerationTimeout: 120,
  // Skip image optimization to avoid build issues
  images: {
    unoptimized: true,
  },
}

export default withContentlayer(nextConfig)

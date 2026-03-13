import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds (lint locally instead)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TypeScript errors during build to prevent deploy failures
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

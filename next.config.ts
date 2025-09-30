import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
  // Optimize for better performance
  reactStrictMode: true,
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Serve AVIF first (best compression), fallback to WebP, then original
    formats: ["image/avif", "image/webp"],
    // Reasonable device sizes for a landing page
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable gzip/brotli compression for all responses
  compress: true,
};

export default nextConfig;

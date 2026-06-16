import type { NextConfig } from "next";

const repoBasePath = "/syedabbas";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoBasePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: repoBasePath,
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['i.postimg.cc'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

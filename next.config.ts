import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
    images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.cregis.io' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'cryptologos.cc' },
    ],
  },
  /* config options here */
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  generateBuildId: async () => {
    return 'my-build-id';
  },
};

export default nextConfig;

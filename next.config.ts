import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  generateBuildId: async () => {
    return 'my-build-id';
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error: reactCompiler flag is available but not yet in NextConfig types
    reactCompiler: true,
  },
};

export default nextConfig;

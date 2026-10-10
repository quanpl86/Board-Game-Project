import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bgu/contracts"]
  // No basePath until KingDragonHub host routing is verified.
};
export default nextConfig;

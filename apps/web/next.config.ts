import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bgu/contracts", "@bgu/game-sdk", "@bgu/gomoku"]
  // No basePath until KingDragonHub host routing is verified.
};
export default nextConfig;

import type { NextConfig } from "next";
import { ASSETS_HOST } from "./src/config/assets";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.svgl.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "svgl.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: ASSETS_HOST,
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

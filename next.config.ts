import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "pgqcciulpaaxtivcehvy.supabase.co",
      },
    ],
  },
};

export default nextConfig;

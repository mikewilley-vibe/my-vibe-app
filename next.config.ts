import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.espncdn.com",
      },
      {
        protocol: "https",
        hostname: "secure.espncdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.espn.com",
      },
        {
        protocol: "https",
        hostname: "s1.ticketm.net",
      },
    ],
  },
};

export default nextConfig;
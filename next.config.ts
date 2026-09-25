import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
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
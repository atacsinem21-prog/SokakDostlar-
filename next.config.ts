import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.hizliresim.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

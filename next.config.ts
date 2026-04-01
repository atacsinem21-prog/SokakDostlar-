import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** URL’ler `/yol` biçiminde kalır; domain sonunda gereksiz `/` oluşturulmaz */
  trailingSlash: false,
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

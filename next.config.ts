import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Izinkan IP
        port: '8000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Izinkan Localhost
        port: '8000',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
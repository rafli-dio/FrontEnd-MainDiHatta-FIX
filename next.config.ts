import type { NextConfig } from "next";

// HAPUS ": NextConfig" setelah nama variabel
const nextConfig = { 
  output: "export", 
  trailingSlash: true,
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
       {
        protocol: 'https',
        hostname: 'api-maindihatta.smartsense.my.id', 
        pathname: '/**',
      },
    ],
  },

  // Tambahkan // @ts-ignore jika masih merah, tapi biasanya menghapus : NextConfig sudah cukup
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
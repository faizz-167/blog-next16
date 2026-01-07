import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3210', // Your backend port
        pathname: '/api/storage/**', // Allow your storage path
      }
    ]
  }
};

export default nextConfig;

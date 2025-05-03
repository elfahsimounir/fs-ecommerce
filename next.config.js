/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for better debugging,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, 
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_API_URL:process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },
  images: {
    domains: ["lh3.googleusercontent.com"], 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
};

module.exports = nextConfig;

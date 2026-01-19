/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
          'localhost:3000', 
          '*.app.github.dev', 
          '*.github.dev'
      ],
    },
  },
};

module.exports = nextConfig;
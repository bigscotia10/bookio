/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/book/:bookid*',
        destination: '/book/:bookid*',
      },
    ];
  },
};

module.exports = nextConfig;

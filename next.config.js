/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serve static HTML file
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/orderflow.html',
      },
    ];
  },
};

module.exports = nextConfig;

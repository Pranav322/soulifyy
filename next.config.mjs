/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['c.saavncdn.com'],
      },
      output: 'standalone',
      experimental: {
        appDir: true,
      },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sharp'],

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.geroserial.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.geroserial.com',
        port: '',
        pathname: '/cdn-cgi/image/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 7200,
    dangerouslyAllowSVG: false,
  },

  compress: true,

  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/escuelas(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

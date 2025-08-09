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
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.geroserial.com',
        port: '',
        pathname: '/cdn-cgi/image/**',
      },
      {
        protocol: 'https',
        hostname: 'devcms.geroserial.com',
        port: '',
        pathname: '/cdn-cgi/image/**',
      },
      {
        protocol: 'https',
        hostname: 'devcms.geroserial.com',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'consejo.geroserial.com',
        port: '',
        pathname: '/cdn-cgi/image/**',
      },
      {
        protocol: 'https',
        hostname: 'consejo.geroserial.com',
        port: '',
        pathname: '/assets/**',
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
    ];
  },
};

export default nextConfig;

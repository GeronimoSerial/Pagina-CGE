/** @type {import('next').NextConfig} */
const nextConfig = {
  //  para VPS con recursos limitados
  serverExternalPackages: ['sharp'], // Optimizar procesamiento de imágenes

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
    // Optimizaciones adicionales para VPS (compatibles con ISR)
    formats: ['image/webp', 'image/avif'], // Formatos modernos prioritarios
    minimumCacheTTL: 3153600, // 1 año de cache para imágenes
    dangerouslyAllowSVG: false, // Seguridad: no procesar SVG
  },

  // Optimizaciones de compilación para VPS
  compress: true, // Compresión gzip

  // Headers para mejorar cache (Next.js maneja ISR directamente)
  async headers() {
    return [
      {
        // Imágenes estáticas del public/
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      {
        // API routes - sin cache para ISR
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        // Páginas de noticias - ISR controlado por Next.js
        source: '/noticias/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300', // ISR optimizado
          },
          {
            key: 'X-Cache-Type',
            value: 'ISR-NEXTJS',
          },
        ],
      },
      {
        // Páginas de trámites - ISR controlado por Next.js
        source: '/tramites/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300', // ISR optimizado
          },
          {
            key: 'X-Cache-Type',
            value: 'ISR-NEXTJS',
          },
        ],
      },
      {
        // Páginas estáticas (SSG) - cache más largo
        source: '/((?!api|_next|noticias|tramites).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=86400', // 1 día de cache,
          },
          {
            key: 'X-Cache-Type',
            value: 'SSG-NEXTJS',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

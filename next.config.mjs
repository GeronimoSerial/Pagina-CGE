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
    // Optimizaciones de imágenes sincronizadas con ISR
    formats: ['image/webp', 'image/avif'], // Formatos modernos prioritarios
    minimumCacheTTL: 7200, // 2 horas - Sincronizado con contenido principal
    dangerouslyAllowSVG: false, // Seguridad: no procesar SVG
  },

  // Optimizaciones de compilación para VPS
  compress: true, // Compresión gzip

  // Headers para optimizar cache de assets estáticos
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
        // Todas las imágenes optimizadas por Next.js (incluye CDN) - son únicas e inmutables
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API de escuelas - archivo estático inmutable
        source: '/api/escuelas(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Otras API routes - sin cache para permitir interactividad
        source: '/api/(?!escuelas)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

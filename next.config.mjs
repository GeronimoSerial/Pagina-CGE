/** @t  // Configuración experimental para mejor performance con PM2
  experimental: {
    // Optimizaciones para memoria limitada
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns'],
    // serverComponentsExternalPackages: ['sharp'],
  },rt('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para VPS + PM2
  serverExternalPackages: ['sharp'], // Optimizar procesamiento de imágenes
  poweredByHeader: false, // Reducir headers innecesarios
  
  // Configuración experimental para mejor performance con PM2
  experimental: {
    // Optimizaciones para memoria limitada
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns'],
  },

  // Configuración de salida optimizada para PM2
  // output: 'standalone', // Deshabilitado por conflicto con npm start

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'devcms.geroserial.com',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'devcms.geroserial.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'devcms.geroserial.com',
        port: '',
        pathname: '/cdn-cgi/image/**',
      },
    ],
    // Optimizaciones de imágenes sincronizadas con ISR
    formats: ['image/webp', 'image/avif'], // Formatos modernos prioritarios
    minimumCacheTTL: 86400, // 24 horas para mejor cache
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
      // Nuevos headers para optimización
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
      // {
      //   // Otras API routes - sin cache para permitir interactividad
      //   source: '/api/(?!escuelas)(.*)',
      //   headers: [
      //     {
      //       key: 'Cache-Control',
      //       value: 'no-cache, no-store, must-revalidate',
      //     },
      //   ],
      // },
    ];
  },
};

export default nextConfig;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://devcms.geroserial.com/items';
export const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://devcms.geroserial.com';
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || '';


// Configuración de performance ULTRA-OPTIMIZADA para VPS + PM2
export const PERFORMANCE_CONFIG = {
  // Timeouts sincronizados con nginx y PM2 (2-4s)
  API_TIMEOUT: 3000, // Reducido de 3500 a 3000ms
  CRITICAL_API_TIMEOUT: 1800, // Reducido de 2000 a 1800ms

  // Configuración unificada de paginación optimizada
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 4, // Mantenido pequeño para mejor performance
    MAX_PAGE_SIZE: 6,     // Reducido de 8 a 6
  },

  // Cache settings SINCRONIZADOS con nginx + PM2
  CACHE: {
    // Cache agresivo para datos estáticos (sync con nginx)
    STATIC_MAX_AGE: 1800, // 30 minutos (aumentado)
    STATIC_STALE_WHILE_REVALIDATE: 3600, // 1 hora

    // Cache optimizado para APIs dinámicas (sync con nginx 60s)
    DYNAMIC_MAX_AGE: 60, // 60s (sincronizado con nginx)
    DYNAMIC_STALE_WHILE_REVALIDATE: 120, // 2 minutos

  },

  // Configuración PM2 específica
  PM2: {
    MEMORY_LIMIT: '400M', // Límite de memoria por proceso
    RESTART_THRESHOLD: 3, // Máximo restarts
    MIN_UPTIME: 10000,   // 10s mínimo uptime
  },

  // Circuit breaker settings
  // CIRCUIT_BREAKER: {
  //   FAILURE_THRESHOLD: 3, // Fallos antes de abrir circuito
  //   RECOVERY_TIMEOUT: 30000, // 30s antes de intentar recovery
  //   SUCCESS_THRESHOLD: 2, // Éxitos para cerrar circuito
  // },

  // Rate limiting más agresivo
  // RATE_LIMITS: {
  //   PER_IP_PER_MINUTE: 15, // Reducido de 20 a 15
  //   BURST_ALLOWANCE: 5, // Máximo burst permitido
  // }
};

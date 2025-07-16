export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://devcms.geroserial.com/items';
export const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://devcms.geroserial.com';
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || '';

// Configuración de performance optimizada para pruebas de carga
export const PERFORMANCE_CONFIG = {
  // Timeouts más agresivos para evitar acumulación
  API_TIMEOUT: 5000, // Reducido de 8-10s a 5s
  CRITICAL_API_TIMEOUT: 3000, // Para endpoints críticos como /api/noticias

  // Configuración unificada de paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 6, // Unificado para toda la app
    MAX_PAGE_SIZE: 20,    // Límite para VPS
  },

  // Cache settings optimizados y coordinados
  CACHE: {
    // Cache más largo para datos estáticos
    STATIC_MAX_AGE: 300, // 5 minutos
    STATIC_STALE_WHILE_REVALIDATE: 600, // 10 minutos

    // Cache coordinado para APIs dinámicas
    DYNAMIC_MAX_AGE: 180, // 3 minutos (coordinado con ISR)
    DYNAMIC_STALE_WHILE_REVALIDATE: 360, // 6 minutos

    // Cache de error para evitar martilleo
    ERROR_CACHE: 15, // 15 segundos de cache en errores
  },

  // Configuración coordinada de revalidate
  REVALIDATE: {
    NOTICIAS_LIST: 3600,    // 1 hora para listados
    NOTICIAS_DETAIL: 7200,  // 2 horas para detalles
    CATEGORIAS: 86400,      // 24 horas para categorías (casi no cambian)
    TRAMITES: 86400,        // 24 horas para trámites (muy estáticos)
    TRAMITES_NAV: 86400,    // 24 horas para navegación de trámites
  },

  // Circuit breaker settings
  CIRCUIT_BREAKER: {
    FAILURE_THRESHOLD: 3, // Fallos antes de abrir circuito
    RECOVERY_TIMEOUT: 30000, // 30s antes de intentar recovery
    SUCCESS_THRESHOLD: 2, // Éxitos para cerrar circuito
  },

  // Rate limiting más agresivo
  RATE_LIMITS: {
    PER_IP_PER_MINUTE: 15, // Reducido de 20 a 15
    BURST_ALLOWANCE: 5, // Máximo burst permitido
  }
};

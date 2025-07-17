export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || '';
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || '';

// Configuración de performance optimizada para pruebas de carga
export const PERFORMANCE_CONFIG = {
  // Timeouts más agresivos para evitar acumulación
  API_TIMEOUT: 5000, // Reducido de 8-10s a 5s
  CRITICAL_API_TIMEOUT: 3000, // Para endpoints críticos como /api/noticias

  // Cache settings optimizados
  CACHE: {
    // Cache más largo para datos estáticos
    STATIC_MAX_AGE: 300, // 5 minutos
    STATIC_STALE_WHILE_REVALIDATE: 600, // 10 minutos

    // Cache más conservador para APIs dinámicas
    DYNAMIC_MAX_AGE: 30, // 30 segundos
    DYNAMIC_STALE_WHILE_REVALIDATE: 60, // 1 minuto

    // Cache de error para evitar martilleo
    ERROR_CACHE: 15, // 15 segundos de cache en errores
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

/**
 * Configuración centralizada para el sistema de caché
 * Esto reemplaza los valores hardcodeados dispersos en el código
 */

export const CACHE_CONFIG = {
  // Configuración de cachés
  CACHES: {
    // Cache para contenido individual (noticias, trámites)
    CONTENT: {
      maxSize: 100,
      defaultTtl: 24 * 60 * 60 * 1000, // 24 horas
    },
    // Cache para listados y páginas
    PAGES: {
      maxSize: 20,
      defaultTtl: 60 * 60 * 1000, // 1 hora
    },
  },
  
  // TTL personalizados por tipo de contenido
  TTL: {
    NEWS_INDIVIDUAL: 24 * 60 * 60 * 1000, // 24 horas
    NEWS_PAGES_FREQUENT: 60 * 60 * 1000, // 1 hora (páginas 1-3)
    NEWS_PAGES_NORMAL: 2 * 60 * 60 * 1000, // 2 horas (páginas 4+)
    FEATURED_NEWS: 60 * 60 * 1000, // 1 hora
    TRAMITES: 24 * 60 * 60 * 1000, // 24 horas
    NAVIGATION: 24 * 60 * 60 * 1000, // 24 horas
  },
  
  // Límites para evitar sobrecarga del VPS
  LIMITS: {
    MAX_PAGE_SIZE: 20,
    MAX_PREGENERATED_SLUGS: 50,
    CACHE_FREQUENT_PAGES: 3, // Solo páginas 1-3 se cachean con TTL corto
  },
} as const;

// Función helper para obtener TTL basado en el tipo y contexto
export function getTTL(
  type: keyof typeof CACHE_CONFIG.TTL,
  context?: { page?: number }
): number {
  if (type === 'NEWS_PAGES_FREQUENT' && context?.page && context.page > 3) {
    return CACHE_CONFIG.TTL.NEWS_PAGES_NORMAL;
  }
  
  return CACHE_CONFIG.TTL[type];
}

// Función helper para validar límites
export function validatePageSize(pageSize: number): number {
  return Math.min(pageSize, CACHE_CONFIG.LIMITS.MAX_PAGE_SIZE);
}

// Función helper para determinar si una página debe cachearse agresivamente
export function shouldCacheAggressively(page: number, hasFilters: boolean): boolean {
  return page <= CACHE_CONFIG.LIMITS.CACHE_FREQUENT_PAGES && !hasFilters;
}

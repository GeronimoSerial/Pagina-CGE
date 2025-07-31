/**
 * Sistema de caché simplificado y unificado
 * Reemplaza la complejidad de múltiples cachés especializados
 * con una estrategia simple y eficiente
 */

import { CACHE_CONFIG } from './cache-config';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
}

export class UnifiedCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTtl: number;

  constructor(config: CacheConfig) {
    this.maxSize = config.maxSize;
    this.defaultTtl = config.defaultTtl;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T, customTtl?: number): void {
    // Simple FIFO eviction if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || this.defaultTtl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Simple stats for monitoring
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      defaultTtl: this.defaultTtl,
    };
  }
}

// Instancias de caché unificadas usando configuración centralizada
export const contentCache = new UnifiedCache<any>(CACHE_CONFIG.CACHES.CONTENT);
export const pagesCache = new UnifiedCache<any>(CACHE_CONFIG.CACHES.PAGES);

// Función wrapper simplificada
export async function withCache<T>(
  cache: UnifiedCache<T>,
  key: string,
  fetchFn: () => Promise<T>,
  customTtl?: number
): Promise<T> {
  // Intentar caché primero
  const cached = cache.get(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss: fetch y guardar
  try {
    const data = await fetchFn();
    cache.set(key, data, customTtl);
    return data;
  } catch (error) {
    // No cachear errores, re-lanzar
    throw error;
  }
}

// Función para limpiar todos los cachés
export function clearAllCaches(): void {
  contentCache.clear();
  pagesCache.clear();
}

// Función para obtener estadísticas consolidadas
export function getAllCacheStats() {
  return {
    content: contentCache.getStats(),
    pages: pagesCache.getStats(),
    total: {
      entries: contentCache.size() + pagesCache.size(),
      maxEntries: CACHE_CONFIG.CACHES.CONTENT.maxSize + CACHE_CONFIG.CACHES.PAGES.maxSize,
    },
  };
}

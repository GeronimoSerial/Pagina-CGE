import { PERFORMANCE_CONFIG } from './config';

// Cache ultra-agresivo para optimizar rendimiento en VPS
class CacheManager {
  public cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 3600000): void { // 1 hora por defecto
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
  
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp < entry.ttl) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    });
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRatio: validEntries / Math.max(this.cache.size, 1)
    };
  }
}

// Instancias de cache específicas
export const noticiasCache = new CacheManager();
export const tramitesCache = new CacheManager();
export const relatedCache = new CacheManager();

// Función helper para usar cache con fallback
export async function withCache<T>(
  cache: CacheManager,
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Intentar obtener del cache primero
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Cache miss - ejecutar fetcher
  try {
    const data = await fetcher();
    cache.set(key, data, ttl);
    return data;
  } catch (error) {
    // En caso de error, intentar devolver cache expirado si existe
    const expired = cache.cache.get(key);
    if (expired) {
      console.warn(`Using expired cache for ${key} due to error:`, error);
      return expired.data;
    }
    throw error;
  }
}
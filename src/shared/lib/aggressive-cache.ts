import { PERFORMANCE_CONFIG } from './config';

// Cache ultra-optimizado para VPS con PM2 (memoria limitada)
class CacheManager {
  public cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();
  private maxEntries = 100; // Límite estricto para PM2 400MB

  set(key: string, data: any, ttl: number = 1800000): void {
    // 30 min por defecto (reducido)
    // Limpieza automática si excede límite
    if (this.cache.size >= this.maxEntries) {
      this.cleanupAggressive();
    }

    // Optimización: limpiar cache expirado antes de agregar nuevos entries
    this.cleanExpired();

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
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

  // Optimización: limpiar cache expirado periódicamente
  cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  // Limpieza agresiva para PM2 (memoria limitada)
  cleanupAggressive(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    // Eliminar entradas expiradas primero
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }

    // Si aún hay demasiadas entradas, eliminar las más antiguas
    if (this.cache.size >= this.maxEntries) {
      const sortedEntries = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );

      const toDelete = sortedEntries.slice(
        0,
        Math.floor(this.maxEntries * 0.3),
      );
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
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
      hitRatio: validEntries / Math.max(this.cache.size, 1),
    };
  }
}

// Instancias de cache específicas
export const newsCache = new CacheManager();
export const tramitesCache = new CacheManager();
export const relatedCache = new CacheManager();

// Función helper para usar cache con fallback
export async function withCache<T>(
  cache: CacheManager,
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number,
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

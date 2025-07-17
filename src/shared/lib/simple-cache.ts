// Cache simple en memoria para VPS con recursos limitados
class SimpleCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private maxSize = 100; // Limitar tamaño para VPS

  set(key: string, data: any, ttlSeconds: number = 300) {
    // Limpiar cache si está lleno
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Limpiar entradas expiradas
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now > item.expires) {
        keysToDelete.push(key);
      }
    });

    // Si aún está lleno, eliminar las más antiguas
    if (keysToDelete.length === 0 && this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].expires - b[1].expires);
      keysToDelete.push(...entries.slice(0, Math.floor(this.maxSize * 0.2)).map(([key]) => key));
    }

    keysToDelete.forEach(key => this.cache.delete(key));
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

    this.cache.forEach((item) => {
      if (now <= item.expires) {
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
      maxSize: this.maxSize
    };
  }
}

// Cache específicos por tipo de datos
export const noticiasCache = new SimpleCache();
export const tramitesCache = new SimpleCache();
export const metadataCache = new SimpleCache();

// Cache general
export const simpleCache = new SimpleCache();

// Función helper para usar cache con fallback
export async function withSimpleCache<T>(
  cache: SimpleCache,
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // Intentar obtener del cache primero
  const cached = cache.get(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - ejecutar fetcher
  try {
    const data = await fetcher();
    cache.set(key, data, ttlSeconds);
    return data;
  } catch (error) {
    // En caso de error, intentar devolver cache expirado si existe
    const expiredItem = cache['cache'].get(key);
    if (expiredItem) {
      console.warn(`Using expired cache for ${key} due to error:`, error);
      return expiredItem.data;
    }
    throw error;
  }
}

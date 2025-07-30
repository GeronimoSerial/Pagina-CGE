interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

class AggressiveCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number;
  private maxSize: number;

  constructor(ttlMs: number = 300000, maxSize: number = 100) {
    // 5 min default
    this.ttl = ttlMs;
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Verificar TTL
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Incrementar hits para LRU
    entry.hits++;
    return entry.data;
  }

  set(key: string, data: T): void {
    // LRU eviction si excede max size
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 1,
    });
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.hits < leastHits) {
        leastHits = entry.hits;
        leastUsedKey = key;
      }
    });

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    const entries: Array<{ key: string; hits: number; age: number }> = [];
    this.cache.forEach((entry, key) => {
      entries.push({
        key,
        hits: entry.hits,
        age: Date.now() - entry.timestamp,
      });
    });

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries,
    };
  }
}

export const newsCache = new AggressiveCache<any>(86400000, 50); // 24 horas, 50 noticias max
export const tramitesCache = new AggressiveCache<any>(2592000000, 20); // 30 días, 20 trámites max - webhook actualiza inmediatamente
export const relatedCache = new AggressiveCache<any>(86400000, 100); // 24 horas, 100 queries relacionadas
export const newsGridCache = new AggressiveCache<any>(86400000, 50); // 24 horas, 50 noticias max

// Nuevos caches para páginas estáticas (Fase 2)
export const newsPagesCache = new AggressiveCache<any>(
  24 * 60 * 60 * 1000, // 24h TTL
  20, // Max 20 entradas (páginas 1-5 * 4 contexts)
);

// Cache para featured news (compartido entre páginas)
export const featuredNewsCache = new AggressiveCache<any>(
  24 * 60 * 60 * 1000, // 24h TTL
  5, // Solo 1 entrada pero con buffer
);
export async function withCache<T>(
  cache: AggressiveCache<T>,
  key: string,
  fetchFn: () => Promise<T>,
): Promise<T> {
  // Intentar cache primero
  const cached = cache.get(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss: fetch y guardar
  const data = await fetchFn();
  cache.set(key, data);
  return data;
}

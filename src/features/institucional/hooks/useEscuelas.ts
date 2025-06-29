import { useEffect, useState } from 'react';
import type { Escuela } from '@/shared/interfaces';

const CACHE_KEY = 'escuelas_cache_v1';
const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hora

export function useEscuelas() {
  const [escuelas, setEscuelas] = useState<Escuela[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (cacheRaw) {
      try {
        const cache = JSON.parse(cacheRaw);
        if (
          cache.timestamp &&
          Date.now() - cache.timestamp < CACHE_EXPIRATION_MS
        ) {
          setEscuelas(cache.data);
          setLoading(false);
          return;
        }
      } catch {}
    }
    setLoading(true);
    fetch('/api/escuelas')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar escuelas.json');
        return res.json();
      })
      .then((data) => {
        setEscuelas(data);
        setLoading(false);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() }),
        );
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { escuelas, loading, error };
}

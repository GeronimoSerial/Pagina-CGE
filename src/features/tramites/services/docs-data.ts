import { API_URL, PERFORMANCE_CONFIG } from '@/shared/lib/config';
import qs from 'qs';
import { withCache, tramitesCache } from '@/shared/lib/aggressive-cache';

// --- INTERFACES ---

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
}

export interface ArticleSection {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'callout';
  level?: number;
  content: string;
  items?: string[];
  variant?: 'info' | 'warning' | 'success' | 'error';
}

export interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  lastUpdated: string;
  content: ArticleSection[];
}

// --- DIRECTUS TYPES ---

interface DirectusTramite {
  id: number;
  status: string;
  date_created: string;
  date_updated: string;
  titulo: string;
  resumen: string | null;
  slug: string;
  contenido: string;
  fecha: string;
  categoria: string;
}

// --- CACHE ULTRA-AGRESIVO PARA TRÁMITES ---
// Los trámites cambian muy raramente, cache de 4 horas

class TramitesStaticCache {
  private navigationCache: NavSection[] | null = null;
  private articlesCache = new Map<string, Article>();
  private allSlugsCache: string[] | null = null;
  private timestamp: number = 0;
  private ttl: number = 14400000; // 4 horas en ms

  isValid(): boolean {
    return this.timestamp > 0 && (Date.now() - this.timestamp) < this.ttl;
  }

  setNavigation(data: NavSection[]): void {
    this.navigationCache = data;
    this.timestamp = Date.now();
  }

  getNavigation(): NavSection[] | null {
    return this.isValid() ? this.navigationCache : null;
  }

  setArticle(slug: string, article: Article): void {
    this.articlesCache.set(slug, article);
    this.timestamp = Date.now();
  }

  getArticle(slug: string): Article | null {
    return this.isValid() ? this.articlesCache.get(slug) || null : null;
  }

  setSlugs(slugs: string[]): void {
    this.allSlugsCache = slugs;
    this.timestamp = Date.now();
  }

  getSlugs(): string[] | null {
    return this.isValid() ? this.allSlugsCache : null;
  }

  clear(): void {
    this.navigationCache = null;
    this.articlesCache.clear();
    this.allSlugsCache = null;
    this.timestamp = 0;
  }
}

const staticCache = new TramitesStaticCache();

// --- OPTIMIZED API HELPERS ---

/**
 * Fetch optimizado para Directus con timeouts agresivos
 */
async function fetchDirectusAPI<T>(params: Record<string, any> = {}): Promise<T> {
  const query = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${API_URL}/tramites${query ? `?${query}` : ''}`;

  // Timeout agresivo para trámites
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PERFORMANCE_CONFIG.CRITICAL_API_TIMEOUT);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': `max-age=${PERFORMANCE_CONFIG.CACHE.STATIC_MAX_AGE}`,
        'Connection': 'keep-alive',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Error al obtener trámites`);
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// --- CATEGORÍAS MEJORADAS ---
// Basadas en los datos reales de Directus

const categoriasMap: Record<string, string> = {
  'general': 'General',
  'licencias por salud y/o maternidad': 'Licencias por Salud y Maternidad',
  'licencias extraordinarias': 'Licencias Extraordinarias',
  'justificacion de inasistencias': 'Justificación de Inasistencias',
  'permisos': 'Permisos',
  'suplentes': 'Suplentes',
};

function getCategoryDisplayName(categoria: string): string {
  return categoriasMap[categoria.toLowerCase()] || categoria;
}

// --- FUNCTIONS ---

/**
 * Obtiene la navegación completa de trámites con cache ultra-agresivo
 */
export async function getTramitesNavigation(): Promise<NavSection[]> {
  // Verificar cache estático primero
  const cached = staticCache.getNavigation();
  if (cached) {
    return cached;
  }

  // Cache miss - usar aggressive cache como fallback
  return withCache(
    tramitesCache,
    'tramites-navigation-v2',
    async (): Promise<NavSection[]> => {
      const tramites: DirectusTramite[] = await fetchDirectusAPI({
        fields: ['categoria', 'titulo', 'slug'],
        sort: ['categoria', 'titulo'],
        limit: -1,
        filter: {
          status: { _eq: 'published' }
        }
      });

      if (!tramites || tramites.length === 0) {
        return [];
      }

      // Agrupar por categoría
      const grouped: Record<string, NavSection> = {};
      
      tramites.forEach((tramite) => {
        const categoryKey = tramite.categoria.toLowerCase();
        const categoryDisplay = getCategoryDisplayName(tramite.categoria);

        if (!grouped[categoryKey]) {
          grouped[categoryKey] = {
            id: categoryKey.replace(/\s+/g, '-'),
            title: categoryDisplay,
            items: [],
          };
        }

        grouped[categoryKey].items.push({
          id: tramite.slug,
          title: tramite.titulo,
          href: `/tramites/${tramite.slug}`,
        });
      });

      // Ordenar secciones: General primero, luego alfabético
      const sortedSections = Object.values(grouped).sort((a, b) => {
        if (a.title === 'General') return -1;
        if (b.title === 'General') return 1;
        return a.title.localeCompare(b.title);
      });

      // Guardar en cache estático
      staticCache.setNavigation(sortedSections);
      
      return sortedSections;
    }
  );
}

/**
 * Obtiene un trámite por slug con cache ultra-agresivo
 */
export async function getTramiteArticleBySlug(slug: string): Promise<Article | null> {
  // Verificar cache estático primero
  const cached = staticCache.getArticle(slug);
  if (cached) {
    return cached;
  }

  // Cache miss - usar aggressive cache
  return withCache(
    tramitesCache,
    `tramite-article-${slug}`,
    async (): Promise<Article | null> => {
      const tramites: DirectusTramite[] = await fetchDirectusAPI({
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1
      });

      if (!tramites || tramites.length === 0) {
        return null;
      }

      const tramite = tramites[0];
      const categoryDisplay = getCategoryDisplayName(tramite.categoria);

      const article: Article = {
        id: tramite.id.toString(),
        slug: tramite.slug,
        category: categoryDisplay,
        title: tramite.titulo,
        description: tramite.resumen || '',
        lastUpdated: tramite.date_updated || tramite.fecha,
        content: parseHTMLToSections(tramite.contenido),
      };

      // Guardar en cache estático
      staticCache.setArticle(slug, article);

      return article;
    }
  );
}

/**
 * Obtiene todos los slugs para generación estática
 */
export async function getAllTramiteSlugs(): Promise<string[]> {
  // Verificar cache estático
  const cached = staticCache.getSlugs();
  if (cached) {
    return cached;
  }

  // Cache miss
  return withCache(
    tramitesCache,
    'all-tramites-slugs',
    async (): Promise<string[]> => {
      const tramites: DirectusTramite[] = await fetchDirectusAPI({
        fields: ['slug'],
        limit: -1,
        filter: {
          status: { _eq: 'published' }
        }
      });

      if (!tramites) {
        return [];
      }

      const slugs = tramites.map(t => t.slug);
      
      // Guardar en cache estático
      staticCache.setSlugs(slugs);
      
      return slugs;
    }
  );
}

/**
 * Parser HTML a secciones mejorado
 */
function parseHTMLToSections(htmlContent: string): ArticleSection[] {
  if (!htmlContent) {
    return [];
  }

  // Por ahora, tratar como un bloque HTML para mantener formato
  // En el futuro se puede implementar un parser más sofisticado
  return [{
    type: 'paragraph',
    content: htmlContent
  }];
}

/**
 * Función para limpiar cache (útil para desarrollo)
 */
export function clearTramitesCache(): void {
  staticCache.clear();
  // También limpiar aggressive cache si es necesario
}

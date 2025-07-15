import { API_URL } from '@/shared/lib/config';
import qs from 'qs';

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

// --- STRAPI TYPES ---

// Type for raw data used in navigation
interface RawTramiteNav {
  slug: string;
  titulo: string;
  categoria: string | null;
}

// Type for raw data for a full article
interface RawTramiteArticle {
  id: string;
  slug: string;
  categoria: string;
  titulo: string;
  resumen: string;
  updatedAt: string;
  fecha: string;
  contenido: string;
}

// --- API HELPER ---

/**
 * Generic fetch function for Strapi API.
 * @param path - API path (e.g., '/tramites')
 * @param params - Query parameters object
 * @returns The 'data' part of the Strapi response.
 */
async function fetchAPI<T>(path: string, params: object = {}): Promise<T> {
  const query = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${API_URL}${path}${query ? `?${query}` : ''}`;

  try {
    // Using Next.js fetch - ISR handled by page-level revalidate
    const res = await fetch(url);

    if (!res.ok) {
      // Log the server-side error for debugging
      console.error(`API fetch error: ${res.status} ${res.statusText} for ${url}`);
      throw new Error(`Error al obtener datos de la API: ${res.statusText}`);
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    // Re-throw a generic error to the client
    throw new Error('No se pudieron obtener los datos del servidor.');
  }
}

// Mapa de categorías
const categoriaMap: Record<number, string> = {
  1: 'Licencias especiales por salud y/o maternidad',
  2: 'Licencias extraordinarias',
  3: 'Justificación de inasistencias',
  4: 'Permisos',
  5: 'Suplentes',
};

/**
 * Obtiene la navegación agrupando los trámites por categoría.
 * Optimizado para obtener solo los campos necesarios.
 */
export async function getTramitesNavigation(): Promise<NavSection[]> {
  const params = {
    fields: ['categoria', 'titulo', 'slug'],
    sort: ['categoria:asc', 'titulo:asc'],
    'pagination[pageSize]': 250, // Increased limit to fetch all items
  };

  const tramites: RawTramiteNav[] = await fetchAPI('/tramites', params);

  if (!tramites) return [];

  const grouped: Record<string, NavSection> = {};
  tramites.forEach((t) => {
    const catNumber = Number(t.categoria); // Convertimos la categoría a número
    const cat = categoriaMap[catNumber] || 'General'; // Mapeamos el número a texto
    if (!grouped[cat]) {
      grouped[cat] = {
        id: cat.toLowerCase().replace(/\s+/g, '-'),
        title: cat,
        items: [],
      };
    }
    grouped[cat].items.push({
      id: t.slug,
      title: t.titulo,
      href: `/tramites/${t.slug}`,
    });
  });
  const sortedSections = Object.values(grouped).sort((a, b) => {
    if (a.title === 'General') return -1; // General siempre al principio
    if (b.title === 'General') return 1;
    return a.title.localeCompare(b.title);
  })
  return sortedSections;
}

/**
 * Obtiene un artículo/trámite por slug.
 */
export async function getTramiteArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const params = {
    'filters[slug][$eq]': slug,
    populate: '*', // We need the full content for the article
  };
  const tramites: RawTramiteArticle[] = await fetchAPI('/tramites', params);

  if (!tramites || tramites.length === 0) {
    return null;
  }

  const t = tramites[0];
  const catNumber = Number(t.categoria); // Convertimos la categoría a número
  const category = categoriaMap[catNumber] || 'General'; // Mapeamos el número a texto

  return {
    id: t.id,
    slug: t.slug,
    category,
    title: t.titulo,
    description: t.resumen,
    lastUpdated: t.updatedAt || t.fecha,
    content: parseContenidoToSections(t.contenido),
  };
}

/**
 * Helper para parsear el contenido del trámite a secciones.
 * Actualmente, trata el contenido como un único párrafo de Markdown.
 */
function parseContenidoToSections(contenido: string | null): ArticleSection[] {
  if (!contenido) return [];
  return [{ type: 'paragraph', content: contenido }];
}

/**
 * Helper para obtener todos los slugs (para generación estática).
 * Optimizado para obtener solo el campo slug.
 */
export async function getAllTramiteSlugs(): Promise<string[]> {
  const params = {
    fields: ['slug'],
    'pagination[pageSize]': 250, // Increased limit to fetch all items
  };
  const tramites: { slug: string }[] = await fetchAPI('/tramites', params);

  if (!tramites) return [];

  return tramites.map((t) => t.slug);
}

export async function getAllTramites(): Promise<any[]> {
  const params = {
    fields: ['id', 'slug', 'categoria', 'titulo', 'resumen', 'updatedAt', 'fecha', 'contenido'],
    sort: ['categoria:asc', 'titulo:asc'],
    populate: '*',
    'pagination[pageSize]': 250, // Increased limit to fetch all items
  };
  const tramites: RawTramiteArticle[] = await fetchAPI('/tramites', params);

  if (!tramites) return [];

  return tramites.map((t) => {
    const catNumber = Number(t.categoria); // Convertimos la categoría a número
    const category = categoriaMap[catNumber] || 'General'; // Mapeamos el número a texto

    return {
      id: t.id,
      slug: t.slug,
      category,
      title: t.titulo,
      description: t.resumen,
      lastUpdated: t.updatedAt || t.fecha,
      content: t.contenido,
    };
  });
}
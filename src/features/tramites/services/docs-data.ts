import { API_URL } from '@/shared/lib/config';
import qs from 'qs';

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

interface RawTramiteNav {
  slug: string;
  titulo: string;
  categoria: string | null;
}

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

async function fetchAPI<T>(path: string, params: object = {}): Promise<T> {
  const query = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${API_URL}${path}${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error al obtener datos de la API: ${res.statusText}`);
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    throw new Error('No se pudieron obtener los datos del servidor.');
  }
}

const categoriaMap: Record<number, string> = {
  1: 'Licencias por salud y/o maternidad',
  2: 'Licencias extraordinarias',
  3: 'Justificación de inasistencias',
  4: 'Permisos',
  5: 'Suplentes',
  6: 'Traslados',
  7: 'Salarios',
};

let navigationCache: NavSection[] | null = null;
let cacheTimestamp = 0;
// const CACHE_DURATION = 2592000;

export function clearNavigationCache() {
  navigationCache = null;
  cacheTimestamp = 0;
  console.log('🧹 Local navigation cache cleared');
}

export async function getProceduresNavigation(): Promise<NavSection[]> {
  const params = {
    fields: ['categoria', 'titulo', 'slug'],
    sort: ['categoria:asc', 'titulo:asc'],
    'pagination[pageSize]': 250,
  };

  const tramites: RawTramiteNav[] = await fetchAPI('/tramites', params);

  if (!tramites) return [];

  const grouped: Record<string, NavSection> = {};
  tramites.forEach((t) => {
    const catNumber = Number(t.categoria);
    const cat = categoriaMap[catNumber] || 'General';
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

  const sortedSections = Object.values(grouped)
    .map((section) => ({
      ...section,
      items: section.items.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => {
      if (a.title === 'General') return -1;
      if (b.title === 'General') return 1;
      return a.title.localeCompare(b.title);
    });

  navigationCache = sortedSections;

  return sortedSections;
}

export async function getProcedureBySlug(
  slug: string,
): Promise<Article | null> {
  const params = {
    'filters[slug][$eq]': slug,
    populate: '*',
  };
  const tramites: RawTramiteArticle[] = await fetchAPI('/tramites', params);

  if (!tramites || tramites.length === 0) {
    return null;
  }

  const t = tramites[0];
  const catNumber = Number(t.categoria);
  const category = categoriaMap[catNumber] || 'General';

  return {
    id: t.id,
    slug: t.slug,
    category,
    title: t.titulo,
    description: t.resumen,
    lastUpdated: t.updatedAt || t.fecha,
    content: wrapContentAsSection(t.contenido),
  };
}

function wrapContentAsSection(contenido: string | null): ArticleSection[] {
  if (!contenido) return [];
  return [{ type: 'paragraph', content: contenido }];
}

export async function getAllProcedureSlugs(): Promise<string[]> {
  const params = {
    fields: ['slug'],
    'pagination[pageSize]': 250,
  };
  const tramites: { slug: string }[] = await fetchAPI('/tramites', params);

  if (!tramites) return [];

  return tramites.map((t) => t.slug);
}

export async function getAllProcedures(): Promise<any[]> {
  const params = {
    fields: [
      'id',
      'slug',
      'categoria',
      'titulo',
      'resumen',
      'updatedAt',
      'fecha',
      'contenido',
    ],
    sort: ['categoria:asc', 'titulo:asc'],
    populate: '*',
    'pagination[pageSize]': 250,
  };
  const tramites: RawTramiteArticle[] = await fetchAPI('/tramites', params);

  if (!tramites) return [];

  return tramites.map((t) => {
    const catNumber = Number(t.categoria);
    const category = categoriaMap[catNumber] || 'General';

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

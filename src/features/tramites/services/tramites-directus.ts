import directus from '@/shared/lib/directus';
import { readItems } from '@directus/sdk';

// Interfaces equivalentes a las de docs-data.ts
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

// Mapa de categorías igual que en docs-data.ts
const categoriaMap: Record<number, string> = {
  1: 'Licencias especiales por salud y/o maternidad',
  2: 'Licencias extraordinarias',
  3: 'Justificación de inasistencias',
  4: 'Permisos',
  5: 'Suplentes',
};

// 1. Navegación de trámites agrupada por categoría
export async function getTramitesNavigationDirectus(): Promise<NavSection[]> {
  const tramites = await directus.request(
    readItems('tramites', {
      fields: ['categoria', 'titulo', 'slug'],
      sort: ['categoria', 'titulo'],
      limit: 250,
    })
  );
  if (!tramites) return [];
  const grouped: Record<string, NavSection> = {};
  tramites.forEach((t: any) => {
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
  const sortedSections = Object.values(grouped).sort((a, b) => {
    if (a.title === 'General') return -1;
    if (b.title === 'General') return 1;
    return a.title.localeCompare(b.title);
  });
  return sortedSections;
}

// 2. Obtener artículo/trámite por slug
export async function getTramiteArticleBySlugDirectus(slug: string): Promise<Article | null> {
  const tramites = await directus.request(
    readItems('tramites', {
      filter: { slug: { _eq: slug } },
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
      limit: 1,
    })
  );
  if (!tramites || tramites.length === 0) return null;
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
    content: parseContenidoToSectionsDirectus(t.contenido),
  };
}

// 3. Helper para parsear el contenido
function parseContenidoToSectionsDirectus(contenido: string | null): ArticleSection[] {
  if (!contenido) return [];
  return [{ type: 'paragraph', content: contenido }];
}

// 4. Obtener todos los slugs
export async function getAllTramiteSlugsDirectus(): Promise<string[]> {
  const tramites = await directus.request(
    readItems('tramites', {
      fields: ['slug'],
      limit: 250,
    })
  );
  if (!tramites) return [];
  return tramites.map((t: any) => t.slug);
}

// 5. Obtener todos los trámites (para listados completos)
export async function getAllTramitesDirectus(): Promise<any[]> {
  const tramites = await directus.request(
    readItems('tramites', {
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
      sort: ['categoria', 'titulo'],
      limit: 250,
    })
  );
  if (!tramites) return [];
  return tramites.map((t: any) => {
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
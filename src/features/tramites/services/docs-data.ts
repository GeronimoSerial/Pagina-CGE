import { DIRECTUS_URL } from '@/shared/lib/config';

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
  date?: string;
  description: string;
  lastUpdated: string;
  content: ArticleSection[];
}

// 1. Navegación de trámites agrupada por categoría
export async function getProceduresNavigation(): Promise<NavSection[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/tramites?fields=categoria,titulo,slug&sort=categoria,titulo&limit=200`,
      {
        next: {
          tags: ['tramites-all', 'tramites-navigation'],
          revalidate: false,
        },
      },
    );

    if (!response.ok) {
      console.error('Error fetching tramites navigation:', response.statusText);
      return [];
    }

    const { data: tramites } = await response.json();
    if (!tramites) return [];
    const grouped: Record<string, NavSection> = {};
    tramites.forEach((t: any) => {
      const cat = t.categoria;
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
  } catch (error) {
    console.error('Error in getProceduresNavigation:', error);
    return [];
  }
}

// 2. Obtener artículo/trámite por slug
export async function getProcedureBySlug(
  slug: string,
): Promise<Article | null> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/tramites?filter[slug][_eq]=${slug}&fields=id,slug,categoria,titulo,resumen,contenido,date_updated,date_created,fecha&limit=1`,
      {
        next: {
          tags: ['tramites-all', `tramites-page-${slug}`],
          revalidate: false,
        },
      },
    );

    if (!response.ok) {
      console.error('Error fetching tramite by slug:', response.statusText);
      return null;
    }

    const { data: tramites } = await response.json();
    if (!tramites || tramites.length === 0) return null;

    const t = tramites[0];

    return {
      id: t.id,
      slug: t.slug,
      category: t.categoria,
      title: t.titulo,
      description: t.resumen,
      lastUpdated: t.date_updated || t.fecha,
      date: t.date_created,
      content: wrapContentAsSection(t.contenido),
    };
  } catch (error) {
    console.error('Error in getProcedureBySlug:', error);
    return null;
  }
}

// 3. Helper para parsear el contenido
function wrapContentAsSection(contenido: string | null): ArticleSection[] {
  if (!contenido) return [];
  return [{ type: 'paragraph', content: contenido }];
}
// 4. Obtener todos los slugs
export async function getAllProcedureSlugs(): Promise<string[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/tramites?fields=slug&limit=200`,
      {
        next: {
          tags: ['tramites-all', 'tramites-list'],
          revalidate: false,
        },
      },
    );

    if (!response.ok) {
      console.error('Error fetching tramites slugs:', response.statusText);
      return [];
    }

    const { data: tramites } = await response.json();
    if (!tramites) return [];
    return tramites.map((t: any) => t.slug);
  } catch (error) {
    console.error('Error in getAllProcedureSlugs:', error);
    return [];
  }
}

// 5. Obtener todos los trámites (para listados completos)
export async function getAllProcedures(): Promise<any[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/tramites?fields=id,slug,categoria,titulo,resumen,date_updated,fecha,contenido&sort=categoria,titulo&limit=200`,
      {
        next: {
          tags: ['tramites-all', 'tramites-list'],
          revalidate: false,
        },
      },
    );

    if (!response.ok) {
      console.error('Error fetching all tramites:', response.statusText);
      return [];
    }

    const { data: tramites } = await response.json();
    if (!tramites) return [];

    return tramites.map((t: any) => {
      return {
        id: t.id,
        slug: t.slug,
        categoria: t.categoria,
        title: t.titulo,
        description: t.resumen,
        lastUpdated: t.date_updated || t.fecha,
        content: t.contenido,
      };
    });
  } catch (error) {
    console.error('Error in getAllProcedures:', error);
    return [];
  }
}

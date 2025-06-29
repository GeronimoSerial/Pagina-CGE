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

// Obtiene la navegación agrupando los trámites por categoría
export async function getTramitesNavigation(): Promise<NavSection[]> {
  const query = qs.stringify(
    { populate: '*', sort: ['categoria:asc', 'titulo:asc'] },
    { encodeValuesOnly: true },
  );
  const res = await fetch(`${API_URL}/tramites?${query}`);
  if (!res.ok) throw new Error('Error al obtener trámites');
  const { data } = await res.json();
  console.log('[Tramites][Navegación] Datos crudos:', data);

  // Agrupar por categoría
  const grouped: Record<string, NavSection> = {};
  data.forEach((t: any) => {
    const cat = t.categoria || 'Sin categoría';
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
  const nav = Object.values(grouped);
  console.log('[Tramites][Navegación] Estructura generada:', nav);
  return nav;
}

// Obtiene un artículo/trámite por slug
export async function getTramiteArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const res = await fetch(
    `${API_URL}/tramites?filters[slug][$eq]=${slug}&populate=*`,
  );
  if (!res.ok) throw new Error('Error al obtener trámite');
  const { data } = await res.json();
  console.log(`[Tramites][Artículo] Datos crudos para slug "${slug}":`, data);
  if (!data || data.length === 0) return null;
  const t = data[0];
  const article = {
    id: t.id,
    slug: t.slug,
    category: t.categoria,
    title: t.titulo,
    description: t.resumen,
    lastUpdated: t.updatedAt || t.fecha,
    content: parseContenidoToSections(t.contenido),
  };
  console.log(
    `[Tramites][Artículo] Artículo generado para slug "${slug}":`,
    article,
  );
  return article;
}

// Helper para parsear el contenido del trámite a secciones (ajustar según formato en Strapi)
function parseContenidoToSections(contenido: string): ArticleSection[] {
  // Si el contenido es markdown o texto plano, se puede adaptar aquí
  // Por ahora, lo tratamos como un solo párrafo
  return [
    {
      type: 'paragraph',
      content: contenido,
    },
  ];
}

// Helper para obtener todos los slugs (para generación estática)
export async function getAllTramiteSlugs(): Promise<string[]> {
  const res = await fetch(`${API_URL}/tramites?fields[0]=slug`);
  if (!res.ok) throw new Error('Error al obtener slugs');
  const { data } = await res.json();
  const slugs = data.map((t: any) => t.slug);
  console.log('[Tramites][Slugs] Slugs obtenidos:', slugs);
  return slugs;
}

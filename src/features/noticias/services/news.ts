import directus from '@/shared/lib/directus';
import { NewsItem } from '@/shared/interfaces';
import { cfImages } from '@/shared/lib/cloudflare-images';
import { DIRECTUS_URL } from '@/shared/lib/config';
import { safeFetchJson } from '@/shared/lib/safe-fetch';
import { handleBuildTimeError } from '@/shared/lib/build-time-error';


export async function getAllNews() {
  try {
    const { data: noticias } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?fields=slug&limit=-1`,
      {
        next: {
          tags: ['noticias', 'noticias-slugs'],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );
    return noticias || [];
  } catch (error) {
    return handleBuildTimeError(error, 'fetch all news items', []);
  }
}

// 2. Noticias paginadas (fetch directo con tags)
export async function getPaginatedNews(
  page: number = 1,
  pageSize: number = 4,
  filters: Record<string, any> = {},
) {
  try {
    const offset = (page - 1) * pageSize;

    // Construir filtros para URL
    let filterQuery = '';
    if (filters.categoria) {
      filterQuery = `&filter[categoria][_eq]=${encodeURIComponent(filters.categoria)}`;
    }

    const { data: noticias } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?fields=id,titulo,resumen,date_created,date_updated,fecha,categoria,esImportante,slug,portada.*&sort=-fecha,-id&limit=${Math.min(pageSize, 20)}&offset=${offset}${filterQuery}`,
      {
        next: {
          tags: ['noticias', 'noticias-paginated'],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );

    return {
      noticias: noticias || [],
      pagination: {
        page,
        pageCount: noticias.length < pageSize ? page : page + 1,
        pageSize,
        total: undefined,
      },
    };
  } catch (error) {
    console.error('Error in getPaginatedNews:', error);
    return {
      noticias: [],
      pagination: {
        page,
        pageCount: 1,
        pageSize,
        total: 0,
      },
    };
  }
}

// 3. Obtener noticia por slug (fetch directo con tags)
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const { data: noticias } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?filter[slug][_eq]=${encodeURIComponent(slug)}&fields=*,portada.*,imagenes.directus_files_id.*,videos.directus_files_id.*&limit=1`,
      {
        next: {
          tags: ['noticias', `noticia-${slug}`],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );
    if (!noticias || noticias.length === 0) return null;

    const n = noticias[0];
    return {
      id: n.id,
      autor: n.autor || 'Redacción CGE',
      titulo: n.titulo,
      resumen: n.resumen,
      categoria: n.categoria,
      esImportante: n.esImportante,
      portada: n.portada,
      slug: n.slug,
      contenido: n.contenido,
      imagen: n.imagen,
      imagenes: n.imagenes,
      videos: n.videos,
      publicado: n.publicado,
      fecha: n.fecha,
      createdAt: n.date_created,
      lastUpdated: n.date_updated || n.date_created,
      metaTitle: n.metaTitle || n.titulo,
      documentos: n.documentos || [],
      metaDescription: n.metaDescription || n.resumen,
    };
  } catch (error) {
    console.error('Error in getNewsBySlug:', error);
    return null;
  }
}

// 4. Noticias relacionadas (fetch directo con tags)
export async function getRelatedNews(categoria: string, excludeSlug?: string) {
  try {
    let filterQuery = `filter[categoria][_eq]=${encodeURIComponent(categoria)}`;
    if (excludeSlug) {
      filterQuery += `&filter[slug][_neq]=${encodeURIComponent(excludeSlug)}`;
    }

    const { data: noticias } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?${filterQuery}&fields=titulo,resumen,fecha,categoria,slug,portada.*&sort=-fecha&limit=2`,
      {
        next: {
          tags: ['noticias', `noticias-categoria-${categoria}`],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );
    return noticias || [];
  } catch (error) {
    console.error('Error in getRelatedNews:', error);
    return [];
  }
}

// 5. Portada (adaptado a Directus)
// Usa Cloudflare CDN para optimización. Next.js Image debe tener unoptimized={true}
export function getCover({ noticia }: any) {
  if (noticia.portada?.url) {
    return cfImages(noticia.portada.url, 1200, 'auto');
  }
  const coverId = noticia.portada?.id;
  if (!coverId || !directus.url) return null;
  return cfImages(`${directus.url}assets/${coverId}`, 1200, 'auto');
}

// 6. Imágenes (adaptado a Directus)
// Usa Cloudflare CDN para optimización de galería
export function getImages(noticia: NewsItem) {
  if (!Array.isArray(noticia.imagenes) || noticia.imagenes.length === 0) {
    return [];
  }

  return noticia.imagenes.map((img: any) => {
    const file = img.directus_files_id;
    return {
      url: cfImages(`${directus.url}assets/${file.id}`, 1200, 'auto'),
      alt: file.title || file.filename_download || '',
      width: file.width,
      height: file.height,
    };
  });
}

//8. Videos
export function getVideos(noticia: NewsItem) {
  if (!Array.isArray(noticia.videos) || noticia.videos.length === 0) {
    return [];
  }

  return noticia.videos.map((video: any) => {
    const file = video.directus_files_id;

    // Generar URL del video
    const videoUrl = `${directus.url}assets/${file.id}`;

    // Generar thumbnail - usar primera frame del video o imagen de placeholder
    let thumbnailUrl = '';

    // Intentar generar thumbnail desde el video (si Directus lo soporta)
    if (file.type && file.type.startsWith('video/')) {
      // Usar transformación de Directus para generar thumbnail del video
      thumbnailUrl = `${directus.url}assets/${file.id}?fit=cover&width=400&height=225&format=webp&quality=80`;
    } else {
      // Fallback a imagen placeholder
      thumbnailUrl = '/images/video-placeholder.jpg';
    }

    return {
      url: videoUrl,
      title: file.title || file.filename_download || 'Video sin título',
      width: file.width || 1920,
      height: file.height || 1080,
      duration: file.duration || 0,
      type: file.type || 'video/mp4',
      filesize: file.filesize || 0,
      thumbnail: thumbnailUrl,
    };
  });
}

// 7. Categorías únicas (fetch directo con tags)
export async function getNewsCategories(): Promise<
  Array<{ id: number; nombre: string }>
> {
  try {
    const { data: noticias } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?fields=categoria&limit=-1`,
      {
        next: {
          tags: ['noticias', 'noticias-categorias'],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );
    if (!noticias) return [];

    const categoriasUnicas = Array.from(
      new Set(noticias.map((item: any) => item.categoria).filter(Boolean)),
    );
    return (categoriasUnicas as string[]).map(
      (categoria: string, index: number) => ({
        id: index + 1,
        nombre: categoria,
      }),
    );
  } catch (error) {
    console.error('Error in getNewsCategories:', error);
    return [];
  }
}

// 8. Noticias destacadas (fetch directo - estructura corregida)
export async function getFeaturedNews(count: number = 3): Promise<NewsItem[]> {
  try {
    const { data: noticias } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?filter[esImportante][_eq]=true&fields=id,titulo,resumen,fecha,date_created,date_updated,categoria,esImportante,slug,portada.*&sort=-fecha,-id&limit=${count}`,
      {
        next: {
          tags: ['noticias-featured'],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );
    if (!noticias) return [];

    return noticias.map((n: any) => ({
      id: n.id,
      autor: 'Redacción CGE',
      titulo: n.titulo,
      resumen: n.resumen,
      categoria: n.categoria,
      esImportante: n.esImportante,
      portada: n.portada
        ? {
            url: `${DIRECTUS_URL}/assets/${n.portada.id}`,
            title: n.portada.title || n.portada.filename_download,
            width: n.portada.width,
            height: n.portada.height,
          }
        : { url: '' },
      slug: n.slug,
      contenido: n.resumen,
      imagen: [],
      publicado: true,
      fecha: n.fecha,
      createdAt: n.date_created,
      lastUpdated: n.date_updated || n.date_created,
      metaTitle: n.titulo,
      metaDescription: n.resumen,
    }));
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return [];
  }
}

// 9. Fetch de página de noticias (fetch directo con estructura corregida)
export async function fetchNewsPage(
  page: number = 1,
  pageSize: number = 6,
): Promise<{
  data: NewsItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  meta: {
    timestamp: string;
    cached: boolean;
  };
} | null> {
  try {
    const offset = (page - 1) * pageSize;

    // Primero obtener el total para la paginación
    const { data: countData } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?aggregate[count]=*`,
      {
        next: {
          tags: ['noticias-count'],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );
    const totalItems = countData?.[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Obtener las noticias de la página
    const { data: noticias } = await safeFetchJson(
      `${DIRECTUS_URL}/items/noticias?fields=id,titulo,resumen,fecha,date_created,date_updated,categoria,esImportante,slug,portada.*&sort=-fecha,-id&limit=${pageSize}&offset=${offset}`,
      {
        next: {
          tags: [`noticias-page-${page}`, 'noticias-list'],
          revalidate: false, // Cache hasta invalidación por webhook
        },
      },
      { timeoutMs: 8000, retries: 1 },
    );

    const transformedData = noticias.map((n: any) => ({
      id: n.id,
      autor: 'Redacción CGE',
      titulo: n.titulo,
      resumen: n.resumen,
      categoria: n.categoria,
      esImportante: n.esImportante,
      portada: n.portada
        ? {
            url: `${DIRECTUS_URL}/assets/${n.portada.id}`,
            title: n.portada.title || n.portada.filename_download,
            width: n.portada.width,
            height: n.portada.height,
          }
        : { url: '' },
      slug: n.slug,
      contenido: n.resumen,
      imagen: [],
      publicado: true,
      fecha: n.fecha,
      createdAt: n.date_created,
      lastUpdated: n.date_updated || n.date_created,
      metaTitle: n.titulo,
      metaDescription: n.resumen,
    }));

    return {
      data: transformedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        pageSize,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      meta: {
        timestamp: new Date().toISOString(),
        cached: true,
      },
    };
  } catch (error) {
    console.error('Error fetching news page:', error);
    return {
      data: [],
      pagination: {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        pageSize,
        hasNextPage: false,
        hasPrevPage: page > 1,
      },
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
      },
    };
  }
}

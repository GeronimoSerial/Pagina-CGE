import directus from '@/shared/lib/directus';
import { readItems } from '@directus/sdk';
import { NewsItem } from '@/shared/interfaces';
import { cfImages } from '@/shared/lib/cloudflare-images';
import { getBaseUrl } from '@/shared/lib/utils';

// ------------> Directus SDK for News <------------
// 1. Obtener todas las noticias (solo slugs)
export async function getAllNews() {
  const noticias = await directus.request(
    readItems('noticias', {
      fields: ['slug'],
      limit: -1,
    }),
  );

  return noticias;
}

// 2. Noticias paginadas
export async function getPaginatedNews(
  page: number = 1,
  pageSize: number = 4,
  filters: Record<string, any> = {},
) {
  // Adaptar filtros a Directus (sin publicado)
  const filter = { ...filters };
  const noticias = await directus.request(
    readItems('noticias', {
      fields: [
        'titulo',
        'resumen',
        'fecha',
        'categoria',
        'esImportante',
        'slug',
        {
          portada: [
            'id',
            'filename_disk',
            'title',
            'description',
            'width',
            'height',
          ],
        },
        {
          imagenes: [
            {
              directus_files_id: [
                'id',
                'filename_disk',
                'filename_download',
                'title',
                'description',
                'width',
                'height',
                'type',
              ],
            },
          ],
        },
      ],
      sort: ['-fecha', '-id'],
      limit: Math.min(pageSize, 20),
      page,
      filter,
    }),
  );
  return {
    noticias,
    pagination: {
      page,
      pageCount: noticias.length < pageSize ? page : page + 1,
      pageSize,
      total: undefined,
    },
  };
}

// 3. Obtener noticia por slug
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const noticias = await directus.request(
    readItems('noticias', {
      filter: { slug: { _eq: slug } },
      fields: [
        '*',
        {
          portada: [
            'id',
            'filename_disk',
            'title',
            'description',
            'width',
            'height',
          ],
        },
        {
          imagenes: [
            {
              directus_files_id: [
                'id',
                'filename_disk',
                'filename_download',
                'title',
                'description',
                'width',
                'height',
                'type',
              ],
            },
          ],
        },
      ],
      limit: 1,
    }),
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
    publicado: n.publicado,
    fecha: n.fecha,
    // createdAt: n.createdAt,
    metaTitle: n.metaTitle || n.titulo,
    metaDescription: n.metaDescription || n.resumen,
  };
}

// 4. Noticias relacionadas
export async function getRelatedNews(categoria: string, excludeSlug?: string) {
  const filter: any = {
    categoria: { _eq: categoria },
  };
  if (excludeSlug) {
    filter.slug = { _neq: excludeSlug };
  }
  const noticias = await directus.request(
    readItems('noticias', {
      filter,
      limit: 2,
      fields: [
        'titulo',
        'resumen',
        'fecha',
        'categoria',
        'slug',
        { portada: ['id', 'filename_disk', 'title', 'description'] },
      ],
      // sort: ['-createdAt', '-fecha'],
      sort: ['-fecha'],
    }),
  );
  return noticias;
}

// 5. Portada (adaptado a Directus)
export function getCover({ noticia }: any) {
  if (noticia.portada?.url) {
    return cfImages(noticia.portada.url);
  }
  const coverId = noticia.portada?.id;
  if (!coverId || !directus.url) return null;
  return cfImages(`${directus.url}assets/${coverId}`, 1200, 'auto');
}

// 6. Imágenes (adaptado a Directus)
export function getImages(noticia: NewsItem) {
  if (!Array.isArray(noticia.imagenes) || noticia.imagenes.length === 0) {
    return [];
  }

  return noticia.imagenes.map((img: any) => {
    const file = img.directus_files_id;
    return {
      url: cfImages(`${directus.url}assets/${file.id}`),
      alt: file.title || file.filename_download || '',
      width: file.width,
      height: file.height,
    };
  });
}

// 7. Categorías únicas
export async function getNewsCategories(): Promise<
  Array<{ id: number; nombre: string }>
> {
  const noticias = await directus.request(
    readItems('noticias', {
      fields: ['categoria'],
      limit: -1,
    }),
  );
  const categoriasUnicas = Array.from(
    new Set(noticias.map((item: any) => item.categoria).filter(Boolean)),
  );
  return (categoriasUnicas as string[]).map(
    (categoria: string, index: number) => ({
      id: index + 1,
      nombre: categoria,
    }),
  );
}

// 8. Noticias destacadas (con Directus SDK)
async function getFeaturedNewsDirectus(count: number): Promise<NewsItem[]> {
  const noticias = await directus.request(
    readItems('noticias', {
      filter: { esImportante: { _eq: true } },
      fields: [
        'id',
        'titulo',
        'resumen',
        'fecha',
        'categoria',
        'esImportante',
        'slug',
        { portada: ['id', 'filename_disk', 'title', 'width', 'height'] },
      ],
      limit: count,
      sort: ['-fecha', '-id'],
    }),
  );

  return noticias.map((n: any) => ({
    id: n.id,
    autor: 'Redacción CGE',
    titulo: n.titulo,
    resumen: n.resumen,
    categoria: n.categoria,
    esImportante: n.esImportante,
    portada: n.portada
      ? {
          url: `${directus.url}assets/${n.portada.id}?width=1200&height=630&fit=cover`,
          title: n.portada.title,
          width: n.portada.width,
          height: n.portada.height,
        }
      : { url: '' }, // Proporcionar fallback para cumplir con el tipo NewsItem
    slug: n.slug,
    contenido: n.resumen,
    imagen: [],
    publicado: true,
    fecha: n.fecha,
    metaTitle: n.titulo,
    metaDescription: n.resumen,
  }));
}

interface ApiResponse {
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
}

// ------------> API Proxy for News <----------------------------------

// 8. Noticias destacadas fetch API con fallback a Directus SDK
export async function getFeaturedNews(count: number = 3): Promise<NewsItem[]> {
  // Durante el build usar Directus SDK directamente
  const isBuildTime = process.env.BUILD_TIME === 'true';

  if (isBuildTime) {
    console.log(
      'Build time detected, using Directus SDK directly for featured news',
    );
    return await getFeaturedNewsDirectus(count);
  }

  try {
    // En runtime, usar API proxy para caché
    const baseUrl = getBaseUrl();

    if (!baseUrl || baseUrl.includes('undefined')) {
      console.warn('Base URL is undefined, using Directus SDK fallback');
      return await getFeaturedNewsDirectus(count);
    }

    const response = await fetch(
      `${baseUrl}/api/noticias?type=featured&limit=${count}`,
      {
        next: {
          revalidate: 600, // 10 minutos
          tags: ['noticias-destacadas', 'noticias-featured'],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(8000), // Timeout 8s
      },
    );

    if (response.ok) {
      const apiData = await response.json();

      // Transformar a NewsItem[]
      return apiData.data.map((noticia: any) => ({
        id: noticia.id,
        autor: 'Redacción CGE',
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        categoria: noticia.categoria,
        esImportante: noticia.esImportante,
        portada: noticia.portada,
        slug: noticia.slug,
        contenido: noticia.resumen,
        imagen: [],
        publicado: true,
        fecha: noticia.fecha,
        metaTitle: noticia.titulo,
        metaDescription: noticia.resumen,
      }));
    }

    // Fallback: llamada directa a Directus si la API falla
    console.warn('API proxy falló, usando fallback directo a Directus SDK');
    return await getFeaturedNewsDirectus(count);
  } catch (error) {
    console.error(
      'Error fetching featured news via API proxy, trying Directus SDK fallback:',
      error,
    );

    // Fallback: llamada directa a Directus SDK
    try {
      return await getFeaturedNewsDirectus(count);
    } catch (fallbackError) {
      console.error('Fallback to Directus SDK also failed:', fallbackError);
      return [];
    }
  }
}

export async function fetchNewsPage(page: number): Promise<ApiResponse | null> {
  // Durante el build, usar Directus SDK directamente
  const isBuildTime = process.env.BUILD_TIME === 'true';

  if (isBuildTime) {
    console.log(
      `Build time detected, using Directus SDK directly for page ${page}`,
    );
    try {
      const result = await getPaginatedNews(page, 6);

      // Adaptar formato de respuesta para compatibilidad
      return {
        data: result.noticias.map((n: any) => ({
          id: n.id,
          autor: 'Redacción CGE',
          titulo: n.titulo,
          resumen: n.resumen,
          categoria: n.categoria,
          esImportante: n.esImportante,
          portada: n.portada
            ? {
                url: `${directus.url}assets/${n.portada.id}`,
                title: n.portada.title,
                width: n.portada.width,
                height: n.portada.height,
              }
            : { url: '' },
          slug: n.slug,
          contenido: n.resumen,
          imagen: [],
          publicado: true,
          fecha: n.fecha,
          metaTitle: n.titulo,
          metaDescription: n.resumen,
        })),
        pagination: {
          currentPage: page,
          totalPages: result.pagination.pageCount,
          totalItems: result.pagination.total || 0,
          pageSize: 6,
          hasNextPage: result.noticias.length === 6,
          hasPrevPage: page > 1,
        },
        meta: {
          timestamp: new Date().toISOString(),
          cached: false,
        },
      };
    } catch (error) {
      console.error('Error fetching news page via Directus SDK:', error);
      return null;
    }
  }

  try {
    const apiUrl = getBaseUrl();
    if (!apiUrl || apiUrl.includes('undefined')) {
      console.warn('Base URL is undefined, using Directus SDK fallback');
      // Usar la misma lógica de arriba como fallback
      const result = await getPaginatedNews(page, 6);
      return {
        data: result.noticias.map((n: any) => ({
          id: n.id,
          autor: 'Redacción CGE',
          titulo: n.titulo,
          resumen: n.resumen,
          categoria: n.categoria,
          esImportante: n.esImportante,
          portada: n.portada
            ? {
                url: cfImages(`${directus.url}assets/${n.portada.id}`),
                title: n.portada.title,
                width: n.portada.width,
                height: n.portada.height,
              }
            : { url: '' },
          slug: n.slug,
          contenido: n.resumen,
          imagen: [],
          publicado: true,
          fecha: n.fecha,
          metaTitle: n.titulo,
          metaDescription: n.resumen,
        })),
        pagination: {
          currentPage: page,
          totalPages: result.pagination.pageCount,
          totalItems: result.pagination.total || 0,
          pageSize: 6,
          hasNextPage: result.noticias.length === 6,
          hasPrevPage: page > 1,
        },
        meta: {
          timestamp: new Date().toISOString(),
          cached: false,
        },
      };
    }

    const response = await fetch(
      `${apiUrl}/api/noticias/page/${page}?pageSize=6`,
      {
        next: {
          revalidate: 300, // 5 minutos
          tags: [`noticias`, `noticias-page-${page}`],
        },
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(8000), // Timeout 8s para build
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      'Error fetching news page via API proxy, trying Directus SDK fallback:',
      error,
    );

    // Fallback: usar Directus SDK
    try {
      const result = await getPaginatedNews(page, 6);
      return {
        data: result.noticias.map((n: any) => ({
          id: n.id,
          autor: 'Redacción CGE',
          titulo: n.titulo,
          resumen: n.resumen,
          categoria: n.categoria,
          esImportante: n.esImportante,
          portada: n.portada
            ? {
                url: `${directus.url}assets/${n.portada.id}`,
                title: n.portada.title,
                width: n.portada.width,
                height: n.portada.height,
              }
            : { url: '' },
          slug: n.slug,
          contenido: n.resumen,
          imagen: [],
          publicado: true,
          fecha: n.fecha,
          metaTitle: n.titulo,
          metaDescription: n.resumen,
        })),
        pagination: {
          currentPage: page,
          totalPages: result.pagination.pageCount,
          totalItems: result.pagination.total || 0,
          pageSize: 6,
          hasNextPage: result.noticias.length === 6,
          hasPrevPage: page > 1,
        },
        meta: {
          timestamp: new Date().toISOString(),
          cached: false,
        },
      };
    } catch (fallbackError) {
      console.error('Directus SDK fallback also failed:', fallbackError);
      return null;
    }
  }
}

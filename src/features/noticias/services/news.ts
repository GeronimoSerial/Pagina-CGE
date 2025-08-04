import directus from '@/shared/lib/directus';
import { readItems } from '@directus/sdk';
import { NewsItem } from '@/shared/interfaces';
import { cfImages } from '@/shared/lib/cloudflare-images';
import { DIRECTUS_URL } from '@/shared/lib/config';

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

// 8. Noticias destacadas (fetch directo - estructura corregida)
export async function getFeaturedNews(count: number = 3): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/noticias?filter[esImportante][_eq]=true&fields=id,titulo,resumen,fecha,categoria,esImportante,slug,portada.*&sort=-fecha,-id&limit=${count}`,
      {
        next: {
          tags: ['noticias-featured'],
          revalidate: 0, // Sin caché del navegador
        },
      },
    );

    if (!response.ok) {
      console.error('Error fetching featured news:', response.statusText);
      return [];
    }

    const { data: noticias } = await response.json();
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
      metaTitle: n.titulo,
      metaDescription: n.resumen,
    }));
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return [];
  }
}

// 9. Fetch de página de noticias (fetch directo con estructura corregida)
export async function fetchNewsPage(page: number = 1, pageSize: number = 6): Promise<{
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
    const countResponse = await fetch(
      `${DIRECTUS_URL}/items/noticias?aggregate[count]=*`,
      {
        next: {
          tags: ['noticias-count'],
          revalidate: 0, // Sin caché del navegador
        },
      }
    );
    
    if (!countResponse.ok) {
      throw new Error(`Error getting count: ${countResponse.status}`);
    }
    
    const { data: countData } = await countResponse.json();
    const totalItems = countData?.[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Obtener las noticias de la página
    const response = await fetch(
      `${DIRECTUS_URL}/items/noticias?fields=id,titulo,resumen,fecha,categoria,esImportante,slug,portada.*&sort=-fecha,-id&limit=${pageSize}&offset=${offset}`,
      {
        next: {
          tags: [`noticias-page-${page}`, 'noticias-list'],
          revalidate: 0, // Sin caché del navegador
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const { data: noticias } = await response.json();

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
    return null;
  }
}

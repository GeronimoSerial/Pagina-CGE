'use client';
import { useState, useEffect, useCallback } from 'react';
import NewsSearch from '@/src/components/noticias/Search';
import { getNoticiasPaginadas } from '@/src/services/noticias';
import PaginacionServer from '@/src/components/noticias/PaginacionServer';
import { useSearchParams, useRouter } from 'next/navigation';
import NewsGrid from '@/src/components/noticias/NewsGrid';

export default function NoticiasClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Leer filtros y página desde la URL
  const query = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria') || '';
  const fechaDesde = searchParams.get('fechaDesde') || '';
  const fechaHasta = searchParams.get('fechaHasta') || '';
  // const autor = searchParams.get('autor') || '';
  const page = Number(searchParams.get('page') || 1);
  const pageSize = 6;

  const [noticias, setNoticias] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    pageSize,
    pageCount: 1,
    total: 0,
  });
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construir objeto de filtros para Strapi
  const buildFilters = useCallback(() => {
    const filters: any = {};
    if (query) filters.titulo = { $containsi: query };
    if (categoria) filters.categoria = { $eq: categoria };
    if (fechaDesde && fechaHasta)
      filters.fecha = { $between: [fechaDesde, fechaHasta] };
    else if (fechaDesde) filters.fecha = { $gte: fechaDesde };
    else if (fechaHasta) filters.fecha = { $lte: fechaHasta };
    // if (autor) filters.autor = { $eq: autor };
    return filters;
  }, [query, categoria, fechaDesde, fechaHasta]);

  // Fetch noticias y categorías cuando cambian los params
  useEffect(() => {
    setLoading(true);
    setError(null);
    getNoticiasPaginadas(page, pageSize, buildFilters())
      .then(({ noticias, pagination }) => {
        setNoticias(noticias);
        setPagination(pagination);
        // Extraer categorías únicas
        const cats = Array.from(
          new Set(
            noticias
              .map((n: any) => n.categoria)
              .filter((c: any): c is string => typeof c === 'string'),
          ),
        );
        setCategorias(cats as string[]);
      })
      .catch((err) => {
        setError('No se pudieron cargar las noticias.');
        setNoticias([]);
      })
      .finally(() => setLoading(false));
  }, [page, query, categoria, fechaDesde, fechaHasta, buildFilters]);

  // Actualizar los query params en la URL
  const updateSearchParams = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.categoria) params.set('categoria', filters.categoria);
    if (filters.fechaDesde) params.set('fechaDesde', filters.fechaDesde);
    if (filters.fechaHasta) params.set('fechaHasta', filters.fechaHasta);
    // if (filters.autor) params.set('autor', filters.autor);
    params.set('page', '1'); // Resetear a la primera página en cada búsqueda
    router.push(`?${params.toString()}`);
  };

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  };

  // Mapear noticias al formato esperado por NewsGrid
  const noticiasMapped = noticias.map((n: any) => ({
    id: n.id,
    slug: n.slug,
    titulo: n.titulo,
    resumen: n.resumen,
    fecha: n.fecha,
    autor: n.autor,
    categoria: n.categoria,
    portada: n.portada,
    destacado: n.esImportante || n.destacado || false,
  }));

  return (
    <div>
      <NewsSearch
        onSearch={updateSearchParams}
        categorias={categorias}
        placeholder="Buscar noticias institucionales..."
      />
      {loading ? (
        <div className="text-center py-12 text-slate-500">
          Cargando noticias...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : noticias.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No se encontraron noticias.
        </div>
      ) : (
        <NewsGrid noticias={noticiasMapped} />
      )}
      <div className="mt-8">
        <PaginacionServer
          currentPage={pagination.page}
          totalItems={pagination.total}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

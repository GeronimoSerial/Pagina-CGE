'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import NewsGrid from './NewsGrid';
import SimplePagination from './SimplePagination';
import { Noticia } from '@/shared/interfaces';
import { STRAPI_URL } from '@/shared/lib/config';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface DynamicNewsClientProps {
  categorias: Array<{ id: number; nombre: string }>;
}

export default function DynamicNewsClient({
  categorias,
}: DynamicNewsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = Number(searchParams.get('page')) || 1;
  const q = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria') || '';
  const desde = searchParams.get('desde') || '';
  const hasta = searchParams.get('hasta') || '';

  const debouncedQ = useDebounce(q, 500);

  const cacheBuster = useMemo(() => {
    const pageGroup = Math.floor((currentPage - 1) / 5);
    const hasFilters = debouncedQ || categoria || desde || hasta;
    return hasFilters ? `filtered-${pageGroup}` : `clean-${pageGroup}`;
  }, [currentPage, debouncedQ, categoria, desde, hasta]);

  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const params = new URLSearchParams({
        'pagination[page]': String(currentPage),
        'pagination[pageSize]': '6',
        'sort[0]': 'createdAt:desc',
        'sort[1]': 'fecha:desc',
        'populate[portada][fields][0]': 'url',
        'populate[portada][fields][1]': 'alternativeText',
        'filters[publicado][$eq]': 'true',
        ...(debouncedQ && { 'filters[titulo][$containsi]': debouncedQ }),
        ...(categoria && { 'filters[categoria][$eq]': categoria }),
        ...(desde && { 'filters[fecha][$gte]': desde }),
        ...(hasta && { 'filters[fecha][$lte]': hasta }),
      });

      const noticiasRes = await fetch(
        `${STRAPI_URL}/api/noticias?${params.toString()}`,
        {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'max-age=90',
          },
        },
      );

      clearTimeout(timeoutId);

      if (!noticiasRes.ok) {
        throw new Error(
          `HTTP ${noticiasRes.status}: Error al cargar las noticias`,
        );
      }

      const noticiasData = await noticiasRes.json();

      const mapeadas: Noticia[] = noticiasData.data.map((noticia: any) => ({
        id: noticia.id,
        autor: noticia.autor || 'Redacción CGE',
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        fecha: noticia.fecha,
        categoria: noticia.categoria,
        esImportante: noticia.esImportante || false,
        slug: noticia.slug,
        portada: noticia.portada,
        imagen: noticia.imagen,
      }));

      setNoticias(mapeadas);
      setTotalPages(noticiasData.meta?.pagination?.pageCount || 1);
    } catch (error: any) {
      console.error('Error fetching noticias:', error);
      setError(error.message || 'Error al cargar las noticias');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedQ, categoria, desde, hasta, cacheBuster]);

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/noticias?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D8B37]"></div>
          <div className="text-gray-500">Filtrando noticias...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error: {error}</div>
          <button
            onClick={fetchNoticias}
            className="px-4 py-2 bg-[#3D8B37] text-white rounded-md hover:bg-[#2d6b29] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const noticiasDestacadas = noticias.filter((noticia) => noticia.esImportante);
  const noticiasRegulares = noticias.filter((noticia) => !noticia.esImportante);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {noticias.length > 0
            ? `${noticias.length} noticia${noticias.length !== 1 ? 's' : ''} encontrada${noticias.length !== 1 ? 's' : ''}`
            : 'No se encontraron noticias'}
        </div>
      </div>

      {/* Grid de noticias filtradas */}
      {noticias.length > 0 ? (
        <>
          <NewsGrid
            noticiasDestacadas={noticiasDestacadas}
            noticiasRegulares={noticiasRegulares}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            No se encontraron noticias con los filtros aplicados.
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import NewsGrid from './NewsGrid';
import NewsSearch from './Search';
import { Noticia } from '@/shared/interfaces';


function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    
    const start = Math.max(1, currentPage - 2);
    return start + i;
  }).filter((page) => page <= totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Anterior
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md transition-colors ${
            page === currentPage
              ? 'bg-[#3D8B37] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Siguiente
        </button>
      )}
    </div>
  );
}

interface NewsClientProps {}

export default function NewsClient({}: NewsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [destacadas, setDestacadas] = useState<Noticia[]>([]);
  const [categorias, setCategorias] = useState<
    Array<{ id: number; nombre: string }>
  >([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const currentPage = Number(searchParams.get('page')) || 1;
  const q = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria') || '';
  const desde = searchParams.get('desde') || '';
  const hasta = searchParams.get('hasta') || '';

  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      
      const [noticiasRes, categoriasRes] = await Promise.all([
        fetch(
          `/api/noticias?${new URLSearchParams({
            page: String(currentPage),
            ...(q && { q }),
            ...(categoria && { categoria }),
            ...(desde && { desde }),
            ...(hasta && { hasta }),
            t: String(Date.now()),
          }).toString()}`,
          {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          },
        ),
        categorias.length === 0
          ? fetch(`/api/noticias/categorias?t=${Date.now()}`, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache',
              },
            })
          : Promise.resolve(null),
      ]);

      if (!noticiasRes.ok) {
        throw new Error('Error al cargar las noticias');
      }

      const noticiasData = await noticiasRes.json();

      
      if (categoriasRes && categoriasRes.ok) {
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData.categorias || []);
      }

      
      const mapeadas: Noticia[] = noticiasData.noticias.map((noticia: any) => ({
        id: noticia.id,
        autor: noticia.autor || 'Redacción CGE',
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        categoria: noticia.categoria,
        esImportante: noticia.esImportante || false,
        portada: noticia.portada || { url: '' },
        slug: noticia.slug,
        contenido: noticia.contenido || '',
        imagen: noticia.imagen || [],
        publicado: noticia.publicado || true,
        fecha: noticia.fecha,
        metaTitle: noticia.metaTitle || noticia.titulo,
        metaDescription: noticia.metaDescription || noticia.resumen,
        createdAt: noticia.createdAt,
        updatedAt: noticia.updatedAt,
      }));

      
      const dest = mapeadas
        .filter((noticia) => noticia.esImportante)
        .slice(0, 3);

      const idsDests = new Set(dest.map((n) => n.id));
      const regulares = mapeadas.filter((noticia) => !idsDests.has(noticia.id));

      setDestacadas(dest);
      setNoticias(regulares);
      setTotalPages(noticiasData.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, q, categoria, desde, hasta, categorias.length]);

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
          <div className="text-gray-500">Cargando noticias...</div>
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

  if (!loading && noticias.length === 0 && destacadas.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-gray-500 mb-2">No se encontraron noticias</div>
          <div className="text-sm text-gray-400">
            Prueba cambiando los filtros de búsqueda
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search integrado en el client - VPS no procesa nada */}
      <div className="px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <NewsSearch
              categorias={categorias}
              placeholder="Buscar noticias institucionales..."
            />
          </div>
          <button
            onClick={fetchNoticias}
            disabled={loading}
            className="ml-4 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
            title="Actualizar noticias"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      <NewsGrid noticiasDestacadas={destacadas} noticiasRegulares={noticias} />
      {totalPages > 1 && (
        <SimplePagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

import HeroSection from '@/shared/components/Hero';
import NewsSearch from '@/features/noticias/components/Search';
import NewsGrid from '@/features/noticias/components/NewsGrid';
import PaginacionServer from '@/features/noticias/components/PaginacionServer';
import { getNoticiasPaginadas } from '@/features/noticias/services/noticias';
import { notFound } from 'next/navigation';

interface NoticiasPageProps {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    desde?: string;
    hasta?: string;
    page?: string;
  }>;
}

export default async function NoticiasPage({
  searchParams,
}: NoticiasPageProps) {
  const awaitedSearchParams = await searchParams;
  const page = Number(awaitedSearchParams.page) || 1;
  const pageSize = 6;
  const query = awaitedSearchParams.q || '';
  const categoria = awaitedSearchParams.categoria || '';
  const fechaDesde = awaitedSearchParams.desde || '';
  const fechaHasta = awaitedSearchParams.hasta || '';

  // Construir filtros para Strapi
  const filters: any = {};
  if (query) filters.titulo = { $containsi: query };
  if (categoria) filters.categoria = { $eq: categoria };
  if (fechaDesde && fechaHasta)
    filters.fecha = { $between: [fechaDesde, fechaHasta] };
  else if (fechaDesde) filters.fecha = { $gte: fechaDesde };
  else if (fechaHasta) filters.fecha = { $lte: fechaHasta };

  // Fetch server-side con ISR
  let noticias = [];
  let pagination = { page: 1, pageSize, pageCount: 1, total: 0 };
  try {
    const res = await getNoticiasPaginadas(page, pageSize, filters);
    noticias = res.noticias;
    pagination = res.pagination;
  } catch {
    // Si falla, mostrar notFound
    return notFound();
  }

  // Extraer categorías únicas para el filtro
  const categorias: string[] = Array.from(
    new Set(
      noticias
        .map((n: any) => n.categoria)
        .filter((c: any): c is string => typeof c === 'string'),
    ),
  );

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

  // Separar las 2 destacadas más recientes
  const noticiasDestacadas = noticiasMapped
    .filter((n: { destacado: boolean }) => n.destacado)
    .sort(
      (a: { fecha: string }, b: { fecha: string }) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    )
    .slice(0, 2);
  // El resto (incluidas otras destacadas) van al grid regular
  const idsDestacadas = new Set(
    noticiasDestacadas.map((n: { id: string | number }) => n.id),
  );
  const noticiasRegulares = noticiasMapped.filter(
    (n: { id: string | number }) => !idsDestacadas.has(n.id),
  );

  return (
    <section>
      <HeroSection
        title="Noticias institucionales"
        description="Mantente informado con las últimas noticias y novedades del Consejo General de Educación."
      />
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <NewsSearch
            categorias={categorias}
            placeholder="Buscar noticias institucionales..."
            initialFilters={{
              query,
              categoria,
              fechaDesde,
              fechaHasta,
              autor: '',
            }}
          />
          <NewsGrid
            noticiasDestacadas={noticiasDestacadas}
            noticiasRegulares={noticiasRegulares}
          />
          <div className="mt-8">
            <PaginacionServer
              currentPage={pagination.page}
              totalItems={pagination.total}
              pageSize={pagination.pageSize}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

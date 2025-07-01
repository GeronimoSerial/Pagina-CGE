import HeroSection from '@/shared/components/Hero';
import NewsSearch from '@/features/noticias/components/Search';
import NewsGrid from '@/features/noticias/components/NewsGrid';
import PaginacionServer from '@/features/noticias/components/PaginacionServer';
import {
  getNoticiasPaginadas,
  getNoticiasCategorias,
} from '@/features/noticias/services/noticias';
import { notFound } from 'next/navigation';
import { Separator } from '@/shared/ui/separator';

interface NoticiasPageProps {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    desde?: string;
    hasta?: string;
    page?: string;
  }>;
}

export const revalidate = 60;

export default async function NoticiasPage({
  searchParams,
}: NoticiasPageProps) {
  const { q, categoria, desde, hasta, page } = await searchParams;
  const pageSize = 7;
  const pageNumber = Number(page) || 1;

  // Construir filtros para Strapi
  const filters: any = {};
  if (q) filters.titulo = { $containsi: q };
  if (categoria) filters.categoria = { $eq: categoria };
  if (desde && hasta) filters.fecha = { $between: [desde, hasta] };
  else if (desde) filters.fecha = { $gte: desde };
  else if (hasta) filters.fecha = { $lte: hasta };

  // Fetch de datos en paralelo para mayor eficiencia
  let noticiasData, categorias;
  try {
    [noticiasData, categorias] = await Promise.all([
      getNoticiasPaginadas(pageNumber, pageSize, filters),
      getNoticiasCategorias(), // Llama a la nueva función
    ]);
  } catch {
    return notFound();
  }

  const { noticias, pagination } = noticiasData;

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

  const idsDestacadas = new Set(
    noticiasDestacadas.map((n: { id: string | number }) => n.id),
  );
  const noticiasRegulares = noticiasMapped.filter(
    (n: { id: string | number }) => !idsDestacadas.has(n.id),
  );

  return (
    <section>
      <HeroSection
        title="Noticias"
        description="Encuentra información sobre eventos, actividades y noticias institucionales."
      />
      <div className="px-6 mx-auto max-w-7xl">
        <NewsSearch
          categorias={categorias} // Pasa la lista completa de categorías
          placeholder="Buscar noticias institucionales..."
          initialFilters={{
            q: q || '',
            categoria: categoria || '',
            desde: desde || '',
            hasta: hasta || '',
          }}
        />
      </div>
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
      <Separator className="my-8 bg-gray-50" />
    </section>
  );
}

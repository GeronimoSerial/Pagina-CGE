import HeroSection from '@/shared/components/Hero';
import NewsSearch from '@/features/noticias/components/Search';
import NewsGrid from '@/features/noticias/components/NewsGrid';
import {
  getNoticiasPaginadas,
  getNoticiasCategorias,
} from '@/features/noticias/services/noticias';
import { notFound } from 'next/navigation';
import { Separator } from '@/shared/ui/separator';
import { Metadata } from 'next';
import SimplePagination from '@/features/noticias/components/SimplePagination';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Noticias del Consejo General de Educación (CGE) en Corrientes',
  alternates: {
    canonical: '/noticias',
  },
  openGraph: {
    title: 'Noticias del CGE',
    description:
      'Mantente informado sobre las últimas noticias y eventos del Consejo General de Educación de Corrientes.',
    url: '/noticias',
    siteName: 'Consejo General de Educación',
    images: [
      {
        url: '/og-noticias.webp',
        width: 1200,
        height: 630,
        alt: 'Noticias del CGE',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
};

interface NoticiasPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    categoria?: string;
    desde?: string;
    hasta?: string;
  }>;
}

export default async function NoticiasPage({ searchParams }: NoticiasPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  
  // Extract search parameters
  const currentPage = Number(params.page) || 1;
  const filtros: Record<string, any> = {};
  
  // Build filters
  if (params.q) filtros.titulo = { $containsi: params.q };
  if (params.categoria) filtros.categoria = { $eq: params.categoria };
  if (params.desde && params.hasta) {
    filtros.fecha = { $between: [params.desde, params.hasta] };
  } else if (params.desde) {
    filtros.fecha = { $gte: params.desde };
  } else if (params.hasta) {
    filtros.fecha = { $lte: params.hasta };
  }

  try {
    // SSR data fetch with optimized cache (VPS-friendly)
    const [noticiasData, categoriasData] = await Promise.all([
      getNoticiasPaginadas(currentPage, 5, filtros),
      getNoticiasCategorias(),
    ]);

    const { noticias, pagination } = noticiasData;

    // Separate featured from regular news
    const destacadas = noticias
      .filter((noticia: any) => noticia.esImportante)
      .slice(0, 3);

    const idsDestacadas = new Set(destacadas.map((n: any) => n.id));
    const regulares = noticias.filter((noticia: any) => !idsDestacadas.has(noticia.id));

    return (
      <section>
        <HeroSection
          title="Noticias"
          description="Encuentra información sobre eventos, actividades y noticias institucionales."
        />
        
        {/* SSR Search - no client-side API calls */}
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <NewsSearch
                categorias={categoriasData || []}
                placeholder="Buscar noticias institucionales..."
              />
            </div>
          </div>
        </div>

        {/* Server-rendered grid - VPS optimized */}
        <NewsGrid 
          noticiasDestacadas={destacadas} 
          noticiasRegulares={regulares} 
        />
        
        {/* Pagination only if needed */}
        {pagination && pagination.pageCount > 1 && (
          <SimplePagination
            totalPages={pagination.pageCount}
            currentPage={pagination.page}
          />
        )}
        
        <Separator className="my-8 bg-gray-50" />
      </section>
    );
  } catch (error) {
    console.error('Error loading noticias:', error);
    notFound();
  }
}

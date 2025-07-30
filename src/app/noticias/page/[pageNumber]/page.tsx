import {
  getPaginatedNews,
  getNewsCategories,
  getFeaturedNews,
} from '@/features/noticias/services/news';
import { PageLayout } from '@/shared/components/PageLayout';
import { Metadata } from 'next';
import StaticNewsSection from '@/features/noticias/components/StaticNewsSection';

export async function generateStaticParams() {
  try {
    // Obtener el total de noticias para calcular páginas necesarias
    const { pagination } = await getPaginatedNews(1, 9);
    const totalPages = Math.min(pagination.pageCount, 5); // Máximo 5 páginas

    console.log(
      `DEBUG: Generating static params for ${totalPages} pages (total news: ${pagination.total})`,
    );

    const params = [];
    for (let i = 1; i <= totalPages; i++) {
      params.push({ pageNumber: i.toString() });
    }

    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback a páginas fijas
    return [
      { pageNumber: '1' },
      { pageNumber: '2' },
      { pageNumber: '3' },
      { pageNumber: '4' },
      { pageNumber: '5' },
    ];
  }
}

export const revalidate = 2592000; // 30 días
export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}): Promise<Metadata> {
  const { pageNumber } = await params;
  const pageNum = parseInt(pageNumber);

  return {
    title: `Noticias - Página ${pageNum} | Consejo General de Educación`,
    description: `Últimas noticias del Consejo General de Educación de Corrientes - Página ${pageNum}.`,
    openGraph: {
      title: `Noticias - Página ${pageNum} | CGE Corrientes`,
      description: `Últimas noticias del Consejo General de Educación de Corrientes - Página ${pageNum}.`,
      url: `/noticias/page/${pageNum}`,
    },
  };
}

interface PageProps {
  params: Promise<{ pageNumber: string }>;
}

export default async function NoticiasPageNumber({ params }: PageProps) {
  const { pageNumber } = await params;
  const pageNum = parseInt(pageNumber);

  try {
    // Primero obtener el total para validar si la página existe
    const testData = await getPaginatedNews(1, 9);
    const maxPages = Math.min(testData.pagination.pageCount, 5);

    // Validar que el número de página esté en el rango permitido
    if (pageNum < 1 || pageNum > maxPages) {
      throw new Error(
        `Página ${pageNum} no encontrada. Solo hay ${maxPages} páginas disponibles.`,
      );
    }

    const [initialNoticias, categorias, featuredNews] = await Promise.all([
      getPaginatedNews(pageNum, 9), // Optimizado para VPS: 12 → 9 noticias
      getNewsCategories(),
      pageNum === 1 ? getFeaturedNews(5) : Promise.resolve([]), // Solo página 1
    ]);

    return (
      <PageLayout
        pageType="wide"
        hero={{
          title: `Noticias - Página ${pageNum}`,
          description:
            'Últimas noticias del Consejo General de Educación de Corrientes.',
        }}
        showSeparator={true}
        showInfoBar={true}
        basePath="/noticias"
      >
        <StaticNewsSection
          initialData={initialNoticias}
          featuredNews={featuredNews}
          currentPage={pageNum} // Nuevo prop simple
        />
      </PageLayout>
    );
  } catch (error) {
    console.error('Error loading noticias page:', error);
    // Reusar el fallback existente
    return (
      <PageLayout
        pageType="wide"
        hero={{
          title: 'Error al cargar noticias',
          description: 'Ha ocurrido un error al cargar las noticias.',
        }}
        showSeparator={true}
        showInfoBar={true}
        basePath="/noticias"
      >
        <div className="text-center py-12">
          <p className="text-gray-600">
            Error al cargar noticias. Por favor, intente más tarde.
          </p>
        </div>
      </PageLayout>
    );
  }
}

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { PageLayout } from '@/shared/components/PageLayout';
import NewsSection from '@/features/noticias/components/structure/NewsSection';
import { fetchNewsPage } from '@/features/noticias/services/news';

// ISR: Revalidar cada 10 minutos
export const revalidate = 600;

interface NewsPageProps {
  params: { page: string };
}

// Generar parámetros estáticos para las primeras páginas
export async function generateStaticParams() {
  // Generar las primeras 10 páginas estáticamente
  return Array.from({ length: 10 }, (_, i) => ({
    page: (i + 2).toString(), // Empezar desde página 2 (página 1 es /noticias)
  }));
}

// Metadata dinámico
export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const awaitedParams = await params;
  const page = parseInt(awaitedParams.page, 10);

  if (isNaN(page) || page < 1) {
    return {
      title: 'Página no encontrada',
    };
  }

  return {
    title: `Noticias - Página ${page}`,
    description: `Noticias del Consejo General de Educación (CGE) en Corrientes - Página ${page}`,
    alternates: {
      canonical: `/noticias/page/${page}`,
    },
    openGraph: {
      title: `Noticias del CGE - Página ${page}`,
      description: `Mantente informado sobre las últimas noticias y eventos del Consejo General de Educación de Corrientes.`,
      url: `/noticias/page/${page}`,
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
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function NewsPagePaginated({ params }: NewsPageProps) {
  // Validar parámetro de página
  const awaitedParams = await params;
  const page = parseInt(awaitedParams.page, 10);

  if (isNaN(page) || page < 1) {
    notFound();
  }

  // Si es página 1, redirigir a /noticias
  if (page === 1) {
    redirect('/noticias');
  }

  // Obtener datos de la API
  const newsData = await fetchNewsPage(page);

  if (!newsData) {
    notFound();
  }

  // Si la página solicitada excede el total de páginas disponibles
  if (page > newsData.pagination.totalPages) {
    notFound();
  }

  // Estructurar datos para el componente
  const initialData = {
    noticias: newsData.data,
    pagination: newsData.pagination,
  };

  return (
    <PageLayout
      hero={{
        title: `Noticias - Página ${page}`,
        description:
          'Mantente informado sobre las últimas noticias y eventos del Consejo General de Educación de Corrientes.',
      }}
      pageType="wide"
    >
      <div className="px-6 mx-auto max-w-7xl">
        <NewsSection
          initialData={initialData}
          currentPage={page}
          showCarousel={false}
        />
      </div>
    </PageLayout>
  );
}

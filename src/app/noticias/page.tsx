import {
  getNewsCategories,
  getFeaturedNews,
  fetchNewsPage,
} from '@/features/noticias/services/news';
import { PageLayout } from '@/shared/components/PageLayout';
import { Metadata } from 'next';
import NewsContainer from '@/features/noticias/components/structure/NewsContainer';

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

// ISR: Revalidar cada 24 horas 
export const revalidate = 86400;

export default async function NoticiasPage() {
  try {
    const [initialNoticias, categorias, featuredNews] = await Promise.all([
      fetchNewsPage(1),
      getNewsCategories(),
      getFeaturedNews(3).catch((error) => {
        console.error('Error fetching featured news:', error);
        return [];
      }),
    ]);

    if (!initialNoticias) {
      throw new Error('No se pudieron cargar las noticias');
    }

    const adaptedInitialData = {
      noticias: initialNoticias.data,
      pagination: initialNoticias.pagination,
    };

    return (
      <PageLayout
        pageType="wide"
        hero={{
          title: 'Noticias',
          description:
            'Encontrá información sobre eventos, actividades y noticias institucionales.',
        }}
        showSeparator={true}
        showInfoBar={true}
        basePath="/noticias"
      >
        <NewsContainer
          initialData={adaptedInitialData}
          categorias={categorias}
          featuredNews={featuredNews}
        />
      </PageLayout>
    );
  } catch (error) {
    console.error('Error loading noticias page:', error);
    return (
      <PageLayout
        pageType="wide"
        hero={{
          title: 'Noticias',
          description:
            'Encontrá información sobre eventos, actividades y noticias institucionales.',
        }}
        showSeparator={true}
        showInfoBar={true}
        basePath="/noticias"
      >
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-red-600">Error al cargar las noticias</p>
            <p className="text-gray-500">
              Por favor, intenta nuevamente más tarde
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }
}

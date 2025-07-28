import {
  getPaginatedNews,
  getNewsCategories,
} from '@/features/noticias/services/news';
import { PageLayout } from '@/shared/components/PageLayout';
import { Metadata } from 'next';
import NewsContainer from '@/features/noticias/components/NewsContainer';
import { Suspense } from 'react';

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

// ISR: Revalidar cada 30 días  api/revalidate se encarga
export const revalidate = 2592000;

export default async function NoticiasPage() {
  const [initialNoticias, categorias] = await Promise.all([
    getPaginatedNews(1, 6),
    getNewsCategories(),
  ]);

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
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D8B37]"></div>
              <div className="text-gray-500">Cargando...</div>
            </div>
          </div>
        }
      >
        <NewsContainer initialData={initialNoticias} categorias={categorias} />
      </Suspense>
    </PageLayout>
  );
}

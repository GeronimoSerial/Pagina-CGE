import HeroMain from '@/features/home/components/HeroMain';
import QuickAccess from '@/features/home/components/QuickAccess';
import { Separator } from '@radix-ui/react-separator';
import { Separador } from '@/shared/components/Separador';
import { Metadata } from 'next';
import { LatestNews, SocialMediaSection } from '@/shared/data/dynamic-client';
import { getPaginatedNews } from '@/features/noticias/services/news';

export const metadata: Metadata = {
  title: 'Consejo General de Educación (CGE)',
  description:
    'Portal Web del Consejo General de Educación (CGE) en Corrientes',
  keywords: [
    'Consejo General de Educación',
    'CGE',
    'Portal Web',
    'Consejo',
    'Escuelas',
    'Primaria',
    'Docente',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Consejo General de Educación (CGE)',
    description:
      'Portal Web del Consejo General de Educación (CGE) en Corrientes',
    url: '/',
    type: 'website',
    siteName: 'Consejo General de Educación',
    images: [
      {
        url: '/og.webp',
        width: 1200,
        height: 630,
        alt: 'Consejo General de Educación - Información Institucional',
      },
    ],
    locale: 'es_AR',
  },
};

export const revalidate = 3600;

export default async function PagPrincipal() {
  let latestNewsData;

  try {
    latestNewsData = await getPaginatedNews(1, 4);
  } catch (error) {
    console.error('Error fetching latest news:', error);

    latestNewsData = {
      noticias: [],
      pagination: { page: 1, pageCount: 0, pageSize: 4, total: 0 },
    };
  }

  return (
    <div className="page-bg-transparent">
      <main>
        <HeroMain />
        <Separator className="section-separator" />

        <section className="section-spacing">
          <div className="page-container">
            <QuickAccess />
          </div>
        </section>

        <Separador />

        <section>
          <LatestNews noticias={latestNewsData.noticias} />
        </section>

        <Separador />

        <SocialMediaSection />

        <Separator className="section-separator bg-gray-50" />
      </main>
    </div>
  );
}

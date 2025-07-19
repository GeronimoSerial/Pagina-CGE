import HeroMain from '@/features/home/components/HeroMain';
import QuickAccess from '@/features/home/components/QuickAccess';
import { Separator } from '@radix-ui/react-separator';
import SocialMediaSection from '@/features/socials/components/SocialMediaSection';
import { Separador } from '@/shared/components/Separador';
import { Metadata } from 'next';
import LatestNewsStatic from '@/features/noticias/components/LatestNews';
import { getNoticiasPaginadas } from '@/features/noticias/services/noticias';

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
    latestNewsData = await getNoticiasPaginadas(1, 4); 
  } catch (error) {
    console.error('Error loading home page news:', error);
    latestNewsData = {
      noticias: [],
      pagination: { page: 1, pageCount: 0, pageSize: 4, total: 0 }
    };
  }

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <HeroMain />
        <Separator className="my-8" />
        {/* Quick Access Section */}
        <section className="bg-transparent">
          <div className="container px-4 mx-auto md:px-6">
            <QuickAccess />
          </div>
        </section>
        {/* <Separator className="my-8 bg-[#217A4B]/20" /> */}
        <Separador />
        <section>
          <LatestNewsStatic noticias={latestNewsData.noticias} />
        </section>
        <Separador />
        <SocialMediaSection />
        {/* <Separator className="my-8 bg-[#217A4B]/20" /> */}
        <Separator className="my-8 bg-gray-50" />
      </main>
    </div>
  );
}

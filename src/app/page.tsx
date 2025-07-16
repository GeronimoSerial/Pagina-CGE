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

// ISR: Revalidar cada 2 horas para mantener noticias principales frescas
export const revalidate = 7200;

export default async function PagPrincipal() {
  // Pre-renderizar últimas noticias (SSG) - Sin API calls del usuario
  const latestNewsData = await getNoticiasPaginadas(1, 6);

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

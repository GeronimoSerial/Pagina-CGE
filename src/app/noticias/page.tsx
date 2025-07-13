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
import NewsClient from '@/features/noticias/components/NewsClient';
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

interface NoticiasPageProps {}

export const revalidate = 300; // 5 minutos - balance entre performance y contenido fresco

export default function NoticiasPage() {
  return (
    <section>
      <HeroSection
        title="Noticias"
        description="Encuentra información sobre eventos, actividades y noticias institucionales."
      />
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
        <NewsClient />
      </Suspense>
      <Separator className="my-8 bg-gray-50" />
    </section>
  );
}

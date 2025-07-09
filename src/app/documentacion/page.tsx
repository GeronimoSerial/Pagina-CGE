// Documentación descargable.
import { DocumentacionSection } from '@/shared/data/dynamic-client';
import HeroSection from '@/shared/components/Hero';
import FAQSection from '@/shared/components/FAQSection';
import { Metadata } from 'next';
import InfoBar from '@/shared/components/InfoBar';

export const metadata: Metadata = {
  title: 'Documentación',
  description:
    'Documentación del Consejo General de Educación (CGE) en Corrientes',
  alternates: {
    canonical: '/documentacion',
  },
  openGraph: {
    title: 'Documentación',
    description:
      'Documentación del Consejo General de Educación (CGE) en Corrientes',
    type: 'website',
    url: '/documentacion',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Consejo General de Educación',
      },
    ],
  },
};

export default function Documentacion() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection
        title="Documentación"
        description="Encuentra todos los documentos, formularios y normativas necesarias para tus trámites"
      />
      <InfoBar basePath="/documentacion" />
      <section>
        <div className="container px-4 mx-auto md:px-6">
          <DocumentacionSection />
        </div>
      </section>
      <FAQSection basePath="/documentacion" />
    </main>
  );
}

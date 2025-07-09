//Pagina principal para la sección de escuelas
import HeroSection from '@/shared/components/Hero';
import { Metadata } from 'next';
import { EscuelasClient } from '@/shared/data/dynamic-client';
import FAQSection from '@/shared/components/FAQSection';

export const metadata: Metadata = {
  title: 'Escuelas',
  description: 'Instituciones dependientes del Consejo General de Educación',
  alternates: {
    canonical: '/escuelas',
  },
  openGraph: {
    title: 'Escuelas dependientes del Consejo General de Educación',
    description:
      'Descubre las instituciones educativas que forman parte del Consejo General de Educación de Corrientes.',
    url: '/escuelas',
    siteName: 'Consejo General de Educación',
    images: [
      {
        url: '/og-escuelas.webp',
        width: 1200,
        height: 630,
        alt: 'Escuelas del Consejo General de Educación',
      },
    ],
  },
};

export default function Escuelas() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection
        title="Escuelas"
        description="Instituciones dependientes del Consejo General de Educación."
      />
      <div className="container mx-auto px-4 py-8">
        <EscuelasClient />
      </div>
      <FAQSection basePath="/escuelas" />
    </main>
  );
}

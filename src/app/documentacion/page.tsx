// Documentación descargable.
import { DocumentacionSection } from '@/shared/data/dynamic-client';
import { ContentPageLayout } from '@/shared/components/PageLayout';
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
        url: '/og-documentacion.webp',
        width: 1200,
        height: 630,
        alt: 'Consejo General de Educación',
      },
    ],
  },
};

export default function Documentacion() {
  return (
    <ContentPageLayout
      title="Documentación"
      description="Encontrá todos los documentos, formularios y normativas necesarias para tus trámites"
      showFAQ={true}
      faqBasePath="/documentacion"
    >
      <InfoBar basePath="/documentacion" />
      <DocumentacionSection />
    </ContentPageLayout>
  );
}

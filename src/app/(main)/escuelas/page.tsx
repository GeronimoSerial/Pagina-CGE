//Pagina principal para la sección de escuelas
import { Metadata } from 'next';
import { SchoolsClient } from '@/shared/data/dynamic-client';
import { PageLayout } from '@/shared/components/PageLayout';

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
    <PageLayout
      pageType="wide"
      hero={{
        title: 'Escuelas',
        description:
          'Instituciones dependientes del Consejo General de Educación de Corrientes.',
      }}
      showSeparator={true}
      showInfoBar={true}
      showFAQ={true}
      basePath="/escuelas"
    >
      <SchoolsClient />
    </PageLayout>
  );
}

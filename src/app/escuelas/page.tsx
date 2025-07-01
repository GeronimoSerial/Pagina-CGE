//Pagina principal para la sección de escuelas
import HeroSection from '@/shared/components/Hero';
import { Metadata } from 'next';
import { EscuelasClient } from '@/shared/data/dynamic-client';
import FAQSection from '@/shared/components/FAQSection';

export const metadata: Metadata = {
  title: 'Escuelas',
  description: 'Instituciones dependientes del Consejo General de Educación',
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

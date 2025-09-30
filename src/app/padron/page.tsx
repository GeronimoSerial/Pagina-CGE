import HeroSection from '@/shared/components/Hero';
import ConsultaDNI from '@/features/padron/components/ConsultaDNI';
import { PageLayout } from '@/shared/components/PageLayout';

export default function Padron() {
  return (
    <PageLayout>
      {/* <HeroSection
        title="Padrón de Interinatos y Suplencias"
        description="Consultá tu situación en el padrón de docentes"
      /> */}

      {/* Sección principal de consulta */}
      <section className="bg-gray-50">
        <div className="container mx-auto">
          <ConsultaDNI />
        </div>
      </section>
    </PageLayout>
  );
}

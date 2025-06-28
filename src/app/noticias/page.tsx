import HeroSection from '@/src/modules/layout/Hero';
import NoticiasClient from './NoticiasClient';

export default function NoticiasPage() {
  return (
    <section>
      <HeroSection
        title="Noticias institucionales"
        description="Mantente informado con las últimas noticias y novedades del Consejo General de Educación."
      />
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <NoticiasClient />
        </div>
      </div>
    </section>
  );
}

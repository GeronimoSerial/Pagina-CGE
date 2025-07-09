// src/app/noticia/[id]/page.tsx
import HeroMain from '@/features/home/components/HeroMain';
import QuickAccess from '@/features/home/components/QuickAccess';
import { Separator } from '@radix-ui/react-separator';
import SocialMediaSection from '@/features/socials/components/SocialMediaSection';
import { Separador } from '@/shared/components/Separador';
import { Metadata } from 'next';
import LatestNews from '@/features/noticias/components/LatestNews';

export const metadata: Metadata = {
  title: 'Consejo General de Educación (CGE)',
  description:
    'Portal Web del Consejo General de Educación (CGE) en Corrientes',
};

export default async function PagPrincipal() {
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
          <LatestNews />
        </section>
        <Separador />
        <SocialMediaSection />
        {/* <Separator className="my-8 bg-[#217A4B]/20" /> */}
        <Separator className="my-8 bg-gray-50" />
      </main>
    </div>
  );
}

// Página de contacto
import ContactForm from '@/features/contact/components';
import SocialMediaSection from '@/features/socials/components/SocialMediaSection';
import HeroSection from '@/shared/components/Hero';
import FAQSection from '@/shared/components/FAQSection';
import { Separator } from '@radix-ui/react-separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte.',
  alternates: {
    canonical: '/contacto',
  },
  openGraph: {
    title: 'Contacto',
    description:
      'Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte.',
    type: 'website',
    url: '/contacto',
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

export default function Contacto() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection
        title="Contacto"
        description="Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte."
      />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      <FAQSection basePath="/contacto" />
      <Separator className="my-10 bg-white/20" />
      <SocialMediaSection
        title="Seguinos en redes sociales"
        description="Contactános a través de nuestras redes"
      />
    </main>
  );
}

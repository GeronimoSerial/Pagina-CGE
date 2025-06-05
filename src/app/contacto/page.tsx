// Página de contacto
import { Metadata } from "next";
import ContactForm from "@/src/modules/contact";
import SocialMediaSection from "@modules/socials/SocialMediaSection";
import HeroSection from "@modules/layout/Hero";
import FAQSection from "@modules/layout/FAQSection";
import { Separator } from "@radix-ui/react-separator";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte.",
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

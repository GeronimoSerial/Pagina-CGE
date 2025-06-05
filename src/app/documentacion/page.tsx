// Documentación descargable.
import DocumentationSection from "@modules/documentation/components/DocumentationSection";
import HeroSection from "@modules/layout/Hero";
import FAQSection from "@modules/layout/FAQSection";
import { Suspense } from "react";
import { Metadata } from "next";
import InfoBar from "@/src/modules/layout/InfoBar";

export const metadata: Metadata = {
  title: "Documentación",
  description:
    "Documentación del Consejo General de Educación (CGE) en Corrientes",
};

export default function Documentacion() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection
        title="Documentación"
        description="Portal de documentación del Consejo General de Educación."
      />
      <InfoBar basePath="/documentacion" />
      <section>
        <div className="container mx-auto px-4 md:px-6">
          <Suspense fallback={<div>Cargando documentación...</div>}>
            <DocumentationSection />
          </Suspense>
        </div>
      </section>
      <FAQSection basePath="/documentacion" />
    </main>
  );
}

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
      {/* Hero section con degradado */}
      <HeroSection
        title="Documentación"
        description="Portal de documentación del Consejo General de Educación"
      />
      {/* Sección de información importante */}
      <InfoBar basePath="/documentacion" />
      {/* Sección principal de trámites */}
      <section>
        <div className="container mx-auto px-4 md:px-6">
          {/* Componente de trámites */}
          <Suspense fallback={<div>Cargando documentación...</div>}>
            <DocumentationSection />
          </Suspense>
        </div>
      </section>
      {/* Sección de preguntas frecuentes */}
      <FAQSection basePath="/documentacion" />
    </main>
  );
}

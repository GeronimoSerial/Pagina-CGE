import { Info, Phone } from "lucide-react";
import DocumentationSection from "@modules/documentation/components/DocumentationSection";
import HeroSection from "@modules/layout/Hero";
import FAQSection from "@modules/layout/FAQSection";
import { Suspense } from "react";
import { faqsDocs } from "@modules/faqs/faqs";
import { Metadata } from "next";

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
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Horario de atención:{" "}
                <span className="text-gray-900">
                  Lunes a Viernes de 7:00 a 18:00 hs
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Consultas: <span className="text-gray-900">3794-852954</span>
              </p>
            </div>
          </div>
        </div>
      </div>
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
      <FAQSection
        faqTitle="Preguntas Frecuentes"
        faqDescription="Encuentra respuestas a las preguntas más comunes sobre la documentación."
        faqs={faqsDocs}
      />
    </main>
  );
}

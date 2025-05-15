import HeroSection from "@modules/layout/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminos y Condiciones",
  description:
    "Terminos y Condiciones de Uso del Sitio Web del Consejo General de Educación (CGE) en Corrientes",
};

export default function Terminos() {
  return (
    <main className="min-h-screen">
      <HeroSection
        title="Términos y Condiciones"
        description="Información legal y condiciones de uso del sitio web del CGE Corrientes"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Sitio oficial del CGE
            </h2>
            <p className="mb-6">
              Este sitio web es una plataforma oficial del Consejo General de
              Educación (CGE), dependiente del Ministerio de Educación de la
              Provincia de Corrientes, República Argentina.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              1. Uso del sitio
            </h2>
            <p className="mb-6">
              El contenido de este sitio tiene como objetivo brindar información
              pública relacionada con la educación en la provincia de
              Corrientes. Su acceso es libre y gratuito.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              2. Reproducción del contenido
            </h2>
            <p className="mb-6">
              Se permite la reproducción total o parcial de los contenidos
              publicados en este sitio, siempre que se cite la fuente y no se
              altere su significado o integridad.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              3. Protección de datos personales
            </h2>
            <p className="mb-6">
              Este sitio no recolecta datos personales de los usuarios. No se
              utilizan formularios que soliciten información identificable ni se
              aplican tecnologías de rastreo que comprometan la privacidad.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              4. Responsabilidad sobre la información
            </h2>
            <p className="mb-6">
              El CGE se compromete a mantener actualizada y precisa la
              información publicada. Sin embargo, no se garantiza la ausencia
              total de errores involuntarios o desactualización temporal. En
              caso de duda, se recomienda contactar al organismo de forma
              oficial.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              5. Enlaces externos
            </h2>
            <p className="mb-6">
              El sitio puede contener enlaces a páginas externas que pertenecen
              a otros organismos o entidades. El CGE no se responsabiliza por el
              contenido ni por la disponibilidad de dichos sitios.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              6. Jurisdicción
            </h2>
            <p className="mb-6">
              Toda controversia derivada de la interpretación o aplicación de
              los presentes términos será sometida a la jurisdicción de los
              tribunales ordinarios de la Provincia de Corrientes.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

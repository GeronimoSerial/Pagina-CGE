import DocumentationSection from "../../modules/documentation/components/DocumentationSection";

export default function Documentacion() {
  return (
    // Sección de Documentación
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">
            Documentación Institucional
          </h2>
          <p className="text-gray-700 max-w-3xl">
            Accede a recursos, guías y normativas oficiales para trámites, procedimientos y consultas relacionadas con el sistema educativo provincial.
          </p>
        </div>
        <DocumentationSection />
      </div>
    </section>
  );
}
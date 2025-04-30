import { formatearFecha } from "../../lib/utils";
import ArticlesGrid from "../../modules/article/components/ArticlesGrid";
import { getAllContent } from "../../modules/article/data/content";
import { Info, Phone, Clock, ArrowRight, HelpCircle } from "lucide-react";
import HeroSubSection from "../../modules/layout/Hero";

export default function TramitesGrid() {
  const rawTramites = getAllContent("tramites");
  const categorias = [
    "Licencias",
    "Certificaciones",
    "Inscripciones",
    "Jubilaciones",
    "Cambios de destino",
  ];

  const tramite = rawTramites.map((item: any) => {
    const date = formatearFecha(item.date || item.fecha);
    return {
      id: item.slug,
      slug: item.slug,
      title: item.title || item.titulo,
      titulo: item.titulo,
      description: item.description || item.resumen,
      resumen: item.resumen,
      date,
      fecha: date,
      imageUrl: item.imageUrl || item.imagen,
      imagen: item.imagen,
      categoria: item.subcategoria,
      content: item.content,
      esUrgente: item.esUrgente || false,
    };
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero section con degradado */}
      <HeroSubSection
        title="Trámites y Gestiones"
        description="Portal centralizado de trámites del Consejo General de Educación.
              Acceda a toda la información y documentación necesaria."
      />
      {/* Sección de información importante */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Horario de atención:{" "}
                <span className="text-gray-900">
                  Lunes a Viernes de 8:00 a 16:00 hs
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Consultas: <span className="text-gray-900">0800-555-1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Sección principal de trámites */}
      <section className="py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          {/* Componente de trámites */}
          <div className="py-8">
            <ArticlesGrid
              articles={tramite}
              categories={categorias}
              searchPlaceholder="Buscar trámites..."
              buttonText="Ver trámite"
              emptyStateTitle="No se encontraron trámites"
              emptyStateDescription="No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría."
              emptyStateButtonText="Mostrar todos los trámites"
              showUrgentBadge={true}
              showSearch={true}
              basePath="/tramites"
            />
          </div>
        </div>
      </section>
      {/* Sección de preguntas frecuentes */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Preguntas Frecuentes
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Respuestas a las consultas más comunes sobre trámites del Consejo
              General de Educación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pregunta 1 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cómo inicio un trámite?
              </h4>
              <p className="text-gray-600">
                Para iniciar un trámite debe presentar la documentación
                requerida en Mesa de Entradas del Consejo General de Educación,
                o a través del portal digital si el trámite lo permite.
              </p>
            </div>

            {/* Pregunta 2 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cómo consulto el estado de mi trámite?
              </h4>
              <p className="text-gray-600">
                Puede consultar el estado de su trámite con el número de
                expediente a través del portal digital o llamando al
                0800-555-1234 en horario de atención.
              </p>
            </div>

            {/* Pregunta 3 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Qué documentos necesito presentar?
              </h4>
              <p className="text-gray-600">
                Los documentos requeridos varían según el tipo de trámite. Puede
                encontrar la lista completa de requisitos en cada ficha de
                trámite específica.
              </p>
            </div>

            {/* Pregunta 4 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cuánto tiempo demora un trámite?
              </h4>
              <p className="text-gray-600">
                Los tiempos de resolución varían según el tipo de trámite y la
                carga administrativa. Los plazos estimados están indicados en
                cada ficha de trámite.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/preguntas-frecuentes"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
            >
              Ver todas las preguntas frecuentes
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>

          <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-[#3D8B37] mr-3" />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Horarios de atención
                  </h4>
                  <p className="text-gray-600">
                    Lunes a Viernes de 8:00 a 16:00 hs
                  </p>
                </div>
              </div>
              <a
                href="/contacto"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium transition-colors"
              >
                Contactar Mesa de Ayuda
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

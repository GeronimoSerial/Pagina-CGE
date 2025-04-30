import { formatearFecha } from "../../lib/utils";
import ArticlesGrid from "../../modules/article/components/ArticlesGrid";
import { getAllContent } from "../../modules/article/data/content";
import { Info, Phone, Clock, ArrowRight, HelpCircle } from "lucide-react";
import HeroSubSection from "../../modules/layout/Hero";

export default function NoticiasGrid() {
  const rawNoticias = getAllContent("noticias");

  const noticias = rawNoticias.map((item: any) => {
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
      <HeroSubSection
        title="Noticias y Novedades"
        description="Mantente informado con las últimas noticias y novedades del
              Consejo General de Educación. Encuentra información actualizada
              sobre eventos, anuncios y comunicados importantes."
      />

      {/* Sección de información importante */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Actualizaciones:{" "}
                <span className="text-gray-900">
                  Noticias actualizadas diariamente
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Sala de Prensa:{" "}
                <span className="text-gray-900">0800-555-1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección principal de noticias */}
      <section className="py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          {/* Componente de noticias */}
          <div className="py-2">
            <ArticlesGrid
              articles={noticias}
              searchPlaceholder="Buscar Noticias..."
              buttonText="Ver noticia completa"
              emptyStateTitle="No se encontraron noticias"
              emptyStateDescription="No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría."
              emptyStateButtonText="Mostrar todas las noticias"
              showUrgentBadge={true}
              showSearch={true}
              basePath="/noticias"
            />
          </div>
        </div>
      </section>

      {/* Sección de preguntas frecuentes */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Preguntas Frecuentes sobre Noticias
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Respuestas a las consultas más comunes sobre nuestro portal de
              noticias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pregunta 1 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Con qué frecuencia se actualizan las noticias?
              </h4>
              <p className="text-gray-600">
                Nuestro portal se actualiza diariamente con las últimas noticias
                y comunicados del Consejo General de Educación.
              </p>
            </div>

            {/* Pregunta 2 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cómo puedo buscar noticias anteriores?
              </h4>
              <p className="text-gray-600">
                Puede utilizar el buscador en la parte superior de la página o
                filtrar por categorías para encontrar noticias específicas.
              </p>
            </div>

            {/* Pregunta 3 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cómo identifico las noticias urgentes?
              </h4>
              <p className="text-gray-600">
                Las noticias urgentes están marcadas con una etiqueta especial y
                aparecen destacadas en la parte superior del portal.
              </p>
            </div>

            {/* Pregunta 4 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Puedo compartir las noticias?
              </h4>
              <p className="text-gray-600">
                Sí, todas las noticias pueden ser compartidas a través de redes
                sociales o mediante el enlace directo a la noticia.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/preguntas-frecuentes"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
            >
              Ver más preguntas frecuentes
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>

          <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-[#3D8B37] mr-3" />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Sala de Prensa
                  </h4>
                  <p className="text-gray-600">
                    Atención a medios: Lunes a Viernes de 8:00 a 16:00 hs
                  </p>
                </div>
              </div>
              <a
                href="/contacto"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium transition-colors"
              >
                Contactar Sala de Prensa
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

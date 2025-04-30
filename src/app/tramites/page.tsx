import { formatearFecha } from "../../lib/utils";
import { getAllContent } from "../../modules/article/data/content";
import { Info, Phone } from "lucide-react";
import PageWithFAQ from "../../modules/layout/PageWithFAQ";

export default function TramitesGrid() {
  const rawTramites = getAllContent("tramites");
  const categorias = [
    "Licencias",
    "Certificaciones",
    "Inscripciones",
    "Jubilaciones",
    "Cambios de destino",
  ];

  const tramites = rawTramites.map((item: any) => {
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

  const infoBarItems = [
    {
      icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
      label: "Horario de atención:",
      value: "Lunes a Viernes de 8:00 a 16:00 hs",
    },
    {
      icon: <Phone className="h-5 w-5 text-[#3D8B37] mr-2" />,
      label: "Consultas:",
      value: "0800-555-1234",
    },
  ];

  const faqs = [
    {
      question: "¿Cómo inicio un trámite?",
      answer:
        "Para iniciar un trámite debe presentar la documentación requerida en Mesa de Entradas del Consejo General de Educación, o a través del portal digital si el trámite lo permite.",
    },
    {
      question: "¿Cómo consulto el estado de mi trámite?",
      answer:
        "Puede consultar el estado de su trámite con el número de expediente a través del portal digital o llamando al 0800-555-1234 en horario de atención.",
    },
    {
      question: "¿Qué documentos necesito presentar?",
      answer:
        "Los documentos requeridos varían según el tipo de trámite. Puede encontrar la lista completa de requisitos en cada ficha de trámite específica.",
    },
    {
      question: "¿Cuánto tiempo demora un trámite?",
      answer:
        "Los tiempos de resolución varían según el tipo de trámite y la carga administrativa. Los plazos estimados están indicados en cada ficha de trámite.",
    },
  ];

  return (
    <PageWithFAQ
      heroTitle="Trámites y Gestiones"
      heroDescription="Portal centralizado de trámites del Consejo General de Educación.
              Acceda a toda la información y documentación necesaria."
      infoBarItems={infoBarItems}
      articles={tramites}
      categories={categorias}
      searchPlaceholder="Buscar trámites..."
      buttonText="Ver trámite"
      emptyStateTitle="No se encontraron trámites"
      emptyStateDescription="No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría."
      emptyStateButtonText="Mostrar todos los trámites"
      basePath="/tramites"
      faqTitle="Preguntas Frecuentes"
      faqDescription="Respuestas a las consultas más comunes sobre trámites del Consejo General de Educación"
      faqs={faqs}
      contactTitle="Horarios de atención"
      contactSchedule="Lunes a Viernes de 8:00 a 16:00 hs"
      contactButtonText="Contactar Mesa de Ayuda"
    />
  );
}

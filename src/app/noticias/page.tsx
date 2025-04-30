import { formatearFecha } from "../../lib/utils";
import { getAllContent } from "../../modules/article/data/content";
import { Info, Phone } from "lucide-react";
import PageWithFAQ from "../../modules/layout/PageWithFAQ";

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

  const infoBarItems = [
    {
      icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
      label: "Actualizaciones:",
      value: "Noticias actualizadas diariamente",
    },
    {
      icon: <Phone className="h-5 w-5 text-[#3D8B37] mr-2" />,
      label: "Sala de Prensa:",
      value: "0800-555-1234",
    },
  ];

  const faqs = [
    {
      question: "¿Con qué frecuencia se actualizan las noticias?",
      answer:
        "Nuestro portal se actualiza diariamente con las últimas noticias y comunicados del Consejo General de Educación.",
    },
    {
      question: "¿Cómo puedo buscar noticias anteriores?",
      answer:
        "Puede utilizar el buscador en la parte superior de la página o filtrar por categorías para encontrar noticias específicas.",
    },
    {
      question: "¿Cómo identifico las noticias urgentes?",
      answer:
        "Las noticias urgentes están marcadas con una etiqueta especial y aparecen destacadas en la parte superior del portal.",
    },
    {
      question: "¿Puedo compartir las noticias?",
      answer:
        "Sí, todas las noticias pueden ser compartidas a través de redes sociales o mediante el enlace directo a la noticia.",
    },
  ];

  return (
    <PageWithFAQ
      heroTitle="Noticias y Novedades"
      heroDescription="Mantente informado con las últimas noticias y novedades del
              Consejo General de Educación. Encuentra información actualizada
              sobre eventos, anuncios y comunicados importantes."
      infoBarItems={infoBarItems}
      articles={noticias}
      searchPlaceholder="Buscar Noticias..."
      buttonText="Ver noticia completa"
      emptyStateTitle="No se encontraron noticias"
      emptyStateDescription="No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría."
      emptyStateButtonText="Mostrar todas las noticias"
      basePath="/noticias"
      faqTitle="Preguntas Frecuentes sobre Noticias"
      faqDescription="Respuestas a las consultas más comunes sobre nuestro portal de noticias"
      faqs={faqs}
      contactTitle="Sala de Prensa"
      contactSchedule="Atención a medios: Lunes a Viernes de 8:00 a 16:00 hs"
      contactButtonText="Contactar Sala de Prensa"
    />
  );
}

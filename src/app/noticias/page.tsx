import { formatearFecha } from "../../lib/utils";
import { getAllContent } from "../../modules/article/data/content";
import { Info, Phone } from "lucide-react";
import PageWithFAQ from "../../modules/layout/PageWithFAQ";
import { faqsNews } from "../../modules/faqs/faqs";

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
      esImportante: item.esImportante || false,
    };
  });

  const infoBarItems = [
    {
      icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
      label: "Actualizaciones:",
      value: "Noticias actualizadas diariamente",
    },
  ];

  return (
    <PageWithFAQ
      heroTitle="Noticias y Novedades"
      heroDescription="Mantente informado con las últimas noticias y novedades del
              Consejo General de Educación. Información actualizada
              sobre eventos, anuncios y comunicados importantes."
      infoBarItems={infoBarItems}
      articles={noticias}
      searchPlaceholder="Buscar Noticias..."
      buttonText="Ver noticia completa"
      emptyStateTitle="No se encontraron noticias"
      emptyStateDescription="No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría."
      emptyStateButtonText="Mostrar todas las noticias"
      basePath="/noticias"
      faqTitle="Preguntas Frecuentes"
      faqDescription="Respuestas a las consultas más comunes sobre nuestro portal de noticias"
      faqs={faqsNews}
      contactTitle="Sala de Prensa"
      contactSchedule="Atención a medios: Lunes a Viernes de 8:00 a 12:00 hs"
      contactButtonText="Contactar Prensa"
      contactUrl="https://wa.me/5493794376025?text=Hola,%20necesito%20contactar%20a%20la%20sala%20de%20prensa.%20"
    />
  );
}

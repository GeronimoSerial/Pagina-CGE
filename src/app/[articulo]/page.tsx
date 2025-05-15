import { formatearFecha } from "@lib/utils";
import { getAllContentMetadata } from "@modules/article/data/content";
import { Info } from "lucide-react";
import PageWithFAQ from "@modules/article/components/PageWithFAQ";
import { faqsNews, faqsTramites } from "@modules/faqs/faqs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generación dinámica de metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ articulo: string }>;
}): Promise<Metadata> {
  // Primero debemos esperar el objeto params completo
  const resolvedParams = await params;

  const titles: Record<string, string> = {
    noticias: "Noticias",
    tramites: "Trámites",
  };

  const descriptions: Record<string, string> = {
    noticias:
      "Noticias y novedades del Consejo General de Educación (CGE) en Corrientes",
    tramites: "Información detallada sobre los trámites disponibles en el CGE",
  };

  // Ahora podemos acceder a articulo de manera segura
  const articulo = resolvedParams.articulo;

  if (!titles[articulo]) {
    return notFound();
  }

  return {
    title: titles[articulo],
    description: descriptions[articulo],
  };
}

// Generación estática de rutas
export async function generateStaticParams() {
  return [{ articulo: "noticias" }, { articulo: "tramites" }];
}

export default async function ContenidoGrid({
  params,
  searchParams,
}: {
  params: Promise<{ articulo: string }>;
  searchParams?: Promise<{ [key: string]: string }>;
}) {
  // Primero esperamos el objeto params y searchParams
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const articulo = resolvedParams.articulo;

  if (articulo !== "noticias" && articulo !== "tramites") {
    return notFound();
  }

  // Obtener página actual de los parámetros de búsqueda
  const page = resolvedSearchParams?.page
    ? parseInt(resolvedSearchParams.page)
    : 1;
  const limit = 4; // Fijamos el límite a 4 artículos por página
  const searchTerm = resolvedSearchParams?.search || "";
  const categoria = resolvedSearchParams?.categoria || "";

  const { items: rawData, pagination } = await getAllContentMetadata(
    articulo,
    page,
    limit,
    searchTerm,
    categoria
  );

  const data = rawData.map((item: any) => {
    const date = formatearFecha(item.date || item.fecha);
    return {
      id: item.slug,
      slug: item.slug,
      titulo: item.titulo,
      description: item.description || item.resumen,
      date,
      fecha: date,
      imagen:
        item.imagen ||
        (articulo === "noticias" ? "/images/news.png" : "/images/tramites.png"),
      categoria: item.subcategoria,
      esImportante: item.esImportante || false,
    };
  });

  const isNoticias = articulo === "noticias";

  const categorias = isNoticias
    ? ["General", "Novedades", "Eventos", "Comunicados"]
    : ["Licencias", "Títulos", "Inscripción", "Otros"];

  const infoBarItems = isNoticias
    ? [
        {
          icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
          label: "Actualizaciones:",
          value: "Noticias actualizadas diariamente",
        },
      ]
    : [
        {
          icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
          label: "Horario de atención:",
          value: "Lunes a Viernes de 7:00 a 18:00 hs",
        },
      ];

  return (
    <PageWithFAQ
      heroTitle={isNoticias ? "Noticias y Novedades" : "Trámites y Gestiones"}
      heroDescription={
        isNoticias
          ? "Mantente informado con las últimas noticias y novedades del Consejo General de Educación."
          : "Portal centralizado de trámites del Consejo General de Educación. Acceda a toda la información y documentación necesaria."
      }
      infoBarItems={infoBarItems}
      articles={data}
      searchPlaceholder={
        isNoticias ? "Buscar Noticias..." : "Buscar Trámites..."
      }
      buttonText={isNoticias ? "Ver noticia completa" : "Ver trámite completo"}
      emptyStateTitle={
        isNoticias ? "No se encontraron noticias" : "No se encontraron trámites"
      }
      emptyStateDescription={
        isNoticias
          ? "No hay resultados para tu búsqueda. Intenta con otros términos o selecciona otra categoría."
          : "No hay trámites con esos términos. Intenta nuevamente o selecciona otra categoría."
      }
      emptyStateButtonText={
        isNoticias ? "Mostrar todas las noticias" : "Mostrar todos los trámites"
      }
      basePath={`/${articulo}`}
      faqTitle={"Preguntas Frecuentes"}
      faqDescription={
        isNoticias
          ? "Respuestas a las consultas más comunes sobre nuestro portal de noticias"
          : "Respuestas a las consultas más comunes sobre trámites del Consejo General de Educación"
      }
      faqs={isNoticias ? faqsNews : faqsTramites}
      contactTitle={isNoticias ? "Sala de Prensa" : "Horario de atención"}
      contactSchedule={
        isNoticias
          ? "Atención a medios: Lunes a Viernes de 8:00 a 12:00 hs"
          : "Lunes a Viernes de 8:00 a 12:00 hs"
      }
      contactButtonText={
        isNoticias ? "Contactar Prensa" : "Contactar Mesa de Entradas y Salidas"
      }
      contactUrl={
        isNoticias
          ? "https://wa.me/5493794376025?text=Hola,%20necesito%20contactar%20a%20la%20sala%20de%20prensa.%20"
          : "https://wa.me/5493794852954?text=Hola,%20necesito%20ayuda%20con%20mi%20tr%C3%A1mite.%20Gracias!"
      }
      isNoticia={isNoticias}
      categories={categorias}
      pagination={pagination}
    />
  );
}

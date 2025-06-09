export interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  basePath: string;
}

export const TEXTS = {
  noticias: {
    emptyStateButtonText: "Mostrar todas las noticias",
    emptyStateTitle: "No se encontraron noticias",
    buttonText: "Ver noticia completa",
  },
  tramites: {
    emptyStateButtonText: "Mostrar todos los trámites",
    emptyStateTitle: "No se encontraron trámites",
    buttonText: "Ver trámite completo",
  },
  common: {
    emptyStateDescription:
      "No se encontraron resultados para tu búsqueda. Intenta con otra palabra clave o revisa la categoría seleccionada.",
  },
} as const;

export const HERO_CONFIG = {
  noticias: {
    title: "Noticias y Novedades",
    description:
      "Mantente informado con las últimas noticias y novedades del Consejo General de Educación.",
  },
  tramites: {
    title: "Trámites y Gestiones",
    description:
      "Portal centralizado de trámites del Consejo General de Educación. Acceda a toda la información y documentación necesaria.",
  },
} as const;

export const ENLACES_RELACIONADOS = [
  {
    titulo: "Gestión Educativa",
    url: "https://ge.mec.gob.ar",
  },
  {
    titulo: "Sitio oficial Ministerio de Educación",
    url: "http://mec.gob.ar",
  },
  {
    titulo: "Artículos relacionados",
    url: "/articulos",
  },
  {
    titulo: "Documentación",
    url: "/documentacion",
  },
];

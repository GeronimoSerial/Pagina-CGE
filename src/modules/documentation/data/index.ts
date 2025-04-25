import { DocumentItem } from "../types";

// Mock data for documents - would be replaced with Strapi data in the future
export const documents: DocumentItem[] = [
  {
    id: "1",
    title: "Licencia por Artículo 28",
    description:
      "Guía completa para solicitar licencias según el Artículo 28. Incluye requisitos y formularios.",
    category: "licencias",
    type: "guia",
    date: "15/04/2023",
    downloadUrl: "#",
  },
  {
    id: "2",
    title: "Generación de Expedientes Administrativos",
    description:
      "Procedimiento paso a paso para la generación y seguimiento de expedientes administrativos.",
    category: "expedientes",
    type: "procedimiento",
    date: "10/03/2023",
    downloadUrl: "#",
  },
  {
    id: "3",
    title: "Formulario de Licencia Médica",
    description:
      "Formulario oficial para la solicitud de licencias por razones médicas.",
    category: "formularios",
    type: "formulario",
    date: "05/02/2023",
    downloadUrl: "#",
  },
  {
    id: "4",
    title: "Resolución 1234/2023 - Calendario Escolar",
    description:
      "Normativa vigente que establece el calendario escolar para el ciclo lectivo 2023.",
    category: "normativas",
    type: "resolucion",
    date: "20/12/2022",
    downloadUrl: "#",
  },
  {
    id: "5",
    title: "Guía para Directivos Escolares",
    description:
      "Manual práctico con orientaciones para la gestión directiva de establecimientos educativos.",
    category: "guias",
    type: "manual",
    date: "18/01/2023",
    downloadUrl: "#",
  },
  {
    id: "6",
    title: "Formulario de Inscripción Docente",
    description:
      "Formulario para la inscripción en el registro de aspirantes a cargos docentes.",
    category: "formularios",
    type: "formulario",
    date: "01/03/2023",
    downloadUrl: "#",
  },
  {
    id: "7",
    title: "Protocolo de Acción para Situaciones de Emergencia",
    description:
      "Documento oficial que establece los procedimientos a seguir ante situaciones de emergencia en instituciones educativas.",
    category: "normativas",
    type: "protocolo",
    date: "25/05/2023",
    downloadUrl: "#",
  },
];

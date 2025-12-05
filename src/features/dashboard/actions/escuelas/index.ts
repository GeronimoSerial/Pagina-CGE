/**
 * Módulo de Escuelas - Server Actions
 *
 * Este módulo contiene todas las funciones relacionadas con la gestión de escuelas.
 * Está organizado en los siguientes archivos:
 *
 * - escuelas-core.ts: Consultas principales (getEscuelasCompletas, getEscuelaById, etc.)
 * - escuelas-filtros.ts: Helpers para filtros y búsqueda
 * - escuelas-geografia.ts: Consultas geográficas (departamentos, localidades)
 * - escuelas-calidad.ts: Métricas de calidad de datos
 * - escuelas-distribucion.ts: Consultas de distribución por zona, categoría, etc.
 * - escuelas-graficos.ts: Datos para gráficos
 * - escuelas-reportes.ts: Funciones de reportes y contadores
 * - supervisores-actions.ts: Todas las funciones relacionadas con supervisores
 */

// Core - Consultas principales
export {
  getEscuelasCompletas,
  getEscuelaById,
  getEstadisticasSistema,
  getDistribucionZonaModalidad,
  getInfraestructuraEscuela,
} from './escuelas-core';

// Filtros - Helpers para búsqueda y filtrado
export {
  getTodasCategorias,
  getTodosDepartamentos,
  getTodosSupervisores,
  buscarEscuelas,
  contarEscuelas,
} from './escuelas-filtros';

// Geografía - Consultas geográficas
export {
  getEscuelasPorDepartamento,
  getTopLocalidades,
} from './escuelas-geografia';

// Calidad - Métricas de calidad de datos
export {
  getMetricasCalidad,
  getEscuelasConDatosFaltantes,
} from './escuelas-calidad';

// Distribución - Consultas de distribución
export {
  getEscuelasPorZona,
  getEscuelasPorCategoria,
  getSupervisionPorDepartamento,
  getEscuelasPorModalidad,
} from './escuelas-distribucion';

// Gráficos - Datos para visualizaciones
export {
  getDatosGraficoModalidad,
  getDatosGraficoDepartamentos,
} from './escuelas-graficos';

// Reportes - Funciones de reportes y contadores
export {
  getReporteEscuelas,
  buscarEscuelaPorNombreOCue,
  getContadoresBasicos,
  refreshEstadisticasSistema,
} from './escuelas-reportes';

// Supervisores - Funciones relacionadas con supervisores

// Relevamiento - Funciones de relevamiento
export * from './escuelas-relevamiento';

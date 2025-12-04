// Tipos para el módulo de Escuelas

/**
 * Escuela con todos sus datos relacionados (vista v_escuela_completa)
 */
export interface EscuelaCompleta {
  id_escuela: number;
  cue: number;
  nombre: string;
  telefono: string | null;
  mail: string | null;
  fecha_fundacion: string | null;
  anexo: string | null;
  modalidad: string | null;
  categoria: string | null;
  zona: string | null;
  zona_codigo: string | null;
  turno: string | null;
  servicio_comida: string | null;
  ambito: string | null;
  localidad: string | null;
  departamento: string | null;
  supervisor: string | null;
  id_supervisor: number | null;
  director: string | null;
  id_director: number | null;
  tiene_modalidad: boolean;
  tiene_categoria: boolean;
  tiene_zona: boolean;
  tiene_localidad: boolean;
  tiene_supervisor: boolean;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Estadísticas globales del sistema (vista materializada mv_estadisticas_sistema)
 */
export interface EstadisticasSistema {
  total_escuelas: number;
  escuelas_con_modalidad: number;
  escuelas_con_categoria: number;
  escuelas_con_zona: number;
  escuelas_con_turno: number;
  escuelas_con_supervisor: number;
  escuelas_sin_supervisor: number;
  total_supervisores: number;
  pct_con_modalidad: number;
  pct_con_supervisor: number;
  escuelas_pendientes: number;
  supervisiones_pendientes: number;
  ultima_actualizacion: string;
}

/**
 * Distribución de escuelas por zona y modalidad (vista v_distribucion_zona_modalidad)
 */
export interface DistribucionZonaModalidad {
  zona: string | null;
  zona_codigo: string | null;
  comun: number;
  especial: number;
  adultos: number;
  inicial: number;
  hospitalaria: number;
  contextos_encierro: number;
  sin_modalidad: number;
  total: number;
}

/**
 * Resultado de búsqueda de escuelas (función buscar_escuelas)
 */
export interface EscuelaBusqueda {
  id_escuela: number;
  cue: number;
  nombre: string;
  modalidad: string | null;
  zona: string | null;
  turno: string | null;
  supervisor: string;
  tiene_supervisor: boolean;
}

/**
 * Parámetros de búsqueda para escuelas
 */
export interface BusquedaEscuelasParams {
  termino?: string;
  modalidad?: number;
  zona?: number;
  turno?: number;
  categoria?: number;
  departamento?: number;
  supervisor?: number;
  soloSinSupervisor?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Escuelas por supervisor (resumen)
 */
export interface SupervisorConEscuelas {
  supervisor: string;
  total_escuelas: number;
  escuelas: string;
}

/**
 * Detalle de escuelas por supervisor
 */
export interface EscuelaPorSupervisor {
  supervisor: string;
  cue: number;
  escuela: string;
  modalidad: string | null;
  zona: string | null;
  localidad: string | null;
  departamento: string | null;
}

/**
 * Supervisores por departamento
 */
export interface SupervisorPorDepartamento {
  departamento: string;
  supervisores: number;
  escuelas_supervisadas: number;
  nombres_supervisores: string;
}

/**
 * Escuelas por zona
 */
export interface EscuelasPorZona {
  id: number;
  codigo: string | null;
  zona: string | null;
  cantidad: number;
  porcentaje: number;
}

/**
 * Escuelas por categoría
 */
export interface EscuelasPorCategoria {
  codigo: string | null;
  categoria: string | null;
  cantidad: number;
  porcentaje: number;
}

/**
 * Escuelas por departamento (con estado de supervisión)
 */
export interface EscuelasPorDepartamentoSupervision {
  departamento: string;
  total_escuelas: number;
  con_supervisor: number;
  sin_supervisor: number;
  pct_supervisados: number;
}

/**
 * Escuelas por modalidad
 */
export interface EscuelasPorModalidad {
  id: number;
  modalidad: string | null;
  cantidad: number;
  porcentaje: number;
}

export interface EscuelasPorDepartamento {
  id: number;
  departamento: string;
  cantidad: number;
}

export interface EscuelasPorLocalidad {
  id: number;
  localidad: string;
  departamento: string;
  cantidad: number;
}

export interface MetricasCalidad {
  total_escuelas: number;
  sin_modalidad: number;
  sin_zona: number;
  sin_categoria: number;
  sin_supervisor: number;
  sin_coordenadas: number; // Placeholder if we add geo later
}

export interface EscuelaDatosFaltantes {
  id_escuela: number;
  cue: number;
  nombre: string;
  faltantes: string[]; // Array of strings describing what's missing e.g. ["Modalidad", "Zona"]
}

/**
 * Dato para gráfico de torta/barras
 */
export interface DatoGrafico {
  label: string;
  value: number;
}

/**
 * Reporte completo de escuela (exportable)
 */
export interface ReporteEscuela {
  cue: number;
  escuela: string;
  modalidad: string | null;
  categoria: string | null;
  zona: string | null;
  turno: string | null;
  localidad: string | null;
  departamento: string | null;
  telefono: string | null;
  mail: string | null;
  supervisor: string;
}

/**
 * Detalle completo del supervisor
 */
export interface SupervisorDetalle {
  id_persona: number;
  apellido: string;
  nombre: string;
  mail: string | null;
  telefono: string | null;
  cargo: string | null;
  escuelas_asignadas: number;
}

/**
 * Estadísticas detalladas de un supervisor
 */
export interface SupervisorEstadisticas {
  id_persona: number;
  nombre_completo: string;
  mail: string | null;
  telefono: string | null;
  total_escuelas: number;
  escuelas_urbana_centrica: number;
  escuelas_urbana_periferica: number;
  escuelas_rurales: number;
  escuelas_especiales: number;
  escuelas_adultos: number;
  categoria_promedio: number;
  departamentos_asignados: number;
  departamentos: string;
}

/**
 * Escuela asignada a un supervisor con detalle
 */
export interface EscuelaSupervisada {
  id_escuela: number;
  cue: number;
  nombre: string;
  modalidad: string | null;
  categoria: string | null;
  zona: string | null;
  zona_codigo: string | null;
  turno: string | null;
  localidad: string | null;
  departamento: string | null;
  telefono: string | null;
  mail: string | null;
}

/**
 * Listado de todos los supervisores
 */
export interface SupervisorListItem {
  id_persona: number;
  nombre_completo: string;
  total_escuelas: number;
}

/**
 * Datos de relevamiento de cocina
 */
export interface RelevamientoCocina {
  id_cocina: number;
  id_escuela: number;
  fecha: Date;
  datos: Record<string, any>; // JSONB field
}

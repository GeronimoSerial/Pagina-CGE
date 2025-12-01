export interface AsistenciaDiaria {
  legajo: number;
  nombre: string;
  dia: string; // Date string
  entrada: string | null; // Timestamp string
  salida: string | null; // Timestamp string
  horas_trabajadas: number | null;
  total_marcas: number;
}

export interface AusenteDiario {
  legajo: number;
  nombre: string;
  dia: string; // Date string
}

export interface MarcacionIncompleta {
  legajo: number;
  nombre: string;
  dia: string; // Date string
  entradas: number;
  salidas: number;
}

export interface AuditoriaOperacion {
  id: number;
  fecha: string; // Date string
  hora: string; // Time string
  tipo: string;
  detalle: string;
  empleado: string;
  operado_por: string;
}

export interface DiaSinActividad {
  dia: string; // Date string
}

export interface MarcacionUnificada {
  id: number;
  legajo: number;
  ts: string; // Timestamp string
  tipo: string;
  sensor: string;
  origen: string;
  duplicado: boolean;
}

export interface MarcacionDiaria {
  legajo: number;
  nombre: string;
  dia: string; // Date string
  primera_marca: string;
  ultima_marca: string;
  total_marcas: number;
}

export interface DiaConMarca {
  dia: string; // Date string
}

export interface EmpleadoActivo {
  legajo: number;
}

export interface EmpleadoDetalle {
  legajo: string;
  nombre: string;
  area: string | null;
  turno: string | null;
  estado: string | null;
  fechaingreso: string | null;
  dni: string | null;
  email: string | null;
  inactivo: boolean;
}

export interface ResumenMensualEmpleado {
  legajo: number;
  nombre: string;
  mes: string;
  dias_trabajados: number;
  total_horas: number | null;
  promedio_horas_dia: number | null;
  total_marcas: number;
}

export interface EstadisticaDiaria {
  dia: string;
  presentes: number;
  ausentes: number;
}

export interface PromedioHorasDiario {
  dia: string;
  promedio_horas: number;
  empleados_con_registro: number;
}

// Tipos para Reportes y Liquidaciones
export interface ReporteLiquidacion {
  legajo: string;
  nombre: string;
  area: string | null;
  turno: string | null;
  dni: string | null;
  mes: string;
  dias_trabajados: number;
  total_horas: number;
  promedio_horas_dia: number;
  dias_ausente: number;
  dias_incompletos: number;
  primer_dia_trabajado: string | null;
  ultimo_dia_trabajado: string | null;
  fecha_ingreso: string | null;
  estado: string | null;
  categoria_horas: string;
  // Nuevos campos para cumplimiento
  horas_jornada?: number;
  horas_esperadas?: number;
  porcentaje_cumplimiento?: number;
}

export interface DetalleDiarioEmpleado {
  legajo: string;
  nombre: string;
  area: string | null;
  turno: string | null;
  dia: string;
  dia_semana: string;
  entrada: string | null;
  salida: string | null;
  horas_trabajadas: number | null;
  total_marcas: number;
  tipo_jornada: string;
}

export interface MesDisponible {
  mes: string;
  mes_nombre: string;
}

// Tipos para Feriados
export interface Feriado {
  id: number;
  fecha: string;
  descripcion: string;
  tipo: string;
  dia_semana?: string;
  anio?: number;
}

export interface FeriadoCreate {
  fecha: string;
  descripcion: string;
  tipo: string;
}

// Tipos para Configuración de Jornada
export interface ConfigJornada {
  id?: number;
  legajo: string;
  horas_jornada: 4 | 6 | 8;
  descripcion?: string;
  vigente_desde?: string;
}

export interface EmpleadoConJornada {
  legajo: string;
  nombre: string;
  area: string | null;
  turno: string | null;
  dni: string | null;
  estado: string | null;
  inactivo: boolean;
  horas_jornada: number;
  tipo_jornada: string;
  vigente_desde: string | null;
  en_whitelist: boolean;
}

// Tipos para Empleados Problemáticos
export interface EmpleadoProblematico {
  legajo: string;
  nombre: string;
  area: string | null;
  turno: string | null;
  dni: string | null;
  horas_jornada: number;
  total_ausencias: number;
  dias_trabajados: number;
  total_horas: number;
  dias_incompletos: number;
  total_dias_habiles: number;
  horas_esperadas: number;
  porcentaje_cumplimiento: number;
  problema_ausencias: boolean;
  problema_cumplimiento: boolean;
  problema_incompletos: boolean;
  score_severidad: number;
  cantidad_problemas: number;
}

// Tipos para Excepciones de Asistencia (Vacaciones, Licencias)
export type TipoExcepcion =
  | "vacaciones"
  | "art_8" // Licencia por razones de salud
  | "art_11" // Licencia por cambio de tareas
  | "art_12" // Licencia por enfermedad de familiar
  | "art_13" // Licencia por maternidad
  | "art_15" // Licencia por matrimonio
  | "art_16" // Licencia por fallecimiento de familiar
  | "art_17" // Licencias por representación política y participación electoral
  | "art_18" // Licencia por representación gremial
  | "art_19" // Licencia por exámenes
  | "art_21" // Licencia por perfeccionamiento o estudios
  | "art_22" // Licencia por Razones Particulares
  | "art_27" // Licencia especial
  | "art_28" // Licencia por cargo de mayor jerarquía
  | "art_29" // Licencia por actividades deportivas
  | "lic_gineco" // Licencia por Estudios Ginecológicos
  | "comision_servicio"
  | "otro";

export interface ExcepcionAsistencia {
  id: number;
  legajo: string;
  nombre: string | null;
  area: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: TipoExcepcion;
  descripcion: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  dias_excepcion: number;
}

export interface ExcepcionCreate {
  legajo: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: TipoExcepcion;
  descripcion?: string;
}

// Tipos para Whitelist de Empleados
export interface WhitelistEmpleado {
  id: number;
  legajo: string;
  nombre: string | null;
  area: string | null;
  turno: string | null;
  motivo: string;
  created_by: string;
  created_at: string;
  activo: boolean;
}

export interface WhitelistCreate {
  legajo: string;
  motivo: string;
}

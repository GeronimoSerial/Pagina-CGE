'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../lib/prisma';
import {
  EscuelaCompleta,
  EstadisticasSistema,
  DistribucionZonaModalidad,
  EscuelaBusqueda,
  BusquedaEscuelasParams,
  SupervisorConEscuelas,
  EscuelaPorSupervisor,
  SupervisorPorDepartamento,
  EscuelasPorZona,
  EscuelasPorCategoria,
  EscuelasPorDepartamento,
  EscuelasPorModalidad,
  DatoGrafico,
  ReporteEscuela,
} from '../lib/escuelas-types';
import { Prisma } from '@prisma/client';

// =====================================================
// CONSULTAS PRINCIPALES
// =====================================================

/**
 * Obtiene todas las escuelas con datos completos
 */
export async function getEscuelasCompletas(): Promise<EscuelaCompleta[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'escuelas-completas');

  const result = await prisma.$queryRaw<
    Array<{
      id_escuela: number;
      cue: bigint;
      nombre: string;
      telefono: string | null;
      mail: string | null;
      fecha_fundacion: Date | null;
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
      tiene_modalidad: boolean;
      tiene_categoria: boolean;
      tiene_zona: boolean;
      tiene_localidad: boolean;
      tiene_supervisor: boolean;
      created_at: Date | null;
      updated_at: Date | null;
    }>
  >`
    SELECT *
    FROM institucional.v_escuela_completa
    ORDER BY nombre
  `;

  return result.map((row) => ({
    id_escuela: row.id_escuela,
    cue: Number(row.cue),
    nombre: row.nombre,
    telefono: row.telefono,
    mail: row.mail,
    fecha_fundacion: row.fecha_fundacion?.toISOString().split('T')[0] ?? null,
    anexo: row.anexo,
    modalidad: row.modalidad,
    categoria: row.categoria,
    zona: row.zona,
    zona_codigo: row.zona_codigo,
    turno: row.turno,
    servicio_comida: row.servicio_comida,
    ambito: row.ambito,
    localidad: row.localidad,
    departamento: row.departamento,
    supervisor: row.supervisor,
    id_supervisor: row.id_supervisor,
    tiene_modalidad: row.tiene_modalidad,
    tiene_categoria: row.tiene_categoria,
    tiene_zona: row.tiene_zona,
    tiene_localidad: row.tiene_localidad,
    tiene_supervisor: row.tiene_supervisor,
    created_at: row.created_at?.toISOString() ?? null,
    updated_at: row.updated_at?.toISOString() ?? null,
  }));
}

/**
 * Obtiene estadísticas globales del sistema
 */
export async function getEstadisticasSistema(): Promise<EstadisticasSistema | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'estadisticas-sistema');

  const result = await prisma.$queryRaw<
    Array<{
      total_escuelas: bigint;
      escuelas_con_modalidad: bigint;
      escuelas_con_categoria: bigint;
      escuelas_con_zona: bigint;
      escuelas_con_turno: bigint;
      escuelas_con_supervisor: bigint;
      escuelas_sin_supervisor: bigint;
      total_supervisores: bigint;
      pct_con_modalidad: Prisma.Decimal;
      pct_con_supervisor: Prisma.Decimal;
      escuelas_pendientes: bigint;
      supervisiones_pendientes: bigint;
      ultima_actualizacion: Date;
    }>
  >`
    SELECT *
    FROM institucional.mv_estadisticas_sistema
    LIMIT 1
  `;

  if (!result[0]) return null;

  const row = result[0];
  return {
    total_escuelas: Number(row.total_escuelas),
    escuelas_con_modalidad: Number(row.escuelas_con_modalidad),
    escuelas_con_categoria: Number(row.escuelas_con_categoria),
    escuelas_con_zona: Number(row.escuelas_con_zona),
    escuelas_con_turno: Number(row.escuelas_con_turno),
    escuelas_con_supervisor: Number(row.escuelas_con_supervisor),
    escuelas_sin_supervisor: Number(row.escuelas_sin_supervisor),
    total_supervisores: Number(row.total_supervisores),
    pct_con_modalidad: row.pct_con_modalidad.toNumber(),
    pct_con_supervisor: row.pct_con_supervisor.toNumber(),
    escuelas_pendientes: Number(row.escuelas_pendientes),
    supervisiones_pendientes: Number(row.supervisiones_pendientes),
    ultima_actualizacion: row.ultima_actualizacion.toISOString(),
  };
}

/**
 * Obtiene la distribución de escuelas por zona y modalidad
 */
export async function getDistribucionZonaModalidad(): Promise<
  DistribucionZonaModalidad[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'distribucion-zona-modalidad');

  const result = await prisma.$queryRaw<
    Array<{
      zona: string | null;
      zona_codigo: string | null;
      comun: bigint;
      especial: bigint;
      adultos: bigint;
      inicial: bigint;
      hospitalaria: bigint;
      contextos_encierro: bigint;
      sin_modalidad: bigint;
      total: bigint;
    }>
  >`
    SELECT *
    FROM institucional.v_distribucion_zona_modalidad
    ORDER BY zona_codigo
  `;

  return result.map((row) => ({
    zona: row.zona,
    zona_codigo: row.zona_codigo,
    comun: Number(row.comun),
    especial: Number(row.especial),
    adultos: Number(row.adultos),
    inicial: Number(row.inicial),
    hospitalaria: Number(row.hospitalaria),
    contextos_encierro: Number(row.contextos_encierro),
    sin_modalidad: Number(row.sin_modalidad),
    total: Number(row.total),
  }));
}

/**
 * Busca escuelas con filtros opcionales usando la función SQL
 */
export async function buscarEscuelas(
  params: BusquedaEscuelasParams = {},
): Promise<EscuelaBusqueda[]> {
  const {
    termino = null,
    modalidad = null,
    zona = null,
    turno = null,
    soloSinSupervisor = false,
    limit = 50,
    offset = 0,
  } = params;

  const result = await prisma.$queryRaw<
    Array<{
      id_escuela: number;
      cue: bigint;
      nombre: string;
      modalidad: string | null;
      zona: string | null;
      turno: string | null;
      supervisor: string;
      tiene_supervisor: boolean;
    }>
  >`
    SELECT *
    FROM institucional.buscar_escuelas(
      ${termino}::TEXT,
      ${modalidad}::INTEGER,
      ${zona}::INTEGER,
      ${turno}::INTEGER,
      ${soloSinSupervisor}::BOOLEAN,
      ${limit}::INTEGER,
      ${offset}::INTEGER
    )
  `;

  return result.map((row) => ({
    id_escuela: row.id_escuela,
    cue: Number(row.cue),
    nombre: row.nombre,
    modalidad: row.modalidad,
    zona: row.zona,
    turno: row.turno,
    supervisor: row.supervisor,
    tiene_supervisor: row.tiene_supervisor,
  }));
}

// =====================================================
// CONSULTAS DE SUPERVISORES
// =====================================================

/**
 * Obtiene resumen de escuelas asignadas a cada supervisor
 */
export async function getSupervisoresConEscuelas(): Promise<
  SupervisorConEscuelas[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'supervisores');

  const result = await prisma.$queryRaw<SupervisorConEscuelas[]>`
    SELECT 
      p.nombre || ' ' || p.apellido AS supervisor,
      COUNT(se.id_escuela)::int AS total_escuelas,
      STRING_AGG(e.nombre, ' | ' ORDER BY e.nombre) AS escuelas
    FROM rrhh.persona p
    JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    GROUP BY p.id_persona, p.nombre, p.apellido
    ORDER BY total_escuelas DESC
  `;

  return result;
}

/**
 * Obtiene detalle de escuelas por supervisor
 */
export async function getEscuelasPorSupervisor(): Promise<
  EscuelaPorSupervisor[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'escuelas-por-supervisor');

  const result = await prisma.$queryRaw<
    Array<{
      supervisor: string;
      cue: bigint;
      escuela: string;
      modalidad: string | null;
      zona: string | null;
      localidad: string | null;
      departamento: string | null;
    }>
  >`
    SELECT 
      p.nombre || ' ' || p.apellido AS supervisor,
      e.cue,
      e.nombre AS escuela,
      m.descripcion AS modalidad,
      z.descripcion AS zona,
      l.nombre AS localidad,
      d.nombre AS departamento
    FROM rrhh.persona p
    JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    ORDER BY p.apellido, e.nombre
  `;

  return result.map((row) => ({
    supervisor: row.supervisor,
    cue: Number(row.cue),
    escuela: row.escuela,
    modalidad: row.modalidad,
    zona: row.zona,
    localidad: row.localidad,
    departamento: row.departamento,
  }));
}

/**
 * Obtiene supervisores agrupados por departamento
 */
export async function getSupervisoresPorDepartamento(): Promise<
  SupervisorPorDepartamento[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'supervisores-por-departamento');

  const result = await prisma.$queryRaw<SupervisorPorDepartamento[]>`
    SELECT 
      d.nombre AS departamento,
      COUNT(DISTINCT se.id_persona)::int AS supervisores,
      COUNT(e.id_escuela)::int AS escuelas_supervisadas,
      STRING_AGG(DISTINCT p.apellido, ', ') AS nombres_supervisores
    FROM supervision.supervisor_escuela se
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    JOIN rrhh.persona p ON se.id_persona = p.id_persona
    JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    GROUP BY d.nombre
    ORDER BY escuelas_supervisadas DESC
  `;

  return result;
}

// =====================================================
// CONSULTAS DE DISTRIBUCIÓN
// =====================================================

/**
 * Obtiene distribución de escuelas por zona
 */
export async function getEscuelasPorZona(): Promise<EscuelasPorZona[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'escuelas-por-zona');

  const result = await prisma.$queryRaw<
    Array<{
      codigo: string | null;
      zona: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      z.codigo,
      z.descripcion AS zona,
      COUNT(e.id_escuela) AS cantidad,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
    FROM institucional.escuela e
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    GROUP BY z.id_zona, z.codigo, z.descripcion
    ORDER BY z.codigo
  `;

  return result.map((row) => ({
    codigo: row.codigo,
    zona: row.zona,
    cantidad: Number(row.cantidad),
    porcentaje: row.porcentaje.toNumber(),
  }));
}

/**
 * Obtiene distribución de escuelas por categoría
 */
export async function getEscuelasPorCategoria(): Promise<
  EscuelasPorCategoria[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'escuelas-por-categoria');

  const result = await prisma.$queryRaw<
    Array<{
      codigo: string | null;
      categoria: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      c.codigo,
      c.descripcion AS categoria,
      COUNT(e.id_escuela) AS cantidad,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
    FROM institucional.escuela e
    LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
    GROUP BY c.id_categoria, c.codigo, c.descripcion
    ORDER BY c.codigo
  `;

  return result.map((row) => ({
    codigo: row.codigo,
    categoria: row.categoria,
    cantidad: Number(row.cantidad),
    porcentaje: row.porcentaje.toNumber(),
  }));
}

/**
 * Obtiene distribución de escuelas por departamento (con estado de supervisión)
 */
export async function getEscuelasPorDepartamento(): Promise<
  EscuelasPorDepartamento[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'escuelas-por-departamento');

  const result = await prisma.$queryRaw<
    Array<{
      departamento: string;
      total_escuelas: bigint;
      con_supervisor: bigint;
      sin_supervisor: bigint;
      pct_supervisados: Prisma.Decimal;
    }>
  >`
    SELECT 
      d.nombre AS departamento,
      COUNT(e.id_escuela) AS total_escuelas,
      COUNT(CASE WHEN se.id_escuela IS NOT NULL THEN 1 END) AS con_supervisor,
      COUNT(CASE WHEN se.id_escuela IS NULL THEN 1 END) AS sin_supervisor,
      ROUND(100.0 * COUNT(se.id_escuela) / COUNT(e.id_escuela), 1) AS pct_supervisados
    FROM institucional.escuela e
    JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
    GROUP BY d.nombre
    ORDER BY total_escuelas DESC
  `;

  return result.map((row) => ({
    departamento: row.departamento,
    total_escuelas: Number(row.total_escuelas),
    con_supervisor: Number(row.con_supervisor),
    sin_supervisor: Number(row.sin_supervisor),
    pct_supervisados: row.pct_supervisados.toNumber(),
  }));
}

/**
 * Obtiene distribución de escuelas por modalidad
 */
export async function getEscuelasPorModalidad(): Promise<
  EscuelasPorModalidad[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'escuelas-por-modalidad');

  const result = await prisma.$queryRaw<
    Array<{
      modalidad: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      m.descripcion AS modalidad,
      COUNT(e.id_escuela) AS cantidad,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
    FROM institucional.escuela e
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    GROUP BY m.id_modalidad, m.descripcion
    ORDER BY cantidad DESC
  `;

  return result.map((row) => ({
    modalidad: row.modalidad,
    cantidad: Number(row.cantidad),
    porcentaje: row.porcentaje.toNumber(),
  }));
}

// =====================================================
// DATOS PARA GRÁFICOS
// =====================================================

/**
 * Obtiene datos para gráfico de torta (modalidad)
 */
export async function getDatosGraficoModalidad(): Promise<DatoGrafico[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'grafico-modalidad');

  const result = await prisma.$queryRaw<
    Array<{ label: string | null; value: bigint }>
  >`
    SELECT m.descripcion AS label, COUNT(*) AS value
    FROM institucional.escuela e
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    GROUP BY m.descripcion
    ORDER BY value DESC
  `;

  return result.map((row) => ({
    label: row.label ?? 'Sin modalidad',
    value: Number(row.value),
  }));
}

/**
 * Obtiene datos para gráfico de barras (top 10 departamentos con más escuelas)
 */
export async function getDatosGraficoDepartamentos(): Promise<DatoGrafico[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'grafico-departamentos');

  const result = await prisma.$queryRaw<
    Array<{ label: string; value: bigint }>
  >`
    SELECT d.nombre AS label, COUNT(e.id_escuela) AS value
    FROM institucional.escuela e
    JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    GROUP BY d.nombre
    ORDER BY value DESC
    LIMIT 10
  `;

  return result.map((row) => ({
    label: row.label,
    value: Number(row.value),
  }));
}

// =====================================================
// REPORTES
// =====================================================

/**
 * Obtiene listado completo de escuelas (exportable)
 */
export async function getReporteEscuelas(): Promise<ReporteEscuela[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'reporte-escuelas');

  const result = await prisma.$queryRaw<
    Array<{
      cue: bigint;
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
    }>
  >`
    SELECT 
      e.cue,
      e.nombre AS escuela,
      m.descripcion AS modalidad,
      c.descripcion AS categoria,
      z.descripcion AS zona,
      t.descripcion AS turno,
      l.nombre AS localidad,
      d.nombre AS departamento,
      e.telefono,
      e.mail,
      COALESCE(p.apellido || ', ' || p.nombre, 'Sin asignar') AS supervisor
    FROM institucional.escuela e
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
    LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona
    ORDER BY d.nombre, l.nombre, e.nombre
  `;

  return result.map((row) => ({
    cue: Number(row.cue),
    escuela: row.escuela,
    modalidad: row.modalidad,
    categoria: row.categoria,
    zona: row.zona,
    turno: row.turno,
    localidad: row.localidad,
    departamento: row.departamento,
    telefono: row.telefono,
    mail: row.mail,
    supervisor: row.supervisor,
  }));
}

/**
 * Busca escuela por nombre o CUE
 */
export async function buscarEscuelaPorNombreOCue(
  termino: string,
): Promise<ReporteEscuela[]> {
  const result = await prisma.$queryRaw<
    Array<{
      cue: bigint;
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
    }>
  >`
    SELECT 
      e.cue,
      e.nombre AS escuela,
      m.descripcion AS modalidad,
      c.descripcion AS categoria,
      z.descripcion AS zona,
      t.descripcion AS turno,
      l.nombre AS localidad,
      d.nombre AS departamento,
      e.telefono,
      e.mail,
      COALESCE(p.apellido || ', ' || p.nombre, 'Sin asignar') AS supervisor
    FROM institucional.escuela e
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
    LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona
    WHERE e.nombre ILIKE ${'%' + termino + '%'}
      OR e.cue::TEXT LIKE ${termino + '%'}
    ORDER BY e.nombre
  `;

  return result.map((row) => ({
    cue: Number(row.cue),
    escuela: row.escuela,
    modalidad: row.modalidad,
    categoria: row.categoria,
    zona: row.zona,
    turno: row.turno,
    localidad: row.localidad,
    departamento: row.departamento,
    telefono: row.telefono,
    mail: row.mail,
    supervisor: row.supervisor,
  }));
}

// =====================================================
// CONTADORES RÁPIDOS
// =====================================================

/**
 * Obtiene contadores básicos del sistema
 */
export async function getContadoresBasicos(): Promise<{
  total_escuelas: number;
  total_supervisores: number;
  total_departamentos: number;
  total_localidades: number;
}> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'contadores-basicos');

  const result = await prisma.$queryRaw<
    Array<{
      total_escuelas: bigint;
      total_supervisores: bigint;
      total_departamentos: bigint;
      total_localidades: bigint;
    }>
  >`
    SELECT
      (SELECT COUNT(*) FROM institucional.escuela) AS total_escuelas,
      (SELECT COUNT(DISTINCT id_persona) FROM supervision.supervisor_escuela) AS total_supervisores,
      (SELECT COUNT(*) FROM geografia.departamento) AS total_departamentos,
      (SELECT COUNT(*) FROM geografia.localidad) AS total_localidades
  `;

  const row = result[0];
  return {
    total_escuelas: Number(row?.total_escuelas ?? 0),
    total_supervisores: Number(row?.total_supervisores ?? 0),
    total_departamentos: Number(row?.total_departamentos ?? 0),
    total_localidades: Number(row?.total_localidades ?? 0),
  };
}

/**
 * Refresca la vista materializada de estadísticas
 */
export async function refreshEstadisticasSistema(): Promise<void> {
  await prisma.$executeRaw`
    REFRESH MATERIALIZED VIEW CONCURRENTLY institucional.mv_estadisticas_sistema
  `;
}

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
  EscuelasPorDepartamentoSupervision,
  EscuelasPorModalidad,
  DatoGrafico,
  ReporteEscuela,
  SupervisorDetalle,
  SupervisorEstadisticas,
  EscuelaSupervisada,
  SupervisorListItem,
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
      director: string | null;
      id_director: number | null;
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
    director: row.director,
    id_director: row.id_director,
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
 * Obtiene una escuela por su ID con todos sus datos
 */
export async function getEscuelaById(
  id: number,
): Promise<EscuelaCompleta | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', `escuela-${id}`);

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
      director: string | null;
      id_director: number | null;
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
    WHERE id_escuela = ${id}
    LIMIT 1
  `;

  if (!result[0]) return null;

  const row = result[0];
  return {
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
    director: row.director,
    id_director: row.id_director,
    tiene_modalidad: row.tiene_modalidad,
    tiene_categoria: row.tiene_categoria,
    tiene_zona: row.tiene_zona,
    tiene_localidad: row.tiene_localidad,
    tiene_supervisor: row.tiene_supervisor,
    created_at: row.created_at?.toISOString() ?? null,
    updated_at: row.updated_at?.toISOString() ?? null,
  };
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

// =====================================================
// HELPERS PARA FILTROS
// =====================================================

export async function getTodasCategorias() {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'categorias');

  return prisma.categoria.findMany({
    orderBy: { descripcion: 'asc' },
    select: { id_categoria: true, descripcion: true },
  });
}

export async function getTodosDepartamentos() {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'departamentos');

  return prisma.departamento.findMany({
    orderBy: { nombre: 'asc' },
    select: { id_departamento: true, nombre: true },
  });
}

export async function getTodosSupervisores() {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'supervisores-lista');

  const result = await prisma.$queryRaw<
    Array<{ id_persona: number; nombre_completo: string }>
  >`
    SELECT DISTINCT p.id_persona, p.apellido || ', ' || p.nombre as nombre_completo
    FROM supervision.supervisor_escuela se
    JOIN rrhh.persona p ON se.id_persona = p.id_persona
    ORDER BY nombre_completo
  `;

  return result;
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
    categoria = null,
    departamento = null,
    supervisor = null,
    soloSinSupervisor = false,
    limit = 50,
    offset = 0,
  } = params;

  // Construcción dinámica de la cláusula WHERE
  const conditions: Prisma.Sql[] = [];

  if (termino) {
    conditions.push(
      Prisma.sql`(e.nombre ILIKE ${'%' + termino + '%'} OR e.cue::TEXT LIKE ${termino + '%'})`,
    );
  }
  if (modalidad) {
    conditions.push(Prisma.sql`e.id_modalidad = ${modalidad}`);
  }
  if (zona) {
    conditions.push(Prisma.sql`e.id_zona = ${zona}`);
  }
  if (turno) {
    conditions.push(Prisma.sql`e.id_turno = ${turno}`);
  }
  if (categoria) {
    conditions.push(Prisma.sql`e.id_categoria = ${categoria}`);
  }
  if (departamento) {
    conditions.push(Prisma.sql`l.id_departamento = ${departamento}`);
  }
  if (supervisor) {
    conditions.push(Prisma.sql`se.id_persona = ${supervisor}`);
  }
  if (soloSinSupervisor) {
    conditions.push(Prisma.sql`se.id_escuela IS NULL`);
  }

  const whereClause =
    conditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.empty;

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
    SELECT 
      e.id_escuela,
      e.cue,
      e.nombre,
      m.descripcion as modalidad,
      z.descripcion as zona,
      t.descripcion as turno,
      COALESCE(p.apellido || ', ' || p.nombre, 'Sin asignar') as supervisor,
      (se.id_escuela IS NOT NULL) as tiene_supervisor
    FROM institucional.escuela e
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
    LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
    LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona
    ${whereClause}
    ORDER BY e.nombre
    LIMIT ${limit} OFFSET ${offset}
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

/**
 * Cuenta el total de escuelas que coinciden con los filtros
 */
export async function contarEscuelas(
  params: BusquedaEscuelasParams = {},
): Promise<number> {
  const {
    termino = null,
    modalidad = null,
    zona = null,
    turno = null,
    categoria = null,
    departamento = null,
    supervisor = null,
    soloSinSupervisor = false,
  } = params;

  // Construcción dinámica de la cláusula WHERE para coincidir con la función SQL
  const conditions: Prisma.Sql[] = [];

  if (termino) {
    conditions.push(
      Prisma.sql`(e.nombre ILIKE ${'%' + termino + '%'} OR e.cue::TEXT LIKE ${termino + '%'})`,
    );
  }
  if (modalidad) {
    conditions.push(Prisma.sql`e.id_modalidad = ${modalidad}`);
  }
  if (zona) {
    conditions.push(Prisma.sql`e.id_zona = ${zona}`);
  }
  if (turno) {
    conditions.push(Prisma.sql`e.id_turno = ${turno}`);
  }
  if (categoria) {
    conditions.push(Prisma.sql`e.id_categoria = ${categoria}`);
  }
  if (departamento) {
    conditions.push(Prisma.sql`l.id_departamento = ${departamento}`);
  }
  if (supervisor) {
    conditions.push(Prisma.sql`se.id_persona = ${supervisor}`);
  }
  if (soloSinSupervisor) {
    conditions.push(Prisma.sql`se.id_escuela IS NULL`);
  }

  const whereClause =
    conditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.empty;

  const result = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(DISTINCT e.id_escuela) as count
    FROM institucional.escuela e
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
    ${whereClause}
  `;
  return Number(result[0]?.count ?? 0);
}

// =====================================================
// GEOGRAFÍA
// =====================================================

export async function getEscuelasPorDepartamento() {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'geografia', 'departamentos');

  const result = await prisma.$queryRaw<
    Array<{ id_departamento: number; nombre: string; cantidad: bigint }>
  >`
    SELECT 
      d.id_departamento,
      d.nombre,
      COUNT(e.id_escuela) as cantidad
    FROM geografia.departamento d
    JOIN geografia.localidad l ON d.id_departamento = l.id_departamento
    JOIN institucional.escuela e ON l.id_localidad = e.id_localidad
    GROUP BY d.id_departamento, d.nombre
    ORDER BY cantidad DESC
  `;

  return result.map((row) => ({
    id: row.id_departamento,
    departamento: row.nombre,
    cantidad: Number(row.cantidad),
  }));
}

export async function getTopLocalidades(limit = 10) {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'geografia', 'localidades');

  const result = await prisma.$queryRaw<
    Array<{
      id_localidad: number;
      localidad: string;
      departamento: string;
      cantidad: bigint;
    }>
  >`
    SELECT 
      l.id_localidad,
      l.nombre as localidad,
      d.nombre as departamento,
      COUNT(e.id_escuela) as cantidad
    FROM geografia.localidad l
    JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    JOIN institucional.escuela e ON l.id_localidad = e.id_localidad
    GROUP BY l.id_localidad, l.nombre, d.nombre
    ORDER BY cantidad DESC
    LIMIT ${limit}
  `;

  return result.map((row) => ({
    id: row.id_localidad,
    localidad: row.localidad,
    departamento: row.departamento,
    cantidad: Number(row.cantidad),
  }));
}

// =====================================================
// CALIDAD DE DATOS
// =====================================================

export async function getMetricasCalidad() {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'calidad');

  const result = await prisma.$queryRaw<
    Array<{
      total: bigint;
      sin_modalidad: bigint;
      sin_zona: bigint;
      sin_categoria: bigint;
      sin_supervisor: bigint;
    }>
  >`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE id_modalidad = 11 OR id_modalidad IS NULL) as sin_modalidad,
      COUNT(*) FILTER (WHERE id_zona = 0 OR id_zona IS NULL) as sin_zona,
      COUNT(*) FILTER (WHERE id_categoria = 0 OR id_categoria IS NULL) as sin_categoria,
      (SELECT COUNT(*) FROM institucional.escuela e LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela WHERE se.id_persona IS NULL) as sin_supervisor
    FROM institucional.escuela
  `;

  const row = result[0];
  return {
    total_escuelas: Number(row.total),
    sin_modalidad: Number(row.sin_modalidad),
    sin_zona: Number(row.sin_zona),
    sin_categoria: Number(row.sin_categoria),
    sin_supervisor: Number(row.sin_supervisor),
    sin_coordenadas: 0, // Placeholder
  };
}

export async function getEscuelasConDatosFaltantes(limit = 50) {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'calidad', 'lista');

  // Buscamos escuelas que tengan al menos un campo crítico faltante
  // Modalidad 11 = Desconocido/Sin definir (según análisis)
  // Zona 0 = Sin definir (según análisis)
  // Categoria 0 = Sin definir (según análisis)

  const result = await prisma.$queryRaw<
    Array<{
      id_escuela: number;
      cue: bigint;
      nombre: string;
      id_modalidad: number;
      id_zona: number;
      id_categoria: number;
      tiene_supervisor: boolean;
    }>
  >`
    SELECT 
      e.id_escuela,
      e.cue,
      e.nombre,
      e.id_modalidad,
      e.id_zona,
      e.id_categoria,
      (se.id_persona IS NOT NULL) as tiene_supervisor
    FROM institucional.escuela e
    LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
    WHERE 
      e.id_modalidad = 11 OR e.id_modalidad IS NULL OR
      e.id_zona = 0 OR e.id_zona IS NULL OR
      e.id_categoria = 0 OR e.id_categoria IS NULL OR
      se.id_persona IS NULL
    LIMIT ${limit}
  `;

  return result.map((row) => {
    const faltantes = [];
    if (row.id_modalidad === 11 || !row.id_modalidad)
      faltantes.push('Modalidad');
    if (row.id_zona === 0 || !row.id_zona) faltantes.push('Zona');
    if (row.id_categoria === 0 || !row.id_categoria)
      faltantes.push('Categoría');
    if (!row.tiene_supervisor) faltantes.push('Supervisor');

    return {
      id_escuela: row.id_escuela,
      cue: Number(row.cue),
      nombre: row.nombre,
      faltantes,
    };
  });
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

/**
 * Obtiene detalles completos de un supervisor
 */
export async function getSupervisorDetails(
  id_persona: number,
): Promise<SupervisorDetalle | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', `supervisor-${id_persona}`);

  const result = await prisma.$queryRaw<
    Array<{
      id_persona: number;
      apellido: string;
      nombre: string;
      mail: string | null;
      telefono: string | null;
      cargo: string | null;
      escuelas_asignadas: bigint;
    }>
  >`
    SELECT 
      p.id_persona,
      p.apellido,
      p.nombre,
      p.mail,
      p.telefono,
      c.descripcion as cargo,
      (SELECT COUNT(*) FROM supervision.supervisor_escuela se2 WHERE se2.id_persona = p.id_persona) as escuelas_asignadas
    FROM rrhh.persona p
    LEFT JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
    LEFT JOIN vacantes.cargo c ON se.id_cargo = c.id_cargo
    WHERE p.id_persona = ${id_persona}
    LIMIT 1
  `;

  if (!result[0]) return null;

  const row = result[0];
  return {
    id_persona: row.id_persona,
    apellido: row.apellido,
    nombre: row.nombre,
    mail: row.mail,
    telefono: row.telefono,
    cargo: row.cargo,
    escuelas_asignadas: Number(row.escuelas_asignadas),
  };
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
      id_zona: number;
      codigo: string | null;
      zona: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      z.id_zona,
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
    id: row.id_zona,
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
export async function getSupervisionPorDepartamento(): Promise<
  EscuelasPorDepartamentoSupervision[]
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
      id_modalidad: number;
      modalidad: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      m.id_modalidad,
      m.descripcion AS modalidad,
      COUNT(e.id_escuela) AS cantidad,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
    FROM institucional.escuela e
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    GROUP BY m.id_modalidad, m.descripcion
    ORDER BY cantidad DESC
  `;

  return result.map((row) => ({
    id: row.id_modalidad,
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

// =====================================================
// PÁGINAS DE DETALLE DE SUPERVISORES
// =====================================================

/**
 * Obtiene la lista de todos los supervisores con sus IDs
 */
export async function getListaSupervisores(): Promise<SupervisorListItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('supervisores', 'lista-supervisores');

  const result = await prisma.$queryRaw<
    Array<{
      id_persona: number;
      nombre_completo: string;
      total_escuelas: bigint;
    }>
  >`
    SELECT 
      p.id_persona,
      p.apellido || ', ' || p.nombre as nombre_completo,
      COUNT(se.id_escuela) as total_escuelas
    FROM rrhh.persona p
    JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
    GROUP BY p.id_persona, p.apellido, p.nombre
    ORDER BY p.apellido, p.nombre
  `;

  return result.map((row) => ({
    id_persona: row.id_persona,
    nombre_completo: row.nombre_completo,
    total_escuelas: Number(row.total_escuelas),
  }));
}

/**
 * Obtiene estadísticas detalladas de un supervisor
 */
export async function getSupervisorEstadisticas(
  id_persona: number,
): Promise<SupervisorEstadisticas | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('supervisores', `supervisor-stats-${id_persona}`);

  const result = await prisma.$queryRaw<
    Array<{
      id_persona: number;
      nombre_completo: string;
      mail: string | null;
      telefono: string | null;
      total_escuelas: bigint;
      escuelas_urbana_centrica: bigint;
      escuelas_urbana_periferica: bigint;
      escuelas_rurales: bigint;
      escuelas_especiales: bigint;
      escuelas_adultos: bigint;
      categoria_promedio: Prisma.Decimal | null;
      departamentos_asignados: bigint;
      departamentos: string | null;
    }>
  >`
    SELECT 
      p.id_persona,
      p.nombre || ' ' || p.apellido AS nombre_completo,
      p.mail,
      p.telefono,
      COUNT(se.id_escuela) AS total_escuelas,
      COUNT(CASE WHEN z.codigo = 'A' THEN 1 END) AS escuelas_urbana_centrica,
      COUNT(CASE WHEN z.codigo = 'B' THEN 1 END) AS escuelas_urbana_periferica,
      COUNT(CASE WHEN z.codigo IN ('C', 'D', 'E') THEN 1 END) AS escuelas_rurales,
      COUNT(CASE WHEN m.descripcion = 'ESPECIAL' THEN 1 END) AS escuelas_especiales,
      COUNT(CASE WHEN m.descripcion = 'ADULTOS' THEN 1 END) AS escuelas_adultos,
      ROUND(AVG(NULLIF(c.codigo, 0)), 2) AS categoria_promedio,
      COUNT(DISTINCT d.id_departamento) AS departamentos_asignados,
      STRING_AGG(DISTINCT d.nombre, ', ' ORDER BY d.nombre) AS departamentos
    FROM rrhh.persona p
    JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    WHERE p.id_persona = ${id_persona}
    GROUP BY p.id_persona, p.nombre, p.apellido, p.mail, p.telefono
  `;

  if (!result[0]) return null;

  const row = result[0];
  return {
    id_persona: row.id_persona,
    nombre_completo: row.nombre_completo,
    mail: row.mail,
    telefono: row.telefono,
    total_escuelas: Number(row.total_escuelas),
    escuelas_urbana_centrica: Number(row.escuelas_urbana_centrica),
    escuelas_urbana_periferica: Number(row.escuelas_urbana_periferica),
    escuelas_rurales: Number(row.escuelas_rurales),
    escuelas_especiales: Number(row.escuelas_especiales),
    escuelas_adultos: Number(row.escuelas_adultos),
    categoria_promedio: row.categoria_promedio?.toNumber() ?? 0,
    departamentos_asignados: Number(row.departamentos_asignados),
    departamentos: row.departamentos ?? '',
  };
}

/**
 * Obtiene las escuelas asignadas a un supervisor
 */
export async function getEscuelasDeSupervisor(
  id_persona: number,
): Promise<EscuelaSupervisada[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('supervisores', `supervisor-escuelas-${id_persona}`);

  const result = await prisma.$queryRaw<
    Array<{
      id_escuela: number;
      cue: bigint;
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
    }>
  >`
    SELECT 
      e.id_escuela,
      e.cue,
      e.nombre,
      m.descripcion AS modalidad,
      c.descripcion AS categoria,
      z.descripcion AS zona,
      z.codigo AS zona_codigo,
      t.descripcion AS turno,
      l.nombre AS localidad,
      d.nombre AS departamento,
      e.telefono,
      e.mail
    FROM supervision.supervisor_escuela se
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    WHERE se.id_persona = ${id_persona}
    ORDER BY d.nombre, l.nombre, e.nombre
  `;

  return result.map((row) => ({
    id_escuela: row.id_escuela,
    cue: Number(row.cue),
    nombre: row.nombre,
    modalidad: row.modalidad,
    categoria: row.categoria,
    zona: row.zona,
    zona_codigo: row.zona_codigo,
    turno: row.turno,
    localidad: row.localidad,
    departamento: row.departamento,
    telefono: row.telefono,
    mail: row.mail,
  }));
}

/**
 * Obtiene distribución de escuelas por zona para un supervisor específico
 */
export async function getDistribucionZonaSupervisor(
  id_persona: number,
): Promise<Array<{ zona: string; cantidad: number; porcentaje: number }>> {
  'use cache';
  cacheLife('hours');
  cacheTag('supervisores', `supervisor-zonas-${id_persona}`);

  const result = await prisma.$queryRaw<
    Array<{
      zona: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      COALESCE(z.descripcion, 'Sin definir') AS zona,
      COUNT(*) AS cantidad,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
    FROM supervision.supervisor_escuela se
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    WHERE se.id_persona = ${id_persona}
    GROUP BY z.descripcion
    ORDER BY cantidad DESC
  `;

  return result.map((row) => ({
    zona: row.zona ?? 'Sin definir',
    cantidad: Number(row.cantidad),
    porcentaje: row.porcentaje.toNumber(),
  }));
}

/**
 * Obtiene distribución de escuelas por modalidad para un supervisor específico
 */
export async function getDistribucionModalidadSupervisor(
  id_persona: number,
): Promise<Array<{ modalidad: string; cantidad: number; porcentaje: number }>> {
  'use cache';
  cacheLife('hours');
  cacheTag('supervisores', `supervisor-modalidades-${id_persona}`);

  const result = await prisma.$queryRaw<
    Array<{
      modalidad: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      COALESCE(m.descripcion, 'Sin definir') AS modalidad,
      COUNT(*) AS cantidad,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
    FROM supervision.supervisor_escuela se
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    WHERE se.id_persona = ${id_persona}
    GROUP BY m.descripcion
    ORDER BY cantidad DESC
  `;

  return result.map((row) => ({
    modalidad: row.modalidad ?? 'Sin definir',
    cantidad: Number(row.cantidad),
    porcentaje: row.porcentaje.toNumber(),
  }));
}

/**
 * Obtiene distribución de escuelas por departamento para un supervisor específico
 */
export async function getDistribucionDepartamentoSupervisor(
  id_persona: number,
): Promise<
  Array<{ departamento: string; cantidad: number; porcentaje: number }>
> {
  'use cache';
  cacheLife('hours');
  cacheTag('supervisores', `supervisor-departamentos-${id_persona}`);

  const result = await prisma.$queryRaw<
    Array<{
      departamento: string | null;
      cantidad: bigint;
      porcentaje: Prisma.Decimal;
    }>
  >`
    SELECT 
      COALESCE(d.nombre, 'Sin definir') AS departamento,
      COUNT(*) AS cantidad,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
    FROM supervision.supervisor_escuela se
    JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
    LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
    LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
    WHERE se.id_persona = ${id_persona}
    GROUP BY d.nombre
    ORDER BY cantidad DESC
  `;

  return result.map((row) => ({
    departamento: row.departamento ?? 'Sin definir',
    cantidad: Number(row.cantidad),
    porcentaje: row.porcentaje.toNumber(),
  }));
}

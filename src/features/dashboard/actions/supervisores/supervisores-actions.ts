'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';
import {
  SupervisorConEscuelas,
  EscuelaPorSupervisor,
  SupervisorPorDepartamento,
  SupervisorDetalle,
  SupervisorEstadisticas,
  EscuelaSupervisada,
  SupervisorListItem,
} from '../../lib/escuelas-types';
import { Prisma } from '@prisma/client';

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

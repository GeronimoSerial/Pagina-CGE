'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { ReporteEscuela } from '../../lib/escuelas-types';

// =====================================================
// REPORTES Y CONTADORES
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

'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { EscuelaBusqueda, BusquedaEscuelasParams } from '../../lib/escuelas-types';
import { Prisma } from '@prisma/client';

// =====================================================
// HELPERS PARA FILTROS Y BÚSQUEDA
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

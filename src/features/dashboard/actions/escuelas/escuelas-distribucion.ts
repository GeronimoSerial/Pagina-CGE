'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';
import {
  EscuelasPorZona,
  EscuelasPorCategoria,
  EscuelasPorDepartamentoSupervision,
  EscuelasPorModalidad,
} from '../../lib/escuelas-types';
import { Prisma } from '@prisma/client';

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

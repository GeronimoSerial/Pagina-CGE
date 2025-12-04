'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';

// =====================================================
// CONSULTAS GEOGRÁFICAS
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

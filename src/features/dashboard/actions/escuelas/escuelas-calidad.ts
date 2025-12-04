'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';

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

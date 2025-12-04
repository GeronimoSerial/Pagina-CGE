'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';
import { DatoGrafico } from '../../lib/escuelas-types';

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

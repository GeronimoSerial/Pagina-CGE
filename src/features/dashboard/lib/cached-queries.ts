/**
 * Cached Queries - Optimización con React cache() + 'use cache'
 *
 * Este archivo contiene funciones que combinan:
 * 1. cache() de React - Memoización intra-request (deduplica en mismo render)
 * 2. 'use cache' de Next.js - Cache persistente entre requests
 *
 * Uso: Importar estas funciones en lugar de las originales cuando
 * múltiples componentes necesiten los mismos datos en el mismo render.
 */

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import {
  getCantidadEmpleadosActivos,
  getCantidadEmpleadosProblematicos,
  getEstadisticasDiarias,
  getPromedioHorasDiario,
  getListaEmpleados,
  getMesesDisponibles,
  getAreasDisponibles,
  getEmpleadosProblematicos,
} from '@dashboard/actions/actions';
import { prisma } from './prisma';
import { bigIntToNumber } from './dateHelpers';

// =====================================================
// FUNCIONES MEMOIZADAS CON REACT CACHE
// =====================================================

/**
 * Versión memoizada de getCantidadEmpleadosActivos
 * Deduplica llamadas en el mismo render pass
 */
export const getCachedEmpleadosActivos = cache(async () => {
  return getCantidadEmpleadosActivos();
});

/**
 * Versión memoizada de getCantidadEmpleadosProblematicos (count)
 * Deduplica llamadas en el mismo render pass
 */
export const getCachedCantidadProblematicos = cache(async () => {
  return getCantidadEmpleadosProblematicos();
});

/**
 * Versión memoizada de getEstadisticasDiarias
 * Clave de cache incluye parámetros
 */
export const getCachedEstadisticasDiarias = cache(
  async (startDate: string, endDate: string) => {
    return getEstadisticasDiarias(startDate, endDate);
  },
);

/**
 * Versión memoizada de getPromedioHorasDiario
 */
export const getCachedPromedioHorasDiario = cache(
  async (startDate: string, endDate: string) => {
    return getPromedioHorasDiario(startDate, endDate);
  },
);

/**
 * Versión memoizada de getListaEmpleados
 * Datos estáticos que rara vez cambian
 */
export const getCachedListaEmpleados = cache(async () => {
  return getListaEmpleados();
});

/**
 * Versión memoizada de getMesesDisponibles
 */
export const getCachedMesesDisponibles = cache(async () => {
  return getMesesDisponibles();
});

/**
 * Versión memoizada de getAreasDisponibles
 */
export const getCachedAreasDisponibles = cache(async () => {
  return getAreasDisponibles();
});

/**
 * Versión memoizada de getEmpleadosProblematicos (lista completa)
 */
export const getCachedEmpleadosProblematicos = cache(async () => {
  return getEmpleadosProblematicos();
});

// =====================================================
// BATCH QUERIES - Consolidación de múltiples queries
// Con 'use cache' para cache persistente entre requests
// =====================================================

export interface DashboardStats {
  totalEmpleadosActivos: number;
  totalEmpleadosProblematicos: number;
}

/**
 * Query consolidada para estadísticas del dashboard
 * Reduce 2 roundtrips a 1 usando CTE
 * Usa 'use cache' para persistir entre requests + cache() para deduplicar en render
 *
 * Uso: Reemplazar llamadas separadas a getCantidadEmpleadosActivos
 * y getCantidadEmpleadosProblematicos por esta función única
 */
async function fetchDashboardStats(): Promise<DashboardStats> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'dashboard-stats');

  try {
    const result = await prisma.$queryRaw<
      Array<{
        total_activos: bigint;
        total_problematicos: bigint;
      }>
    >`
      WITH activos AS (
        SELECT COUNT(*) as total
        FROM huella.v_empleados_activos
      ),
      problematicos AS (
        SELECT COUNT(*) as total
        FROM huella.mv_empleados_problematicos
      )
      SELECT 
        (SELECT total FROM activos) as total_activos,
        (SELECT total FROM problematicos) as total_problematicos
    `;

    return {
      totalEmpleadosActivos: bigIntToNumber(
        result[0]?.total_activos ?? BigInt(0),
      ),
      totalEmpleadosProblematicos: bigIntToNumber(
        result[0]?.total_problematicos ?? BigInt(0),
      ),
    };
  } catch {
    // Fallback si la vista materializada no existe
    const result = await prisma.$queryRaw<
      Array<{
        total_activos: bigint;
        total_problematicos: bigint;
      }>
    >`
      WITH activos AS (
        SELECT COUNT(*) as total
        FROM huella.v_empleados_activos
      ),
      problematicos AS (
        SELECT COUNT(*) as total
        FROM huella.v_empleados_problematicos
      )
      SELECT 
        (SELECT total FROM activos) as total_activos,
        (SELECT total FROM problematicos) as total_problematicos
    `;

    return {
      totalEmpleadosActivos: bigIntToNumber(
        result[0]?.total_activos ?? BigInt(0),
      ),
      totalEmpleadosProblematicos: bigIntToNumber(
        result[0]?.total_problematicos ?? BigInt(0),
      ),
    };
  }
}

// Exportar con cache() de React para memoización intra-request
export const getDashboardStats = cache(fetchDashboardStats);

export interface DashboardChartData {
  estadisticas: Awaited<ReturnType<typeof getEstadisticasDiarias>>;
  promedioHoras: Awaited<ReturnType<typeof getPromedioHorasDiario>>;
}

/**
 * Query consolidada para datos de gráficos del dashboard
 * Ejecuta ambas queries en paralelo
 * Usa 'use cache' para persistir entre requests
 */
async function fetchDashboardChartData(
  startDate: string,
  endDate: string,
): Promise<DashboardChartData> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'dashboard-charts');

  const [estadisticas, promedioHoras] = await Promise.all([
    getEstadisticasDiarias(startDate, endDate),
    getPromedioHorasDiario(startDate, endDate),
  ]);

  return { estadisticas, promedioHoras };
}

// Exportar con cache() de React para memoización intra-request
export const getDashboardChartData = cache(fetchDashboardChartData);

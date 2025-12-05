'use server';

import { prisma } from '../../lib/prisma';
import {
  RelevamientoCocina,
  PersonalEscuela,
  ProblematicaEscuela,
  DistribucionProblematica,
} from '@dashboard/lib/escuelas-types';

/**
 * Obtiene los datos de relevamiento de cocina para una escuela
 * @param id_escuela ID de la escuela
 * @returns Lista de relevamientos de cocina
 */
export async function getRelevamientoCocina(
  id_escuela: number,
): Promise<RelevamientoCocina[]> {
  try {
    const relevamientos = await prisma.cocina.findMany({
      where: {
        id_escuela: id_escuela,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return relevamientos.map((r) => ({
      id_cocina: r.id_cocina,
      id_escuela: r.id_escuela,
      fecha: r.fecha,
      datos: r.datos as Record<string, any>,
    }));
  } catch (error) {
    console.error('Error al obtener relevamiento de cocina:', error);
    return [];
  }
}

import { unstable_cache } from 'next/cache';

export interface PersonalCocinaStats {
  escuelas_con_especialistas: number;
  escuelas_sin_especialistas: number;
  total: number;
}

export interface EscuelasComedorStats {
  porcentaje_con_comedor: number;
  total_escuelas: number;
}

/**
 * Obtiene estadísticas de personal de cocina desde la vista v_personal_cocina
 */
export const getPersonalCocinaStats = unstable_cache(
  async (): Promise<PersonalCocinaStats | null> => {
    try {
      const result = await prisma.$queryRaw<PersonalCocinaStats[]>`
        SELECT 
          escuelas_con_especialistas::integer, 
          escuelas_sin_especialistas::integer, 
          total::integer 
        FROM relevamiento.v_personal_cocina
      `;
      return result[0] || null;
    } catch (error) {
      console.error(
        'Error al obtener estadísticas de personal de cocina:',
        error,
      );
      return null;
    }
  },
  ['dashboard-personal-cocina-stats'],
  {
    revalidate: 3600, // 1 hora
    tags: ['dashboard-relevamiento'],
  },
);

/**
 * Obtiene estadísticas de comedores desde la vista v_escuelas_con_comedor
 */
export const getEscuelasComedorStats = unstable_cache(
  async (): Promise<EscuelasComedorStats | null> => {
    try {
      const result = await prisma.$queryRaw<EscuelasComedorStats[]>`
        SELECT 
          porcentaje_con_comedor::float, 
          total_escuelas::integer 
        FROM relevamiento.v_escuelas_con_comedor
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error al obtener estadísticas de comedores:', error);
      return null;
    }
  },
  ['dashboard-escuelas-comedor-stats'],
  {
    revalidate: 3600, // 1 hora
    tags: ['dashboard-relevamiento'],
  },
);

/**
 * Obtiene el personal no docente de una escuela
 */
export const getPersonalEscuela = unstable_cache(
  async (id_escuela: number): Promise<PersonalEscuela | null> => {
    try {
      const result = await prisma.$queryRaw<PersonalEscuela[]>`
        SELECT 
          id_escuela::integer,
          cue::integer,
          escuela,
          administrativos::integer,
          porteros::integer,
          total_personal_no_docente::integer
        FROM relevamiento.v_personal_escuela
        WHERE id_escuela = ${id_escuela}
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error al obtener personal de escuela:', error);
      return null;
    }
  },
  ['dashboard-personal-escuela'],
  {
    revalidate: 3600,
    tags: ['dashboard-relevamiento'],
  },
);

/**
 * Obtiene las problemáticas reportadas de una escuela
 */
export const getProblematicasEscuela = unstable_cache(
  async (id_escuela: number): Promise<ProblematicaEscuela | null> => {
    try {
      const result = await prisma.$queryRaw<ProblematicaEscuela[]>`
        SELECT 
          id_escuela::integer,
          cue::integer,
          escuela,
          zona,
          dimensiones_problematicas,
          cantidad_problematicas::integer
        FROM relevamiento.v_problematicas_escuela
        WHERE id_escuela = ${id_escuela}
      `;
      return result[0] || null;
    } catch (error) {
      console.error('Error al obtener problemáticas de escuela:', error);
      return null;
    }
  },
  ['dashboard-problematicas-escuela'],
  {
    revalidate: 3600,
    tags: ['dashboard-relevamiento'],
  },
);

/**
 * Obtiene la distribución global de problemáticas
 */
export const getDistribucionProblematicas = unstable_cache(
  async (): Promise<DistribucionProblematica[]> => {
    'use cache';
    try {
      const result = await prisma.$queryRaw<DistribucionProblematica[]>`
        SELECT 
          dimension,
          descripcion,
          escuelas_afectadas::integer,
          porcentaje_total::float
        FROM relevamiento.v_distribucion_problematicas
        ORDER BY escuelas_afectadas DESC
      `;
      return result;
    } catch (error) {
      console.error('Error al obtener distribución de problemáticas:', error);
      return [];
    }
  },
  ['dashboard-distribucion-problematicas'],
  {
    revalidate: 3600,
    tags: ['dashboard-relevamiento'],
  },
);

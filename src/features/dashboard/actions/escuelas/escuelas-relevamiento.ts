'use server';

import { prisma } from '../../lib/prisma';
import { RelevamientoCocina } from '@dashboard/lib/escuelas-types';

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

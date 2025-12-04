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


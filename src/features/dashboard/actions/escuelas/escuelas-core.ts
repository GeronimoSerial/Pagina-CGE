'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../../lib/prisma';
import {
  EscuelaCompleta,
  EstadisticasSistema,
  DistribucionZonaModalidad,
} from '../../lib/escuelas-types';
import { Prisma } from '@prisma/client';

// =====================================================
// CONSULTAS PRINCIPALES DE ESCUELAS
// =====================================================

/**
 * Obtiene todas las escuelas con datos completos
 */
export async function getEscuelasCompletas(): Promise<EscuelaCompleta[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'escuelas-completas');

  const result = await prisma.$queryRaw<
    Array<{
      id_escuela: number;
      cue: bigint;
      nombre: string;
      telefono: string | null;
      mail: string | null;
      fecha_fundacion: Date | null;
      anexo: string | null;
      modalidad: string | null;
      categoria: string | null;
      zona: string | null;
      zona_codigo: string | null;
      turno: string | null;
      servicio_comida: string | null;
      ambito: string | null;
      localidad: string | null;
      departamento: string | null;
      supervisor: string | null;
      id_supervisor: number | null;
      director: string | null;
      id_director: number | null;
      tiene_modalidad: boolean;
      tiene_categoria: boolean;
      tiene_zona: boolean;
      tiene_localidad: boolean;
      tiene_supervisor: boolean;
      created_at: Date | null;
      updated_at: Date | null;
    }>
  >`
    SELECT *
    FROM institucional.v_escuela_completa
    ORDER BY nombre
  `;

  return result.map((row) => ({
    id_escuela: row.id_escuela,
    cue: Number(row.cue),
    nombre: row.nombre,
    telefono: row.telefono,
    mail: row.mail,
    fecha_fundacion: row.fecha_fundacion?.toISOString().split('T')[0] ?? null,
    anexo: row.anexo,
    modalidad: row.modalidad,
    categoria: row.categoria,
    zona: row.zona,
    zona_codigo: row.zona_codigo,
    turno: row.turno,
    servicio_comida: row.servicio_comida,
    ambito: row.ambito,
    localidad: row.localidad,
    departamento: row.departamento,
    supervisor: row.supervisor,
    id_supervisor: row.id_supervisor,
    director: row.director,
    id_director: row.id_director,
    tiene_modalidad: row.tiene_modalidad,
    tiene_categoria: row.tiene_categoria,
    tiene_zona: row.tiene_zona,
    tiene_localidad: row.tiene_localidad,
    tiene_supervisor: row.tiene_supervisor,
    created_at: row.created_at?.toISOString() ?? null,
    updated_at: row.updated_at?.toISOString() ?? null,
  }));
}

/**
 * Obtiene una escuela por su ID con todos sus datos
 */
export async function getEscuelaById(
  id: number,
): Promise<EscuelaCompleta | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', `escuela-${id}`);

  const result = await prisma.$queryRaw<
    Array<{
      id_escuela: number;
      cue: bigint;
      nombre: string;
      telefono: string | null;
      mail: string | null;
      fecha_fundacion: Date | null;
      anexo: string | null;
      modalidad: string | null;
      categoria: string | null;
      zona: string | null;
      zona_codigo: string | null;
      turno: string | null;
      servicio_comida: string | null;
      ambito: string | null;
      localidad: string | null;
      departamento: string | null;
      supervisor: string | null;
      id_supervisor: number | null;
      director: string | null;
      id_director: number | null;
      tiene_modalidad: boolean;
      tiene_categoria: boolean;
      tiene_zona: boolean;
      tiene_localidad: boolean;
      tiene_supervisor: boolean;
      created_at: Date | null;
      updated_at: Date | null;
    }>
  >`
    SELECT *
    FROM institucional.v_escuela_completa
    WHERE id_escuela = ${id}
    LIMIT 1
  `;

  if (!result[0]) return null;

  const row = result[0];
  return {
    id_escuela: row.id_escuela,
    cue: Number(row.cue),
    nombre: row.nombre,
    telefono: row.telefono,
    mail: row.mail,
    fecha_fundacion: row.fecha_fundacion?.toISOString().split('T')[0] ?? null,
    anexo: row.anexo,
    modalidad: row.modalidad,
    categoria: row.categoria,
    zona: row.zona,
    zona_codigo: row.zona_codigo,
    turno: row.turno,
    servicio_comida: row.servicio_comida,
    ambito: row.ambito,
    localidad: row.localidad,
    departamento: row.departamento,
    supervisor: row.supervisor,
    id_supervisor: row.id_supervisor,
    director: row.director,
    id_director: row.id_director,
    tiene_modalidad: row.tiene_modalidad,
    tiene_categoria: row.tiene_categoria,
    tiene_zona: row.tiene_zona,
    tiene_localidad: row.tiene_localidad,
    tiene_supervisor: row.tiene_supervisor,
    created_at: row.created_at?.toISOString() ?? null,
    updated_at: row.updated_at?.toISOString() ?? null,
  };
}

/**
 * Obtiene estadísticas globales del sistema
 */
export async function getEstadisticasSistema(): Promise<EstadisticasSistema | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'estadisticas-sistema');

  const result = await prisma.$queryRaw<
    Array<{
      total_escuelas: bigint;
      escuelas_con_modalidad: bigint;
      escuelas_con_categoria: bigint;
      escuelas_con_zona: bigint;
      escuelas_con_turno: bigint;
      escuelas_con_supervisor: bigint;
      escuelas_sin_supervisor: bigint;
      total_supervisores: bigint;
      pct_con_modalidad: Prisma.Decimal;
      pct_con_supervisor: Prisma.Decimal;
      escuelas_pendientes: bigint;
      supervisiones_pendientes: bigint;
      ultima_actualizacion: Date;
    }>
  >`
    SELECT *
    FROM institucional.mv_estadisticas_sistema
    LIMIT 1
  `;

  if (!result[0]) return null;

  const row = result[0];
  return {
    total_escuelas: Number(row.total_escuelas),
    escuelas_con_modalidad: Number(row.escuelas_con_modalidad),
    escuelas_con_categoria: Number(row.escuelas_con_categoria),
    escuelas_con_zona: Number(row.escuelas_con_zona),
    escuelas_con_turno: Number(row.escuelas_con_turno),
    escuelas_con_supervisor: Number(row.escuelas_con_supervisor),
    escuelas_sin_supervisor: Number(row.escuelas_sin_supervisor),
    total_supervisores: Number(row.total_supervisores),
    pct_con_modalidad: row.pct_con_modalidad.toNumber(),
    pct_con_supervisor: row.pct_con_supervisor.toNumber(),
    escuelas_pendientes: Number(row.escuelas_pendientes),
    supervisiones_pendientes: Number(row.supervisiones_pendientes),
    ultima_actualizacion: row.ultima_actualizacion.toISOString(),
  };
}

/**
 * Obtiene la distribución de escuelas por zona y modalidad
 */
export async function getDistribucionZonaModalidad(): Promise<
  DistribucionZonaModalidad[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('escuelas', 'distribucion-zona-modalidad');

  const result = await prisma.$queryRaw<
    Array<{
      zona: string | null;
      zona_codigo: string | null;
      comun: bigint;
      especial: bigint;
      adultos: bigint;
      inicial: bigint;
      hospitalaria: bigint;
      contextos_encierro: bigint;
      sin_modalidad: bigint;
      total: bigint;
    }>
  >`
    SELECT *
    FROM institucional.v_distribucion_zona_modalidad
    ORDER BY zona_codigo
  `;

  return result.map((row) => ({
    zona: row.zona,
    zona_codigo: row.zona_codigo,
    comun: Number(row.comun),
    especial: Number(row.especial),
    adultos: Number(row.adultos),
    inicial: Number(row.inicial),
    hospitalaria: Number(row.hospitalaria),
    contextos_encierro: Number(row.contextos_encierro),
    sin_modalidad: Number(row.sin_modalidad),
    total: Number(row.total),
  }));
}

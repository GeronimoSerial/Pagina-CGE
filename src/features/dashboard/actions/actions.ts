'use server';
import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../lib/prisma';
import {
  AsistenciaDiaria,
  AusenteDiario,
  MarcacionIncompleta,
  AuditoriaOperacion,
  DiaSinActividad,
  DiaConMarca,
  EmpleadoActivo,
  EmpleadoDetalle,
  ResumenMensualEmpleado,
  EstadisticaDiaria,
  PromedioHorasDiario,
  ReporteLiquidacion,
  DetalleDiarioEmpleado,
  MesDisponible,
  Feriado,
  FeriadoCreate,
  ConfigJornada,
  EmpleadoConJornada,
  EmpleadoProblematico,
  ExcepcionAsistencia,
  ExcepcionCreate,
  WhitelistEmpleado,
  WhitelistCreate,
} from '@dashboard/lib/types';
import {
  bigIntToNumber,
  formatDateToISO,
  formatTimestampToString,
  parseStringToDate,
} from '../lib/dateHelpers';
import { Prisma } from '@prisma/client';

export async function getAsistenciaDiaria(
  startDate: string,
  endDate: string,
): Promise<AsistenciaDiaria[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'asistencia');
  // Prisma $queryRaw con template literals para parámetros seguros
  const result = await prisma.$queryRaw<
    Array<{
      legajo: string;
      nombre: string | null;
      dia: Date;
      entrada: Date | null;
      salida: Date | null;
      horas_trabajadas: Prisma.Decimal | null;
      total_marcas: bigint;
    }>
  >`
    SELECT
      legajo,
      nombre,
      dia,
      entrada,
      salida,
      horas_trabajadas,
      total_marcas
    FROM huella.v_asistencia_diaria
    WHERE dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia DESC, nombre
  `;

  return result.map((row) => ({
    legajo: row.legajo || '',
    nombre: row.nombre || '',
    dia: formatDateToISO(row.dia)!,
    entrada: formatTimestampToString(row.entrada),
    salida: formatTimestampToString(row.salida),
    horas_trabajadas: row.horas_trabajadas
      ? row.horas_trabajadas.toNumber()
      : null,
    total_marcas: bigIntToNumber(row.total_marcas),
  }));
}

export async function getAusentesDiarios(
  startDate: string,
  endDate: string,
): Promise<AusenteDiario[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'ausentes');
  const result = await prisma.$queryRaw<AusenteDiario[]>`
    SELECT
      legajo::int,
      nombre,
      dia::text
    FROM huella.v_ausentes_diarios
    WHERE dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia DESC, nombre
  `;
  return result;
}

export async function getMarcacionesIncompletas(
  startDate: string,
  endDate: string,
): Promise<MarcacionIncompleta[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'marcaciones-incompletas');
  const result = await prisma.$queryRaw<MarcacionIncompleta[]>`
    SELECT
      legajo::int,
      nombre,
      dia::text,
      entradas::int,
      salidas::int
    FROM huella.v_marcaciones_incompletas
    WHERE dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia DESC, nombre
  `;
  return result;
}

export async function getAuditoriaOperaciones(
  startDate: string,
  endDate: string,
): Promise<AuditoriaOperacion[]> {
  const result = await prisma.$queryRaw<AuditoriaOperacion[]>`
    SELECT
      id::int,
      fecha::text,
      hora::text,
      tipo,
      detalle,
      empleado,
      operado_por
    FROM huella.v_auditoria_operaciones
    WHERE fecha BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY fecha DESC, hora DESC
  `;
  return result;
}

export async function getDiasSinActividad(
  startDate: string,
  endDate: string,
): Promise<DiaSinActividad[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'dias-sin-actividad');
  const result = await prisma.$queryRaw<DiaSinActividad[]>`
    SELECT dia::text
    FROM huella.v_dias_sin_actividad
    WHERE dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia
  `;
  return result;
}

export async function getDiasConMarcaMes(mes: string): Promise<number> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'dias-con-marca');
  const result = await prisma.$queryRaw<[{ total: bigint }]>`
    SELECT COUNT(*) as total
    FROM huella.v_dias_con_marca
    WHERE DATE_TRUNC('month', dia) = ${mes}::date
  `;
  return bigIntToNumber(result[0]?.total ?? BigInt(0));
}

export async function getDiasConMarca(
  startDate: string,
  endDate: string,
): Promise<DiaConMarca[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'dias-con-marca');
  const result = await prisma.$queryRaw<Array<{ dia: string }>>`
      SELECT dia::text
      FROM huella.v_dias_con_marca
      WHERE dia BETWEEN ${startDate} AND ${endDate}
      ORDER BY dia;
  `;
  return result.map((r: any) => ({ dia: r.dia }));
}

export async function getEmpleadosActivos(): Promise<EmpleadoActivo[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('empleados', 'empleados-activos');
  const result = await prisma.$queryRaw<EmpleadoActivo[]>`
      SELECT legajo
      FROM huella.v_empleados_activos
      ORDER BY legajo;
    `;
  return result;
}

export async function getCantidadEmpleadosActivos(): Promise<number> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'empleados-activos');
  const result = await prisma.$queryRaw<{ total: bigint }[]>`
    SELECT COUNT(*) as total
    FROM huella.v_empleados_activos
  `;
  return bigIntToNumber(result[0]?.total ?? BigInt(0));
}

export async function getCantidadEmpleadosProblematicos(): Promise<number> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'empleados-problematicos');
  // Usa vista materializada si existe, fallback a vista normal
  const result = await prisma.$queryRaw<{ total: bigint }[]>`
    SELECT COUNT(*) as total
    FROM huella.mv_empleados_problematicos
  `.catch(
    () =>
      prisma.$queryRaw<{ total: bigint }[]>`
      SELECT COUNT(*) as total
      FROM huella.v_empleados_problematicos
    `,
  );
  return bigIntToNumber(result[0]?.total ?? BigInt(0));
}

export async function getEmpleadoDetalle(
  legajo: string,
): Promise<EmpleadoDetalle | null> {
  const result = await prisma.$queryRaw<Array<EmpleadoDetalle>>`
      SELECT legajo, nombre, area, turno, estado,
             fecha_ingreso::text as fechaingreso, dni, email, inactivo
      FROM huella.v_empleado_detalle
      WHERE legajo = ${legajo}
      LIMIT 1;
    `;
  if (result.length === 0) return null;
  return result[0];
}

export async function getAsistenciaPorEmpleado(
  legajo: number,
  startDate: string,
  endDate: string,
): Promise<AsistenciaDiaria[]> {
  const result = await prisma.$queryRaw<
    Array<{
      legajo: number;
      nombre: string;
      dia: string;
      entrada: string | null;
      salida: string | null;
      horas_trabajadas: Prisma.Decimal | null;
      total_marcas: number;
    }>
  >`
    SELECT
      legajo::int,
      nombre,
      to_char(dia, 'YYYY-MM-DD') as dia,
      entrada::text,
      salida::text,
      horas_trabajadas,
      total_marcas::int
    FROM huella.v_asistencia_diaria
    WHERE legajo = ${String(legajo)}
      AND dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia DESC
  `;

  return result.map((row) => ({
    legajo: String(row.legajo),
    nombre: row.nombre,
    dia: row.dia,
    entrada: row.entrada,
    salida: row.salida,
    horas_trabajadas: row.horas_trabajadas
      ? row.horas_trabajadas.toNumber()
      : null,
    total_marcas: row.total_marcas,
  }));
}

export async function getAusentesPorEmpleado(
  legajo: number,
  startDate: string,
  endDate: string,
): Promise<AusenteDiario[]> {
  const result = await prisma.$queryRaw<AusenteDiario[]>`
    SELECT
      legajo::int,
      nombre,
      to_char(dia, 'YYYY-MM-DD') as dia
    FROM huella.v_ausentes_diarios
    WHERE legajo = ${String(legajo)}
      AND dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia DESC
  `;
  return result;
}

export async function getResumenMensualEmpleado(
  legajo: number,
  mes: string,
): Promise<ResumenMensualEmpleado | null> {
  const result = await prisma.$queryRaw<
    Array<{
      legajo: number;
      nombre: string;
      mes: string;
      dias_trabajados: number;
      total_horas: Prisma.Decimal | null;
      promedio_horas_dia: Prisma.Decimal | null;
      total_marcas: number;
    }>
  >`
    SELECT
      legajo::int,
      nombre,
      mes::text,
      dias_trabajados::int,
      total_horas,
      promedio_horas_dia,
      total_marcas::int
    FROM huella.v_resumen_mensual_empleado
    WHERE legajo = ${String(legajo)} AND mes = ${mes}::date
    LIMIT 1
  `;

  if (!result[0]) return null;

  const row = result[0];
  return {
    legajo: row.legajo,
    nombre: row.nombre,
    mes: row.mes,
    dias_trabajados: row.dias_trabajados,
    total_horas: row.total_horas ? row.total_horas.toNumber() : null,
    promedio_horas_dia: row.promedio_horas_dia
      ? row.promedio_horas_dia.toNumber()
      : null,
    total_marcas: row.total_marcas,
  };
}

export async function getEstadisticasDiarias(
  startDate: string,
  endDate: string,
): Promise<EstadisticaDiaria[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'estadisticas');
  // Usa vista materializada si existe, fallback a vista normal
  const result = await prisma.$queryRaw<EstadisticaDiaria[]>`
    SELECT
      dia::text,
      presentes::int,
      ausentes::int
    FROM huella.mv_estadisticas_diarias
    WHERE dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia
  `.catch(
    () =>
      prisma.$queryRaw<EstadisticaDiaria[]>`
      SELECT
        dia::text,
        presentes::int,
        ausentes::int
      FROM huella.v_estadisticas_diarias
      WHERE dia BETWEEN ${startDate}::date AND ${endDate}::date
      ORDER BY dia
    `,
  );
  return result;
}

export async function getPromedioHorasDiario(
  startDate: string,
  endDate: string,
): Promise<PromedioHorasDiario[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'promedio-horas');
  const result = await prisma.$queryRaw<
    Array<{
      dia: string;
      promedio_horas: Prisma.Decimal;
      empleados_con_registro: number;
    }>
  >`
    SELECT
      dia::text,
      promedio_horas,
      empleados_con_registro::int
    FROM huella.v_promedio_horas_diario
    WHERE dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia
  `;

  return result.map((row) => ({
    dia: row.dia,
    promedio_horas: row.promedio_horas.toNumber(),
    empleados_con_registro: row.empleados_con_registro,
  }));
}

export async function getListaEmpleados(): Promise<
  { legajo: string; nombre: string }[]
> {
  'use cache';
  cacheLife('max');
  cacheTag('empleados', 'lista-empleados');

  const result = await prisma.$queryRaw<{ legajo: string; nombre: string }[]>`
    SELECT DISTINCT l.cod as legajo, l.nombre
    FROM huella.legajo l
    INNER JOIN huella.v_empleados_activos ea ON ea.legajo = l.cod
    WHERE COALESCE(l.inactivo, FALSE) = FALSE
    ORDER BY l.nombre
  `;
  return result;
}

// =====================================================
// ACCIONES PARA REPORTES Y LIQUIDACIONES
// =====================================================

export async function getMesesDisponibles(): Promise<MesDisponible[]> {
  'use cache';
  cacheLife('max');
  cacheTag('reportes', 'meses-disponibles');
  const result = await prisma.$queryRaw<MesDisponible[]>`
    SELECT
      to_char(mes, 'YYYY-MM-DD') as mes,
      mes_nombre
    FROM huella.v_meses_disponibles
    ORDER BY mes DESC
    LIMIT 24
  `;
  return result;
}
export async function getReporteLiquidacion(
  mes: string,
): Promise<ReporteLiquidacion[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('reportes', 'liquidacion');
  const result = await prisma.$queryRaw<
    Array<{
      legajo: string;
      nombre: string;
      area: string | null;
      turno: string | null;
      dni: string | null;
      mes: string;
      dias_trabajados: number;
      total_horas: Prisma.Decimal;
      promedio_horas_dia: Prisma.Decimal;
      dias_ausente: number;
      dias_incompletos: number;
      primer_dia_trabajado: string | null;
      ultimo_dia_trabajado: string | null;
      fecha_ingreso: string | null;
      estado: string | null;
      categoria_horas: string;
      horas_jornada: number;
      horas_esperadas: number;
      porcentaje_cumplimiento: Prisma.Decimal;
    }>
  >`
    SELECT
      legajo,
      nombre,
      area,
      turno,
      dni,
      to_char(mes, 'YYYY-MM-DD') as mes,
      dias_trabajados::int,
      COALESCE(total_horas, 0) as total_horas,
      COALESCE(promedio_horas_dia, 0) as promedio_horas_dia,
      dias_ausente::int,
      dias_incompletos::int,
      to_char(primer_dia_trabajado, 'YYYY-MM-DD') as primer_dia_trabajado,
      to_char(ultimo_dia_trabajado, 'YYYY-MM-DD') as ultimo_dia_trabajado,
      to_char(fecha_ingreso, 'YYYY-MM-DD') as fecha_ingreso,
      estado,
      categoria_horas,
      horas_jornada::int,
      horas_esperadas::int,
      porcentaje_cumplimiento
    FROM huella.v_reporte_liquidacion
    WHERE mes = ${mes}::date
    ORDER BY nombre
  `;

  return result.map((row) => ({
    legajo: row.legajo,
    nombre: row.nombre,
    area: row.area,
    turno: row.turno,
    dni: row.dni,
    mes: row.mes,
    dias_trabajados: row.dias_trabajados,
    total_horas: row.total_horas.toNumber(),
    promedio_horas_dia: row.promedio_horas_dia.toNumber(),
    dias_ausente: row.dias_ausente,
    dias_incompletos: row.dias_incompletos,
    primer_dia_trabajado: row.primer_dia_trabajado,
    ultimo_dia_trabajado: row.ultimo_dia_trabajado,
    fecha_ingreso: row.fecha_ingreso,
    estado: row.estado,
    categoria_horas: row.categoria_horas,
    horas_jornada: row.horas_jornada,
    horas_esperadas: row.horas_esperadas,
    porcentaje_cumplimiento: row.porcentaje_cumplimiento.toNumber(),
  }));
}

export async function getDetalleDiarioEmpleado(
  legajo: string,
  startDate: string,
  endDate: string,
): Promise<DetalleDiarioEmpleado[]> {
  const result = await prisma.$queryRaw<
    Array<{
      legajo: string;
      nombre: string;
      area: string | null;
      turno: string | null;
      dia: string;
      dia_semana: string;
      entrada: string | null;
      salida: string | null;
      horas_trabajadas: Prisma.Decimal;
      total_marcas: number;
      tipo_jornada: string;
    }>
  >`
    SELECT
      legajo,
      nombre,
      area,
      turno,
      to_char(dia, 'YYYY-MM-DD') as dia,
      trim(dia_semana) as dia_semana,
      to_char(entrada, 'HH24:MI:SS') as entrada,
      to_char(salida, 'HH24:MI:SS') as salida,
      COALESCE(horas_trabajadas, 0) as horas_trabajadas,
      total_marcas::int,
      tipo_jornada
    FROM huella.v_detalle_diario_empleado
    WHERE legajo = ${legajo}
      AND dia BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY dia
  `;

  return result.map((row) => ({
    legajo: row.legajo,
    nombre: row.nombre,
    area: row.area,
    turno: row.turno,
    dia: row.dia,
    dia_semana: row.dia_semana,
    entrada: row.entrada,
    salida: row.salida,
    horas_trabajadas: row.horas_trabajadas.toNumber(),
    total_marcas: row.total_marcas,
    tipo_jornada: row.tipo_jornada,
  }));
}

export async function getAreasDisponibles(): Promise<string[]> {
  'use cache';
  cacheLife('max');
  cacheTag('empleados', 'areas');
  const result = await prisma.$queryRaw<{ area: string }[]>`
    SELECT DISTINCT area
    FROM huella.legajo
    WHERE area IS NOT NULL AND area != ''
    ORDER BY area
  `;
  return result.map((r: any) => r.area);
}
// =====================================================
// ACCIONES PARA FERIADOS
// =====================================================

export async function getFeriados(anio?: number): Promise<Feriado[]> {
  const result = anio
    ? await prisma.$queryRaw<Feriado[]>`
        SELECT
          id,
          to_char(fecha, 'YYYY-MM-DD') as fecha,
          descripcion,
          tipo,
          trim(dia_semana) as dia_semana,
          anio::int
        FROM huella.v_feriados
        WHERE anio = ${anio}
        ORDER BY fecha DESC
      `
    : await prisma.$queryRaw<Feriado[]>`
        SELECT
          id,
          to_char(fecha, 'YYYY-MM-DD') as fecha,
          descripcion,
          tipo,
          trim(dia_semana) as dia_semana,
          anio::int
        FROM huella.v_feriados
        ORDER BY fecha DESC
      `;
  return result;
}

export async function createFeriado(feriado: FeriadoCreate): Promise<Feriado> {
  const created = await prisma.feriados.create({
    data: {
      fecha: parseStringToDate(feriado.fecha),
      descripcion: feriado.descripcion,
      tipo: feriado.tipo,
    },
  });

  return {
    id: created.id,
    fecha: formatDateToISO(created.fecha)!,
    descripcion: created.descripcion,
    tipo: created.tipo ?? 'nacional',
  };
}

export async function updateFeriado(
  id: number,
  feriado: FeriadoCreate,
): Promise<Feriado> {
  const updated = await prisma.feriados.update({
    where: { id },
    data: {
      fecha: parseStringToDate(feriado.fecha),
      descripcion: feriado.descripcion,
      tipo: feriado.tipo,
    },
  });

  return {
    id: updated.id,
    fecha: formatDateToISO(updated.fecha)!,
    descripcion: updated.descripcion,
    tipo: updated.tipo ?? 'nacional',
  };
}

export async function deleteFeriado(id: number): Promise<void> {
  await prisma.feriados.delete({ where: { id } });
}

export async function getAniosFeriados(): Promise<number[]> {
  const result = await prisma.$queryRaw<{ anio: number }[]>`
    SELECT DISTINCT EXTRACT(YEAR FROM fecha)::int AS anio
    FROM huella.feriados
    ORDER BY anio DESC
  `;
  return result.map((r: any) => r.anio);
}

// =====================================================
// ACCIONES PARA CONFIGURACIÓN DE JORNADA
// =====================================================

export async function getEmpleadosConJornada(): Promise<EmpleadoConJornada[]> {
  const result = await prisma.$queryRaw<EmpleadoConJornada[]>`
    SELECT
      legajo,
      nombre,
      area,
      turno,
      dni,
      estado,
      inactivo,
      horas_jornada::int,
      tipo_jornada,
      to_char(vigente_desde, 'YYYY-MM-DD') as vigente_desde,
      en_whitelist
    FROM huella.v_empleados_con_jornada
    ORDER BY nombre
  `;
  return result;
}

export async function getConfigJornada(
  legajo: string,
): Promise<ConfigJornada | null> {
  const config = await prisma.config_jornada.findUnique({
    where: { legajo },
  });

  if (!config) return null;

  return {
    id: config.id,
    legajo: config.legajo,
    horas_jornada: config.horas_jornada as 4 | 6 | 8,
    descripcion: config.descripcion ?? undefined,
    vigente_desde: formatDateToISO(config.vigente_desde) ?? undefined,
  };
}

export async function upsertConfigJornada(
  config: ConfigJornada,
): Promise<ConfigJornada> {
  const descripcion =
    config.horas_jornada === 4
      ? 'Media jornada'
      : config.horas_jornada === 6
        ? 'Jornada reducida'
        : 'Jornada completa';

  const result = await prisma.config_jornada.upsert({
    where: { legajo: config.legajo },
    create: {
      legajo: config.legajo,
      horas_jornada: config.horas_jornada,
      descripcion,
      vigente_desde: config.vigente_desde
        ? parseStringToDate(config.vigente_desde)
        : new Date(),
    },
    update: {
      horas_jornada: config.horas_jornada,
      descripcion,
      vigente_desde: config.vigente_desde
        ? parseStringToDate(config.vigente_desde)
        : undefined,
    },
  });

  return {
    id: result.id,
    legajo: result.legajo,
    horas_jornada: result.horas_jornada as 4 | 6 | 8,
    descripcion: result.descripcion ?? undefined,
    vigente_desde: formatDateToISO(result.vigente_desde) ?? undefined,
  };
}

export async function updateMultipleJornadas(
  configs: { legajo: string; horas_jornada: 4 | 6 | 8 }[],
): Promise<void> {
  await prisma.$transaction(
    configs.map((config) => {
      const descripcion =
        config.horas_jornada === 4
          ? 'Media jornada'
          : config.horas_jornada === 6
            ? 'Jornada reducida'
            : 'Jornada completa';

      return prisma.config_jornada.upsert({
        where: { legajo: config.legajo },
        create: {
          legajo: config.legajo,
          horas_jornada: config.horas_jornada,
          descripcion,
        },
        update: {
          horas_jornada: config.horas_jornada,
          descripcion,
        },
      });
    }),
  );
}

export async function deleteConfigJornada(legajo: string): Promise<void> {
  await prisma.config_jornada.delete({ where: { legajo } });
}

// =====================================================
// ACCIONES PARA EMPLEADOS PROBLEMÁTICOS
// =====================================================

export async function getEmpleadosProblematicos(): Promise<
  EmpleadoProblematico[]
> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'empleados-problematicos');
  // Usa vista materializada si existe, fallback a vista normal
  const result = await prisma.$queryRaw<
    Array<{
      legajo: string;
      nombre: string;
      area: string | null;
      turno: string | null;
      dni: string | null;
      horas_jornada: number;
      total_ausencias: number;
      dias_trabajados: number;
      total_horas: Prisma.Decimal;
      dias_incompletos: number;
      total_dias_habiles: number;
      horas_esperadas: number;
      porcentaje_cumplimiento: Prisma.Decimal;
      problema_ausencias: boolean;
      problema_cumplimiento: boolean;
      problema_incompletos: boolean;
      score_severidad: Prisma.Decimal;
      cantidad_problemas: number;
    }>
  >`
    SELECT
      legajo,
      nombre,
      area,
      turno,
      dni,
      horas_jornada::int,
      total_ausencias::int,
      dias_trabajados::int,
      COALESCE(total_horas, 0) as total_horas,
      dias_incompletos::int,
      total_dias_habiles::int,
      horas_esperadas::int,
      COALESCE(porcentaje_cumplimiento, 0) as porcentaje_cumplimiento,
      problema_ausencias,
      problema_cumplimiento,
      problema_incompletos,
      COALESCE(score_severidad, 0) as score_severidad,
      cantidad_problemas::int
    FROM huella.mv_empleados_problematicos
    ORDER BY score_severidad DESC, cantidad_problemas DESC, nombre
  `.catch(
    () =>
      prisma.$queryRaw<
        Array<{
          legajo: string;
          nombre: string;
          area: string | null;
          turno: string | null;
          dni: string | null;
          horas_jornada: number;
          total_ausencias: number;
          dias_trabajados: number;
          total_horas: Prisma.Decimal;
          dias_incompletos: number;
          total_dias_habiles: number;
          horas_esperadas: number;
          porcentaje_cumplimiento: Prisma.Decimal;
          problema_ausencias: boolean;
          problema_cumplimiento: boolean;
          problema_incompletos: boolean;
          score_severidad: Prisma.Decimal;
          cantidad_problemas: number;
        }>
      >`
      SELECT
        legajo,
        nombre,
        area,
        turno,
        dni,
        horas_jornada::int,
        total_ausencias::int,
        dias_trabajados::int,
        COALESCE(total_horas, 0) as total_horas,
        dias_incompletos::int,
        total_dias_habiles::int,
        horas_esperadas::int,
        COALESCE(porcentaje_cumplimiento, 0) as porcentaje_cumplimiento,
        problema_ausencias,
        problema_cumplimiento,
        problema_incompletos,
        COALESCE(score_severidad, 0) as score_severidad,
        cantidad_problemas::int
      FROM huella.v_empleados_problematicos
      ORDER BY score_severidad DESC, cantidad_problemas DESC, nombre
    `,
  );

  return result.map((row) => ({
    legajo: row.legajo,
    nombre: row.nombre,
    area: row.area,
    turno: row.turno,
    dni: row.dni,
    horas_jornada: row.horas_jornada,
    total_ausencias: row.total_ausencias,
    dias_trabajados: row.dias_trabajados,
    total_horas: row.total_horas.toNumber(),
    dias_incompletos: row.dias_incompletos,
    total_dias_habiles: row.total_dias_habiles,
    horas_esperadas: row.horas_esperadas,
    porcentaje_cumplimiento: row.porcentaje_cumplimiento.toNumber(),
    problema_ausencias: row.problema_ausencias,
    problema_cumplimiento: row.problema_cumplimiento,
    problema_incompletos: row.problema_incompletos,
    score_severidad: row.score_severidad.toNumber(),
    cantidad_problemas: row.cantidad_problemas,
  }));
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

async function getCurrentUserEmail(): Promise<string> {
  return 'sistema';
}

// =====================================================
// ACCIONES PARA EXCEPCIONES DE ASISTENCIA
// =====================================================

export async function getExcepciones(
  legajo?: string,
): Promise<ExcepcionAsistencia[]> {
  const result = legajo
    ? await prisma.$queryRaw<ExcepcionAsistencia[]>`
        SELECT
          id,
          legajo,
          nombre,
          area,
          to_char(fecha_inicio, 'YYYY-MM-DD') as fecha_inicio,
          to_char(fecha_fin, 'YYYY-MM-DD') as fecha_fin,
          tipo,
          descripcion,
          created_by,
          to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
          to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
          dias_excepcion::int
        FROM huella.v_excepciones_asistencia
        WHERE legajo = ${legajo}
        ORDER BY fecha_inicio DESC
      `
    : await prisma.$queryRaw<ExcepcionAsistencia[]>`
        SELECT
          id,
          legajo,
          nombre,
          area,
          to_char(fecha_inicio, 'YYYY-MM-DD') as fecha_inicio,
          to_char(fecha_fin, 'YYYY-MM-DD') as fecha_fin,
          tipo,
          descripcion,
          created_by,
          to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
          to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
          dias_excepcion::int
        FROM huella.v_excepciones_asistencia
        ORDER BY fecha_inicio DESC
      `;
  return result;
}

export async function getExcepcionesVigentes(): Promise<ExcepcionAsistencia[]> {
  const result = await prisma.$queryRaw<ExcepcionAsistencia[]>`
    SELECT
      id,
      legajo,
      nombre,
      area,
      to_char(fecha_inicio, 'YYYY-MM-DD') as fecha_inicio,
      to_char(fecha_fin, 'YYYY-MM-DD') as fecha_fin,
      tipo,
      descripcion,
      created_by,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
      to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
      dias_excepcion::int
    FROM huella.v_excepciones_asistencia
    WHERE CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin
    ORDER BY fecha_fin DESC, nombre
  `;
  return result;
}

export async function createExcepcion(
  excepcion: ExcepcionCreate,
  createdBy: string,
): Promise<ExcepcionAsistencia> {
  const created = await prisma.excepciones_asistencia.create({
    data: {
      legajo: excepcion.legajo,
      fecha_inicio: parseStringToDate(excepcion.fecha_inicio),
      fecha_fin: parseStringToDate(excepcion.fecha_fin),
      tipo: excepcion.tipo,
      descripcion: excepcion.descripcion ?? null,
      created_by: createdBy,
    },
    include: {
      legajo_excepciones_asistencia_legajoTolegajo: true,
    },
  });

  return {
    id: created.id,
    legajo: created.legajo,
    nombre: created.legajo_excepciones_asistencia_legajoTolegajo.nombre,
    area: created.legajo_excepciones_asistencia_legajoTolegajo.area,
    fecha_inicio: formatDateToISO(created.fecha_inicio)!,
    fecha_fin: formatDateToISO(created.fecha_fin)!,
    tipo: created.tipo as ExcepcionAsistencia['tipo'],
    descripcion: created.descripcion,
    created_by: created.created_by,
    created_at: created.created_at?.toISOString() ?? '',
    updated_at: created.updated_at?.toISOString() ?? '',
    dias_excepcion:
      Math.ceil(
        (created.fecha_fin.getTime() - created.fecha_inicio.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1,
  };
}

export async function updateExcepcion(
  id: number,
  excepcion: ExcepcionCreate,
): Promise<ExcepcionAsistencia> {
  const updated = await prisma.excepciones_asistencia.update({
    where: { id },
    data: {
      legajo: excepcion.legajo,
      fecha_inicio: parseStringToDate(excepcion.fecha_inicio),
      fecha_fin: parseStringToDate(excepcion.fecha_fin),
      tipo: excepcion.tipo,
      descripcion: excepcion.descripcion ?? null,
    },
    include: {
      legajo_excepciones_asistencia_legajoTolegajo: true,
    },
  });

  return {
    id: updated.id,
    legajo: updated.legajo,
    nombre: updated.legajo_excepciones_asistencia_legajoTolegajo.nombre,
    area: updated.legajo_excepciones_asistencia_legajoTolegajo.area,
    fecha_inicio: formatDateToISO(updated.fecha_inicio)!,
    fecha_fin: formatDateToISO(updated.fecha_fin)!,
    tipo: updated.tipo as ExcepcionAsistencia['tipo'],
    descripcion: updated.descripcion,
    created_by: updated.created_by,
    created_at: updated.created_at?.toISOString() ?? '',
    updated_at: updated.updated_at?.toISOString() ?? '',
    dias_excepcion:
      Math.ceil(
        (updated.fecha_fin.getTime() - updated.fecha_inicio.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1,
  };
}

export async function deleteExcepcion(id: number): Promise<void> {
  await prisma.excepciones_asistencia.delete({ where: { id } });
}

// =====================================================
// ACCIONES PARA WHITELIST DE EMPLEADOS
// =====================================================

export async function getWhitelist(): Promise<WhitelistEmpleado[]> {
  const result = await prisma.$queryRaw<WhitelistEmpleado[]>`
    SELECT
      id,
      legajo,
      nombre,
      area,
      turno,
      motivo,
      created_by,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
      activo
    FROM huella.v_whitelist_empleados
    ORDER BY activo DESC, nombre
  `;
  return result;
}

export async function getWhitelistActiva(): Promise<WhitelistEmpleado[]> {
  const result = await prisma.$queryRaw<WhitelistEmpleado[]>`
    SELECT
      id,
      legajo,
      nombre,
      area,
      turno,
      motivo,
      created_by,
      to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
      activo
    FROM huella.v_whitelist_empleados
    WHERE activo = TRUE
    ORDER BY nombre
  `;
  return result;
}

export async function addToWhitelist(
  data: WhitelistCreate,
  createdBy: string,
): Promise<WhitelistEmpleado> {
  const created = await prisma.whitelist_empleados.create({
    data: {
      legajo: data.legajo,
      motivo: data.motivo,
      created_by: createdBy,
    },
    include: {
      legajo_whitelist_empleados_legajoTolegajo: true,
    },
  });

  return {
    id: created.id,
    legajo: created.legajo,
    nombre: created.legajo_whitelist_empleados_legajoTolegajo.nombre,
    area: created.legajo_whitelist_empleados_legajoTolegajo.area,
    turno: created.legajo_whitelist_empleados_legajoTolegajo.turno,
    motivo: created.motivo,
    created_by: created.created_by,
    created_at: created.created_at?.toISOString() ?? '',
    activo: created.activo ?? true,
  };
}

export async function updateWhitelist(
  id: number,
  data: WhitelistCreate,
): Promise<WhitelistEmpleado> {
  const updated = await prisma.whitelist_empleados.update({
    where: { id },
    data: { motivo: data.motivo },
    include: {
      legajo_whitelist_empleados_legajoTolegajo: true,
    },
  });

  return {
    id: updated.id,
    legajo: updated.legajo,
    nombre: updated.legajo_whitelist_empleados_legajoTolegajo.nombre,
    area: updated.legajo_whitelist_empleados_legajoTolegajo.area,
    turno: updated.legajo_whitelist_empleados_legajoTolegajo.turno,
    motivo: updated.motivo,
    created_by: updated.created_by,
    created_at: updated.created_at?.toISOString() ?? '',
    activo: updated.activo ?? true,
  };
}

export async function toggleWhitelistStatus(
  id: number,
  activo: boolean,
): Promise<void> {
  await prisma.whitelist_empleados.update({
    where: { id },
    data: { activo },
  });
}

export async function removeFromWhitelist(id: number): Promise<void> {
  await prisma.whitelist_empleados.delete({ where: { id } });
}

export async function isEmpleadoInWhitelist(legajo: string): Promise<boolean> {
  const count = await prisma.whitelist_empleados.count({
    where: {
      legajo,
      activo: true,
    },
  });
  return count > 0;
}

export interface AlertsSummary {
  absentes: number;
  incompletas: number;
  problematicos: number;
}

export async function getAlertsSummary(): Promise<AlertsSummary> {
  'use cache';
  cacheLife('hours');
  cacheTag('dashboard', 'alerts');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDateToISO(today)!;

  // Obtener ausentes de hoy
  const ausentes = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count
    FROM huella.v_ausentes_diarios
    WHERE dia = ${todayStr}::date
  `;

  // Obtener marcaciones incompletas de hoy
  const incompletas = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count
    FROM huella.v_marcaciones_incompletas
    WHERE dia = ${todayStr}::date
  `;

  // Obtener empleados problemáticos (vista ya contiene los últimos 30 días)
  const problematicos = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count
    FROM huella.v_empleados_problematicos
    WHERE problema_ausencias = true 
       OR problema_cumplimiento = true 
       OR problema_incompletos = true
  `;

  return {
    absentes: Number(ausentes[0]?.count ?? 0),
    incompletas: Number(incompletas[0]?.count ?? 0),
    problematicos: Number(problematicos[0]?.count ?? 0),
  };
}

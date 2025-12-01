"use server";

import pool from "../lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  AsistenciaDiaria,
  AusenteDiario,
  MarcacionIncompleta,
  AuditoriaOperacion,
  DiaSinActividad,
  MarcacionUnificada,
  MarcacionDiaria,
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
} from "@dashboard/lib/types";

export async function getAsistenciaDiaria(
  startDate: string,
  endDate: string
): Promise<AsistenciaDiaria[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, dia::text, entrada::text, salida::text, horas_trabajadas, total_marcas
      FROM huella.v_asistencia_diaria
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia DESC, nombre;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAusentesDiarios(
  startDate: string,
  endDate: string
): Promise<AusenteDiario[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, dia::text
      FROM huella.v_ausentes_diarios
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia DESC, nombre;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getMarcacionesIncompletas(
  startDate: string,
  endDate: string
): Promise<MarcacionIncompleta[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, dia::text, entradas, salidas
      FROM huella.v_marcaciones_incompletas
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia DESC, nombre;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAuditoriaOperaciones(
  startDate: string,
  endDate: string
): Promise<AuditoriaOperacion[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, fecha::text, hora::text, tipo, detalle, empleado, operado_por
      FROM huella.v_auditoria_operaciones
      WHERE fecha BETWEEN $1 AND $2
      ORDER BY fecha DESC, hora DESC;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getDiasSinActividad(
  startDate: string,
  endDate: string
): Promise<DiaSinActividad[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT dia::text
      FROM huella.v_dias_sin_actividad
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getMarcacionesUnificadas(
  startDate: string,
  endDate: string
): Promise<MarcacionUnificada[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, legajo, ts::text, tipo, sensor, origen, duplicado
      FROM huella.v_marcaciones_unificadas
      WHERE ts >= $1::timestamp AND ts <= $2::timestamp + interval '1 day'
      ORDER BY ts DESC
      LIMIT 1000; 
    `;
    // Note: v_marcaciones_unificadas uses 'ts' (timestamp), not 'dia'.
    // Also adding a LIMIT to avoid fetching too much data for raw markings.
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getMarcacionesDiarias(
  startDate: string,
  endDate: string
): Promise<MarcacionDiaria[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo,
             nombre,
             dia::text,
             primera_marca::text,
             ultima_marca::text,
             total_marcas
      FROM huella.v_marcaciones_diarias
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia DESC, nombre;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getDiasConMarcaMes(mes: string): Promise<number> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT COUNT(*) as total
      FROM huella.v_dias_con_marca
      WHERE DATE_TRUNC('month', dia) = $1::date;
    `;
    const result = await client.query(query, [mes]);
    return Number(result.rows[0]?.total || 0);
  } finally {
    client.release();
  }
}

export async function getDiasConMarca(
  startDate: string,
  endDate: string
): Promise<DiaConMarca[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT dia::text
      FROM huella.v_dias_con_marca
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getEmpleadosActivos(): Promise<EmpleadoActivo[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo
      FROM huella.v_empleados_activos
      ORDER BY legajo;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getEmpleadoDetalle(
  legajo: string
): Promise<EmpleadoDetalle | null> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, area, turno, estado, 
             fecha_ingreso::text as fechaingreso, dni, email, inactivo
      FROM huella.v_empleado_detalle
      WHERE legajo = $1
      LIMIT 1;
    `;
    const result = await client.query(query, [legajo]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function getAsistenciaPorEmpleado(
  legajo: number,
  startDate: string,
  endDate: string
): Promise<AsistenciaDiaria[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, to_char(dia, 'YYYY-MM-DD') as dia, entrada::text, salida::text, 
             horas_trabajadas, total_marcas
      FROM huella.v_asistencia_diaria
      WHERE legajo = $1 AND dia BETWEEN $2 AND $3
      ORDER BY dia DESC;
    `;
    const result = await client.query(query, [
      String(legajo),
      startDate,
      endDate,
    ]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAusentesPorEmpleado(
  legajo: number,
  startDate: string,
  endDate: string
): Promise<AusenteDiario[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, to_char(dia, 'YYYY-MM-DD') as dia
      FROM huella.v_ausentes_diarios
      WHERE legajo = $1 AND dia BETWEEN $2 AND $3
      ORDER BY dia DESC;
    `;
    const result = await client.query(query, [
      String(legajo),
      startDate,
      endDate,
    ]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getResumenMensualEmpleado(
  legajo: number,
  mes: string
): Promise<ResumenMensualEmpleado | null> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, mes::text, dias_trabajados, 
             total_horas, promedio_horas_dia, total_marcas
      FROM huella.v_resumen_mensual_empleado
      WHERE legajo = $1 AND mes = $2
      LIMIT 1;
    `;
    const result = await client.query(query, [String(legajo), mes]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function getEstadisticasDiarias(
  startDate: string,
  endDate: string
): Promise<EstadisticaDiaria[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT dia::text, presentes, ausentes
      FROM huella.v_estadisticas_diarias
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getPromedioHorasDiario(
  startDate: string,
  endDate: string
): Promise<PromedioHorasDiario[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT dia::text, promedio_horas, empleados_con_registro
      FROM huella.v_promedio_horas_diario
      WHERE dia BETWEEN $1 AND $2
      ORDER BY dia;
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getListaEmpleados(): Promise<
  { legajo: string; nombre: string }[]
> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT DISTINCT l.cod as legajo, l.nombre
      FROM huella.legajo l
      INNER JOIN huella.v_empleados_activos ea ON ea.legajo = l.cod
      WHERE COALESCE(l.inactivo, FALSE) = FALSE
      ORDER BY l.nombre;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

// =====================================================
// ACCIONES PARA REPORTES Y LIQUIDACIONES
// =====================================================

export async function getMesesDisponibles(): Promise<MesDisponible[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT to_char(mes, 'YYYY-MM-DD') as mes, mes_nombre
      FROM huella.v_meses_disponibles
      ORDER BY mes DESC
      LIMIT 24;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getReporteLiquidacion(
  mes: string
): Promise<ReporteLiquidacion[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, area, turno, dni, 
             to_char(mes, 'YYYY-MM-DD') as mes,
             dias_trabajados, 
             COALESCE(total_horas, 0) as total_horas, 
             COALESCE(promedio_horas_dia, 0) as promedio_horas_dia,
             dias_ausente, dias_incompletos,
             to_char(primer_dia_trabajado, 'YYYY-MM-DD') as primer_dia_trabajado,
             to_char(ultimo_dia_trabajado, 'YYYY-MM-DD') as ultimo_dia_trabajado,
             to_char(fecha_ingreso, 'YYYY-MM-DD') as fecha_ingreso,
             estado, categoria_horas,
             horas_jornada, horas_esperadas, porcentaje_cumplimiento
      FROM huella.v_reporte_liquidacion
      WHERE mes = $1::date
      ORDER BY nombre;
    `;
    const result = await client.query(query, [mes]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getDetalleDiarioEmpleado(
  legajo: string,
  startDate: string,
  endDate: string
): Promise<DetalleDiarioEmpleado[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, area, turno,
             to_char(dia, 'YYYY-MM-DD') as dia,
             trim(dia_semana) as dia_semana, 
             to_char(entrada, 'HH24:MI:SS') as entrada, 
             to_char(salida, 'HH24:MI:SS') as salida,
             COALESCE(horas_trabajadas, 0) as horas_trabajadas, 
             total_marcas, tipo_jornada
      FROM huella.v_detalle_diario_empleado
      WHERE legajo = $1 AND dia BETWEEN $2 AND $3
      ORDER BY dia;
    `;
    const result = await client.query(query, [legajo, startDate, endDate]);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAreasDisponibles(): Promise<string[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT DISTINCT area 
      FROM huella.legajo 
      WHERE area IS NOT NULL AND area != ''
      ORDER BY area;
    `;
    const result = await client.query(query);
    return result.rows.map((r: any) => r.area);
  } finally {
    client.release();
  }
}

// =====================================================
// ACCIONES PARA FERIADOS
// =====================================================

export async function getFeriados(anio?: number): Promise<Feriado[]> {
  const client = await pool.connect();
  try {
    let query = `
      SELECT id, to_char(fecha, 'YYYY-MM-DD') as fecha, descripcion, tipo, 
             trim(dia_semana) as dia_semana, anio
      FROM huella.v_feriados
    `;
    const params: (string | number)[] = [];

    if (anio) {
      query += ` WHERE anio = $1`;
      params.push(anio);
    }

    query += ` ORDER BY fecha DESC`;

    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createFeriado(feriado: FeriadoCreate): Promise<Feriado> {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO huella.feriados (fecha, descripcion, tipo)
      VALUES ($1, $2, $3)
      RETURNING id, to_char(fecha, 'YYYY-MM-DD') as fecha, descripcion, tipo;
    `;
    const result = await client.query(query, [
      feriado.fecha,
      feriado.descripcion,
      feriado.tipo,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateFeriado(
  id: number,
  feriado: FeriadoCreate
): Promise<Feriado> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE huella.feriados 
      SET fecha = $1, descripcion = $2, tipo = $3
      WHERE id = $4
      RETURNING id, to_char(fecha, 'YYYY-MM-DD') as fecha, descripcion, tipo;
    `;
    const result = await client.query(query, [
      feriado.fecha,
      feriado.descripcion,
      feriado.tipo,
      id,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function deleteFeriado(id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM huella.feriados WHERE id = $1`, [id]);
  } finally {
    client.release();
  }
}

export async function getAniosFeriados(): Promise<number[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT DISTINCT EXTRACT(YEAR FROM fecha)::int AS anio
      FROM huella.feriados
      ORDER BY anio DESC;
    `;
    const result = await client.query(query);
    return result.rows.map((r: any) => r.anio);
  } finally {
    client.release();
  }
}

// =====================================================
// ACCIONES PARA CONFIGURACIÓN DE JORNADA
// =====================================================

export async function getEmpleadosConJornada(): Promise<EmpleadoConJornada[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT legajo, nombre, area, turno, dni, estado, inactivo,
             horas_jornada, tipo_jornada, 
             to_char(vigente_desde, 'YYYY-MM-DD') as vigente_desde,
             en_whitelist
      FROM huella.v_empleados_con_jornada
      ORDER BY nombre;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getConfigJornada(
  legajo: string
): Promise<ConfigJornada | null> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, legajo, horas_jornada, descripcion, 
             to_char(vigente_desde, 'YYYY-MM-DD') as vigente_desde
      FROM huella.config_jornada
      WHERE legajo = $1
      LIMIT 1;
    `;
    const result = await client.query(query, [legajo]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function upsertConfigJornada(
  config: ConfigJornada
): Promise<ConfigJornada> {
  const client = await pool.connect();
  try {
    const descripcion =
      config.horas_jornada === 4
        ? "Media jornada"
        : config.horas_jornada === 6
        ? "Jornada reducida"
        : "Jornada completa";

    const query = `
      INSERT INTO huella.config_jornada (legajo, horas_jornada, descripcion, vigente_desde)
      VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE))
      ON CONFLICT (legajo) DO UPDATE
      SET horas_jornada = EXCLUDED.horas_jornada,
          descripcion = EXCLUDED.descripcion,
          vigente_desde = EXCLUDED.vigente_desde,
          updated_at = NOW()
      RETURNING id, legajo, horas_jornada, descripcion, 
                to_char(vigente_desde, 'YYYY-MM-DD') as vigente_desde;
    `;
    const result = await client.query(query, [
      config.legajo,
      config.horas_jornada,
      descripcion,
      config.vigente_desde || null,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateMultipleJornadas(
  configs: { legajo: string; horas_jornada: 4 | 6 | 8 }[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const config of configs) {
      const descripcion =
        config.horas_jornada === 4
          ? "Media jornada"
          : config.horas_jornada === 6
          ? "Jornada reducida"
          : "Jornada completa";

      await client.query(
        `
        INSERT INTO huella.config_jornada (legajo, horas_jornada, descripcion)
        VALUES ($1, $2, $3)
        ON CONFLICT (legajo) DO UPDATE
        SET horas_jornada = EXCLUDED.horas_jornada,
            descripcion = EXCLUDED.descripcion,
            updated_at = NOW();
      `,
        [config.legajo, config.horas_jornada, descripcion]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteConfigJornada(legajo: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM huella.config_jornada WHERE legajo = $1`, [
      legajo,
    ]);
  } finally {
    client.release();
  }
}

// =====================================================
// ACCIONES PARA EMPLEADOS PROBLEMÁTICOS
// =====================================================

export async function getEmpleadosProblematicos(): Promise<
  EmpleadoProblematico[]
> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        legajo, nombre, area, turno, dni,
        horas_jornada,
        total_ausencias,
        dias_trabajados,
        COALESCE(total_horas, 0) as total_horas,
        dias_incompletos,
        total_dias_habiles,
        horas_esperadas,
        COALESCE(porcentaje_cumplimiento, 0) as porcentaje_cumplimiento,
        problema_ausencias,
        problema_cumplimiento,
        problema_incompletos,
        COALESCE(score_severidad, 0) as score_severidad,
        cantidad_problemas
      FROM huella.v_empleados_problematicos
      ORDER BY score_severidad DESC, cantidad_problemas DESC, nombre;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

async function getCurrentUserEmail(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    return "sistema";
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Prioridad 1: Username
    if (user.username) {
      return user.username;
    }

    // Prioridad 2: Email primario
    const primaryEmail = user.emailAddresses.find(
      (e: any) => e.id === user.primaryEmailAddressId
    );
    if (primaryEmail?.emailAddress) {
      return primaryEmail.emailAddress;
    }

    // Prioridad 3: Primer email disponible
    if (user.emailAddresses.length > 0) {
      return user.emailAddresses[0].emailAddress;
    }

    // Prioridad 4: firstName
    if (user.firstName) {
      return user.firstName;
    }

    // Fallback: userId
    return userId;
  } catch (error) {
    // Si hay error al obtener el usuario, retornar el userId
    return userId;
  }
}

// =====================================================
// ACCIONES PARA EXCEPCIONES DE ASISTENCIA
// =====================================================

export async function getExcepciones(
  legajo?: string
): Promise<ExcepcionAsistencia[]> {
  const client = await pool.connect();
  try {
    let query = `
      SELECT 
        id, legajo, nombre, area,
        to_char(fecha_inicio, 'YYYY-MM-DD') as fecha_inicio,
        to_char(fecha_fin, 'YYYY-MM-DD') as fecha_fin,
        tipo, descripcion, created_by,
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
        to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
        dias_excepcion
      FROM huella.v_excepciones_asistencia
    `;
    const params: string[] = [];

    if (legajo) {
      query += ` WHERE legajo = $1`;
      params.push(legajo);
    }

    query += ` ORDER BY fecha_inicio DESC`;

    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getExcepcionesVigentes(): Promise<ExcepcionAsistencia[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        id, legajo, nombre, area,
        to_char(fecha_inicio, 'YYYY-MM-DD') as fecha_inicio,
        to_char(fecha_fin, 'YYYY-MM-DD') as fecha_fin,
        tipo, descripcion, created_by,
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
        to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
        dias_excepcion
      FROM huella.v_excepciones_asistencia
      WHERE CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin
      ORDER BY fecha_fin DESC, nombre;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createExcepcion(
  excepcion: ExcepcionCreate
): Promise<ExcepcionAsistencia> {
  const client = await pool.connect();
  const createdBy = await getCurrentUserEmail();

  try {
    const query = `
      INSERT INTO huella.excepciones_asistencia (legajo, fecha_inicio, fecha_fin, tipo, descripcion, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, legajo, 
                to_char(fecha_inicio, 'YYYY-MM-DD') as fecha_inicio,
                to_char(fecha_fin, 'YYYY-MM-DD') as fecha_fin,
                tipo, descripcion, created_by,
                to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
                to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
                (fecha_fin - fecha_inicio + 1) as dias_excepcion;
    `;
    const result = await client.query(query, [
      excepcion.legajo,
      excepcion.fecha_inicio,
      excepcion.fecha_fin,
      excepcion.tipo,
      excepcion.descripcion || null,
      createdBy,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateExcepcion(
  id: number,
  excepcion: ExcepcionCreate
): Promise<ExcepcionAsistencia> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE huella.excepciones_asistencia 
      SET legajo = $1, fecha_inicio = $2, fecha_fin = $3, tipo = $4, descripcion = $5
      WHERE id = $6
      RETURNING id, legajo, 
                to_char(fecha_inicio, 'YYYY-MM-DD') as fecha_inicio,
                to_char(fecha_fin, 'YYYY-MM-DD') as fecha_fin,
                tipo, descripcion, created_by,
                to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
                to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at,
                (fecha_fin - fecha_inicio + 1) as dias_excepcion;
    `;
    const result = await client.query(query, [
      excepcion.legajo,
      excepcion.fecha_inicio,
      excepcion.fecha_fin,
      excepcion.tipo,
      excepcion.descripcion || null,
      id,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function deleteExcepcion(id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `DELETE FROM huella.excepciones_asistencia WHERE id = $1`,
      [id]
    );
  } finally {
    client.release();
  }
}

// =====================================================
// ACCIONES PARA WHITELIST DE EMPLEADOS
// =====================================================

export async function getWhitelist(): Promise<WhitelistEmpleado[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        id, legajo, nombre, area, turno, motivo, created_by,
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
        activo
      FROM huella.v_whitelist_empleados
      ORDER BY activo DESC, nombre;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getWhitelistActiva(): Promise<WhitelistEmpleado[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        id, legajo, nombre, area, turno, motivo, created_by,
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
        activo
      FROM huella.v_whitelist_empleados
      WHERE activo = TRUE
      ORDER BY nombre;
    `;
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function addToWhitelist(
  data: WhitelistCreate
): Promise<WhitelistEmpleado> {
  const client = await pool.connect();
  const createdBy = await getCurrentUserEmail();

  try {
    const query = `
      INSERT INTO huella.whitelist_empleados (legajo, motivo, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, legajo, motivo, created_by,
                to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
                activo;
    `;
    const result = await client.query(query, [
      data.legajo,
      data.motivo,
      createdBy,
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateWhitelist(
  id: number,
  data: WhitelistCreate
): Promise<WhitelistEmpleado> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE huella.whitelist_empleados 
      SET motivo = $1
      WHERE id = $2
      RETURNING id, legajo, motivo, created_by,
                to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
                activo;
    `;
    const result = await client.query(query, [data.motivo, id]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function toggleWhitelistStatus(
  id: number,
  activo: boolean
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE huella.whitelist_empleados SET activo = $1 WHERE id = $2`,
      [activo, id]
    );
  } finally {
    client.release();
  }
}

export async function removeFromWhitelist(id: number): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`DELETE FROM huella.whitelist_empleados WHERE id = $1`, [
      id,
    ]);
  } finally {
    client.release();
  }
}

export async function isEmpleadoInWhitelist(legajo: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM huella.whitelist_empleados 
        WHERE legajo = $1 AND activo = TRUE
      ) as in_whitelist;
    `;
    const result = await client.query(query, [legajo]);
    return result.rows[0]?.in_whitelist || false;
  } finally {
    client.release();
  }
}

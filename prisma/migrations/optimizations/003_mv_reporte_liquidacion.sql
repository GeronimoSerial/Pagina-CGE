-- ============================================================================
-- MATERIALIZED VIEW: mv_reporte_liquidacion
-- Optimización para reportes de liquidación mensuales
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS huella.mv_reporte_liquidacion CASCADE;

CREATE MATERIALIZED VIEW huella.mv_reporte_liquidacion AS
WITH asistencia_mes AS (
  SELECT
    legajo,
    (date_trunc('month', dia::timestamp with time zone))::date AS mes,
    count(*) AS dias_trabajados,
    sum(horas_trabajadas) AS total_horas,
    avg(horas_trabajadas) AS promedio_horas_dia,
    min(dia) AS primer_dia_trabajado,
    max(dia) AS ultimo_dia_trabajado
  FROM huella.v_asistencia_diaria
  WHERE dia >= (CURRENT_DATE - INTERVAL '12 months')
  GROUP BY legajo, date_trunc('month', dia::timestamp with time zone)
),
ausencias_mes AS (
  SELECT
    legajo,
    (date_trunc('month', dia::timestamp with time zone))::date AS mes,
    count(*) AS dias_ausente
  FROM huella.v_ausentes_diarios
  WHERE dia >= (CURRENT_DATE - INTERVAL '12 months')
  GROUP BY legajo, date_trunc('month', dia::timestamp with time zone)
),
incompletas_mes AS (
  SELECT
    legajo,
    (date_trunc('month', dia::timestamp with time zone))::date AS mes,
    count(*) AS dias_incompletos
  FROM huella.v_marcaciones_incompletas
  WHERE dia >= (CURRENT_DATE - INTERVAL '12 months')
  GROUP BY legajo, date_trunc('month', dia::timestamp with time zone)
),
dias_habiles AS (
  SELECT
    (date_trunc('month', d.d))::date AS mes,
    count(*) AS total_dias_habiles
  FROM (
    generate_series(
      (CURRENT_DATE - INTERVAL '12 months')::timestamp with time zone,
      CURRENT_DATE::timestamp with time zone,
      '1 day'::INTERVAL
    ) d(d)
    LEFT JOIN huella.feriados f ON f.fecha = d.d::date
  )
  WHERE EXTRACT(dow FROM d.d) NOT IN (0, 6)
    AND f.fecha IS NULL
  GROUP BY date_trunc('month', d.d)
),
whitelist AS (
  SELECT legajo
  FROM huella.whitelist_empleados
  WHERE activo = TRUE
)
SELECT
  l.cod AS legajo,
  l.nombre,
  l.area,
  l.turno,
  l.dni,
  COALESCE(a.mes, au.mes) AS mes,
  CASE
    WHEN w.legajo IS NOT NULL THEN COALESCE(dh.total_dias_habiles, 22::bigint)
    ELSE COALESCE(a.dias_trabajados, 0::bigint)
  END AS dias_trabajados,
  CASE
    WHEN w.legajo IS NOT NULL THEN (COALESCE(dh.total_dias_habiles, 22::bigint) * COALESCE(cj.horas_jornada, 8))::numeric
    ELSE COALESCE(a.total_horas, 0::numeric)
  END AS total_horas,
  CASE
    WHEN w.legajo IS NOT NULL THEN COALESCE(cj.horas_jornada, 8)::numeric
    ELSE COALESCE(a.promedio_horas_dia, 0::numeric)
  END AS promedio_horas_dia,
  CASE
    WHEN w.legajo IS NOT NULL THEN 0::bigint
    ELSE COALESCE(au.dias_ausente, 0::bigint)
  END AS dias_ausente,
  CASE
    WHEN w.legajo IS NOT NULL THEN 0::bigint
    ELSE COALESCE(i.dias_incompletos, 0::bigint)
  END AS dias_incompletos,
  a.primer_dia_trabajado,
  a.ultimo_dia_trabajado,
  l.fecha_ingreso,
  l.estado,
  COALESCE(cj.horas_jornada, 8) AS horas_jornada,
  (COALESCE(dh.total_dias_habiles, 22::bigint) * COALESCE(cj.horas_jornada, 8)) AS horas_esperadas,
  CASE
    WHEN w.legajo IS NOT NULL THEN 100.0
    WHEN (COALESCE(dh.total_dias_habiles, 22::bigint) * COALESCE(cj.horas_jornada, 8)) > 0 
    THEN round(
      (COALESCE(a.total_horas, 0::numeric) / 
       (COALESCE(dh.total_dias_habiles, 22::bigint) * COALESCE(cj.horas_jornada, 8))::numeric) * 100::numeric,
      1
    )
    ELSE 0::numeric
  END AS porcentaje_cumplimiento,
  CASE
    WHEN w.legajo IS NOT NULL THEN 'Completo'
    WHEN COALESCE(a.total_horas, 0::numeric) >= 
         ((COALESCE(dh.total_dias_habiles, 22::bigint) * COALESCE(cj.horas_jornada, 8))::numeric * 0.9) 
    THEN 'Completo'
    WHEN COALESCE(a.total_horas, 0::numeric) >= 
         ((COALESCE(dh.total_dias_habiles, 22::bigint) * COALESCE(cj.horas_jornada, 8))::numeric * 0.7) 
    THEN 'Parcial'
    ELSE 'Mínimo'
  END AS categoria_horas,
  NOW() AS ultima_actualizacion
FROM huella.legajo l
JOIN huella.v_empleados_activos ea ON ea.legajo = l.cod
LEFT JOIN asistencia_mes a ON a.legajo = l.cod
LEFT JOIN ausencias_mes au ON au.legajo = l.cod AND au.mes = a.mes
LEFT JOIN incompletas_mes i ON i.legajo = l.cod AND i.mes = a.mes
LEFT JOIN huella.config_jornada cj ON cj.legajo::text = l.cod
LEFT JOIN dias_habiles dh ON dh.mes = COALESCE(a.mes, au.mes)
LEFT JOIN whitelist w ON w.legajo::text = l.cod
WHERE l.inactivo = false OR l.inactivo IS NULL
ORDER BY COALESCE(a.mes, au.mes) DESC, l.nombre;

-- Índice único compuesto para REFRESH CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_reporte_liquidacion_pk 
ON huella.mv_reporte_liquidacion (legajo, mes);

-- Índices para consultas frecuentes
CREATE INDEX idx_mv_reporte_liquidacion_mes 
ON huella.mv_reporte_liquidacion (mes DESC);

CREATE INDEX idx_mv_reporte_liquidacion_area 
ON huella.mv_reporte_liquidacion (area, mes DESC);

CREATE INDEX idx_mv_reporte_liquidacion_categoria 
ON huella.mv_reporte_liquidacion (categoria_horas, mes DESC);

COMMENT ON MATERIALIZED VIEW huella.mv_reporte_liquidacion IS 
'Vista materializada de reportes de liquidación (últimos 12 meses). Actualizar con: REFRESH MATERIALIZED VIEW CONCURRENTLY huella.mv_reporte_liquidacion';

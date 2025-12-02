WITH asistencia_mes AS (
  SELECT
    v_asistencia_diaria.legajo,
    (
      date_trunc(
        'month' :: text,
        (v_asistencia_diaria.dia) :: timestamp WITH time zone
      )
    ) :: date AS mes,
    count(*) AS dias_trabajados,
    sum(v_asistencia_diaria.horas_trabajadas) AS total_horas,
    avg(v_asistencia_diaria.horas_trabajadas) AS promedio_horas_dia,
    min(v_asistencia_diaria.dia) AS primer_dia_trabajado,
    max(v_asistencia_diaria.dia) AS ultimo_dia_trabajado
  FROM
    v_asistencia_diaria
  GROUP BY
    v_asistencia_diaria.legajo,
    (
      date_trunc(
        'month' :: text,
        (v_asistencia_diaria.dia) :: timestamp WITH time zone
      )
    )
),
ausencias_mes AS (
  SELECT
    v_ausentes_diarios.legajo,
    (
      date_trunc(
        'month' :: text,
        (v_ausentes_diarios.dia) :: timestamp WITH time zone
      )
    ) :: date AS mes,
    count(*) AS dias_ausente
  FROM
    v_ausentes_diarios
  GROUP BY
    v_ausentes_diarios.legajo,
    (
      date_trunc(
        'month' :: text,
        (v_ausentes_diarios.dia) :: timestamp WITH time zone
      )
    )
),
incompletas_mes AS (
  SELECT
    v_marcaciones_incompletas.legajo,
    (
      date_trunc(
        'month' :: text,
        (v_marcaciones_incompletas.dia) :: timestamp WITH time zone
      )
    ) :: date AS mes,
    count(*) AS dias_incompletos
  FROM
    v_marcaciones_incompletas
  GROUP BY
    v_marcaciones_incompletas.legajo,
    (
      date_trunc(
        'month' :: text,
        (v_marcaciones_incompletas.dia) :: timestamp WITH time zone
      )
    )
),
dias_habiles AS (
  SELECT
    (date_trunc('month' :: text, d.d)) :: date AS mes,
    count(*) AS total_dias_habiles
  FROM
    (
      generate_series(
        (
          (
            SELECT
              min(v_asistencia_diaria.dia) AS min
            FROM
              v_asistencia_diaria
          )
        ) :: timestamp WITH time zone,
        (
          (
            SELECT
              max(v_asistencia_diaria.dia) AS max
            FROM
              v_asistencia_diaria
          )
        ) :: timestamp WITH time zone,
        '1 day' :: INTERVAL
      ) d(d)
      LEFT JOIN feriados f ON ((f.fecha = (d.d) :: date))
    )
  WHERE
    (
      (
        EXTRACT(
          dow
          FROM
            d.d
        ) <> ALL (ARRAY [(0)::numeric, (6)::numeric])
      )
      AND (f.fecha IS NULL)
    )
  GROUP BY
    (date_trunc('month' :: text, d.d))
),
whitelist AS (
  SELECT
    whitelist_empleados.legajo
  FROM
    whitelist_empleados
  WHERE
    (whitelist_empleados.activo = TRUE)
)
SELECT
  l.cod AS legajo,
  l.nombre,
  l.area,
  l.turno,
  l.dni,
  COALESCE(a.mes, au.mes) AS mes,
  CASE
    WHEN (w.legajo IS NOT NULL) THEN COALESCE(dh.total_dias_habiles, (22) :: bigint)
    ELSE COALESCE(a.dias_trabajados, (0) :: bigint)
  END AS dias_trabajados,
  CASE
    WHEN (w.legajo IS NOT NULL) THEN (
      (
        COALESCE(dh.total_dias_habiles, (22) :: bigint) * COALESCE(cj.horas_jornada, 8)
      )
    ) :: numeric
    ELSE COALESCE(a.total_horas, (0) :: numeric)
  END AS total_horas,
  CASE
    WHEN (w.legajo IS NOT NULL) THEN (COALESCE(cj.horas_jornada, 8)) :: numeric
    ELSE COALESCE(a.promedio_horas_dia, (0) :: numeric)
  END AS promedio_horas_dia,
  CASE
    WHEN (w.legajo IS NOT NULL) THEN (0) :: bigint
    ELSE COALESCE(au.dias_ausente, (0) :: bigint)
  END AS dias_ausente,
  CASE
    WHEN (w.legajo IS NOT NULL) THEN (0) :: bigint
    ELSE COALESCE(i.dias_incompletos, (0) :: bigint)
  END AS dias_incompletos,
  a.primer_dia_trabajado,
  a.ultimo_dia_trabajado,
  l.fecha_ingreso,
  l.estado,
  COALESCE(cj.horas_jornada, 8) AS horas_jornada,
  (
    COALESCE(dh.total_dias_habiles, (22) :: bigint) * COALESCE(cj.horas_jornada, 8)
  ) AS horas_esperadas,
  CASE
    WHEN (w.legajo IS NOT NULL) THEN 100.0
    WHEN (
      (
        COALESCE(dh.total_dias_habiles, (22) :: bigint) * COALESCE(cj.horas_jornada, 8)
      ) > 0
    ) THEN round(
      (
        (
          COALESCE(a.total_horas, (0) :: numeric) / (
            (
              COALESCE(dh.total_dias_habiles, (22) :: bigint) * COALESCE(cj.horas_jornada, 8)
            )
          ) :: numeric
        ) * (100) :: numeric
      ),
      1
    )
    ELSE (0) :: numeric
  END AS porcentaje_cumplimiento,
  CASE
    WHEN (w.legajo IS NOT NULL) THEN 'Completo' :: text
    WHEN (
      COALESCE(a.total_horas, (0) :: numeric) >= (
        (
          (
            COALESCE(dh.total_dias_habiles, (22) :: bigint) * COALESCE(cj.horas_jornada, 8)
          )
        ) :: numeric * 0.9
      )
    ) THEN 'Completo' :: text
    WHEN (
      COALESCE(a.total_horas, (0) :: numeric) >= (
        (
          (
            COALESCE(dh.total_dias_habiles, (22) :: bigint) * COALESCE(cj.horas_jornada, 8)
          )
        ) :: numeric * 0.7
      )
    ) THEN 'Parcial' :: text
    ELSE 'Mínimo' :: text
  END AS categoria_horas
FROM
  (
    (
      (
        (
          (
            (
              (
                legajo l
                JOIN v_empleados_activos ea ON ((ea.legajo = l.cod))
              )
              LEFT JOIN asistencia_mes a ON ((a.legajo = l.cod))
            )
            LEFT JOIN ausencias_mes au ON (
              (
                (au.legajo = l.cod)
                AND (au.mes = a.mes)
              )
            )
          )
          LEFT JOIN incompletas_mes i ON (
            (
              (i.legajo = l.cod)
              AND (i.mes = a.mes)
            )
          )
        )
        LEFT JOIN config_jornada cj ON (((cj.legajo) :: text = l.cod))
      )
      LEFT JOIN dias_habiles dh ON ((dh.mes = COALESCE(a.mes, au.mes)))
    )
    LEFT JOIN whitelist w ON (((w.legajo) :: text = l.cod))
  )
WHERE
  (
    (l.inactivo = false)
    OR (l.inactivo IS NULL)
  )
ORDER BY
  COALESCE(a.mes, au.mes) DESC,
  l.nombre;
WITH dias AS (
  SELECT
    v_dias_con_marca.dia
  FROM
    v_dias_con_marca
),
marcas_dias AS (
  SELECT
    DISTINCT v_marcaciones_unificadas.legajo,
    date(v_marcaciones_unificadas.ts) AS dia
  FROM
    v_marcaciones_unificadas
),
trabaja_finde AS (
  SELECT
    trabaja_finde.legajo,
    trabaja_finde.sabado,
    trabaja_finde.domingo
  FROM
    huella.trabaja_finde
),
feriados_list AS (
  SELECT
    feriados.fecha
  FROM
    feriados
),
excepciones_list AS (
  SELECT
    excepciones_asistencia.legajo,
    excepciones_asistencia.fecha_inicio,
    excepciones_asistencia.fecha_fin
  FROM
    excepciones_asistencia
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
  d.dia
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
              CROSS JOIN dias d
            )
            LEFT JOIN marcas_dias m ON (
              (
                (m.legajo = l.cod)
                AND (m.dia = d.dia)
              )
            )
          )
          LEFT JOIN trabaja_finde tf ON ((tf.legajo = l.cod))
        )
        LEFT JOIN feriados_list f ON ((f.fecha = d.dia))
      )
      LEFT JOIN excepciones_list ex ON (
        (
          ((ex.legajo) :: text = l.cod)
          AND (
            (d.dia >= ex.fecha_inicio)
            AND (d.dia <= ex.fecha_fin)
          )
        )
      )
    )
    LEFT JOIN whitelist w ON (((w.legajo) :: text = l.cod))
  )
WHERE
  (
    (m.legajo IS NULL)
    AND (COALESCE(l.inactivo, false) = false)
    AND (f.fecha IS NULL)
    AND (ex.legajo IS NULL)
    AND (w.legajo IS NULL)
    AND (
      (
        EXTRACT(
          dow
          FROM
            d.dia
        ) <> ALL (ARRAY [(0)::numeric, (6)::numeric])
      )
      OR (
        (
          EXTRACT(
            dow
            FROM
              d.dia
          ) = (6) :: numeric
        )
        AND tf.sabado
      )
      OR (
        (
          EXTRACT(
            dow
            FROM
              d.dia
          ) = (0) :: numeric
        )
        AND tf.domingo
      )
    )
  )
ORDER BY
  d.dia,
  l.nombre;
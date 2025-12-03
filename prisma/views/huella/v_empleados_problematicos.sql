WITH periodo AS (
  SELECT
    (CURRENT_DATE - '30 days' :: INTERVAL) AS fecha_inicio,
    CURRENT_DATE AS fecha_fin
),
whitelist AS (
  SELECT
    whitelist_empleados.legajo
  FROM
    huella.whitelist_empleados
  WHERE
    (whitelist_empleados.activo = TRUE)
),
ausencias_periodo AS (
  SELECT
    v_ausentes_diarios.legajo,
    count(*) AS total_ausencias
  FROM
    huella.v_ausentes_diarios,
    periodo p
  WHERE
    (
      (v_ausentes_diarios.dia >= p.fecha_inicio)
      AND (v_ausentes_diarios.dia <= p.fecha_fin)
    )
  GROUP BY
    v_ausentes_diarios.legajo
),
asistencia_periodo AS (
  SELECT
    v_asistencia_diaria.legajo,
    count(*) AS dias_trabajados,
    sum(v_asistencia_diaria.horas_trabajadas) AS total_horas,
    avg(v_asistencia_diaria.horas_trabajadas) AS promedio_horas_dia
  FROM
    huella.v_asistencia_diaria,
    periodo p
  WHERE
    (
      (v_asistencia_diaria.dia >= p.fecha_inicio)
      AND (v_asistencia_diaria.dia <= p.fecha_fin)
    )
  GROUP BY
    v_asistencia_diaria.legajo
),
incompletas_periodo AS (
  SELECT
    v_marcaciones_incompletas.legajo,
    count(*) AS dias_incompletos
  FROM
    huella.v_marcaciones_incompletas,
    periodo p
  WHERE
    (
      (v_marcaciones_incompletas.dia >= p.fecha_inicio)
      AND (v_marcaciones_incompletas.dia <= p.fecha_fin)
    )
  GROUP BY
    v_marcaciones_incompletas.legajo
),
dias_habiles_periodo AS (
  SELECT
    count(*) AS total_dias_habiles
  FROM
    (
      generate_series(
        (CURRENT_DATE - '30 days' :: INTERVAL),
        (CURRENT_DATE) :: timestamp without time zone,
        '1 day' :: INTERVAL
      ) d(d)
      LEFT JOIN huella.feriados f ON ((f.fecha = (d.d) :: date))
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
)
SELECT
  l.cod AS legajo,
  l.nombre,
  l.area,
  l.turno,
  l.dni,
  COALESCE(cj.horas_jornada, 8) AS horas_jornada,
  COALESCE(au.total_ausencias, (0) :: bigint) AS total_ausencias,
  COALESCE(a.dias_trabajados, (0) :: bigint) AS dias_trabajados,
  COALESCE(a.total_horas, (0) :: numeric) AS total_horas,
  COALESCE(i.dias_incompletos, (0) :: bigint) AS dias_incompletos,
  dh.total_dias_habiles,
  (
    dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
  ) AS horas_esperadas,
  CASE
    WHEN (
      (
        dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
      ) > 0
    ) THEN round(
      (
        (
          COALESCE(a.total_horas, (0) :: numeric) / (
            (
              dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
            )
          ) :: numeric
        ) * (100) :: numeric
      ),
      1
    )
    ELSE (0) :: numeric
  END AS porcentaje_cumplimiento,
  CASE
    WHEN (COALESCE(au.total_ausencias, (0) :: bigint) > 3) THEN TRUE
    ELSE false
  END AS problema_ausencias,
  CASE
    WHEN (
      (
        (
          dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
        ) > 0
      )
      AND (
        (
          (
            COALESCE(a.total_horas, (0) :: numeric) / (
              (
                dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
              )
            ) :: numeric
          ) * (100) :: numeric
        ) < (60) :: numeric
      )
    ) THEN TRUE
    ELSE false
  END AS problema_cumplimiento,
  CASE
    WHEN (COALESCE(i.dias_incompletos, (0) :: bigint) > 2) THEN TRUE
    ELSE false
  END AS problema_incompletos,
  (
    (
      (
        CASE
          WHEN (COALESCE(au.total_ausencias, (0) :: bigint) > 3) THEN (
            (COALESCE(au.total_ausencias, (0) :: bigint) - 3) * 10
          )
          ELSE (0) :: bigint
        END
      ) :: numeric + CASE
        WHEN (
          (
            (
              dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
            ) > 0
          )
          AND (
            (
              (
                COALESCE(a.total_horas, (0) :: numeric) / (
                  (
                    dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
                  )
                ) :: numeric
              ) * (100) :: numeric
            ) < (60) :: numeric
          )
        ) THEN (
          (60) :: numeric - (
            (
              COALESCE(a.total_horas, (0) :: numeric) / (
                (
                  dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
                )
              ) :: numeric
            ) * (100) :: numeric
          )
        )
        ELSE (0) :: numeric
      END
    ) + (
      CASE
        WHEN (COALESCE(i.dias_incompletos, (0) :: bigint) > 2) THEN (
          (COALESCE(i.dias_incompletos, (0) :: bigint) - 2) * 5
        )
        ELSE (0) :: bigint
      END
    ) :: numeric
  ) AS score_severidad,
  (
    (
      CASE
        WHEN (COALESCE(au.total_ausencias, (0) :: bigint) > 3) THEN 1
        ELSE 0
      END + CASE
        WHEN (
          (
            (
              dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
            ) > 0
          )
          AND (
            (
              (
                COALESCE(a.total_horas, (0) :: numeric) / (
                  (
                    dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
                  )
                ) :: numeric
              ) * (100) :: numeric
            ) < (60) :: numeric
          )
        ) THEN 1
        ELSE 0
      END
    ) + CASE
      WHEN (COALESCE(i.dias_incompletos, (0) :: bigint) > 2) THEN 1
      ELSE 0
    END
  ) AS cantidad_problemas
FROM
  (
    (
      (
        (
          (
            (
              (
                huella.legajo l
                JOIN huella.v_empleados_activos ea ON ((ea.legajo = l.cod))
              )
              CROSS JOIN dias_habiles_periodo dh
            )
            LEFT JOIN whitelist w ON (((w.legajo) :: text = l.cod))
          )
          LEFT JOIN ausencias_periodo au ON ((au.legajo = l.cod))
        )
        LEFT JOIN asistencia_periodo a ON ((a.legajo = l.cod))
      )
      LEFT JOIN incompletas_periodo i ON ((i.legajo = l.cod))
    )
    LEFT JOIN huella.config_jornada cj ON (((cj.legajo) :: text = l.cod))
  )
WHERE
  (
    (COALESCE(l.inactivo, false) = false)
    AND (w.legajo IS NULL)
    AND (
      (COALESCE(au.total_ausencias, (0) :: bigint) > 3)
      OR (
        (
          (
            dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
          ) > 0
        )
        AND (
          (
            (
              COALESCE(a.total_horas, (0) :: numeric) / (
                (
                  dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
                )
              ) :: numeric
            ) * (100) :: numeric
          ) < (60) :: numeric
        )
      )
      OR (COALESCE(i.dias_incompletos, (0) :: bigint) > 2)
    )
  )
ORDER BY
  (
    (
      (
        CASE
          WHEN (COALESCE(au.total_ausencias, (0) :: bigint) > 3) THEN (
            (COALESCE(au.total_ausencias, (0) :: bigint) - 3) * 10
          )
          ELSE (0) :: bigint
        END
      ) :: numeric + CASE
        WHEN (
          (
            (
              dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
            ) > 0
          )
          AND (
            (
              (
                COALESCE(a.total_horas, (0) :: numeric) / (
                  (
                    dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
                  )
                ) :: numeric
              ) * (100) :: numeric
            ) < (60) :: numeric
          )
        ) THEN (
          (60) :: numeric - (
            (
              COALESCE(a.total_horas, (0) :: numeric) / (
                (
                  dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
                )
              ) :: numeric
            ) * (100) :: numeric
          )
        )
        ELSE (0) :: numeric
      END
    ) + (
      CASE
        WHEN (COALESCE(i.dias_incompletos, (0) :: bigint) > 2) THEN (
          (COALESCE(i.dias_incompletos, (0) :: bigint) - 2) * 5
        )
        ELSE (0) :: bigint
      END
    ) :: numeric
  ) DESC,
  (
    (
      CASE
        WHEN (COALESCE(au.total_ausencias, (0) :: bigint) > 3) THEN 1
        ELSE 0
      END + CASE
        WHEN (
          (
            (
              dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
            ) > 0
          )
          AND (
            (
              (
                COALESCE(a.total_horas, (0) :: numeric) / (
                  (
                    dh.total_dias_habiles * COALESCE(cj.horas_jornada, 8)
                  )
                ) :: numeric
              ) * (100) :: numeric
            ) < (60) :: numeric
          )
        ) THEN 1
        ELSE 0
      END
    ) + CASE
      WHEN (COALESCE(i.dias_incompletos, (0) :: bigint) > 2) THEN 1
      ELSE 0
    END
  ) DESC,
  l.nombre;
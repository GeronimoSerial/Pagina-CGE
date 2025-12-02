SELECT
  l.cod AS legajo,
  l.nombre,
  l.area,
  l.turno,
  l.dni,
  l.estado,
  l.inactivo,
  COALESCE(cj.horas_jornada, 8) AS horas_jornada,
  CASE
    COALESCE(cj.horas_jornada, 8)
    WHEN 4 THEN 'Media jornada (4hs)' :: text
    WHEN 6 THEN 'Jornada reducida (6hs)' :: text
    WHEN 8 THEN 'Jornada completa (8hs)' :: text
    ELSE NULL :: text
  END AS tipo_jornada,
  cj.vigente_desde,
  CASE
    WHEN (
      (w.legajo IS NOT NULL)
      AND (w.activo = TRUE)
    ) THEN TRUE
    ELSE false
  END AS en_whitelist
FROM
  (
    (
      (
        legajo l
        JOIN v_empleados_activos ea ON ((ea.legajo = l.cod))
      )
      LEFT JOIN config_jornada cj ON (((cj.legajo) :: text = l.cod))
    )
    LEFT JOIN whitelist_empleados w ON (((w.legajo) :: text = l.cod))
  )
WHERE
  (COALESCE(l.inactivo, false) = false)
ORDER BY
  l.nombre;
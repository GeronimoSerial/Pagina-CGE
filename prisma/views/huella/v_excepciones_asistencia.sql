SELECT
  e.id,
  e.legajo,
  l.nombre,
  l.area,
  e.fecha_inicio,
  e.fecha_fin,
  e.tipo,
  e.descripcion,
  e.created_by,
  e.created_at,
  e.updated_at,
  ((e.fecha_fin - e.fecha_inicio) + 1) AS dias_excepcion
FROM
  (
    excepciones_asistencia e
    LEFT JOIN legajo l ON ((l.cod = (e.legajo) :: text))
  )
ORDER BY
  e.fecha_inicio DESC,
  l.nombre;
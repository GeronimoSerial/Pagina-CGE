SELECT
  w.id,
  w.legajo,
  l.nombre,
  l.area,
  l.turno,
  w.motivo,
  w.created_by,
  w.created_at,
  w.activo
FROM
  (
    huella.whitelist_empleados w
    LEFT JOIN huella.legajo l ON ((l.cod = (w.legajo) :: text))
  )
ORDER BY
  w.activo DESC,
  l.nombre;
SELECT
  e.id_escuela,
  e.cue,
  e.nombre AS escuela,
  z.descripcion AS zona,
  string_agg(
    (prob.dimension) :: text,
    ', ' :: text
    ORDER BY
      (prob.dimension) :: text
  ) AS dimensiones_problematicas,
  count(ep.id_problematica) AS cantidad_problematicas
FROM
  (
    (
      (
        institucional.escuela e
        LEFT JOIN relevamiento.escuela_problematica ep ON ((e.id_escuela = ep.id_escuela))
      )
      LEFT JOIN relevamiento.problematica prob ON ((ep.id_problematica = prob.id_problematica))
    )
    LEFT JOIN institucional.zona z ON ((e.id_zona = z.id_zona))
  )
GROUP BY
  e.id_escuela,
  e.cue,
  e.nombre,
  z.descripcion;
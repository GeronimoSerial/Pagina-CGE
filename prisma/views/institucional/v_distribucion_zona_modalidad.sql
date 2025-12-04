SELECT
  z.descripcion AS zona,
  z.codigo AS zona_codigo,
  count(*) FILTER (
    WHERE
      ((m.descripcion) :: text = 'COMÚN' :: text)
  ) AS comun,
  count(*) FILTER (
    WHERE
      ((m.descripcion) :: text = 'ESPECIAL' :: text)
  ) AS especial,
  count(*) FILTER (
    WHERE
      ((m.descripcion) :: text = 'ADULTOS' :: text)
  ) AS adultos,
  count(*) FILTER (
    WHERE
      ((m.descripcion) :: text = 'INICIAL' :: text)
  ) AS inicial,
  count(*) FILTER (
    WHERE
      (
        (m.descripcion) :: text = 'HOSPITALARIA Y DOMICILIARIA' :: text
      )
  ) AS hospitalaria,
  count(*) FILTER (
    WHERE
      (
        (m.descripcion) :: text = 'CONTEXTOS DE ENCIERRO' :: text
      )
  ) AS contextos_encierro,
  count(*) FILTER (
    WHERE
      ((m.descripcion) :: text = 'DESCONOCIDO' :: text)
  ) AS sin_modalidad,
  count(*) AS total
FROM
  (
    (
      institucional.escuela e
      LEFT JOIN institucional.zona z ON ((e.id_zona = z.id_zona))
    )
    LEFT JOIN institucional.modalidad m ON ((e.id_modalidad = m.id_modalidad))
  )
GROUP BY
  z.descripcion,
  z.codigo
ORDER BY
  z.codigo;
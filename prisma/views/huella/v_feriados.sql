SELECT
  id,
  fecha,
  descripcion,
  tipo,
  to_char((fecha) :: timestamp WITH time zone, 'TMDay' :: text) AS dia_semana,
  EXTRACT(
    year
    FROM
      fecha
  ) AS anio
FROM
  feriados
ORDER BY
  fecha DESC;
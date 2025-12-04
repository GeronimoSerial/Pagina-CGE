SELECT
  feriados.id,
  feriados.fecha,
  feriados.descripcion,
  feriados.tipo,
  to_char(
    (feriados.fecha) :: timestamp WITH time zone,
    'TMDay' :: text
  ) AS dia_semana,
  EXTRACT(
    year
    FROM
      feriados.fecha
  ) AS anio
FROM
  huella.feriados
ORDER BY
  feriados.fecha DESC;
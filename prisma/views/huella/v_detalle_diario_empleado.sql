SELECT
  a.legajo,
  l.nombre,
  l.area,
  l.turno,
  a.dia,
  to_char((a.dia) :: timestamp WITH time zone, 'TMDay' :: text) AS dia_semana,
  a.entrada,
  a.salida,
  a.horas_trabajadas,
  a.total_marcas,
  CASE
    WHEN (a.horas_trabajadas >= (8) :: numeric) THEN 'Jornada completa' :: text
    WHEN (a.horas_trabajadas >= (4) :: numeric) THEN 'Media jornada' :: text
    WHEN (a.horas_trabajadas > (0) :: numeric) THEN 'Parcial' :: text
    ELSE 'Sin registro' :: text
  END AS tipo_jornada
FROM
  (
    huella.v_asistencia_diaria a
    LEFT JOIN huella.legajo l ON ((l.cod = a.legajo))
  )
ORDER BY
  a.legajo,
  a.dia;
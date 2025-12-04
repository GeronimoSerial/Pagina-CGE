SELECT
  v_asistencia_diaria.legajo,
  v_asistencia_diaria.nombre,
  (
    date_trunc(
      'month' :: text,
      (v_asistencia_diaria.dia) :: timestamp WITH time zone
    )
  ) :: date AS mes,
  count(*) AS dias_trabajados,
  sum(v_asistencia_diaria.horas_trabajadas) AS total_horas,
  avg(v_asistencia_diaria.horas_trabajadas) AS promedio_horas_dia,
  sum(v_asistencia_diaria.total_marcas) AS total_marcas
FROM
  huella.v_asistencia_diaria
GROUP BY
  v_asistencia_diaria.legajo,
  v_asistencia_diaria.nombre,
  (
    date_trunc(
      'month' :: text,
      (v_asistencia_diaria.dia) :: timestamp WITH time zone
    )
  )
ORDER BY
  (
    (
      date_trunc(
        'month' :: text,
        (v_asistencia_diaria.dia) :: timestamp WITH time zone
      )
    ) :: date
  ),
  v_asistencia_diaria.legajo;
SELECT
  legajo,
  nombre,
  (
    date_trunc('month' :: text, (dia) :: timestamp WITH time zone)
  ) :: date AS mes,
  count(*) AS dias_trabajados,
  sum(horas_trabajadas) AS total_horas,
  avg(horas_trabajadas) AS promedio_horas_dia,
  sum(total_marcas) AS total_marcas
FROM
  v_asistencia_diaria
GROUP BY
  legajo,
  nombre,
  (
    date_trunc('month' :: text, (dia) :: timestamp WITH time zone)
  )
ORDER BY
  (
    (
      date_trunc('month' :: text, (dia) :: timestamp WITH time zone)
    ) :: date
  ),
  legajo;
SELECT
  v_asistencia_diaria.dia,
  avg(v_asistencia_diaria.horas_trabajadas) AS promedio_horas,
  count(*) AS empleados_con_registro
FROM
  huella.v_asistencia_diaria
WHERE
  (
    (v_asistencia_diaria.horas_trabajadas IS NOT NULL)
    AND (
      v_asistencia_diaria.horas_trabajadas > (0) :: numeric
    )
  )
GROUP BY
  v_asistencia_diaria.dia
ORDER BY
  v_asistencia_diaria.dia;
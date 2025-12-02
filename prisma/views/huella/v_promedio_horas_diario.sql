SELECT
  dia,
  avg(horas_trabajadas) AS promedio_horas,
  count(*) AS empleados_con_registro
FROM
  v_asistencia_diaria
WHERE
  (
    (horas_trabajadas IS NOT NULL)
    AND (horas_trabajadas > (0) :: numeric)
  )
GROUP BY
  dia
ORDER BY
  dia;
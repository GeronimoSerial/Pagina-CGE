SELECT
  id,
  dia AS fecha,
  hora,
  tipo,
  interno AS detalle,
  nombre AS empleado,
  usuario AS operado_por
FROM
  auditoria
ORDER BY
  dia DESC,
  hora DESC;
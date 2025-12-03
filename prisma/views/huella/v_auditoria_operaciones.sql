SELECT
  id,
  dia AS fecha,
  hora,
  tipo,
  interno AS detalle,
  nombre AS empleado,
  usuario AS operado_por
FROM
  huella.auditoria
ORDER BY
  dia DESC,
  hora DESC;
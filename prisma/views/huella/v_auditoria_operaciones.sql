SELECT
  auditoria.id,
  auditoria.dia AS fecha,
  auditoria.hora,
  auditoria.tipo,
  auditoria.interno AS detalle,
  auditoria.nombre AS empleado,
  auditoria.usuario AS operado_por
FROM
  auditoria
ORDER BY
  auditoria.dia DESC,
  auditoria.hora DESC;
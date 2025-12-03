SELECT
  DISTINCT legajo
FROM
  huella.v_marcaciones_unificadas
WHERE
  (ts >= date_trunc('year' :: text, NOW()));
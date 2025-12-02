SELECT
  DISTINCT legajo
FROM
  v_marcaciones_unificadas
WHERE
  (ts >= date_trunc('year' :: text, NOW()));
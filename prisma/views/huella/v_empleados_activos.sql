SELECT
  DISTINCT v_marcaciones_unificadas.legajo
FROM
  v_marcaciones_unificadas
WHERE
  (
    v_marcaciones_unificadas.ts >= date_trunc('year' :: text, NOW())
  );
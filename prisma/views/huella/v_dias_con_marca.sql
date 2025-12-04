SELECT
  DISTINCT date(v_marcaciones_unificadas.ts) AS dia
FROM
  huella.v_marcaciones_unificadas;
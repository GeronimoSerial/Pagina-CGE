SELECT
  id,
  legajo,
  ts,
  tipo,
  sensor,
  origen,
  duplicado
FROM
  huella.marcas
WHERE
  (COALESCE(duplicado, false) = false);
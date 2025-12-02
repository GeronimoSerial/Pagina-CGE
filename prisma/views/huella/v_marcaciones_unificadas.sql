SELECT
  id,
  legajo,
  ts,
  tipo,
  sensor,
  origen,
  duplicado
FROM
  marcas
WHERE
  (COALESCE(duplicado, false) = false);
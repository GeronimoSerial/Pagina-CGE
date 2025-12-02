SELECT
  marcas.id,
  marcas.legajo,
  marcas.ts,
  marcas.tipo,
  marcas.sensor,
  marcas.origen,
  marcas.duplicado
FROM
  marcas
WHERE
  (COALESCE(marcas.duplicado, false) = false);
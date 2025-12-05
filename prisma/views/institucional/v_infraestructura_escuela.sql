SELECT
  e.id_escuela,
  e.cue,
  e.nombre,
  z.descripcion AS zona,
  COALESCE(e.edificio_propio, false) AS edificio_propio,
  COALESCE(e.tiene_empresa_limpieza, false) AS tiene_empresa_limpieza,
  COALESCE(
    e.comparte_edificio,
    'Sin datos' :: character varying
  ) AS comparte_edificio,
  e.obs_limpieza AS empresa_limpieza
FROM
  (
    institucional.escuela e
    LEFT JOIN institucional.zona z ON ((e.id_zona = z.id_zona))
  );
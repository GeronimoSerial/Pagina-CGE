SELECT
  m.legajo,
  l.nombre,
  date(m.ts) AS dia,
  min(m.ts) AS primera_marca,
  max(m.ts) AS ultima_marca,
  count(*) AS total_marcas
FROM
  (
    huella.marcas m
    LEFT JOIN huella.legajo l ON ((l.cod = m.legajo))
  )
GROUP BY
  m.legajo,
  l.nombre,
  (date(m.ts));
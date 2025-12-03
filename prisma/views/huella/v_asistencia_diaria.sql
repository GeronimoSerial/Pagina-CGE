WITH diario AS (
  SELECT
    v_marcaciones_unificadas.legajo,
    date(v_marcaciones_unificadas.ts) AS dia,
    min(v_marcaciones_unificadas.ts) AS entrada,
    max(v_marcaciones_unificadas.ts) AS salida,
    count(*) AS total_marcas
  FROM
    huella.v_marcaciones_unificadas
  GROUP BY
    v_marcaciones_unificadas.legajo,
    (date(v_marcaciones_unificadas.ts))
)
SELECT
  d.legajo,
  l.nombre,
  d.dia,
  d.entrada,
  d.salida,
  (
    EXTRACT(
      epoch
      FROM
        (d.salida - d.entrada)
    ) / (3600) :: numeric
  ) AS horas_trabajadas,
  d.total_marcas
FROM
  (
    diario d
    LEFT JOIN huella.legajo l ON ((l.cod = d.legajo))
  );
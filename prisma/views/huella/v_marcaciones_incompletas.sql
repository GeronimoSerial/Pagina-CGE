WITH clas AS (
  SELECT
    v_marcaciones_unificadas.legajo,
    date(v_marcaciones_unificadas.ts) AS dia,
    count(*) FILTER (
      WHERE
        (
          v_marcaciones_unificadas.tipo ~~* 'entrada' :: text
        )
    ) AS entradas,
    count(*) FILTER (
      WHERE
        (v_marcaciones_unificadas.tipo ~~* 'salida' :: text)
    ) AS salidas
  FROM
    v_marcaciones_unificadas
  GROUP BY
    v_marcaciones_unificadas.legajo,
    (date(v_marcaciones_unificadas.ts))
)
SELECT
  c.legajo,
  l.nombre,
  c.dia,
  c.entradas,
  c.salidas
FROM
  (
    clas c
    LEFT JOIN legajo l ON ((l.cod = c.legajo))
  )
WHERE
  (
    (c.entradas = 0)
    OR (c.salidas = 0)
  );
WITH rango AS (
  SELECT
    (
      generate_series(
        (
          (
            SELECT
              min(date(v_marcaciones_unificadas.ts)) AS min
            FROM
              v_marcaciones_unificadas
          )
        ) :: timestamp WITH time zone,
        (
          (
            SELECT
              max(date(v_marcaciones_unificadas.ts)) AS max
            FROM
              v_marcaciones_unificadas
          )
        ) :: timestamp WITH time zone,
        '1 day' :: INTERVAL
      )
    ) :: date AS dia
)
SELECT
  r.dia
FROM
  (
    rango r
    LEFT JOIN v_dias_con_marca d ON ((d.dia = r.dia))
  )
WHERE
  (d.dia IS NULL)
ORDER BY
  r.dia;
WITH presentes AS (
  SELECT
    date(v_marcaciones_unificadas.ts) AS dia,
    count(DISTINCT v_marcaciones_unificadas.legajo) AS total_presentes
  FROM
    huella.v_marcaciones_unificadas
  GROUP BY
    (date(v_marcaciones_unificadas.ts))
),
ausentes AS (
  SELECT
    v_ausentes_diarios.dia,
    count(*) AS total_ausentes
  FROM
    huella.v_ausentes_diarios
  GROUP BY
    v_ausentes_diarios.dia
)
SELECT
  d.dia,
  COALESCE(p.total_presentes, (0) :: bigint) AS presentes,
  COALESCE(a.total_ausentes, (0) :: bigint) AS ausentes
FROM
  (
    (
      huella.v_dias_con_marca d
      LEFT JOIN presentes p ON ((p.dia = d.dia))
    )
    LEFT JOIN ausentes a ON ((a.dia = d.dia))
  )
ORDER BY
  d.dia;
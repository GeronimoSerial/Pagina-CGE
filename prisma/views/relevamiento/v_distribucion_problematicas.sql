SELECT
  prob.dimension,
  prob.descripcion,
  count(DISTINCT ep.id_escuela) AS escuelas_afectadas,
  round(
    (
      ((count(DISTINCT ep.id_escuela)) :: numeric * 100.0) / (
        (
          SELECT
            count(*) AS count
          FROM
            institucional.escuela
        )
      ) :: numeric
    ),
    1
  ) AS porcentaje_total
FROM
  (
    relevamiento.problematica prob
    LEFT JOIN relevamiento.escuela_problematica ep ON ((prob.id_problematica = ep.id_problematica))
  )
WHERE
  ((prob.dimension) :: text <> 'NINGUNA' :: text)
GROUP BY
  prob.dimension,
  prob.descripcion
ORDER BY
  (count(DISTINCT ep.id_escuela)) DESC;
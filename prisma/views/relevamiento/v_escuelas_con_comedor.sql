SELECT
  (
    (
      (
        count(*) FILTER (
          WHERE
            (
              (
                cocina.datos ->> 'tiene_espacio_fisico_comedor' :: text
              ) = 'Sí' :: text
            )
        )
      ) :: numeric / (NULLIF(count(*), 0)) :: numeric
    ) * (100) :: numeric
  ) AS porcentaje_con_comedor,
  count(*) AS total_escuelas
FROM
  relevamiento.cocina;
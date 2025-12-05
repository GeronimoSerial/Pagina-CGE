SELECT
  count(*) FILTER (
    WHERE
      (
        (
          cocina.datos ->> 'tiene_personal_especializado' :: text
        ) = 'Sí' :: text
      )
  ) AS escuelas_con_especialistas,
  count(*) FILTER (
    WHERE
      (
        (
          cocina.datos ->> 'tiene_personal_especializado' :: text
        ) = 'No' :: text
      )
  ) AS escuelas_sin_especialistas,
  count(*) AS total
FROM
  relevamiento.cocina;
SELECT
  DISTINCT (
    date_trunc(
      'month' :: text,
      (v_asistencia_diaria.dia) :: timestamp WITH time zone
    )
  ) :: date AS mes,
  to_char(
    date_trunc(
      'month' :: text,
      (v_asistencia_diaria.dia) :: timestamp WITH time zone
    ),
    'TMMonth YYYY' :: text
  ) AS mes_nombre
FROM
  huella.v_asistencia_diaria
ORDER BY
  (
    (
      date_trunc(
        'month' :: text,
        (v_asistencia_diaria.dia) :: timestamp WITH time zone
      )
    ) :: date
  ) DESC;
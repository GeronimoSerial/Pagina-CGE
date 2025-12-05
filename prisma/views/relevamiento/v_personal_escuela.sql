SELECT
  e.id_escuela,
  e.cue,
  e.nombre AS escuela,
  COALESCE(pa.cantidad, 0) AS administrativos,
  COALESCE(pp.cantidad, 0) AS porteros,
  (
    COALESCE(pa.cantidad, 0) + COALESCE(pp.cantidad, 0)
  ) AS total_personal_no_docente
FROM
  (
    (
      institucional.escuela e
      LEFT JOIN relevamiento.personal pa ON (
        (
          (e.id_escuela = pa.id_escuela)
          AND (pa.id_personal_tipo = 1)
        )
      )
    )
    LEFT JOIN relevamiento.personal pp ON (
      (
        (e.id_escuela = pp.id_escuela)
        AND (pp.id_personal_tipo = 2)
      )
    )
  );
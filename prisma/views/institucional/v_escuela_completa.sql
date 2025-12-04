SELECT
  e.id_escuela,
  e.cue,
  e.nombre,
  e.telefono,
  e.mail,
  e.fecha_fundacion,
  e.anexo,
  m.descripcion AS modalidad,
  c.descripcion AS categoria,
  z.descripcion AS zona,
  z.codigo AS zona_codigo,
  t.descripcion AS turno,
  sc.nombre AS servicio_comida,
  ae.codigo AS ambito,
  l.nombre AS localidad,
  d.nombre AS departamento,
  (
    ((p.nombre) :: text || ' ' :: text) || (p.apellido) :: text
  ) AS supervisor,
  p.id_persona AS id_supervisor,
  (
    ((pd.nombre) :: text || ' ' :: text) || (pd.apellido) :: text
  ) AS director,
  pd.id_persona AS id_director,
  CASE
    WHEN (e.id_modalidad = 11) THEN false
    ELSE TRUE
  END AS tiene_modalidad,
  CASE
    WHEN (e.id_categoria = 0) THEN false
    ELSE TRUE
  END AS tiene_categoria,
  CASE
    WHEN (e.id_zona = 0) THEN false
    ELSE TRUE
  END AS tiene_zona,
  CASE
    WHEN (e.id_localidad IS NOT NULL) THEN TRUE
    ELSE false
  END AS tiene_localidad,
  CASE
    WHEN (se.id_persona IS NOT NULL) THEN TRUE
    ELSE false
  END AS tiene_supervisor,
  e.created_at,
  e.updated_at
FROM
  (
    (
      (
        (
          (
            (
              (
                (
                  (
                    (
                      (
                        (
                          institucional.escuela e
                          LEFT JOIN institucional.modalidad m ON ((e.id_modalidad = m.id_modalidad))
                        )
                        LEFT JOIN institucional.categoria c ON ((e.id_categoria = c.id_categoria))
                      )
                      LEFT JOIN institucional.zona z ON ((e.id_zona = z.id_zona))
                    )
                    LEFT JOIN institucional.turno t ON ((e.id_turno = t.id_turno))
                  )
                  LEFT JOIN institucional.servicio_comida sc ON ((e.id_serv_comida = sc.id_serv_comida))
                )
                LEFT JOIN institucional.ambito_escuela ae ON ((e.id_ambito = ae.id_ambito))
              )
              LEFT JOIN geografia.localidad l ON ((e.id_localidad = l.id_localidad))
            )
            LEFT JOIN geografia.departamento d ON ((l.id_departamento = d.id_departamento))
          )
          LEFT JOIN supervision.supervisor_escuela se ON ((e.id_escuela = se.id_escuela))
        )
        LEFT JOIN rrhh.persona p ON ((se.id_persona = p.id_persona))
      )
      LEFT JOIN institucional.director_escuela de ON (
        (
          (e.id_escuela = de.id_escuela)
          AND (de.fecha_fin IS NULL)
        )
      )
    )
    LEFT JOIN rrhh.persona pd ON ((de.id_persona = pd.id_persona))
  );
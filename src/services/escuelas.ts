import { prisma } from "@lib/prisma";


export async function getEscuelas() {
  return prisma.$queryRaw`
    SELECT
      e.id_escuela, e.cue, e.nombre,
      cat.descripcion AS categoria,
      z.descripcion AS zona,
      m.descripcion AS modalidad,
      t.descripcion AS turno,
      sc.nombre AS servicio_comida,
      amb.codigo AS ambito
    FROM institucional.escuela e
    LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
    LEFT JOIN institucional.servicio_comida sc ON e.id_serv_comida = sc.id_serv_comida
    LEFT JOIN institucional.ambito_escuela amb ON e.id_ambito = amb.id_ambito
    ORDER BY e.cue
    LIMIT 50;
  `
}


export async function getEscuelasPorCue(cue: bigint) {
    return await prisma.escuela.findUnique({
        where: { cue: cue },
        include: {
            categoria: true,
            zona: true,
            modalidad: true,
            turno: true,
            servicio_comida: true,
            ambito_escuela: true,
        },
    });
}

export async function getEscuelasPorDepartamento(id_departamento: number) {
  return prisma.$queryRaw`
    SELECT
      e.id_escuela, e.cue, e.nombre,
      cat.descripcion AS categoria,
      z.descripcion AS zona,
      m.descripcion AS modalidad,
      t.descripcion AS turno,
      sc.nombre AS servicio_comida,
      amb.codigo AS ambito
    FROM institucional.escuela e
    LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
    LEFT JOIN institucional.servicio_comida sc ON e.id_serv_comida = sc.id_serv_comida
    LEFT JOIN institucional.ambito_escuela amb ON e.id_ambito = amb.id_ambito
    JOIN infraestructura.edificio_escuela ee ON e.id_escuela = ee.id_escuela
    JOIN infraestructura.edificio ed ON ee.id_edificio = ed.id_edificio
    JOIN geografia.domicilio d ON ed.id_domicilio = d.id_domicilio
    JOIN geografia.localidad l ON d.id_localidad = l.id_localidad
    WHERE l.id_departamento = ${id_departamento}
    ORDER BY e.cue
    LIMIT 50;
  `
}
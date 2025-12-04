SELECT
  l.cod AS legajo,
  l.nombre,
  l.area,
  l.turno,
  l.estado,
  l.fecha_ingreso,
  l.dni,
  l.email,
  l.inactivo
FROM
  huella.legajo l;
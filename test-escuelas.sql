-- Script de prueba para las vistas de escuelas
-- Ejecutar con: psql DATABASE_URL -f test-escuelas.sql

\echo '🧪 Iniciando pruebas de vistas de escuelas...'
\echo ''

-- Test 1: Contadores básicos
\echo '1️⃣ Probando contadores básicos...'
SELECT
    (SELECT COUNT(*) FROM institucional.escuela) AS total_escuelas,
    (SELECT COUNT(DISTINCT id_persona) FROM supervision.supervisor_escuela) AS total_supervisores,
    (SELECT COUNT(*) FROM geografia.departamento) AS total_departamentos,
    (SELECT COUNT(*) FROM geografia.localidad) AS total_localidades;
\echo ''

-- Test 2: Vista v_escuela_completa (primeras 5)
\echo '2️⃣ Probando v_escuela_completa [primeras 5]...'
SELECT 
    id_escuela,
    cue,
    nombre,
    modalidad,
    zona,
    departamento,
    supervisor,
    tiene_supervisor
FROM institucional.v_escuela_completa
ORDER BY nombre
LIMIT 5;
\echo ''

-- Test 3: Vista materializada mv_estadisticas_sistema
\echo '3️⃣ Probando mv_estadisticas_sistema...'
SELECT * FROM institucional.mv_estadisticas_sistema;
\echo ''

-- Test 4: Vista v_distribucion_zona_modalidad
\echo '4️⃣ Probando v_distribucion_zona_modalidad...'
SELECT 
    zona,
    zona_codigo,
    comun,
    especial,
    adultos,
    inicial,
    total
FROM institucional.v_distribucion_zona_modalidad
ORDER BY zona_codigo
LIMIT 5;
\echo ''

-- Test 5: Función buscar_escuelas (sin filtros, primeras 10)
\echo '5️⃣ Probando función buscar_escuelas [primeras 10]...'
SELECT * FROM institucional.buscar_escuelas(
    NULL::TEXT,      -- termino
    NULL::INTEGER,   -- modalidad
    NULL::INTEGER,   -- zona
    NULL::INTEGER,   -- turno
    FALSE,           -- solo_sin_supervisor
    10,              -- limit
    0                -- offset
);
\echo ''

-- Test 6: Escuelas por zona
\echo '6️⃣ Probando escuelas por zona...'
SELECT 
    z.codigo,
    z.descripcion AS zona,
    COUNT(e.id_escuela) AS cantidad,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
FROM institucional.escuela e
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
GROUP BY z.id_zona, z.codigo, z.descripcion
ORDER BY z.codigo
LIMIT 5;
\echo ''

-- Test 7: Escuelas por modalidad
\echo '7️⃣ Probando escuelas por modalidad...'
SELECT 
    m.descripcion AS modalidad,
    COUNT(e.id_escuela) AS cantidad,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
GROUP BY m.id_modalidad, m.descripcion
ORDER BY cantidad DESC;
\echo ''

-- Test 8: Escuelas por departamento (primeros 5)
\echo '8️⃣ Probando escuelas por departamento [primeros 5]...'
SELECT 
    d.nombre AS departamento,
    COUNT(e.id_escuela) AS total_escuelas,
    COUNT(CASE WHEN se.id_escuela IS NOT NULL THEN 1 END) AS con_supervisor,
    COUNT(CASE WHEN se.id_escuela IS NULL THEN 1 END) AS sin_supervisor,
    ROUND(100.0 * COUNT(se.id_escuela) / NULLIF(COUNT(e.id_escuela), 0), 1) AS pct_supervisados
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
GROUP BY d.nombre
ORDER BY total_escuelas DESC
LIMIT 5;
\echo ''

-- Test 9: Supervisores con escuelas (primeros 5)
\echo '9️⃣ Probando supervisores con escuelas [primeros 5]...'
SELECT 
    p.nombre || ' ' || p.apellido AS supervisor,
    COUNT(se.id_escuela) AS total_escuelas
FROM rrhh.persona p
JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
GROUP BY p.id_persona, p.nombre, p.apellido
ORDER BY total_escuelas DESC
LIMIT 5;
\echo ''

-- Test 10: Datos para gráfico de modalidad
\echo '🔟 Probando datos para gráfico de modalidad...'
SELECT 
    m.descripcion AS label,
    COUNT(*) AS value
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
GROUP BY m.descripcion
ORDER BY value DESC;
\echo ''

-- Test 11: Top 10 departamentos
\echo '1️⃣1️⃣ Probando top 10 departamentos...'
SELECT 
    d.nombre AS label,
    COUNT(e.id_escuela) AS value
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
GROUP BY d.nombre
ORDER BY value DESC
LIMIT 10;
\echo ''

-- Test 12: Búsqueda por nombre/CUE
\echo '1️⃣2️⃣ Probando búsqueda por nombre/CUE con término "139"...'
SELECT 
    e.cue,
    e.nombre AS escuela,
    m.descripcion AS modalidad,
    d.nombre AS departamento,
    COALESCE(p.apellido || ', ' || p.nombre, 'Sin asignar') AS supervisor
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona
WHERE e.nombre ILIKE '%139%' OR e.cue::TEXT LIKE '139%'
ORDER BY e.nombre
LIMIT 5;
\echo ''

\echo '✅ ¡Todas las pruebas SQL completadas!'

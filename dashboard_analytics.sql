-- =============================================
-- DASHBOARD ANALYTICS COMPLETO
-- =============================================
-- Este archivo contiene vistas, vistas materializadas y funciones
-- para soportar un dashboard completo de gestión educativa

CREATE SCHEMA IF NOT EXISTS analytics;

-- =============================================
-- 1. GESTIÓN INSTITUCIONAL
-- =============================================

-- Vista consolidada de escuelas con todas sus relaciones
CREATE OR REPLACE VIEW analytics.v_escuelas_completo AS
SELECT  
    e.id_escuela,
    e.cue,
    e.nombre,
    e.anexo,
    e.fecha_fundacion,
    e.telefono,
    e.mail,
    cat.codigo as categoria_codigo,
    cat.descripcion as categoria,
    z.codigo as zona_codigo,
    z.descripcion as zona,
    m.descripcion as modalidad,
    t.descripcion as turno,
    sc.nombre as servicio_comida,
    ae.codigo as ambito,
    -- Escuela cabecera
    ec.nombre as escuela_cabecera,
    -- Timestamps
    e.created_at,
    e.updated_at
FROM institucional.escuela e
LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
LEFT JOIN institucional.servicio_comida sc ON e.id_serv_comida = sc.id_serv_comida
LEFT JOIN institucional.ambito_escuela ae ON e.id_ambito = ae.id_ambito
LEFT JOIN institucional.escuela ec ON e.cabecera_id = ec.id_escuela;

-- Directores activos con información de plaza
CREATE OR REPLACE VIEW analytics.v_directores_activos AS
SELECT 
    de.id_director_escuela,
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    p.id_persona,
    p.apellido || ', ' || p.nombre as director,
    p.dni,
    p.telefono,
    p.mail,
    pl.codigo_display as plaza,
    de.fecha_inicio,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, de.fecha_inicio)) as anios_en_cargo
FROM institucional.director_escuela de
JOIN institucional.escuela e ON de.id_escuela = e.id_escuela
JOIN rrhh.persona p ON de.id_persona = p.id_persona
JOIN vacantes.plaza pl ON de.id_plaza = pl.id_plaza AND de.id_escuela = pl.id_escuela
WHERE de.fecha_fin IS NULL;

-- Escuelas sin director asignado
CREATE OR REPLACE VIEW analytics.v_escuelas_sin_director AS
SELECT 
    e.id_escuela,
    e.cue,
    e.nombre,
    e.telefono,
    e.mail,
    cat.descripcion as categoria,
    z.descripcion as zona
FROM institucional.escuela e
LEFT JOIN institucional.director_escuela de ON e.id_escuela = de.id_escuela AND de.fecha_fin IS NULL
LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
WHERE de.id_director_escuela IS NULL;

-- =============================================
-- 2. ANÁLISIS GEOGRÁFICO
-- =============================================

-- Distribución de escuelas por departamento
CREATE OR REPLACE VIEW analytics.v_escuelas_por_departamento AS
SELECT 
    dep.id_departamento,
    dep.nombre as departamento,
    prov.nombre as provincia,
    COUNT(DISTINCT e.id_escuela) as total_escuelas,
    COUNT(DISTINCT e.id_escuela) FILTER (WHERE ae.codigo = 'URBANA') as escuelas_urbanas,
    COUNT(DISTINCT e.id_escuela) FILTER (WHERE ae.codigo = 'RURAL') as escuelas_rurales
FROM geografia.departamento dep
LEFT JOIN geografia.provincia prov ON dep.id_provincia = prov.id_provincia
LEFT JOIN geografia.localidad loc ON dep.id_departamento = loc.id_departamento
LEFT JOIN geografia.domicilio dom ON loc.id_localidad = dom.id_localidad
LEFT JOIN infraestructura.edificio ed ON dom.id_domicilio = ed.id_domicilio
LEFT JOIN institucional.escuela e ON 1=1 -- Placeholder: ajustar cuando exista relación escuela-edificio
LEFT JOIN institucional.ambito_escuela ae ON e.id_ambito = ae.id_ambito
GROUP BY dep.id_departamento, dep.nombre, prov.nombre;

-- =============================================
-- 3. RRHH Y VACANTES
-- =============================================

-- Resumen completo de vacantes por escuela
CREATE OR REPLACE VIEW analytics.v_resumen_vacantes_escuela AS
SELECT 
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    COUNT(v.id_vacante) as total_vacantes,
    COUNT(v.id_vacante) FILTER (WHERE v.estado = 'ABIERTA') as abiertas,
    COUNT(v.id_vacante) FILTER (WHERE v.estado = 'CUBIERTA') as cubiertas,
    COUNT(v.id_vacante) FILTER (WHERE v.estado = 'RESERVADA') as reservadas,
    COUNT(v.id_vacante) FILTER (WHERE v.estado = 'CERRADA') as cerradas,
    ROUND(
        100.0 * COUNT(v.id_vacante) FILTER (WHERE v.estado = 'CUBIERTA') / 
        NULLIF(COUNT(v.id_vacante), 0), 
        2
    ) as porcentaje_cobertura
FROM institucional.escuela e
LEFT JOIN vacantes.vacante v ON e.id_escuela = v.id_escuela
GROUP BY e.id_escuela, e.nombre, e.cue;

-- Detalle de asignaciones vigentes
CREATE OR REPLACE VIEW analytics.v_asignaciones_vigentes AS
SELECT 
    a.id_vacante,
    a.id_escuela,
    e.nombre as escuela,
    e.cue,
    c.codigo_display as codigo_cargo,
    c.descripcion as cargo,
    r.codigo as rol,
    p.apellido || ', ' || p.nombre as persona,
    p.dni,
    p.mail,
    p.telefono,
    a.fecha_asignacion,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, a.fecha_asignacion)) as anios_en_cargo,
    aut.sigla as autoridad,
    disp.numero || '/' || disp.anio as disposicion,
    disp.fecha as fecha_disposicion
FROM vacantes.asignacion a
JOIN vacantes.vacante v ON a.id_vacante = v.id_vacante AND a.id_escuela = v.id_escuela
JOIN institucional.escuela e ON a.id_escuela = e.id_escuela
JOIN vacantes.plaza pl ON v.id_plaza = pl.id_plaza AND v.id_escuela = pl.id_escuela
JOIN vacantes.cargo c ON pl.id_cargo = c.id_cargo
JOIN rrhh.rol r ON c.id_rol = r.id_rol
JOIN rrhh.persona p ON a.id_persona = p.id_persona
JOIN normativa.autoridad aut ON a.id_autoridad = aut.id_autoridad
JOIN normativa.disposicion disp ON a.id_disposicion = disp.id_disposicion;

-- Vacantes críticas (abiertas hace más de 90 días)
CREATE OR REPLACE VIEW analytics.v_vacantes_criticas AS
SELECT 
    v.id_vacante,
    v.id_escuela,
    e.nombre as escuela,
    e.cue,
    c.codigo_display as codigo_cargo,
    c.descripcion as cargo,
    v.fecha_vacante,
    CURRENT_DATE - v.fecha_vacante as dias_abierta,
    v.motivo,
    disp.numero || '/' || disp.anio as disposicion
FROM vacantes.vacante v
JOIN institucional.escuela e ON v.id_escuela = e.id_escuela
JOIN vacantes.plaza pl ON v.id_plaza = pl.id_plaza AND v.id_escuela = pl.id_escuela
JOIN vacantes.cargo c ON pl.id_cargo = c.id_cargo
JOIN normativa.disposicion disp ON v.id_disposicion = disp.id_disposicion
WHERE v.estado = 'ABIERTA' 
  AND CURRENT_DATE - v.fecha_vacante > 90;

-- Cargos por rol
CREATE OR REPLACE VIEW analytics.v_distribucion_cargos_rol AS
SELECT 
    r.codigo as rol,
    COUNT(DISTINCT c.id_cargo) as tipos_cargo,
    COUNT(pl.id_plaza) as total_plazas,
    COUNT(a.id_vacante) as plazas_ocupadas,
    COUNT(pl.id_plaza) - COUNT(a.id_vacante) as plazas_vacantes,
    ROUND(
        100.0 * COUNT(a.id_vacante) / NULLIF(COUNT(pl.id_plaza), 0),
        2
    ) as porcentaje_ocupacion
FROM rrhh.rol r
JOIN vacantes.cargo c ON r.id_rol = c.id_rol
LEFT JOIN vacantes.plaza pl ON c.id_cargo = pl.id_cargo
LEFT JOIN vacantes.vacante v ON pl.id_plaza = v.id_plaza AND pl.id_escuela = v.id_escuela
LEFT JOIN vacantes.asignacion a ON v.id_vacante = a.id_vacante AND v.id_escuela = a.id_escuela
GROUP BY r.id_rol, r.codigo;

-- =============================================
-- 4. ANÁLISIS TEMPORAL (TENDENCIAS)
-- =============================================

-- Evolución de matrícula por escuela
CREATE OR REPLACE VIEW analytics.v_tendencia_matricula AS
SELECT 
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    m.anio,
    m.cantidad as matricula,
    LAG(m.cantidad) OVER (PARTITION BY e.id_escuela ORDER BY m.anio) as matricula_anio_anterior,
    m.cantidad - LAG(m.cantidad) OVER (PARTITION BY e.id_escuela ORDER BY m.anio) as variacion_absoluta,
    ROUND(
        100.0 * (m.cantidad - LAG(m.cantidad) OVER (PARTITION BY e.id_escuela ORDER BY m.anio)) / 
        NULLIF(LAG(m.cantidad) OVER (PARTITION BY e.id_escuela ORDER BY m.anio), 0),
        2
    ) as variacion_porcentual
FROM institucional.escuela e
JOIN relevamiento.matricula m ON e.id_escuela = m.id_escuela
ORDER BY e.id_escuela, m.anio;

-- Escuelas con matrícula decreciente
CREATE OR REPLACE VIEW analytics.v_escuelas_matricula_decreciente AS
SELECT 
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    m_actual.anio as anio_actual,
    m_actual.cantidad as matricula_actual,
    m_anterior.cantidad as matricula_anterior,
    m_actual.cantidad - m_anterior.cantidad as variacion,
    ROUND(
        100.0 * (m_actual.cantidad - m_anterior.cantidad) / NULLIF(m_anterior.cantidad, 0),
        2
    ) as porcentaje_variacion
FROM institucional.escuela e
JOIN relevamiento.matricula m_actual ON e.id_escuela = m_actual.id_escuela
JOIN relevamiento.matricula m_anterior ON e.id_escuela = m_anterior.id_escuela 
    AND m_anterior.anio = m_actual.anio - 1
WHERE m_actual.anio = EXTRACT(YEAR FROM CURRENT_DATE)
  AND m_actual.cantidad < m_anterior.cantidad
ORDER BY porcentaje_variacion ASC;

-- Evolución de personal por tipo
CREATE OR REPLACE VIEW analytics.v_tendencia_personal AS
SELECT 
    pt.nombre as tipo_personal,
    p.anio,
    SUM(p.cantidad) as total,
    LAG(SUM(p.cantidad)) OVER (PARTITION BY pt.id_personal_tipo ORDER BY p.anio) as total_anio_anterior,
    SUM(p.cantidad) - LAG(SUM(p.cantidad)) OVER (PARTITION BY pt.id_personal_tipo ORDER BY p.anio) as variacion
FROM relevamiento.personal p
JOIN relevamiento.personal_tipo pt ON p.id_personal_tipo = pt.id_personal_tipo
GROUP BY pt.id_personal_tipo, pt.nombre, p.anio
ORDER BY pt.nombre, p.anio;

-- =============================================
-- 5. INFRAESTRUCTURA Y CONECTIVIDAD
-- =============================================

-- Estado de conectividad por escuela
CREATE OR REPLACE VIEW analytics.v_conectividad_escuelas AS
SELECT 
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    ec.fecha_relevamiento,
    prov.nombre as proveedor,
    tec.descripcion as tecnologia,
    cs.descripcion as calidad_servicio,
    ec.observaciones
FROM institucional.escuela e
LEFT JOIN infraestructura.edificio ed ON 1=1 -- Placeholder: ajustar relación
LEFT JOIN infraestructura.edificio_conexion ec ON ed.id_edificio = ec.id_edificio
LEFT JOIN infraestructura.proveedor prov ON ec.id_proveedor = prov.id_proveedor
LEFT JOIN infraestructura.tecnologia tec ON ec.id_tecnologia = tec.id_tecnologia
LEFT JOIN infraestructura.calidad_servicio cs ON ec.id_calidad_servicio = cs.id_calidad_servicio;

-- Escuelas sin conectividad
CREATE OR REPLACE VIEW analytics.v_escuelas_sin_conectividad AS
SELECT 
    e.id_escuela,
    e.cue,
    e.nombre,
    e.telefono,
    cat.descripcion as categoria,
    z.descripcion as zona,
    ae.codigo as ambito
FROM institucional.escuela e
LEFT JOIN infraestructura.edificio ed ON 1=1 -- Placeholder
LEFT JOIN infraestructura.edificio_conexion ec ON ed.id_edificio = ec.id_edificio
LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.ambito_escuela ae ON e.id_ambito = ae.id_ambito
WHERE ec.id_edificio_conexion IS NULL;

-- =============================================
-- 6. PROGRAMAS Y ACOMPAÑAMIENTO
-- =============================================

-- Escuelas en programas de acompañamiento
CREATE OR REPLACE VIEW analytics.v_escuelas_programas AS
SELECT 
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    pa.descripcion as programa,
    cat.descripcion as categoria,
    z.descripcion as zona
FROM institucional.escuela e
JOIN programas.escuela_programa ep ON e.id_escuela = ep.id_escuela
JOIN programas.programa_acompanamiento pa ON ep.id_programa = pa.id_programa
LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona;

-- Cobertura de programas
CREATE OR REPLACE VIEW analytics.v_cobertura_programas AS
SELECT 
    pa.descripcion as programa,
    COUNT(DISTINCT ep.id_escuela) as escuelas_participantes,
    COUNT(DISTINCT ep.id_escuela) FILTER (WHERE z.codigo = 'R') as escuelas_rurales,
    COUNT(DISTINCT ep.id_escuela) FILTER (WHERE z.codigo = 'U') as escuelas_urbanas
FROM programas.programa_acompanamiento pa
LEFT JOIN programas.escuela_programa ep ON pa.id_programa = ep.id_programa
LEFT JOIN institucional.escuela e ON ep.id_escuela = e.id_escuela
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
GROUP BY pa.id_programa, pa.descripcion;

-- =============================================
-- 7. SUPERVISIÓN
-- =============================================

-- Carga de trabajo por supervisor
CREATE OR REPLACE VIEW analytics.v_carga_supervisores AS
SELECT 
    p.id_persona,
    p.apellido || ', ' || p.nombre as supervisor,
    p.mail,
    p.telefono,
    c.descripcion as cargo,
    COUNT(se.id_escuela) as escuelas_asignadas,
    SUM(m.cantidad) as total_alumnos_supervisados
FROM rrhh.persona p
JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
JOIN vacantes.cargo c ON se.id_cargo = c.id_cargo
LEFT JOIN relevamiento.matricula m ON se.id_escuela = m.id_escuela 
    AND m.anio = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY p.id_persona, p.apellido, p.nombre, p.mail, p.telefono, c.descripcion;

-- Escuelas sin supervisor
CREATE OR REPLACE VIEW analytics.v_escuelas_sin_supervisor AS
SELECT 
    e.id_escuela,
    e.cue,
    e.nombre,
    cat.descripcion as categoria,
    z.descripcion as zona
FROM institucional.escuela e
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
WHERE se.id_escuela IS NULL;

-- =============================================
-- 8. PROBLEMÁTICAS
-- =============================================

-- Escuelas con problemáticas
CREATE OR REPLACE VIEW analytics.v_escuelas_problematicas AS
SELECT 
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    prob.dimension,
    prob.descripcion as problematica,
    cat.descripcion as categoria,
    z.descripcion as zona
FROM institucional.escuela e
JOIN relevamiento.escuela_problematica ep ON e.id_escuela = ep.id_escuela
JOIN relevamiento.problematica prob ON ep.id_problematica = prob.id_problematica
LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona;

-- Resumen de problemáticas por dimensión
CREATE OR REPLACE VIEW analytics.v_resumen_problematicas AS
SELECT 
    prob.dimension,
    prob.descripcion,
    COUNT(DISTINCT ep.id_escuela) as escuelas_afectadas,
    COUNT(DISTINCT ep.id_escuela) FILTER (WHERE z.codigo = 'R') as escuelas_rurales,
    COUNT(DISTINCT ep.id_escuela) FILTER (WHERE z.codigo = 'U') as escuelas_urbanas
FROM relevamiento.problematica prob
LEFT JOIN relevamiento.escuela_problematica ep ON prob.id_problematica = ep.id_problematica
LEFT JOIN institucional.escuela e ON ep.id_escuela = e.id_escuela
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
GROUP BY prob.id_problematica, prob.dimension, prob.descripcion;

-- =============================================
-- 9. CUMPLIMIENTO ADMINISTRATIVO
-- =============================================

-- Cumplimiento de novedades (mes actual)
CREATE OR REPLACE VIEW analytics.v_cumplimiento_novedades_actual AS
SELECT 
    e.id_escuela,
    e.nombre,
    e.cue,
    CASE WHEN pn.id_planilla IS NOT NULL THEN TRUE ELSE FALSE END as envio_realizado,
    pn.fecha_envio,
    pn.estado,
    u.email as usuario_envio,
    cat.descripcion as categoria,
    z.descripcion as zona
FROM institucional.escuela e
LEFT JOIN institucional.planilla_novedades pn 
    ON e.id_escuela = pn.id_escuela 
    AND pn.mes = EXTRACT(MONTH FROM CURRENT_DATE) 
    AND pn.anio = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN auth."user" u ON pn.usuario_envio = u.id
LEFT JOIN institucional.categoria cat ON e.id_categoria = cat.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona;

-- Histórico de cumplimiento por escuela
CREATE OR REPLACE VIEW analytics.v_historico_cumplimiento AS
SELECT 
    e.id_escuela,
    e.nombre as escuela,
    e.cue,
    pn.anio,
    COUNT(pn.id_planilla) as meses_reportados,
    12 - COUNT(pn.id_planilla) as meses_faltantes,
    ROUND(100.0 * COUNT(pn.id_planilla) / 12, 2) as porcentaje_cumplimiento
FROM institucional.escuela e
CROSS JOIN generate_series(2020, EXTRACT(YEAR FROM CURRENT_DATE)::int) as anios(anio)
LEFT JOIN institucional.planilla_novedades pn 
    ON e.id_escuela = pn.id_escuela 
    AND pn.anio = anios.anio
GROUP BY e.id_escuela, e.nombre, e.cue, pn.anio
ORDER BY e.id_escuela, pn.anio;

-- =============================================
-- 10. VISTAS MATERIALIZADAS (KPIs)
-- =============================================

-- KPI Globales
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_kpi_globales AS
SELECT
    (SELECT COUNT(*) FROM institucional.escuela) as total_escuelas,
    (SELECT COUNT(*) FROM institucional.escuela WHERE id_ambito = (SELECT id_ambito FROM institucional.ambito_escuela WHERE codigo = 'RURAL')) as escuelas_rurales,
    (SELECT COUNT(*) FROM institucional.escuela WHERE id_ambito = (SELECT id_ambito FROM institucional.ambito_escuela WHERE codigo = 'URBANA')) as escuelas_urbanas,
    (SELECT SUM(cantidad) FROM relevamiento.matricula WHERE anio = EXTRACT(YEAR FROM CURRENT_DATE)) as total_alumnos,
    (SELECT SUM(cantidad) FROM relevamiento.personal WHERE anio = EXTRACT(YEAR FROM CURRENT_DATE)) as total_personal,
    (SELECT COUNT(*) FROM rrhh.persona) as total_agentes,
    (SELECT COUNT(*) FROM vacantes.vacante WHERE estado = 'ABIERTA') as vacantes_abiertas,
    (SELECT COUNT(*) FROM vacantes.vacante WHERE estado = 'CUBIERTA') as vacantes_cubiertas,
    (SELECT COUNT(*) FROM vacantes.vacante) as total_vacantes,
    (SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE estado = 'CUBIERTA') / NULLIF(COUNT(*), 0), 2) FROM vacantes.vacante) as porcentaje_cobertura,
    (SELECT COUNT(*) FROM institucional.escuela e LEFT JOIN institucional.director_escuela de ON e.id_escuela = de.id_escuela AND de.fecha_fin IS NULL WHERE de.id_director_escuela IS NULL) as escuelas_sin_director,
    NOW() as ultima_actualizacion;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_kpi_globales_unique ON analytics.mv_kpi_globales (ultima_actualizacion);

-- KPIs por Zona
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_kpi_por_zona AS
SELECT
    z.codigo as zona_codigo,
    z.descripcion as zona,
    COUNT(DISTINCT e.id_escuela) as total_escuelas,
    SUM(m.cantidad) as total_alumnos,
    COUNT(DISTINCT v.id_vacante) as total_vacantes,
    COUNT(DISTINCT v.id_vacante) FILTER (WHERE v.estado = 'ABIERTA') as vacantes_abiertas,
    ROUND(
        100.0 * COUNT(DISTINCT v.id_vacante) FILTER (WHERE v.estado = 'CUBIERTA') / 
        NULLIF(COUNT(DISTINCT v.id_vacante), 0),
        2
    ) as porcentaje_cobertura,
    NOW() as ultima_actualizacion
FROM institucional.zona z
LEFT JOIN institucional.escuela e ON z.id_zona = e.id_zona
LEFT JOIN relevamiento.matricula m ON e.id_escuela = m.id_escuela AND m.anio = EXTRACT(YEAR FROM CURRENT_DATE)
LEFT JOIN vacantes.vacante v ON e.id_escuela = v.id_escuela
GROUP BY z.id_zona, z.codigo, z.descripcion;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_kpi_zona_unique ON analytics.mv_kpi_por_zona (zona_codigo);

-- =============================================
-- 11. FUNCIONES ÚTILES
-- =============================================

-- Función para refrescar todas las vistas materializadas
CREATE OR REPLACE FUNCTION analytics.refresh_all_materialized_views()
RETURNS TABLE(vista text, duracion interval) AS $$
DECLARE
    start_time timestamp;
    vista_nombre text;
BEGIN
    FOR vista_nombre IN 
        SELECT matviewname 
        FROM pg_matviews 
        WHERE schemaname = 'analytics'
    LOOP
        start_time := clock_timestamp();
        EXECUTE 'REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.' || vista_nombre;
        RETURN QUERY SELECT vista_nombre, clock_timestamp() - start_time;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de una escuela
CREATE OR REPLACE FUNCTION analytics.get_estadisticas_escuela(p_id_escuela int)
RETURNS TABLE(
    escuela text,
    cue bigint,
    matricula_actual int,
    total_personal int,
    total_vacantes int,
    vacantes_abiertas int,
    tiene_director boolean,
    tiene_supervisor boolean,
    programas_activos int,
    problematicas_identificadas int
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.nombre,
        e.cue,
        COALESCE(m.cantidad, 0)::int,
        COALESCE(SUM(p.cantidad), 0)::int,
        COUNT(DISTINCT v.id_vacante)::int,
        COUNT(DISTINCT v.id_vacante) FILTER (WHERE v.estado = 'ABIERTA')::int,
        EXISTS(SELECT 1 FROM institucional.director_escuela de WHERE de.id_escuela = p_id_escuela AND de.fecha_fin IS NULL),
        EXISTS(SELECT 1 FROM supervision.supervisor_escuela se WHERE se.id_escuela = p_id_escuela),
        COUNT(DISTINCT ep.id_programa)::int,
        COUNT(DISTINCT epr.id_problematica)::int
    FROM institucional.escuela e
    LEFT JOIN relevamiento.matricula m ON e.id_escuela = m.id_escuela AND m.anio = EXTRACT(YEAR FROM CURRENT_DATE)
    LEFT JOIN relevamiento.personal p ON e.id_escuela = p.id_escuela AND p.anio = EXTRACT(YEAR FROM CURRENT_DATE)
    LEFT JOIN vacantes.vacante v ON e.id_escuela = v.id_escuela
    LEFT JOIN programas.escuela_programa ep ON e.id_escuela = ep.id_escuela
    LEFT JOIN relevamiento.escuela_problematica epr ON e.id_escuela = epr.id_escuela
    WHERE e.id_escuela = p_id_escuela
    GROUP BY e.id_escuela, e.nombre, e.cue, m.cantidad;
END;
$$ LANGUAGE plpgsql;

-- Comentarios en las vistas principales
COMMENT ON VIEW analytics.v_escuelas_completo IS 'Vista consolidada con toda la información de escuelas';
COMMENT ON VIEW analytics.v_resumen_vacantes_escuela IS 'Resumen de estado de vacantes por escuela con porcentaje de cobertura';
COMMENT ON MATERIALIZED VIEW analytics.mv_kpi_globales IS 'KPIs globales del sistema - refrescar diariamente';
COMMENT ON FUNCTION analytics.refresh_all_materialized_views() IS 'Refresca todas las vistas materializadas del esquema analytics';

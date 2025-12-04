-- Vistas y funciones para gestión de escuelas
-- Este archivo contiene las definiciones a ejecutar en la base de datos

-- =====================================================
-- VISTA: v_escuela_completa
-- Escuela con todos sus datos relacionados
-- =====================================================
CREATE OR REPLACE VIEW institucional.v_escuela_completa AS
SELECT e.id_escuela,
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
       p.nombre || ' ' || p.apellido AS supervisor,
       p.id_persona AS id_supervisor,
       CASE
           WHEN e.id_modalidad = 11 THEN false
           ELSE true
       END AS tiene_modalidad,
       CASE
           WHEN e.id_categoria = 0 THEN false
           ELSE true
       END AS tiene_categoria,
       CASE
           WHEN e.id_zona = 0 THEN false
           ELSE true
       END AS tiene_zona,
       CASE
           WHEN e.id_localidad IS NOT NULL THEN true
           ELSE false
       END AS tiene_localidad,
       CASE
           WHEN se.id_persona IS NOT NULL THEN true
           ELSE false
       END AS tiene_supervisor,
       e.created_at,
       e.updated_at
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
LEFT JOIN institucional.servicio_comida sc ON e.id_serv_comida = sc.id_serv_comida
LEFT JOIN institucional.ambito_escuela ae ON e.id_ambito = ae.id_ambito
LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona;

-- =====================================================
-- VISTA MATERIALIZADA: mv_estadisticas_sistema
-- Estadísticas globales del sistema
-- =====================================================
DROP MATERIALIZED VIEW IF EXISTS institucional.mv_estadisticas_sistema;

CREATE MATERIALIZED VIEW institucional.mv_estadisticas_sistema AS 
WITH base AS (
    SELECT COUNT(*) AS total_escuelas,
           COUNT(CASE WHEN id_modalidad != 11 THEN 1 END) AS escuelas_con_modalidad,
           COUNT(CASE WHEN id_categoria != 0 THEN 1 END) AS escuelas_con_categoria,
           COUNT(CASE WHEN id_zona != 0 THEN 1 END) AS escuelas_con_zona,
           COUNT(CASE WHEN id_turno != 1 THEN 1 END) AS escuelas_con_turno
    FROM institucional.escuela
),
supervision_stats AS (
    SELECT COUNT(DISTINCT id_escuela) AS escuelas_con_supervisor,
           COUNT(DISTINCT id_persona) AS total_supervisores
    FROM supervision.supervisor_escuela
),
staging_stats AS (
    SELECT
        (SELECT COUNT(*) FROM staging.escuelas_revision) AS escuelas_pendientes,
        (SELECT COUNT(*) FROM staging.supervisor_revision) AS supervisiones_pendientes
)
SELECT b.total_escuelas,
       b.escuelas_con_modalidad,
       b.escuelas_con_categoria,
       b.escuelas_con_zona,
       b.escuelas_con_turno,
       s.escuelas_con_supervisor,
       b.total_escuelas - s.escuelas_con_supervisor AS escuelas_sin_supervisor,
       s.total_supervisores,
       ROUND(100.0 * b.escuelas_con_modalidad / NULLIF(b.total_escuelas, 0), 1) AS pct_con_modalidad,
       ROUND(100.0 * s.escuelas_con_supervisor / NULLIF(b.total_escuelas, 0), 1) AS pct_con_supervisor,
       st.escuelas_pendientes,
       st.supervisiones_pendientes,
       NOW() AS ultima_actualizacion
FROM base b,
     supervision_stats s,
     staging_stats st;

-- Índice para refresh concurrente
CREATE UNIQUE INDEX ON institucional.mv_estadisticas_sistema(ultima_actualizacion);

-- =====================================================
-- VISTA: v_distribucion_zona_modalidad
-- Distribución cruzada de escuelas por zona y modalidad
-- =====================================================
CREATE OR REPLACE VIEW institucional.v_distribucion_zona_modalidad AS
SELECT z.descripcion AS zona,
       z.codigo AS zona_codigo,
       COUNT(*) FILTER (WHERE m.descripcion = 'COMÚN') AS comun,
       COUNT(*) FILTER (WHERE m.descripcion = 'ESPECIAL') AS especial,
       COUNT(*) FILTER (WHERE m.descripcion = 'ADULTOS') AS adultos,
       COUNT(*) FILTER (WHERE m.descripcion = 'INICIAL') AS inicial,
       COUNT(*) FILTER (WHERE m.descripcion = 'HOSPITALARIA Y DOMICILIARIA') AS hospitalaria,
       COUNT(*) FILTER (WHERE m.descripcion = 'CONTEXTOS DE ENCIERRO') AS contextos_encierro,
       COUNT(*) FILTER (WHERE m.descripcion = 'DESCONOCIDO') AS sin_modalidad,
       COUNT(*) AS total
FROM institucional.escuela e
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
GROUP BY z.descripcion, z.codigo
ORDER BY z.codigo;

-- =====================================================
-- FUNCIÓN: buscar_escuelas
-- Búsqueda parametrizada de escuelas
-- =====================================================
CREATE OR REPLACE FUNCTION institucional.buscar_escuelas(
    p_termino TEXT DEFAULT NULL, 
    p_modalidad INTEGER DEFAULT NULL, 
    p_zona INTEGER DEFAULT NULL, 
    p_turno INTEGER DEFAULT NULL, 
    p_solo_sin_supervisor BOOLEAN DEFAULT FALSE, 
    p_limit INTEGER DEFAULT 50, 
    p_offset INTEGER DEFAULT 0
) 
RETURNS TABLE (
    id_escuela INTEGER, 
    cue BIGINT, 
    nombre VARCHAR, 
    modalidad VARCHAR, 
    zona VARCHAR, 
    turno VARCHAR, 
    supervisor TEXT, 
    tiene_supervisor BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id_escuela,
        e.cue,
        e.nombre,
        m.descripcion AS modalidad,
        z.descripcion AS zona,
        t.descripcion AS turno,
        COALESCE(p.nombre || ' ' || p.apellido, 'Sin asignar') AS supervisor,
        se.id_persona IS NOT NULL AS tiene_supervisor
    FROM institucional.escuela e
    LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
    LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
    LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
    LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
    LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona
    WHERE
        (p_termino IS NULL OR e.nombre ILIKE '%' || p_termino || '%' OR e.cue::TEXT LIKE p_termino || '%')
        AND (p_modalidad IS NULL OR e.id_modalidad = p_modalidad)
        AND (p_zona IS NULL OR e.id_zona = p_zona)
        AND (p_turno IS NULL OR e.id_turno = p_turno)
        AND (NOT p_solo_sin_supervisor OR se.id_persona IS NULL)
    ORDER BY e.nombre
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

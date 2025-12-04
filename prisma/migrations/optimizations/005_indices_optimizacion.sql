-- ============================================================================
-- ÍNDICES DE OPTIMIZACIÓN
-- Mejoran el rendimiento de las vistas y queries frecuentes
-- ============================================================================

-- ============================================================================
-- TABLA: marcas
-- Principal tabla de consulta con millones de registros
-- ============================================================================

-- Índice compuesto para queries por empleado y rango de fechas
-- Usado por: v_asistencia_diaria, v_marcaciones_unificadas
CREATE INDEX IF NOT EXISTS idx_marcas_legajo_ts_optimized 
ON huella.marcas (legajo, ts DESC)
WHERE duplicado = false;

-- Índice para búsquedas por fecha (extrae la parte de fecha del timestamp)
-- Mejora GROUP BY date(ts) en vistas
CREATE INDEX IF NOT EXISTS idx_marcas_ts_date 
ON huella.marcas ((ts::date));

-- Índice para el campo origen si se filtra frecuentemente
CREATE INDEX IF NOT EXISTS idx_marcas_origen 
ON huella.marcas (origen) 
WHERE origen != 'reloj';

-- Índice parcial para marcas no duplicadas (las más consultadas)
CREATE INDEX IF NOT EXISTS idx_marcas_no_duplicados 
ON huella.marcas (legajo, ts DESC) 
WHERE duplicado = false;

-- ============================================================================
-- TABLA: legajo
-- Tabla maestra de empleados
-- ============================================================================

-- Índice parcial para empleados activos (consulta más frecuente)
CREATE INDEX IF NOT EXISTS idx_legajo_activo 
ON huella.legajo (cod) 
WHERE COALESCE(inactivo, false) = false;

-- Índice para búsquedas por área
CREATE INDEX IF NOT EXISTS idx_legajo_area 
ON huella.legajo (area) 
WHERE area IS NOT NULL;

-- Índice para búsquedas por nombre (para autocomplete/búsqueda)
CREATE INDEX IF NOT EXISTS idx_legajo_nombre_trgm 
ON huella.legajo USING gin (nombre gin_trgm_ops);

-- Nota: El índice trigram requiere extensión pg_trgm
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- TABLA: excepciones_asistencia
-- Consultas por rango de fechas
-- ============================================================================

-- Índice para consultas de excepciones vigentes
CREATE INDEX IF NOT EXISTS idx_excepciones_vigentes 
ON huella.excepciones_asistencia (fecha_inicio, fecha_fin)
WHERE fecha_fin >= CURRENT_DATE;

-- ============================================================================
-- TABLA: feriados
-- Joins frecuentes con generate_series
-- ============================================================================

-- El índice en fecha ya existe, verificar que sea el óptimo
DROP INDEX IF EXISTS huella.idx_feriados_fecha;
CREATE INDEX idx_feriados_fecha 
ON huella.feriados (fecha);

-- ============================================================================
-- TABLA: config_jornada
-- Joins con legajo
-- ============================================================================

-- Índice ya existe, pero asegurar que sea covering
DROP INDEX IF EXISTS huella.idx_config_jornada_legajo;
CREATE INDEX idx_config_jornada_legajo 
ON huella.config_jornada (legajo) 
INCLUDE (horas_jornada);

-- ============================================================================
-- TABLA: whitelist_empleados
-- Consultas de estado activo
-- ============================================================================

-- Índice parcial para whitelist activa
CREATE INDEX IF NOT EXISTS idx_whitelist_activo_legajo 
ON huella.whitelist_empleados (legajo) 
WHERE activo = true;

-- ============================================================================
-- ESTADÍSTICAS Y ANALYZE
-- ============================================================================

-- Actualizar estadísticas después de crear índices
ANALYZE huella.marcas;
ANALYZE huella.legajo;
ANALYZE huella.excepciones_asistencia;
ANALYZE huella.feriados;
ANALYZE huella.config_jornada;
ANALYZE huella.whitelist_empleados;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Query para verificar los índices creados
-- SELECT 
--   schemaname, 
--   tablename, 
--   indexname, 
--   indexdef
-- FROM pg_indexes 
-- WHERE schemaname = 'huella'
-- ORDER BY tablename, indexname;

-- Query para ver tamaño de índices
-- SELECT
--   indexrelname AS index_name,
--   pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'huella'
-- ORDER BY pg_relation_size(indexrelid) DESC;

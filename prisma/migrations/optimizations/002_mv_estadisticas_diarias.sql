-- ============================================================================
-- MATERIALIZED VIEW: mv_estadisticas_diarias
-- Optimización para consultas de estadísticas diarias del dashboard
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS huella.mv_estadisticas_diarias CASCADE;

CREATE MATERIALIZED VIEW huella.mv_estadisticas_diarias AS
SELECT
  dia,
  presentes::int,
  ausentes::int,
  NOW() AS ultima_actualizacion
FROM huella.v_estadisticas_diarias
WHERE dia >= (CURRENT_DATE - INTERVAL '90 days')
ORDER BY dia DESC;

-- Índice único para REFRESH CONCURRENTLY
CREATE UNIQUE INDEX idx_mv_estadisticas_diarias_dia 
ON huella.mv_estadisticas_diarias (dia);

-- Índice para rangos de fecha
CREATE INDEX idx_mv_estadisticas_diarias_dia_desc 
ON huella.mv_estadisticas_diarias (dia DESC);

COMMENT ON MATERIALIZED VIEW huella.mv_estadisticas_diarias IS 
'Vista materializada de estadísticas diarias (últimos 90 días). Actualizar con: REFRESH MATERIALIZED VIEW CONCURRENTLY huella.mv_estadisticas_diarias';

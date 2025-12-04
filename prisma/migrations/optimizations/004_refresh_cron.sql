-- ============================================================================
-- FUNCIÓN Y CRON: Refresh automático de vistas materializadas
-- ============================================================================

-- Función para refrescar todas las vistas materializadas
CREATE OR REPLACE FUNCTION huella.refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  -- Refresh concurrente (no bloquea lecturas)
  REFRESH MATERIALIZED VIEW CONCURRENTLY huella.mv_empleados_problematicos;
  REFRESH MATERIALIZED VIEW CONCURRENTLY huella.mv_estadisticas_diarias;
  REFRESH MATERIALIZED VIEW CONCURRENTLY huella.mv_reporte_liquidacion;
  
  RAISE NOTICE 'Todas las vistas materializadas han sido actualizadas: %', NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION huella.refresh_all_materialized_views() IS 
'Refresca todas las vistas materializadas del schema huella de forma concurrente';

-- ============================================================================
-- OPCIÓN 1: Usando pg_cron (si está instalado)
-- ============================================================================

-- Habilitar extensión pg_cron (requiere superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar refresh diario a las 03:00 AM
-- SELECT cron.schedule(
--   'refresh_materialized_views',
--   '0 3 * * *',
--   $$SELECT huella.refresh_all_materialized_views()$$
-- );

-- ============================================================================
-- OPCIÓN 2: Usando crontab del sistema operativo
-- ============================================================================

-- Agregar al crontab del servidor:
-- 0 3 * * * psql -U usuario -d database -c "SELECT huella.refresh_all_materialized_views();"

-- ============================================================================
-- OPCIÓN 3: Refresh más frecuente para mv_empleados_problematicos
-- ============================================================================

-- Si necesitas datos más frescos para empleados problemáticos:
CREATE OR REPLACE FUNCTION huella.refresh_empleados_problematicos()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY huella.mv_empleados_problematicos;
  RAISE NOTICE 'mv_empleados_problematicos actualizado: %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Programar cada 4 horas:
-- SELECT cron.schedule(
--   'refresh_empleados_problematicos',
--   '0 */4 * * *',
--   $$SELECT huella.refresh_empleados_problematicos()$$
-- );

-- ============================================================================
-- TABLA DE LOG para tracking de refreshes (opcional)
-- ============================================================================

CREATE TABLE IF NOT EXISTS huella.mv_refresh_log (
  id SERIAL PRIMARY KEY,
  view_name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT
);

-- Función mejorada con logging
CREATE OR REPLACE FUNCTION huella.refresh_all_materialized_views_with_log()
RETURNS void AS $$
DECLARE
  start_time TIMESTAMP WITH TIME ZONE;
  view_names TEXT[] := ARRAY[
    'mv_empleados_problematicos',
    'mv_estadisticas_diarias',
    'mv_reporte_liquidacion'
  ];
  v_name TEXT;
BEGIN
  FOREACH v_name IN ARRAY view_names
  LOOP
    start_time := NOW();
    
    BEGIN
      EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY huella.%I', v_name);
      
      INSERT INTO huella.mv_refresh_log (view_name, started_at, completed_at, duration_ms, success)
      VALUES (v_name, start_time, NOW(), EXTRACT(MILLISECONDS FROM (NOW() - start_time))::INTEGER, TRUE);
      
    EXCEPTION WHEN OTHERS THEN
      INSERT INTO huella.mv_refresh_log (view_name, started_at, completed_at, success, error_message)
      VALUES (v_name, start_time, NOW(), FALSE, SQLERRM);
      RAISE WARNING 'Error refreshing %: %', v_name, SQLERRM;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Ver historial de refreshes:
-- SELECT * FROM huella.mv_refresh_log ORDER BY started_at DESC LIMIT 20;

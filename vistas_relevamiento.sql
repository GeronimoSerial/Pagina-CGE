-- VISTA: Indicadores de recursos humanos
-- Analiza la distribución de personal especializado en cocina
CREATE OR REPLACE VIEW relevamiento.v_personal_cocina AS
SELECT
  COUNT(*) FILTER (WHERE datos->>'tiene_personal_especializado' = 'Sí') AS escuelas_con_especialistas,
  COUNT(*) FILTER (WHERE datos->>'tiene_personal_especializado' = 'No') AS escuelas_sin_especialistas,
  COUNT(*) AS total
FROM relevamiento.cocina;

-- VISTA: Porcentaje de escuelas con comedor
-- Calcula el porcentaje de escuelas que tienen espacio físico para comedor
CREATE OR REPLACE VIEW relevamiento.v_escuelas_con_comedor AS
SELECT
  COUNT(*) FILTER (WHERE datos->>'tiene_espacio_fisico_comedor' = 'Sí')::decimal
    / NULLIF(COUNT(*), 0) * 100 AS porcentaje_con_comedor,
  COUNT(*) AS total_escuelas
FROM relevamiento.cocina;

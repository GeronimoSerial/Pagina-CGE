-- =====================================================
-- Extensiones requeridas para búsquedas difusas
-- =====================================================
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- Wrapper IMMUTABLE para unaccent
-- PostgreSQL requiere funciones IMMUTABLE para índices
-- La función unaccent por defecto es STABLE, no IMMUTABLE
-- =====================================================
CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
RETURNS text AS $$
  SELECT public.unaccent('public.unaccent', $1)
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

-- =====================================================
-- Índices GIN con trigramas para búsquedas difusas
-- Usan el wrapper immutable_unaccent
-- =====================================================

-- Empleados / legajos
CREATE INDEX IF NOT EXISTS idx_legajo_nombre_trgm
  ON huella.legajo
  USING gin (public.immutable_unaccent(nombre) gin_trgm_ops);

-- Personas (rrhh) usadas en supervisores
CREATE INDEX IF NOT EXISTS idx_persona_nombre_trgm
  ON rrhh.persona
  USING gin (public.immutable_unaccent(nombre) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_persona_apellido_trgm
  ON rrhh.persona
  USING gin (public.immutable_unaccent(apellido) gin_trgm_ops);

-- Escuelas
CREATE INDEX IF NOT EXISTS idx_escuela_nombre_trgm
  ON institucional.escuela
  USING gin (public.immutable_unaccent(nombre) gin_trgm_ops);

-- Geografía
CREATE INDEX IF NOT EXISTS idx_localidad_nombre_trgm
  ON geografia.localidad
  USING gin (public.immutable_unaccent(nombre) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_departamento_nombre_trgm
  ON geografia.departamento
  USING gin (public.immutable_unaccent(nombre) gin_trgm_ops);

-- =====================================================
-- Configuración opcional de thresholds de similitud
-- Descomentar para ajustar sensibilidad de búsqueda
-- =====================================================
-- SELECT set_config('pg_trgm.similarity_threshold', '0.25', false);
-- SELECT set_config('pg_trgm.word_similarity_threshold', '0.3', false);

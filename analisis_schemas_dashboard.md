# Análisis de Schemas de Base de Datos para Dashboard CGE

> **Fecha de análisis**: 4 de diciembre de 2025  
> **Base de datos**: PostgreSQL  
> **Schemas analizados**: `geografia`, `infraestructura`, `institucional`, `normativa`, `programas`, `relevamiento`, `rrhh`, `staging`, `supervision`, `vacantes`

---

## 📊 Resumen Ejecutivo

| Schema            | Tablas | Registros Principales             | Estado           |
| ----------------- | ------ | --------------------------------- | ---------------- |
| `institucional`   | 9      | 1,304 escuelas                    | ✅ Producción    |
| `supervision`     | 1      | 742 asignaciones                  | ✅ Producción    |
| `geografia`       | 4      | 25 departamentos, 529 localidades | ✅ Producción    |
| `rrhh`            | 2      | 15 personas, 6 roles              | ✅ Producción    |
| `vacantes`        | 4      | 2 cargos                          | 🔄 En desarrollo |
| `normativa`       | 2      | 1 autoridad                       | 🔄 En desarrollo |
| `infraestructura` | 5      | 0 registros                       | 📋 Vacío         |
| `programas`       | 2      | 0 registros                       | 📋 Vacío         |
| `relevamiento`    | 5      | 0 registros                       | 📋 Vacío         |
| `staging`         | 2      | 160 revisiones                    | 🔄 ETL pendiente |

---

## 🗂️ Schema: `institucional`

### Tablas Principales

#### `escuela` (1,304 registros)

Entidad central del sistema educativo.

| Campo                      | Tipo        | Descripción                             |
| -------------------------- | ----------- | --------------------------------------- |
| `id_escuela`               | INTEGER     | PK, identificador único                 |
| `cue`                      | BIGINT      | Código Único de Establecimiento (único) |
| `nombre`                   | VARCHAR     | Nombre de la escuela                    |
| `telefono`, `mail`         | VARCHAR     | Datos de contacto                       |
| `fecha_fundacion`          | DATE        | Fecha de fundación                      |
| `id_modalidad`             | INTEGER     | FK a modalidad                          |
| `id_categoria`             | INTEGER     | FK a categoría                          |
| `id_zona`                  | INTEGER     | FK a zona                               |
| `id_turno`                 | INTEGER     | FK a turno                              |
| `id_serv_comida`           | INTEGER     | FK a servicio_comida                    |
| `id_ambito`                | INTEGER     | FK a ambito_escuela                     |
| `id_localidad`             | INTEGER     | FK a geografia.localidad                |
| `cabecera_id`              | INTEGER     | Self-reference para anexos              |
| `anexo`                    | CHAR(2)     | Código de anexo (default '00')          |
| `created_at`, `updated_at` | TIMESTAMPTZ | Timestamps de auditoría                 |

**Índices destacados**:

- `idx_escuela_nombre_trgm` - Búsqueda por trigrama (GIN) para búsquedas fuzzy
- `idx_escuela_categoria_zona` - Índice compuesto para filtros comunes
- `idx_escuela_modalidad_turno` - Índice compuesto para análisis

#### Tablas de Referencia

| Tabla             | Registros | Valores                                                                |
| ----------------- | --------- | ---------------------------------------------------------------------- |
| `modalidad`       | 7         | COMÚN, ESPECIAL, ADULTOS, INICIAL, HOSPITALARIA, CONTEXTOS DE ENCIERRO |
| `categoria`       | 5         | Categorías 0-4                                                         |
| `zona`            | 6         | A (Urbana Céntrica) → E (Rural Inhóspita)                              |
| `turno`           | 6         | MAÑANA, TARDE, NOCHE, JORNADA COMPLETA/EXTENDIDA                       |
| `servicio_comida` | 7         | SIN SERVICIO, DESAYUNO, ALMUERZO, COMEDOR COMPLETO, etc.               |
| `ambito_escuela`  | -         | Códigos de ámbito                                                      |

#### `planilla_novedades` (0 registros - estructura lista)

Almacena planillas de novedades mensuales por escuela.

| Campo           | Tipo        | Descripción                        |
| --------------- | ----------- | ---------------------------------- |
| `id_planilla`   | BIGINT      | PK                                 |
| `id_escuela`    | INTEGER     | FK a escuela                       |
| `mes`, `anio`   | INTEGER     | Período                            |
| `fecha_envio`   | TIMESTAMPTZ | Fecha de envío                     |
| `usuario_envio` | TEXT        | FK a auth.user                     |
| `datos`         | JSONB       | Datos de novedades en formato JSON |
| `estado`        | VARCHAR     | Estado (default 'ENVIADA')         |

**Restricción única**: `(id_escuela, mes, anio)` - Una planilla por escuela/período

---

## 👥 Schema: `rrhh`

### `persona` (15 registros)

Registro maestro de personas en el sistema.

| Campo                      | Tipo        | Descripción     |
| -------------------------- | ----------- | --------------- |
| `id_persona`               | INTEGER     | PK              |
| `dni`                      | INTEGER     | DNI único       |
| `nombre`, `apellido`       | VARCHAR     | Nombre completo |
| `telefono`, `mail`         | VARCHAR     | Contacto        |
| `created_at`, `updated_at` | TIMESTAMPTZ | Auditoría       |

### `rol` (6 registros)

| id_rol | codigo         |
| ------ | -------------- |
| 1      | DIRECTOR       |
| 2      | VICEDIRECTOR   |
| 3      | DOCENTE        |
| 4      | ADMINISTRATIVO |
| 5      | SUPERVISOR     |
| 6      | AUXILIAR       |

---

## 👁️ Schema: `supervision`

### `supervisor_escuela` (742 registros)

Asignación de supervisores a escuelas.

| Campo          | Tipo    | Descripción                            |
| -------------- | ------- | -------------------------------------- |
| `id_persona`   | INTEGER | FK a rrhh.persona                      |
| `id_cargo`     | INTEGER | FK a vacantes.cargo                    |
| `id_escuela`   | INTEGER | FK a institucional.escuela (PK, única) |
| `id_autoridad` | INTEGER | FK a normativa.autoridad               |

**Estado actual**:

- 742 escuelas tienen supervisor asignado
- 562 escuelas **sin supervisor** (43% del total)
- 15 supervisores gestionan todas las escuelas asignadas

### Distribución de Carga por Supervisor

| Supervisor            | Escuelas |
| --------------------- | -------- |
| NORMA MONZON          | 63       |
| VIRGINIA CORONEL      | 62       |
| DORA LILIANA PEÑALBER | 57       |
| PATRICIA PONCE        | 56       |
| SANDRA ESQUIVEL       | 56       |
| MILAGROS GONZALES     | 55       |
| ...                   | ...      |
| NANCY AGUILAR RIVERO  | 22       |

---

## 🌍 Schema: `geografia`

### Estructura Jerárquica

```
provincia (1)
  └── departamento (25)
        └── localidad (529) ✅ Poblado
              └── domicilio (0)
```

### `provincia` (1 registro)

- Corrientes

### `departamento` (25 registros - Corrientes completo)

Todos los departamentos de la provincia de Corrientes.

### `localidad` (529 registros)

Distribución de localidades por departamento:

| Departamento        | Localidades | Escuelas |
| ------------------- | ----------- | -------- |
| GOYA                | 59          | 128      |
| ESQUINA             | 41          | 81       |
| CURUZÚ CUATIÁ       | 33          | 62       |
| LAVALLE             | 33          | 67       |
| EMPEDRADO           | 31          | 48       |
| GENERAL PAZ         | 30          | 52       |
| SAN LUIS DEL PALMAR | 29          | 44       |
| SAN ROQUE           | 24          | 35       |
| SANTO TOMÉ          | 22          | 58       |
| ITUZAINGÓ           | 22          | 51       |
| MONTE CASEROS       | 22          | 48       |
| CONCEPCIÓN          | 22          | 54       |
| SALADAS             | 21          | 45       |
| MERCEDES            | 18          | 49       |
| SAN MARTÍN          | 15          | 31       |
| PASO DE LOS LIBRES  | 14          | 43       |
| BELLA VISTA         | 14          | 60       |
| SAN MIGUEL          | 13          | 25       |
| SAUCE               | 12          | 30       |
| SAN COSME           | 11          | 34       |
| CAPITAL             | 11          | 152      |
| MBURUCUYÁ           | 10          | 23       |
| ITATÍ               | 9           | 14       |
| GENERAL ALVEAR      | 8           | 19       |
| BERÓN DE ASTRADA    | 5           | 5        |

### Cobertura de Localidades en Escuelas

- **Total escuelas**: 1,304
- **Con localidad asignada**: 1,258 (96.5%)
- **Sin localidad**: 46 (3.5%)

### Principales Localidades por Cantidad de Escuelas

| Localidad           | Departamento       | Escuelas |
| ------------------- | ------------------ | -------- |
| CORRIENTES          | CAPITAL            | 128      |
| GOYA                | GOYA               | 33       |
| MERCEDES            | MERCEDES           | 29       |
| PASO DE LOS LIBRES  | PASO DE LOS LIBRES | 23       |
| GOBERNADOR VIRASORO | SANTO TOMÉ         | 22       |
| CURUZÚ CUATIÁ       | CURUZÚ CUATIÁ      | 20       |
| ITUZAINGÓ           | ITUZAINGÓ          | 17       |
| BELLA VISTA         | BELLA VISTA        | 16       |
| MONTE CASEROS       | MONTE CASEROS      | 15       |
| SANTO TOMÉ          | SANTO TOMÉ         | 14       |
| ESQUINA             | ESQUINA            | 14       |
| SANTA ROSA          | CONCEPCIÓN         | 13       |
| SAUCE               | SAUCE              | 12       |
| PASO DE LA PATRIA   | SAN COSME          | 11       |

---

## 🏗️ Schema: `infraestructura` (Sin datos)

Diseñado para gestión de conectividad de edificios escolares.

### Modelo de Datos

```
edificio → edificio_conexion → proveedor
                            → tecnologia
                            → calidad_servicio
```

### Tablas

- `edificio`: Vincula edificios con domicilios
- `proveedor`: Proveedores de internet
- `tecnologia`: Tipos de conexión
- `calidad_servicio`: Niveles de calidad
- `edificio_conexion`: Relación con fecha de relevamiento

---

## 💼 Schema: `vacantes`

### `cargo` (2 registros)

| id_cargo | prefijo | sufijo | descripcion            | rol        |
| -------- | ------- | ------ | ---------------------- | ---------- |
| 1        | 5       | 305    | SUPERVISOR DE ESCUELAS | SUPERVISOR |
| 4        | 1       | 101    | DIRECTOR DE ESCUELA    | DIRECTOR   |

### Flujo de Vacantes

```
plaza (por escuela)
  └── vacante (estado: ABIERTA/CERRADA/etc)
        └── asignacion (persona asignada + disposición)
```

---

## 📋 Schema: `normativa`

### `autoridad` (1 registro)

| Campo       | Valor                                      |
| ----------- | ------------------------------------------ |
| nombre      | Consejo General de Educación               |
| sigla       | CGE                                        |
| descripcion | Consejo General de Educación de Corrientes |

### `disposicion` (0 registros)

Preparado para registrar disposiciones legales con número, año, fecha, título y observaciones.

---

## 📊 Schema: `relevamiento` (Sin datos)

Diseñado para censos anuales.

### Tablas

- `matricula`: Cantidad de alumnos por escuela/año
- `personal`: Cantidad de personal por escuela/año/tipo
- `personal_tipo`: Tipos de personal (vinculado a roles)
- `problematica`: Catálogo de problemáticas por dimensión
- `escuela_problematica`: Problemáticas detectadas por escuela

---

## 🔄 Schema: `staging`

### `escuelas_revision` (79 registros)

Escuelas con datos pendientes de integrar (CUE no encontrado).

| Campo                        | Descripción               |
| ---------------------------- | ------------------------- |
| `cue_json`                   | CUE del JSON fuente       |
| `mail`, `telefono`           | Datos de contacto         |
| `categoria`, `zona`, `turno` | Clasificación             |
| `modalidad`, `ambito`        | Tipo de escuela           |
| `nombre_director`            | Director informado        |
| `motivo`                     | "CUE no encontrado en BD" |

### `supervisor_revision` (81 registros)

Asignaciones de supervisores pendientes de resolver.

---

## 📈 Estadísticas Clave del Sistema

### Completitud de Datos en Escuelas

| Campo                  | Con Datos | Porcentaje |
| ---------------------- | --------- | ---------- |
| Total escuelas         | 1,304     | 100%       |
| Con modalidad definida | 1,012     | 78%        |
| Con categoría definida | 1,051     | 81%        |
| Con zona definida      | 1,051     | 81%        |
| Con turno definido     | 1,053     | 81%        |
| Con localidad          | 1,258     | 96.5%      |
| Con supervisor         | 742       | 57%        |

### Distribución por Modalidad

| Modalidad                   | Cantidad | %     |
| --------------------------- | -------- | ----- |
| COMÚN                       | 956      | 73.3% |
| DESCONOCIDO                 | 292      | 22.4% |
| ADULTOS                     | 33       | 2.5%  |
| ESPECIAL                    | 19       | 1.5%  |
| CONTEXTOS DE ENCIERRO       | 2        | 0.2%  |
| HOSPITALARIA Y DOMICILIARIA | 2        | 0.2%  |

### Distribución por Zona

| Zona                  | Cantidad | %     |
| --------------------- | -------- | ----- |
| A - URBANA CÉNTRICA   | 319      | 24.5% |
| C - RURAL ACCESIBLE   | 296      | 22.7% |
| DESCONOCIDO           | 253      | 19.4% |
| D - RURAL ALEJADA     | 218      | 16.7% |
| B - URBANA PERIFÉRICA | 193      | 14.8% |
| E - RURAL INHÓSPITA   | 25       | 1.9%  |

### Distribución por Turno

| Turno             | Cantidad | %     |
| ----------------- | -------- | ----- |
| MAÑANA            | 528      | 40.5% |
| JORNADA COMPLETA  | 356      | 27.3% |
| DESCONOCIDO       | 251      | 19.2% |
| TARDE             | 118      | 9.0%  |
| NOCHE             | 44       | 3.4%  |
| JORNADA EXTENDIDA | 7        | 0.5%  |

---

## 🚀 Propuestas de Vistas y Consultas

### 1. Vista: `v_escuela_completa`

Consolidación de todos los datos de escuela con sus referencias.

```sql
CREATE OR REPLACE VIEW institucional.v_escuela_completa AS
SELECT
    e.id_escuela,
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
    -- Ubicación geográfica
    l.nombre AS localidad,
    d.nombre AS departamento,
    -- Supervisor
    p.nombre || ' ' || p.apellido AS supervisor,
    p.id_persona AS id_supervisor,
    -- Métricas de completitud
    CASE WHEN e.id_modalidad = 11 THEN false ELSE true END AS tiene_modalidad,
    CASE WHEN e.id_categoria = 0 THEN false ELSE true END AS tiene_categoria,
    CASE WHEN e.id_zona = 0 THEN false ELSE true END AS tiene_zona,
    CASE WHEN e.id_localidad IS NOT NULL THEN true ELSE false END AS tiene_localidad,
    CASE WHEN se.id_persona IS NOT NULL THEN true ELSE false END AS tiene_supervisor,
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
```

### 2. Vista: `v_supervisor_carga`

Análisis de carga de trabajo de supervisores.

```sql
CREATE OR REPLACE VIEW supervision.v_supervisor_carga AS
SELECT
    p.id_persona,
    p.nombre || ' ' || p.apellido AS supervisor,
    p.mail,
    p.telefono,
    COUNT(se.id_escuela) AS total_escuelas,
    COUNT(CASE WHEN z.codigo = 'A' THEN 1 END) AS escuelas_urbana_centrica,
    COUNT(CASE WHEN z.codigo = 'B' THEN 1 END) AS escuelas_urbana_periferica,
    COUNT(CASE WHEN z.codigo IN ('C', 'D', 'E') THEN 1 END) AS escuelas_rurales,
    COUNT(CASE WHEN m.descripcion = 'ESPECIAL' THEN 1 END) AS escuelas_especiales,
    COUNT(CASE WHEN m.descripcion = 'ADULTOS' THEN 1 END) AS escuelas_adultos,
    ROUND(AVG(c.codigo), 2) AS categoria_promedio,
    COUNT(DISTINCT d.id_departamento) AS departamentos_asignados,
    STRING_AGG(DISTINCT d.nombre, ', ' ORDER BY d.nombre) AS departamentos
FROM rrhh.persona p
JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
GROUP BY p.id_persona, p.nombre, p.apellido, p.mail, p.telefono
ORDER BY total_escuelas DESC;
```

### 3. Vista Materializada: `mv_estadisticas_sistema`

Dashboard general del sistema educativo.

```sql
CREATE MATERIALIZED VIEW institucional.mv_estadisticas_sistema AS
WITH base AS (
    SELECT
        COUNT(*) AS total_escuelas,
        COUNT(CASE WHEN id_modalidad != 11 THEN 1 END) AS escuelas_con_modalidad,
        COUNT(CASE WHEN id_categoria != 0 THEN 1 END) AS escuelas_con_categoria,
        COUNT(CASE WHEN id_zona != 0 THEN 1 END) AS escuelas_con_zona,
        COUNT(CASE WHEN id_turno != 1 THEN 1 END) AS escuelas_con_turno
    FROM institucional.escuela
),
supervision_stats AS (
    SELECT
        COUNT(DISTINCT id_escuela) AS escuelas_con_supervisor,
        COUNT(DISTINCT id_persona) AS total_supervisores
    FROM supervision.supervisor_escuela
),
staging_stats AS (
    SELECT
        (SELECT COUNT(*) FROM staging.escuelas_revision) AS escuelas_pendientes,
        (SELECT COUNT(*) FROM staging.supervisor_revision) AS supervisiones_pendientes
)
SELECT
    b.total_escuelas,
    b.escuelas_con_modalidad,
    b.escuelas_con_categoria,
    b.escuelas_con_zona,
    b.escuelas_con_turno,
    s.escuelas_con_supervisor,
    b.total_escuelas - s.escuelas_con_supervisor AS escuelas_sin_supervisor,
    s.total_supervisores,
    ROUND(100.0 * b.escuelas_con_modalidad / b.total_escuelas, 1) AS pct_con_modalidad,
    ROUND(100.0 * s.escuelas_con_supervisor / b.total_escuelas, 1) AS pct_con_supervisor,
    st.escuelas_pendientes,
    st.supervisiones_pendientes,
    NOW() AS ultima_actualizacion
FROM base b, supervision_stats s, staging_stats st;

-- Índice para refresh concurrente
CREATE UNIQUE INDEX ON institucional.mv_estadisticas_sistema(ultima_actualizacion);
```

### 4. Vista: `v_escuelas_sin_supervisor`

Identificar escuelas que necesitan asignación.

```sql
CREATE OR REPLACE VIEW supervision.v_escuelas_sin_supervisor AS
SELECT
    e.id_escuela,
    e.cue,
    e.nombre,
    m.descripcion AS modalidad,
    z.descripcion AS zona,
    z.codigo AS zona_codigo,
    c.descripcion AS categoria
FROM institucional.escuela e
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
WHERE se.id_escuela IS NULL
ORDER BY z.codigo, e.nombre;
```

### 5. Vista: `v_distribucion_por_zona_modalidad`

Matriz para análisis cruzado.

```sql
CREATE OR REPLACE VIEW institucional.v_distribucion_zona_modalidad AS
SELECT
    z.descripcion AS zona,
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
```

### 6. Función: Búsqueda de escuelas

```sql
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
    supervisor VARCHAR,
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
```

### 7. Procedimiento: Refresh de estadísticas

```sql
CREATE OR REPLACE PROCEDURE institucional.refresh_estadisticas()
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY institucional.mv_estadisticas_sistema;
    RAISE NOTICE 'Estadísticas actualizadas: %', NOW();
END;
$$;

-- Programar con pg_cron (si está disponible)
-- SELECT cron.schedule('refresh-stats', '0 */4 * * *', 'CALL institucional.refresh_estadisticas()');
```

### 8. Vista: `v_calidad_datos`

Monitoreo de completitud de datos.

```sql
CREATE OR REPLACE VIEW institucional.v_calidad_datos AS
SELECT
    'Escuelas totales' AS metrica,
    COUNT(*)::TEXT AS valor,
    '100%' AS porcentaje
FROM institucional.escuela

UNION ALL

SELECT
    'Sin modalidad definida',
    COUNT(*)::TEXT,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM institucional.escuela), 1) || '%'
FROM institucional.escuela WHERE id_modalidad = 11

UNION ALL

SELECT
    'Sin zona definida',
    COUNT(*)::TEXT,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM institucional.escuela), 1) || '%'
FROM institucional.escuela WHERE id_zona = 0

UNION ALL

SELECT
    'Sin supervisor asignado',
    COUNT(*)::TEXT,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM institucional.escuela), 1) || '%'
FROM institucional.escuela e
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
WHERE se.id_persona IS NULL

UNION ALL

SELECT
    'En staging (escuelas)',
    COUNT(*)::TEXT,
    '-'
FROM staging.escuelas_revision

UNION ALL

SELECT
    'En staging (supervisores)',
    COUNT(*)::TEXT,
    '-'
FROM staging.supervisor_revision;
```

---

## 📝 Índices Adicionales Recomendados

```sql
-- Para búsquedas por CUE parcial
CREATE INDEX IF NOT EXISTS idx_escuela_cue_text
ON institucional.escuela (cue::TEXT varchar_pattern_ops);

-- Para reportes por fecha de creación
CREATE INDEX IF NOT EXISTS idx_escuela_fecha_creacion
ON institucional.escuela (DATE(created_at));

-- Índice parcial para escuelas sin supervisor
CREATE INDEX IF NOT EXISTS idx_escuela_sin_supervisor
ON institucional.escuela (id_escuela)
WHERE id_escuela NOT IN (SELECT id_escuela FROM supervision.supervisor_escuela);
```

---

## 🔧 Consultas Útiles para Dashboard

### 📊 CARDS PRINCIPALES

#### Resumen general del sistema

```sql
SELECT * FROM institucional.mv_estadisticas_sistema;
```

#### Totales rápidos

```sql
SELECT
    (SELECT COUNT(*) FROM institucional.escuela) AS total_escuelas,
    (SELECT COUNT(DISTINCT id_persona) FROM supervision.supervisor_escuela) AS total_supervisores,
    (SELECT COUNT(*) FROM geografia.departamento) AS total_departamentos,
    (SELECT COUNT(*) FROM geografia.localidad) AS total_localidades;
```

---

### 👤 CONSULTAS DE SUPERVISORES

#### Escuelas asignadas a cada supervisor

```sql
SELECT
    p.nombre || ' ' || p.apellido AS supervisor,
    COUNT(se.id_escuela) AS total_escuelas,
    STRING_AGG(e.nombre, ' | ' ORDER BY e.nombre) AS escuelas
FROM rrhh.persona p
JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
GROUP BY p.id_persona, p.nombre, p.apellido
ORDER BY total_escuelas DESC;
```

#### Escuelas por supervisor (detalle)

```sql
SELECT
    p.nombre || ' ' || p.apellido AS supervisor,
    e.cue,
    e.nombre AS escuela,
    m.descripcion AS modalidad,
    z.descripcion AS zona,
    l.nombre AS localidad,
    d.nombre AS departamento
FROM rrhh.persona p
JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
ORDER BY p.apellido, e.nombre;
```

#### Supervisores por departamento

```sql
SELECT
    d.nombre AS departamento,
    COUNT(DISTINCT se.id_persona) AS supervisores,
    COUNT(e.id_escuela) AS escuelas_supervisadas,
    STRING_AGG(DISTINCT p.apellido, ', ') AS nombres_supervisores
FROM supervision.supervisor_escuela se
JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
JOIN rrhh.persona p ON se.id_persona = p.id_persona
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
GROUP BY d.nombre
ORDER BY escuelas_supervisadas DESC;
```

#### Carga de trabajo por supervisor (ranking)

```sql
SELECT * FROM supervision.v_supervisor_carga ORDER BY total_escuelas DESC LIMIT 15;
```

#### Balance de carga (detectar desbalances)

```sql
WITH stats AS (
    SELECT
        p.nombre || ' ' || p.apellido AS supervisor,
        COUNT(se.id_escuela) AS escuelas,
        AVG(COUNT(se.id_escuela)) OVER() AS promedio
    FROM rrhh.persona p
    JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
    GROUP BY p.id_persona, p.nombre, p.apellido
)
SELECT
    supervisor,
    escuelas,
    ROUND(promedio, 1) AS promedio_sistema,
    escuelas - ROUND(promedio, 0) AS diferencia,
    CASE
        WHEN escuelas > promedio * 1.2 THEN '⚠️ Sobrecargado'
        WHEN escuelas < promedio * 0.8 THEN '📉 Subcargado'
        ELSE '✅ Balanceado'
    END AS estado
FROM stats
ORDER BY escuelas DESC;
```

---

### 🏫 CONSULTAS DE ESCUELAS POR ZONA Y CATEGORÍA

#### Escuelas por zona

```sql
SELECT
    z.codigo AS codigo,
    z.descripcion AS zona,
    COUNT(e.id_escuela) AS cantidad,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
FROM institucional.escuela e
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
GROUP BY z.id_zona, z.codigo, z.descripcion
ORDER BY z.codigo;
```

#### Escuelas por categoría

```sql
SELECT
    c.codigo,
    c.descripcion AS categoria,
    COUNT(e.id_escuela) AS cantidad,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
FROM institucional.escuela e
LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
GROUP BY c.id_categoria, c.codigo, c.descripcion
ORDER BY c.codigo;
```

#### Matriz zona × categoría (crosstab)

```sql
SELECT
    z.descripcion AS zona,
    COUNT(*) FILTER (WHERE c.codigo = 1) AS cat_1,
    COUNT(*) FILTER (WHERE c.codigo = 2) AS cat_2,
    COUNT(*) FILTER (WHERE c.codigo = 3) AS cat_3,
    COUNT(*) FILTER (WHERE c.codigo = 4) AS cat_4,
    COUNT(*) FILTER (WHERE c.codigo = 0) AS sin_cat,
    COUNT(*) AS total
FROM institucional.escuela e
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
GROUP BY z.id_zona, z.descripcion
ORDER BY z.id_zona;
```

#### Escuelas por zona y modalidad

```sql
SELECT
    z.descripcion AS zona,
    m.descripcion AS modalidad,
    COUNT(*) AS cantidad
FROM institucional.escuela e
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
GROUP BY z.descripcion, m.descripcion
ORDER BY z.descripcion, COUNT(*) DESC;
```

---

### 🗺️ CONSULTAS GEOGRÁFICAS

#### Escuelas por departamento

```sql
SELECT
    d.nombre AS departamento,
    COUNT(e.id_escuela) AS total_escuelas,
    COUNT(CASE WHEN se.id_escuela IS NOT NULL THEN 1 END) AS con_supervisor,
    COUNT(CASE WHEN se.id_escuela IS NULL THEN 1 END) AS sin_supervisor,
    ROUND(100.0 * COUNT(se.id_escuela) / COUNT(e.id_escuela), 1) AS pct_supervisados
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
GROUP BY d.nombre
ORDER BY total_escuelas DESC;
```

#### Escuelas por localidad (top 30)

```sql
SELECT
    l.nombre AS localidad,
    d.nombre AS departamento,
    COUNT(e.id_escuela) AS escuelas,
    STRING_AGG(DISTINCT m.descripcion, ', ') AS modalidades
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
GROUP BY l.nombre, d.nombre
ORDER BY escuelas DESC
LIMIT 30;
```

#### Departamentos con más escuelas rurales

```sql
SELECT
    d.nombre AS departamento,
    COUNT(*) AS total_escuelas,
    COUNT(*) FILTER (WHERE z.codigo IN ('C', 'D', 'E')) AS rurales,
    COUNT(*) FILTER (WHERE z.codigo IN ('A', 'B')) AS urbanas,
    ROUND(100.0 * COUNT(*) FILTER (WHERE z.codigo IN ('C', 'D', 'E')) / COUNT(*), 1) AS pct_rurales
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
GROUP BY d.nombre
HAVING COUNT(*) FILTER (WHERE z.codigo IN ('C', 'D', 'E')) > 0
ORDER BY pct_rurales DESC;
```

#### Escuelas sin localidad asignada

```sql
SELECT
    e.id_escuela,
    e.cue,
    e.nombre,
    m.descripcion AS modalidad
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
WHERE e.id_localidad IS NULL
ORDER BY e.nombre;
```

#### Localidades sin escuelas

```sql
SELECT
    l.nombre AS localidad,
    d.nombre AS departamento
FROM geografia.localidad l
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN institucional.escuela e ON l.id_localidad = e.id_localidad
WHERE e.id_escuela IS NULL
ORDER BY d.nombre, l.nombre;
```

---

### 🎓 CONSULTAS POR MODALIDAD Y TURNO

#### Escuelas por modalidad

```sql
SELECT
    m.descripcion AS modalidad,
    COUNT(e.id_escuela) AS cantidad,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
GROUP BY m.id_modalidad, m.descripcion
ORDER BY cantidad DESC;
```

#### Escuelas por turno

```sql
SELECT
    t.descripcion AS turno,
    COUNT(e.id_escuela) AS cantidad,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) AS porcentaje
FROM institucional.escuela e
LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
GROUP BY t.id_turno, t.descripcion
ORDER BY cantidad DESC;
```

#### Matriz modalidad × turno

```sql
SELECT
    m.descripcion AS modalidad,
    COUNT(*) FILTER (WHERE t.descripcion = 'MAÑANA') AS manana,
    COUNT(*) FILTER (WHERE t.descripcion = 'TARDE') AS tarde,
    COUNT(*) FILTER (WHERE t.descripcion = 'NOCHE') AS noche,
    COUNT(*) FILTER (WHERE t.descripcion = 'JORNADA COMPLETA') AS jornada_completa,
    COUNT(*) FILTER (WHERE t.descripcion = 'JORNADA EXTENDIDA') AS jornada_extendida,
    COUNT(*) AS total
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
GROUP BY m.descripcion
ORDER BY total DESC;
```

#### Escuelas especiales por departamento

```sql
SELECT
    d.nombre AS departamento,
    e.nombre AS escuela,
    z.descripcion AS zona,
    t.descripcion AS turno
FROM institucional.escuela e
JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
WHERE m.descripcion = 'ESPECIAL'
ORDER BY d.nombre, e.nombre;
```

---

### ⚠️ CONSULTAS DE COBERTURA Y PROBLEMAS

#### Escuelas sin supervisor

```sql
SELECT
    d.nombre AS departamento,
    COUNT(*) AS sin_supervisor
FROM institucional.escuela e
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
WHERE se.id_escuela IS NULL
GROUP BY d.nombre
ORDER BY sin_supervisor DESC;
```

#### Escuelas con datos incompletos

```sql
SELECT
    e.id_escuela,
    e.cue,
    e.nombre,
    CASE WHEN e.id_modalidad = 11 THEN '❌' ELSE '✅' END AS modalidad,
    CASE WHEN e.id_categoria = 0 THEN '❌' ELSE '✅' END AS categoria,
    CASE WHEN e.id_zona = 0 THEN '❌' ELSE '✅' END AS zona,
    CASE WHEN e.id_localidad IS NULL THEN '❌' ELSE '✅' END AS localidad,
    CASE WHEN se.id_escuela IS NULL THEN '❌' ELSE '✅' END AS supervisor
FROM institucional.escuela e
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
WHERE e.id_modalidad = 11
   OR e.id_categoria = 0
   OR e.id_zona = 0
   OR e.id_localidad IS NULL
   OR se.id_escuela IS NULL
ORDER BY e.nombre;
```

#### Resumen de completitud por departamento

```sql
SELECT
    d.nombre AS departamento,
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE e.id_modalidad != 11) AS con_modalidad,
    COUNT(*) FILTER (WHERE e.id_categoria != 0) AS con_categoria,
    COUNT(*) FILTER (WHERE e.id_zona != 0) AS con_zona,
    COUNT(*) FILTER (WHERE se.id_escuela IS NOT NULL) AS con_supervisor,
    ROUND(100.0 * COUNT(*) FILTER (WHERE se.id_escuela IS NOT NULL) / COUNT(*), 1) AS pct_supervisados
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
GROUP BY d.nombre
ORDER BY pct_supervisados ASC;
```

---

### 🔍 CONSULTAS DE BÚSQUEDA

#### Buscar escuela por nombre o CUE

```sql
SELECT
    e.id_escuela,
    e.cue,
    e.nombre,
    m.descripcion AS modalidad,
    d.nombre AS departamento,
    l.nombre AS localidad,
    COALESCE(p.apellido || ', ' || p.nombre, 'Sin asignar') AS supervisor
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona
WHERE e.nombre ILIKE '%139%' OR e.cue::TEXT LIKE '18004%'
ORDER BY e.nombre;
```

#### Filtro avanzado (ejemplo: rurales sin supervisor en Goya)

```sql
SELECT
    e.cue,
    e.nombre,
    z.descripcion AS zona,
    l.nombre AS localidad
FROM institucional.escuela e
JOIN institucional.zona z ON e.id_zona = z.id_zona
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
WHERE d.nombre = 'GOYA'
  AND z.codigo IN ('C', 'D', 'E')
  AND se.id_escuela IS NULL
ORDER BY e.nombre;
```

---

### 📈 CONSULTAS PARA GRÁFICOS

#### Datos para gráfico de torta (modalidad)

```sql
SELECT
    m.descripcion AS label,
    COUNT(*) AS value
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
GROUP BY m.descripcion
ORDER BY value DESC;
```

#### Datos para gráfico de barras (escuelas por departamento)

```sql
SELECT
    d.nombre AS label,
    COUNT(e.id_escuela) AS value
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
GROUP BY d.nombre
ORDER BY value DESC
LIMIT 10;
```

#### Datos para gráfico apilado (zona por departamento)

```sql
SELECT
    d.nombre AS departamento,
    COUNT(*) FILTER (WHERE z.codigo = 'A') AS urbana_centrica,
    COUNT(*) FILTER (WHERE z.codigo = 'B') AS urbana_periferica,
    COUNT(*) FILTER (WHERE z.codigo = 'C') AS rural_accesible,
    COUNT(*) FILTER (WHERE z.codigo = 'D') AS rural_alejada,
    COUNT(*) FILTER (WHERE z.codigo = 'E') AS rural_inhospita
FROM institucional.escuela e
JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
GROUP BY d.nombre
ORDER BY d.nombre;
```

#### Datos para indicador de progreso (completitud)

```sql
SELECT
    'Modalidad' AS metrica,
    ROUND(100.0 * COUNT(*) FILTER (WHERE id_modalidad != 11) / COUNT(*), 1) AS porcentaje
FROM institucional.escuela
UNION ALL
SELECT 'Categoría', ROUND(100.0 * COUNT(*) FILTER (WHERE id_categoria != 0) / COUNT(*), 1)
FROM institucional.escuela
UNION ALL
SELECT 'Zona', ROUND(100.0 * COUNT(*) FILTER (WHERE id_zona != 0) / COUNT(*), 1)
FROM institucional.escuela
UNION ALL
SELECT 'Localidad', ROUND(100.0 * COUNT(*) FILTER (WHERE id_localidad IS NOT NULL) / COUNT(*), 1)
FROM institucional.escuela
UNION ALL
SELECT 'Supervisor', ROUND(100.0 * COUNT(se.id_escuela) / COUNT(e.id_escuela), 1)
FROM institucional.escuela e
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela;
```

---

### 📋 CONSULTAS PARA REPORTES

#### Listado completo de escuelas (exportable)

```sql
SELECT
    e.cue,
    e.nombre AS escuela,
    m.descripcion AS modalidad,
    c.descripcion AS categoria,
    z.descripcion AS zona,
    t.descripcion AS turno,
    l.nombre AS localidad,
    d.nombre AS departamento,
    e.telefono,
    e.mail,
    COALESCE(p.apellido || ', ' || p.nombre, 'Sin asignar') AS supervisor
FROM institucional.escuela e
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN institucional.turno t ON e.id_turno = t.id_turno
LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
LEFT JOIN supervision.supervisor_escuela se ON e.id_escuela = se.id_escuela
LEFT JOIN rrhh.persona p ON se.id_persona = p.id_persona
ORDER BY d.nombre, l.nombre, e.nombre;
```

#### Reporte de supervisor (para uso interno)

```sql
SELECT
    p.apellido || ', ' || p.nombre AS supervisor,
    p.mail,
    p.telefono,
    e.cue,
    e.nombre AS escuela,
    m.descripcion AS modalidad,
    c.descripcion AS categoria,
    z.descripcion AS zona,
    d.nombre AS departamento,
    l.nombre AS localidad
FROM rrhh.persona p
JOIN supervision.supervisor_escuela se ON p.id_persona = se.id_persona
JOIN institucional.escuela e ON se.id_escuela = e.id_escuela
LEFT JOIN institucional.modalidad m ON e.id_modalidad = m.id_modalidad
LEFT JOIN institucional.categoria c ON e.id_categoria = c.id_categoria
LEFT JOIN institucional.zona z ON e.id_zona = z.id_zona
LEFT JOIN geografia.localidad l ON e.id_localidad = l.id_localidad
LEFT JOIN geografia.departamento d ON l.id_departamento = d.id_departamento
ORDER BY p.apellido, d.nombre, e.nombre;
```

#### Estadísticas de staging (pendientes de resolver)

```sql
SELECT
    'Escuelas en staging' AS tipo,
    COUNT(*) AS cantidad,
    STRING_AGG(DISTINCT motivo, ', ') AS motivos
FROM staging.escuelas_revision
UNION ALL
SELECT
    'Supervisiones en staging',
    COUNT(*),
    STRING_AGG(DISTINCT motivo, ', ')
FROM staging.supervisor_revision;
```

---

## ⚠️ Observaciones y Recomendaciones

1. **✅ Localidades pobladas**: 529 localidades cubriendo los 25 departamentos de Corrientes, con 96.5% de escuelas vinculadas.

2. **Servicio de comida**: Todas las 1,304 escuelas tienen valor "DESCONOCIDO" - requiere relevamiento.

3. **Staging pendiente**: 79 escuelas y 81 asignaciones de supervisores esperan resolución de CUE.

4. **Infraestructura**: Schema completo pero vacío - preparado para relevamiento de conectividad.

5. **Relevamiento**: Schema para censos anuales sin datos - habilitar para ciclo 2025.

6. **Vacantes**: Sistema de plazas y vacantes preparado - integrar con nómina.

7. **Supervisión**: 562 escuelas (43%) aún sin supervisor asignado - prioridad alta.

---

## 🗓️ Próximos Pasos

1. [x] ~~Poblar datos de localidad vinculando con escuelas~~
2. [ ] Crear las vistas propuestas en la base de datos
3. [ ] Implementar endpoints de API para consultas del dashboard
4. [ ] Resolver staging (79 escuelas + 81 supervisiones)
5. [ ] Relevar servicio de comida en escuelas
6. [ ] Completar asignación de supervisores (562 escuelas pendientes)
7. [ ] Integrar matrícula 2025 en schema relevamiento

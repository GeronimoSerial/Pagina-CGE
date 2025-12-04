# 🚀 Plan de Optimización del Dashboard - Pagina-CGE

> Última actualización: 4 de diciembre de 2025 - Mejoras Next.js 16 Cache Components

## 📊 Estado General

| Fase   | Descripción                    | Estado        |
| ------ | ------------------------------ | ------------- |
| Fase 1 | Impacto Inmediato (DB + Cache) | ✅ Completada |
| Fase 2 | Mejora Frontend                | ✅ Completada |
| Fase 3 | Cache Components Next.js 16    | ✅ Completada |
| Fase 4 | Optimización Avanzada          | ⚪ Pendiente  |

---

## Fase 3: Cache Components Next.js 16 ✅ (NUEVA)

### 3.1 cacheTag para Invalidación On-Demand ✅

**Ubicación:** `src/features/dashboard/actions/actions.ts`

Todas las funciones con `'use cache'` ahora incluyen tags para invalidación selectiva:

| Grupo       | Tags                                                                                                                                             | Funciones                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `dashboard` | `dashboard-stats`, `estadisticas`, `promedio-horas`, `asistencia`, `ausentes`, `marcaciones-incompletas`, `dias-sin-actividad`, `dias-con-marca` | Estadísticas principales |
| `empleados` | `empleados-activos`, `empleados-problematicos`, `lista-empleados`, `areas`                                                                       | Datos de empleados       |
| `reportes`  | `liquidacion`, `meses-disponibles`                                                                                                               | Reportes y liquidación   |

---

### 3.2 cacheLife Explícito en Todas las Funciones ✅

**Estado:** Completado

Todas las funciones con `'use cache'` ahora tienen `cacheLife` explícito según la documentación de Next.js 16:

| Profile   | Funciones                                                   | Descripción                                    |
| --------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `'hours'` | Estadísticas, asistencia, ausentes, empleados problemáticos | Datos que se actualizan múltiples veces al día |
| `'max'`   | Lista empleados, meses disponibles, áreas                   | Datos estáticos que rara vez cambian           |

---

### 3.3 'use cache' en Batch Queries ✅

**Ubicación:** `src/features/dashboard/lib/cached-queries.ts`

Las funciones batch ahora combinan:

1. `'use cache'` - Cache persistente entre requests
2. `cache()` de React - Memoización intra-request
3. `cacheLife('hours')` - Duración explícita
4. `cacheTag()` - Tags para invalidación

| Función                   | Cache                     | Tags                            |
| ------------------------- | ------------------------- | ------------------------------- |
| `getDashboardStats()`     | `'use cache'` + `cache()` | `dashboard`, `dashboard-stats`  |
| `getDashboardChartData()` | `'use cache'` + `cache()` | `dashboard`, `dashboard-charts` |

---

### 3.4 Endpoint de Revalidación ✅

**Ubicación:** `src/app/api/revalidate/dashboard/route.ts`

API Route para invalidar cache on-demand usando `revalidateTag()`:

**Uso:**

```bash
# Listar tags disponibles
GET /api/revalidate/dashboard

# Invalidar con stale-while-revalidate (recomendado)
POST /api/revalidate/dashboard
Body: { "tags": ["dashboard"] }

# Invalidar inmediatamente (para webhooks)
POST /api/revalidate/dashboard
Body: { "tags": ["dashboard"], "mode": "immediate" }

# En producción con secret
POST /api/revalidate/dashboard?secret=YOUR_SECRET
Body: { "tags": ["empleados", "reportes"] }
```

**Tags por grupo:**

- `dashboard` → Invalida todas las estadísticas del dashboard
- `empleados` → Invalida datos de empleados
- `reportes` → Invalida reportes y liquidación

---

## Fase 1: Impacto Inmediato ✅

### 1.1 Materialized Views ✅

**Ubicación:** `prisma/migrations/optimizations/`

| Vista                        | Archivo                              | Estado    |
| ---------------------------- | ------------------------------------ | --------- |
| `mv_empleados_problematicos` | `001_mv_empleados_problematicos.sql` | ✅ Creado |
| `mv_estadisticas_diarias`    | `002_mv_estadisticas_diarias.sql`    | ✅ Creado |
| `mv_reporte_liquidacion`     | `003_mv_reporte_liquidacion.sql`     | ✅ Creado |

**Instrucciones de aplicación:**

```bash
# Conectar a PostgreSQL y ejecutar cada script
psql -U usuario -d database -f prisma/migrations/optimizations/001_mv_empleados_problematicos.sql
psql -U usuario -d database -f prisma/migrations/optimizations/002_mv_estadisticas_diarias.sql
psql -U usuario -d database -f prisma/migrations/optimizations/003_mv_reporte_liquidacion.sql
psql -U usuario -d database -f prisma/migrations/optimizations/004_refresh_cron.sql
psql -U usuario -d database -f prisma/migrations/optimizations/005_indices_optimizacion.sql
```

**Refresh automático:**

- Configurar cron job para ejecutar `REFRESH MATERIALIZED VIEW CONCURRENTLY` cada noche
- Ver script `004_refresh_cron.sql` para configuración

---

### 1.2 Índices Compuestos ✅

**Ubicación:** `prisma/migrations/optimizations/005_indices_optimizacion.sql`

| Tabla                 | Índice                           | Columnas                                    | Estado    |
| --------------------- | -------------------------------- | ------------------------------------------- | --------- |
| `marcas`              | `idx_marcas_legajo_ts_optimized` | `(legajo, ts DESC) WHERE duplicado = false` | ✅ Creado |
| `marcas`              | `idx_marcas_ts_date`             | `((ts::date))`                              | ✅ Creado |
| `marcas`              | `idx_marcas_no_duplicados`       | `(legajo, ts DESC) WHERE duplicado = false` | ✅ Creado |
| `legajo`              | `idx_legajo_activo`              | `(cod) WHERE inactivo = false`              | ✅ Creado |
| `legajo`              | `idx_legajo_area`                | `(area) WHERE area IS NOT NULL`             | ✅ Creado |
| `whitelist_empleados` | `idx_whitelist_activo_legajo`    | `(legajo) WHERE activo = true`              | ✅ Creado |

---

### 1.3 cacheLife en Server Actions ✅

**Ubicación:** `src/features/dashboard/actions/actions.ts`

| Función                               | Cache Life           | Estado             |
| ------------------------------------- | -------------------- | ------------------ |
| `getListaEmpleados()`                 | `cacheLife('max')`   | ✅ Ya implementado |
| `getMesesDisponibles()`               | `cacheLife('max')`   | ✅ Ya implementado |
| `getAreasDisponibles()`               | `cacheLife('max')`   | ✅ Ya implementado |
| `getCantidadEmpleadosActivos()`       | `cacheLife('hours')` | ✅ Implementado    |
| `getCantidadEmpleadosProblematicos()` | `cacheLife('hours')` | ✅ Implementado    |
| `getEstadisticasDiarias()`            | `cacheLife('hours')` | ✅ Implementado    |
| `getPromedioHorasDiario()`            | `cacheLife('hours')` | ✅ Implementado    |
| `getEmpleadosProblematicos()`         | `cacheLife('hours')` | ✅ Implementado    |

**Nota:** Las funciones ahora usan vistas materializadas con fallback automático a vistas normales.

---

### 1.4 React cache() Memoization ✅

**Ubicación:** `src/features/dashboard/lib/cached-queries.ts`

Funciones envueltas en `cache()` para deduplicación en mismo render pass:

| Función Original                      | Función Cached                      | Estado |
| ------------------------------------- | ----------------------------------- | ------ |
| `getCantidadEmpleadosActivos()`       | `getCachedEmpleadosActivos()`       | ✅     |
| `getCantidadEmpleadosProblematicos()` | `getCachedEmpleadosProblematicos()` | ✅     |
| `getEstadisticasDiarias()`            | `getCachedEstadisticasDiarias()`    | ✅     |
| `getPromedioHorasDiario()`            | `getCachedPromedioHorasDiario()`    | ✅     |
| `getListaEmpleados()`                 | `getCachedListaEmpleados()`         | ✅     |
| `getMesesDisponibles()`               | `getCachedMesesDisponibles()`       | ✅     |
| `getAreasDisponibles()`               | `getCachedAreasDisponibles()`       | ✅     |
| `getEmpleadosProblematicos()`         | `getCachedEmpleadosProblematicos()` | ✅     |

---

### 1.5 Batch Queries ✅

**Ubicación:** `src/features/dashboard/lib/cached-queries.ts`

| Función Batch             | Queries Consolidadas                                                    | Estado |
| ------------------------- | ----------------------------------------------------------------------- | ------ |
| `getDashboardStats()`     | `getCantidadEmpleadosActivos()` + `getCantidadEmpleadosProblematicos()` | ✅     |
| `getDashboardChartData()` | `getEstadisticasDiarias()` + `getPromedioHorasDiario()`                 | ✅     |

**Componentes actualizados:**

- ✅ `DashboardStatsCards` - Ahora usa `getDashboardStats()` (1 query en vez de 2)

---

## Fase 2: Mejora Frontend (Completada)

### 2.1 Paginación Cliente-Side ✅

**Estado:** Completado

Implementamos paginación cliente-side en las tablas grandes en vez de virtualización. Este enfoque es más simple, robusto y compatible con el layout de tablas HTML estándar.

**Tablas actualizadas:**
| Tabla | Archivo | Filas por página |
|-------|---------|------------------|
| `LiquidationReportTable` | `liquidation-report-table.tsx` | 25 |
| `EmpleadosProblematicosTable` | `empleados-problematicos-table.tsx` | 25 |

**Características implementadas:**

- ✅ Paginación con navegación anterior/siguiente
- ✅ Indicador de página actual y total
- ✅ Reset automático de página al filtrar
- ✅ Conteo de elementos mostrados vs total
- ✅ Búsqueda/filtrado funciona sobre todos los datos

**Beneficios:**

- Renderiza solo 25 filas en vez de 500+
- Layout de columnas consistente sin desincronización
- Compatible con tablas responsivas
- Menor complejidad de código

---

### 2.2 Prefetching de Rutas ✅

**Estado:** Ya implementado por defecto

Next.js 16 con App Router habilita prefetching automático en el componente `Link`. Los links en `nav-main.tsx` ya usan `<Link href={...}>` que prefetchea automáticamente cuando el link es visible en el viewport.

**Rutas con prefetch automático:**

- ✅ `/dashboard/asistencia`
- ✅ `/dashboard/reportes`
- ✅ `/dashboard/empleados`
- ✅ `/dashboard/atencion`

---

### 2.3 Skeletons Específicos ✅

**Estado:** Completado

**Ubicación:** `src/features/dashboard/components/skeletons/`

| Componente                            | Archivo                   | Uso                                       |
| ------------------------------------- | ------------------------- | ----------------------------------------- |
| `StatsCardSkeleton`                   | `stats-card-skeleton.tsx` | Cards de estadísticas individuales        |
| `StatsCardsGridSkeleton`              | `stats-card-skeleton.tsx` | Grid de 4 cards de stats                  |
| `ChartSkeleton`                       | `chart-skeleton.tsx`      | Gráficos de barras                        |
| `LineChartSkeleton`                   | `chart-skeleton.tsx`      | Gráficos de líneas                        |
| `DonutChartSkeleton`                  | `chart-skeleton.tsx`      | Gráficos circulares                       |
| `TableSkeleton`                       | `table-skeleton.tsx`      | Tablas genéricas con filtros y paginación |
| `CompactTableSkeleton`                | `table-skeleton.tsx`      | Tablas compactas sin filtros              |
| `EmpleadosProblematicosTableSkeleton` | `table-skeleton.tsx`      | Específico para tabla de atención         |
| `LiquidationReportTableSkeleton`      | `table-skeleton.tsx`      | Específico para reportes de liquidación   |

**Loading.tsx integrados:**
| Ruta | Skeleton Usado |
|------|----------------|
| `/dashboard` | `StatsCardsGridSkeleton`, `ChartSkeleton`, `CompactTableSkeleton` |
| `/dashboard/atencion` | `EmpleadosProblematicosTableSkeleton` |
| `/dashboard/reportes` | `LiquidationReportTableSkeleton` |

**Uso:**

```tsx
import {
  StatsCardsGridSkeleton,
  ChartSkeleton,
  TableSkeleton,
} from '@dashboard/components/skeletons';

// En Suspense boundaries
<Suspense fallback={<StatsCardsGridSkeleton />}>
  <DashboardStatsCards />
</Suspense>;
```

---

## Fase 4: Optimización Avanzada (Pendiente)

### 4.1 Particionamiento de `marcas` ⚪

**Estado:** Pendiente - Requiere análisis de volumen de datos

### 4.2 Tabla de Precálculo con Triggers ⚪

**Estado:** Pendiente

### 4.3 SWR para Datos Interactivos ⚪

**Estado:** Pendiente

---

## 📈 Métricas de Rendimiento

### Antes de Optimización

| Métrica                           | Valor  |
| --------------------------------- | ------ |
| TTFB Dashboard                    | TBD    |
| Query `v_empleados_problematicos` | ~5-10s |
| Query `v_reporte_liquidacion`     | ~3-8s  |
| FCP                               | TBD    |

### Después de Optimización

| Métrica                 | Valor Esperado |
| ----------------------- | -------------- |
| TTFB Dashboard          | < 200ms        |
| Query Materialized View | < 50ms         |
| FCP                     | < 1.5s         |

---

## 🔧 Comandos Útiles

```bash
# Verificar estado de vistas materializadas
SELECT schemaname, matviewname, ispopulated
FROM pg_matviews
WHERE schemaname = 'huella';

# Forzar refresh de todas las vistas materializadas
SELECT huella.refresh_all_materialized_views();

# Verificar índices
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'huella';

# Analizar plan de query
EXPLAIN ANALYZE SELECT * FROM huella.mv_empleados_problematicos;
```

---

## 📝 Notas de Implementación

1. Las Materialized Views usan `CONCURRENTLY` para refresh sin bloqueo
2. Se mantienen las vistas originales como fallback
3. El código detecta automáticamente si usar MV o vista normal
4. Cache invalidation se maneja con `revalidateTag()` de Next.js

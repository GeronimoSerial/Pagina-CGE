# Análisis Técnico: Error 429 - Too Many Requests

## Diagnóstico general

### Estado Actual

- **Aplicación**: Next.js 15 con App Router
- **API Externa**: Strapi CMS en `devcms.geroserial.com`
- **Error**: HTTP 429 (Too Many Requests) en múltiples endpoints
- **Impacto**: Degradación de la experiencia de usuario en la sección de noticias

### Arquitectura de Noticias

La implementación utiliza un enfoque híbrido:

1. **Rutas estáticas**: `/noticias/page/[pageNumber]` con ISR
2. **Cliente dinámico**: `DynamicNewsClient` para búsqueda y filtros
3. **Múltiples servicios**: `getPaginatedNews`, `getFeaturedNews`, `getNewsCategories`

## Revisión del ISR, fetch y cliente dinámico

### ISR (Incremental Static Regeneration)

```typescript
export const revalidate = 2592000; // 30 días
```

**Problemas identificados**:

- ISR está configurado con 30 días, pero las páginas estáticas generan múltiples llamadas simultáneas durante `generateStaticParams`
- En el build-time se ejecutan al menos 3 llamadas por página (paginatedNews + categories + featuredNews)
- Para 5 páginas estáticas: ~15 llamadas API simultáneas

### Cliente Dinámico

En `DynamicNewsClient.tsx`:

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 8000);
```

**Problemas identificados**:

- Timeout muy largo (8 segundos) vs API timeout de config (5 segundos)
- No utiliza el circuit breaker existente
- Realiza fetch directo sin pasar por los servicios optimizados
- Cache limitado (`max-age=90`) en headers

### Servicios de Fetch

En `news.ts`:

- ✅ Implementa cache agresivo con `AggressiveCache`
- ✅ Utiliza timeouts con `AbortController`
- ✅ Configuración de headers apropiada
- ❌ **No utiliza circuit breaker** a pesar de estar disponible

## Evaluación del Circuit Breaker

### Implementación Existente

El circuit breaker está implementado en `/shared/lib/circuit-breaker.ts`:

```typescript
export const apiCircuitBreaker = new CircuitBreaker(3, 30000, 2);
```

**Configuración**:

- Threshold de fallos: 3
- Timeout de recuperación: 30 segundos
- Threshold de éxito: 2

### Problema Crítico

**El circuit breaker NO está siendo utilizado** en ninguno de los servicios de noticias:

- `getPaginatedNews` hace fetch directo
- `getFeaturedNews` hace fetch directo
- `DynamicNewsClient` hace fetch directo

## Causas del Error 429

### Causa Principal: Acumulación de Requests

1. **Build-time**: `generateStaticParams` ejecuta múltiples llamadas simultáneas
2. **Runtime**: Usuarios simultáneos + cliente dinámico + ISR revalidation
3. **Falta de circuit breaker**: No hay protección contra cascadas de fallos

### Patrones Problemáticos Identificados

```typescript
// En generateStaticParams (línea 12)
const { pagination } = await getPaginatedNews(1, 9);

// En el componente (línea 67)
const testData = await getPaginatedNews(1, 9);

// Promise.all simultáneo (línea 77-79)
const [initialNoticias, categorias, featuredNews] = await Promise.all([
  getPaginatedNews(pageNum, 9),
  getNewsCategories(),
  pageNum === 1 ? getFeaturedNews(5) : Promise.resolve([]),
]);
```

### Rate Limiting de la API Externa

La API de Strapi probablemente tiene:

- Rate limit por IP
- Rate limit por endpoint
- Posible shared hosting con límites estrictos

## Solución basada en UX (Loading inteligente)

### Estrategia: "Progressive Enhancement with Graceful Degradation"

#### 1. Detectión Inteligente de Sobrecarga

- Monitoreo de status HTTP 429
- Tracking de frecuencia de errores
- Activación automática de modo "degradado"

#### 2. Estados de Loading Progresivo

```typescript
type LoadingState =
  | 'initial' // Carga normal
  | 'retrying' // Reintentando tras 429
  | 'throttled' // Modo degradado activo
  | 'offline'; // Fallback completo
```

#### 3. UX No Intrusiva

- **Loading inteligente**: "Se están procesando muchas solicitudes, por favor espera..."
- **Reintentos automáticos**: Con backoff exponencial
- **Fallback graceful**: Cache stale o datos mínimos
- **Estado persistente**: Evitar múltiples reintentos

## Plan de implementación paso a paso

### Paso 1: Wrapper de API con Circuit Breaker

**Archivo**: `/shared/lib/resilient-api.ts`

```typescript
// Wrapper que integra circuit breaker + retry logic + rate limiting detection
export const resilientFetch = async (url: string, options?: RequestInit) => {
  return apiCircuitBreaker.execute(
    `api-${url}`,
    async () => {
      // Lógica de fetch con detección de 429
    },
    async () => {
      // Fallback con cache stale
    },
  );
};
```

### Paso 2: Hook de Estado de Carga

**Archivo**: `/shared/hooks/use-resilient-loading.ts`

```typescript
// Hook que maneja los estados de loading y retry automático
export const useResilientLoading = () => {
  // Estados: initial, retrying, throttled, offline
  // Auto-retry con exponential backoff
  // Persistencia en sessionStorage
};
```

### Paso 3: Actualizar Servicios de Noticias

**Archivo**: `/features/noticias/services/news.ts`

- Reemplazar `fetch` por `resilientFetch`
- Implementar fallbacks con cache stale
- Reducir llamadas simultáneas en `generateStaticParams`

### Paso 4: Mejorar DynamicNewsClient

**Archivo**: `/features/noticias/components/DynamicNewsClient.tsx`

- Integrar `useResilientLoading`
- Mostrar estado de "throttled" al usuario
- Retry automático en background

### Paso 5: Componente de Loading Inteligente

**Archivo**: `/shared/components/ResilientLoader.tsx`

```typescript
// Componente que muestra diferentes mensajes según el estado:
// - "Cargando noticias..."
// - "Se están procesando muchas solicitudes, por favor espera..."
// - "Reconectando..." (con progreso)
```

### Archivos Clave a Modificar

1. ✏️ `/shared/lib/resilient-api.ts` - Nuevo wrapper API
2. ✏️ `/shared/hooks/use-resilient-loading.ts` - Nuevo hook de estado
3. 🔧 `/features/noticias/services/news.ts` - Integrar circuit breaker
4. 🔧 `/features/noticias/components/DynamicNewsClient.tsx` - UX mejorada
5. ✏️ `/shared/components/ResilientLoader.tsx` - Loading inteligente

### Timeline Estimado

- **Paso 1-2**: 2 horas (infraestructura)
- **Paso 3**: 1 hora (servicios)
- **Paso 4-5**: 2 horas (UI/UX)
- **Testing**: 1 hora
- **Total**: 6 horas

### Métricas de Éxito

- ✅ Eliminación de errores 429 visibles al usuario
- ✅ Tiempo de loading percibido < 3 segundos
- ✅ Rate de éxito > 95% (incluyendo fallbacks)
- ✅ UX fluida durante picos de tráfico

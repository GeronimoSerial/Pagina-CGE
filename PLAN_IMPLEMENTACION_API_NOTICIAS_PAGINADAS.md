# Plan de Implementación: API de Noticias Paginadas

## 📋 Descripción Técnica

Se implementará un endpoint REST API en `/app/api/noticias/page/[page]/route.ts` que proporcionará noticias paginadas utilizando el SDK de Directus ya configurado en el proyecto. El endpoint estará optimizado para ISR (Incremental Static Regeneration) y diseñado para minimizar la carga en el backend.

## 🏗️ Análisis del Estado Actual

### Configuración Existente

- **Directus SDK**: Ya configurado en `src/shared/lib/directus.ts`
- **Servicios de noticias**: Implementados en `src/features/noticias/services/news.ts`
- **Función existente**: `getPaginatedNews()` ya existe pero necesita ajustes para el endpoint API
- **Configuración de caché**: Definida en `src/shared/lib/config.ts` con timeouts y estrategias

### Problemática Identificada

La función `getPaginatedNews()` actual tiene limitaciones:

- No retorna el total exacto de páginas ni elementos
- Usa estimación de páginas (`page + 1`) en lugar de conteo real
- No está optimizada para uso en API routes con ISR

## 🎯 Estructura del Endpoint

### Ruta

```
/app/api/noticias/page/[page]/route.ts
```

### Parámetros

- **[page]**: Número de página (dinámico, capturado desde la URL)
- **Query params opcionales**:
  - `pageSize`: Elementos por página (default: 6, máximo: 20)
  - `categoria`: Filtro por categoría

### Respuesta JSON

```typescript
{
  data: NewsItem[],
  pagination: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    pageSize: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  },
  meta: {
    timestamp: string,
    cached: boolean
  }
}
```

## 🔧 Análisis de Enfoques: SDK vs Fetch Directo

### Enfoque 1: SDK de Directus (Propuesta Inicial)

```typescript
const noticias = await directus.request(
  readItems('noticias', {
    fields: [
      /* campos optimizados */
    ],
    sort: ['-fecha', '-id'],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  }),
);
```

**Pros:**

- Consistencia con el resto del proyecto
- Tipado automático y manejo de errores
- Sintaxis más limpia

**Contras:**

- Overhead del SDK
- Menos control sobre la request HTTP
- Más difícil optimizar el caché a nivel de fetch

### Enfoque 2: Fetch Directo con Caché ISR (RECOMENDADO)

```typescript
const response = await fetch(
  `${DIRECTUS_URL}/items/noticias?page=${page}&limit=${pageSize}&sort=-fecha&fields=titulo,resumen,fecha,categoria,slug,portada.*`,
  {
    next: {
      revalidate: 300,
      tags: ['noticias', `noticias-page-${page}`],
    },
  },
);
```

**Pros:**

- Control total sobre caché ISR
- Menor overhead
- URL directa más fácil de debuggear
- Directus REST API incluye metadata de paginación automáticamente
- Mejor integración con el sistema de caché de Next.js

**Contras:**

- Tipado manual
- Manejo de errores más verboso

## 🎯 Decisión Final: Fetch Directo

Después del análisis, **el enfoque con fetch directo es superior** para este caso específico porque:

1. **Directus REST API automáticamente incluye metadata de paginación** en la respuesta
2. **ISR funciona mejor con fetch nativo** que con abstracciones
3. **Una sola consulta** obtiene tanto datos como metadata (total_count, page_count)
4. **Menor overhead** en VPS con recursos limitados

## 🔧 Lógica de Implementación Actualizada

### 1. Validación de Parámetros

- Validar que `page` sea un número positivo
- Limitar `pageSize` entre 1 y 20
- Sanitizar filtros de categoría

### 2. Consulta Directa a Directus REST API

```typescript
const url = new URL(`${DIRECTUS_URL}/items/noticias`);
url.searchParams.set('page', page.toString());
url.searchParams.set('limit', pageSize.toString());
url.searchParams.set('sort', '-fecha,-id');
url.searchParams.set(
  'fields',
  'id,titulo,resumen,fecha,categoria,esImportante,slug,portada.*',
);
url.searchParams.set('meta', 'total_count,filter_count');

if (categoria) {
  url.searchParams.set('filter[categoria][_eq]', categoria);
}

const response = await fetch(url.toString(), {
  next: {
    revalidate: 300,
    tags: [
      'noticias',
      `noticias-page-${page}`,
      categoria && `noticias-categoria-${categoria}`,
    ].filter(Boolean),
  },
});
```

### 3. Estructura de Respuesta de Directus

Directus automáticamente retorna:

```typescript
{
  data: NewsItem[],
  meta: {
    total_count: number,
    filter_count: number
  }
}
```

### 3. Procesamiento de Datos

- Transformar URLs de imágenes para optimización
- Calcular metadatos de paginación
- Formatear fechas

### 4. Estrategia de Caché y ISR

```typescript
export async function GET(request: Request) {
  // Configuración ISR con revalidación cada 5 minutos
  const response = await fetch(/* consulta */, {
    next: {
      revalidate: 300, // 5 minutos
      tags: ['noticias', `noticias-page-${page}`]
    }
  });
}
```

## ⚡ Justificación de Decisiones Técnicas

### Uso del SDK de Directus

- **Pro**: Tipado automático, manejo de errores integrado, sintaxis más limpia
- **Pro**: Consistencia con el resto del proyecto
- **Contra**: Overhead mínimo vs fetch directo
- **Decisión**: Mantener SDK por consistencia y mantenibilidad

### Tiempo de Revalidación: 300 segundos (5 minutos)

- **Justificación**: Balance entre contenido fresco y reducción de carga en el servidor
- **Contexto**: Las noticias no cambian constantemente, 5 minutos es aceptable
- **Beneficio**: Reduce significativamente las consultas a Directus en VPS con recursos limitados

### Fetch Directo sobre SDK de Directus

- **Alternativa evaluada**: Usar `directus.request(readItems(...))`
- **Problema**: SDK añade overhead y es menos eficiente para caché ISR
- **Decisión**: Fetch directo para máximo control y performance
- **Beneficio**: Directus REST API incluye metadata automáticamente

### Una Sola Consulta con Metadata

- **Ventaja clave**: Directus incluye `total_count` y `filter_count` automáticamente
- **Optimización**: No necesitamos consulta separada para el conteo
- **Eficiencia**: Una sola request HTTP con toda la información necesaria

### Límite de PageSize: 20

- **Justificación**: Previene sobrecarga del servidor con requests excesivos
- **UX**: 20 elementos es suficiente para mostrar sin afectar performance
- **Memoria**: Reduce uso de memoria en servidor VPS

### Campos Optimizados en la Consulta

Solo se solicitarán campos necesarios para listados:

```typescript
fields: [
  'id',
  'titulo',
  'resumen',
  'fecha',
  'categoria',
  'esImportante',
  'slug',
  { portada: ['id', 'filename_disk', 'title', 'width', 'height'] },
];
```

**Beneficio**: Reduce transferencia de datos y tiempo de respuesta

## 📊 Consideraciones de Rendimiento

### Optimizaciones Implementadas

1. **Caché ISR con fetch nativo**: Control total sobre estrategia de caché
2. **Una sola consulta HTTP**: Directus incluye metadata automáticamente
3. **Límite de campos**: Solo datos esenciales para listados
4. **Validación temprana**: Evita consultas innecesarias con parámetros inválidos
5. **Query parameters optimizados**: Paginación eficiente a nivel de Directus

### Estrategia para VPS con Recursos Limitados

- **Memory**: Endpoint stateless, sin caché en memoria local
- **CPU**: Consultas optimizadas, procesamiento mínimo
- **Network**: Reducción de payload con campos específicos
- **Database**: Índices en `fecha` y `categoria` (asumidos en Directus)

### Manejo de Errores

```typescript
try {
  // Consultas a Directus
} catch (error) {
  console.error('Error fetching news:', error);
  return NextResponse.json(
    { error: 'Error interno del servidor' },
    { status: 500 },
  );
}
```

## 🔄 Escalabilidad

### Preparado para Crecimiento

- **Filtros extensibles**: Estructura permite agregar más filtros fácilmente
- **Caché por tags**: Permite invalidación selectiva
- **Rate limiting**: Compatible con middleware de Next.js
- **Monitoring**: Estructura permite agregar métricas fácilmente

### Integración con Sistema Existente

- **Revalidación**: Compatible con webhook en `/api/revalidate`
- **Tipos**: Reutiliza interfaces existentes (`NewsItem`)
- **Configuración**: Usa constantes de `config.ts`
- **Consistencia**: Mantiene patrones del proyecto

## ✅ Criterios de Éxito

### Funcionales

- [ ] Retorna noticias paginadas correctamente
- [ ] Calcula total de páginas preciso
- [ ] Maneja filtros por categoría
- [ ] Valida parámetros de entrada

### No Funcionales

- [ ] Tiempo de respuesta < 500ms (con caché)
- [ ] Tiempo de respuesta < 2s (sin caché)
- [ ] Uso eficiente de memoria
- [ ] Código legible y mantenible

### ISR y Caché

- [ ] Configuración ISR funcional
- [ ] Revalidación automática cada 5 minutos
- [ ] Tags de caché apropiados

## 📁 Estructura del Archivo Final

El archivo `route.ts` contendrá:

1. **Imports**: Next.js Response, tipos del proyecto
2. **Helpers**: Funciones de validación y transformación de URLs
3. **GET Handler**: Lógica principal con fetch directo a Directus
4. **Error Handling**: Manejo robusto de errores HTTP y de parsing
5. **Response Transformation**: Mapeo de respuesta Directus a formato API propio
6. **Export**: Export del handler GET

Total estimado: ~120-150 líneas de código optimizado y directo.

---

**🔄 Cambio de Estrategia Justificado**: El análisis reveló que fetch directo con la REST API de Directus es más eficiente, especialmente porque incluye automáticamente la metadata de paginación y se integra mejor con el sistema ISR de Next.js.

---

**📌 Nota**: Este plan está diseñado específicamente para las necesidades del proyecto, considerando la configuración existente de Directus y los constraints de recursos del VPS de destino.

# API de Noticias Paginadas - Documentación

## Endpoint Implementado

**URL:** `/api/noticias/page/[page]`  
**Método:** `GET`

## Parámetros

### Path Parameters

- `page` (obligatorio): Número de página (entero positivo)

### Query Parameters

- `pageSize` (opcional): Elementos por página
  - **Default:** 6
  - **Rango:** 1-20
- `categoria` (opcional): Filtrar por categoría específica

## Ejemplos de Uso

### Básico - Primera página

```bash
GET /api/noticias/page/1
```

### Página específica con tamaño personalizado

```bash
GET /api/noticias/page/2?pageSize=10
```

### Filtrar por categoría

```bash
GET /api/noticias/page/1?categoria=infancia
```

### Combinado

```bash
GET /api/noticias/page/1?categoria=educacion&pageSize=5
```

## Respuesta Exitosa (200)

```json
{
  "data": [
    {
      "id": 21,
      "titulo": "Título de la noticia",
      "resumen": "Resumen de la noticia",
      "fecha": "2025-07-16",
      "categoria": "infancia",
      "esImportante": true,
      "slug": "titulo-de-la-noticia",
      "portada": {
        "url": "https://devcms.geroserial.com/assets/xxx?width=800&height=600&fit=cover",
        "title": "Título de la imagen",
        "width": 1156,
        "height": 650
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalItems": 21,
    "pageSize": 6,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "meta": {
    "timestamp": "2025-08-01T00:50:58.062Z",
    "cached": true
  }
}
```

## Respuestas de Error

### 400 - Bad Request

```json
{
  "error": "Número de página inválido"
}
```

```json
{
  "error": "Tamaño de página debe estar entre 1 y 20"
}
```

### 500 - Internal Server Error

```json
{
  "error": "Error interno del servidor"
}
```

## Características ISR

- **Revalidación:** 300 segundos (5 minutos)
- **Cache Tags:**
  - `noticias`
  - `noticias-page-{page}`
  - `noticias-categoria-{categoria}` (si aplica)
- **Optimización:** Respuestas cacheadas estáticamente con Next.js ISR

## Rendimiento

- **Tiempo de respuesta con caché:** < 100ms
- **Tiempo de respuesta sin caché:** < 2s
- **Campos optimizados:** Solo datos necesarios para listados
- **Imágenes:** URLs optimizadas con transformaciones automáticas

## Casos de Uso Frontend

```javascript
// React Hook ejemplo
const useNoticias = (page, pageSize = 6, categoria = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      const params = new URLSearchParams();
      if (pageSize) params.set('pageSize', pageSize);
      if (categoria) params.set('categoria', categoria);

      const url = `/api/noticias/page/${page}?${params}`;
      const response = await fetch(url);
      const result = await response.json();

      setData(result);
      setLoading(false);
    };

    fetchNoticias();
  }, [page, pageSize, categoria]);

  return { data, loading };
};
```

## Testing

El endpoint ha sido probado con:

- ✅ Paginación básica
- ✅ Parámetros de tamaño de página
- ✅ Filtros por categoría
- ✅ Validación de errores
- ✅ Respuestas de metadata completas
- ✅ Integración ISR funcional

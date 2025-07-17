# ⚡ Configuración Rápida - Webhook ISR Optimizado

## 🎯 Solo para Trámites y Noticias

Esta configuración está optimizada para revalidar únicamente:
- **Noticias** → Revalida `/` (LatestNews), `/noticias`, `/noticias/[slug]`
- **Trámites** → Revalida `/tramites`, `/tramites/[slug]`

El resto del contenido (escuelas, documentación, institucional) es **estático** y mantiene cache indefinido.

## ⚙️ Configuración en Directus

### 1. Crear Webhook
- **URL:** `https://tu-dominio.com/api/revalidate`
- **Method:** `POST`
- **Headers:**
  ```
  Authorization: Bearer tu_token_secreto
  Content-Type: application/json
  ```

### 2. Eventos a configurar
**✅ SOLO estos eventos:**
```
noticias.items.create
noticias.items.update  
noticias.items.delete
tramites.items.create
tramites.items.update
tramites.items.delete
```

**❌ NO configurar:**
- `escuelas.*` (estático)
- `documentacion.*` (estático)  
- `institucional.*` (estático)

### 3. Filtro opcional
Para revalidar solo contenido publicado:
```json
{
  "status": {
    "_eq": "published"
  }
}
```

## 🧪 Testing

```bash
# Test endpoint de debugging
curl https://tu-dominio.com/api/revalidate/test \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{"collection":"noticias","event":"test"}'

# Test real (noticias)
curl https://tu-dominio.com/api/revalidate \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{"collection":"noticias","action":"update","item":{"slug":"test"}}'

# Test con colección estática (no revalidará)
curl https://tu-dominio.com/api/revalidate \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{"collection":"escuelas","action":"update","item":{"id":1}}'
```

## 📋 Respuestas esperadas

**Para noticias/trámites:**
```json
{
  "success": true,
  "revalidated": true,
  "pathsRevalidated": ["/", "/noticias", "/noticias/mi-slug"]
}
```

**Para contenido estático:**
```json
{
  "success": true, 
  "revalidated": false,
  "reason": "Collection has static content"
}
```

## 🚀 ¡Listo!

Con esta configuración optimizada:
- ✅ Máximo rendimiento para contenido estático
- ✅ Revalidación automática solo donde es necesario
- ✅ Menor carga en el servidor
- ✅ Cache más eficiente

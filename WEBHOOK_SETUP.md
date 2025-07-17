# Configuración de Webhooks en Directus para ISR

Esta guía te explica cómo configurar webhooks en Directus para revalidar automáticamente el cache ISR de Next.js cuando se publican o actualizan contenidos.

## 🎯 ¿Qué hace el webhook?

Cuando publicas o actualizas contenido en Directus, el webhook automáticamente:
- Revalida las páginas afectadas en Next.js
- Limpia el cache ISR solo donde es necesario
- Mantiene el resto del cache intacto para máximo rendimiento

## 🔧 Configuración paso a paso

### 1. Variables de entorno

Primero, configura las variables de entorno necesarias:

```bash
# En tu archivo .env.local
REVALIDATE_SECRET_TOKEN=tu_token_super_secreto_aqui
```

**⚠️ Importante:** Genera un token seguro usando:
```bash
openssl rand -base64 32
```

### 2. Configuración en Directus

#### Acceso al panel de administración
1. Inicia sesión en tu panel de Directus como administrador
2. Ve a **Settings** → **Webhooks**
3. Haz clic en **"Create Webhook"**

#### Configuración del webhook

**Configuración básica:**
- **Name:** `ISR Revalidation - Producción`
- **Method:** `POST`
- **URL:** `https://tu-dominio.com/api/revalidate`
- **Status:** `Active`

**Headers:**
```
Authorization: Bearer tu_token_super_secreto_aqui
Content-Type: application/json
```

**Trigger Events:**
Selecciona **SOLO** los eventos que disparen la revalidación (otros contenidos son estáticos):

✅ **Para noticias** (revalida home con LatestNews, /noticias y detalle):
- `noticias.items.create`
- `noticias.items.update` 
- `noticias.items.delete`

✅ **Para trámites** (revalida /tramites y detalle):
- `tramites.items.create`
- `tramites.items.update`
- `tramites.items.delete`

❌ **NO configurar eventos para:**
- `escuelas` - Contenido estático
- `documentacion` - Contenido estático  
- `institucional` - Contenido estático
- Otras colecciones estáticas

#### Configuración avanzada (opcional)

**Filters:** Puedes configurar filtros para que solo se dispare en ciertos casos:
```json
{
  "status": {
    "_eq": "published"
  }
}
```

**Request Body:** Usar el body por defecto de Directus (contiene toda la información necesaria)

### 3. Prueba del webhook

#### Desde Directus
1. En la configuración del webhook, haz clic en **"Test Webhook"**
2. Deberías ver una respuesta exitosa (status 200)

#### Desde tu aplicación
1. Publica o actualiza cualquier contenido en las colecciones configuradas
2. Verifica en los logs de tu aplicación Next.js:
```bash
# Logs esperados
🔔 Directus Webhook received: { ... }
✅ Revalidated paths: /, /noticias, /noticias/mi-noticia
📝 Collection: noticias, Action: update, Item: mi-noticia
```

### 4. Verificación del funcionamiento

#### Método 1: Logs de servidor
Revisa los logs de tu aplicación Next.js para ver si los webhooks están llegando correctamente.

#### Método 2: Network tab
1. Abre las herramientas de desarrollo del navegador
2. Ve a la pestaña Network
3. Actualiza una página que debería haberse revalidado
4. Verifica que se está sirviendo contenido fresco

#### Método 3: Testing manual
```bash
# Prueba manual del endpoint - Solo para noticias y trámites
curl -X POST https://tu-dominio.com/api/revalidate \\
  -H "Authorization: Bearer tu_token_secreto" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "noticias.items.update",
    "collection": "noticias",
    "item": {
      "id": 1,
      "slug": "mi-noticia"
    },
    "action": "update"
  }'

# Para trámites
curl -X POST https://tu-dominio.com/api/revalidate \\
  -H "Authorization: Bearer tu_token_secreto" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "tramites.items.update", 
    "collection": "tramites",
    "item": {
      "id": 1,
      "slug": "mi-tramite"
    },
    "action": "update"
  }'

# Test con colección estática (no revalidará)
curl -X POST https://tu-dominio.com/api/revalidate \\
  -H "Authorization: Bearer tu_token_secreto" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "escuelas.items.update",
    "collection": "escuelas", 
    "item": {"id": 1},
    "action": "update"
  }'
# Respuesta esperada: "Collection has static content"
```

## 🚀 Configuraciones recomendadas por entorno

### Desarrollo
```
URL: http://localhost:3000/api/revalidate
Token: desarrollo_token_123
Events: Solo los que necesites para testing
```

### Staging
```
URL: https://staging.tu-dominio.com/api/revalidate
Token: staging_token_456
Events: Todos los eventos de producción
```

### Producción
```
URL: https://tu-dominio.com/api/revalidate
Token: Token ultra-seguro generado con openssl
Events: Todos los eventos necesarios
```

## 🔍 Troubleshooting

### El webhook no se dispara
- ✅ Verifica que el webhook esté marcado como "Active"
- ✅ Revisa que los eventos estén correctamente seleccionados
- ✅ Confirma que el filtro (si usas uno) no esté bloqueando el evento

### Error 401 (Unauthorized)
- ✅ Verifica que el token en el header Authorization sea correcto
- ✅ Confirma que la variable de entorno `REVALIDATE_SECRET_TOKEN` esté configurada
- ✅ Asegúrate de usar el formato: `Bearer tu_token_aqui`

### Error 400 (Bad Request)
- ✅ Verifica que el Content-Type sea `application/json`
- ✅ Confirma que Directus esté enviando un JSON válido

### El cache no se revalida
- ✅ Verifica en los logs que las rutas correctas se estén revalidando
- ✅ Confirma que el ISR esté configurado en las páginas (`export const revalidate = 86400`)
- ✅ Prueba hacer un hard refresh (Ctrl+Shift+R) para verificar

### Performance
- ✅ El webhook revalida **SOLO** noticias y trámites (contenido dinámico)
- ✅ Escuelas, documentación e institucional **NO** se revalidan (contenido estático)
- ✅ Máximo rendimiento: cache indefinido para contenido estático
- ✅ Si necesitas revalidar contenido estático, hazlo manualmente tras deployments

## 📊 Monitoreo

### Logs útiles para monitorear
```javascript
// En tu aplicación
console.log('📈 Webhook stats:', {
  successfulRevalidations: count,
  averageResponseTime: time,
  mostRevalidatedCollection: collection
});
```

### Métricas recomendadas
- Número de webhooks recibidos por día
- Tiempo de respuesta del endpoint de revalidación
- Errores en la revalidación
- Páginas más frecuentemente revalidadas

## 🔐 Seguridad

### Buenas prácticas
1. **Nunca** hardcodees el token en el código
2. Usa tokens diferentes para cada entorno
3. Rota los tokens periódicamente
4. Monitorea intentos de acceso no autorizados
5. Considera usar IP whitelisting si es posible

### Headers de seguridad adicionales
```json
{
  "Authorization": "Bearer tu_token",
  "X-Webhook-Source": "directus",
  "X-Environment": "production"
}
```

## 🚀 Próximos pasos

Una vez configurado el webhook básico, considera:

1. **Revalidación por tags:** Implementar `revalidateTag` para mayor granularidad
2. **Queue de revalidación:** Para sitios con mucho tráfico
3. **Notificaciones:** Alertas cuando la revalidación falla
4. **Analytics:** Métricas detalladas del cache hit/miss ratio

---

## 💡 Tips adicionales

- El ISR funciona mejor con `revalidate` en múltiplos de 60 (1 min, 5 min, 1 hora, 1 día)
- **Solo noticias y trámites** se revalidan automáticamente via webhook
- **Contenido estático** (escuelas, documentación, institucional) mantiene cache indefinido
- Para contenido estático: revalidar manualmente tras deployments si es necesario
- Prueba en desarrollo antes de configurar en producción
- Documenta qué colecciones están conectadas a qué rutas

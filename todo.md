# ✅ Plan de Optimización VPS - Checklist

## 🧱 FASE 1 – Base sólida

- [X] Configurar Next.js con solo SSG e ISR (sin SSR)
- [X] Aplicar `fallback: "blocking"` en páginas dinámicas con ISR
- [ ] No listar todos los slugs, pensar a futuro en caso de ser muchos (Next lo generará en el primer request).
- [ ] Eliminar `revalidate` fijo en `getStaticProps` (usar false)
- [ ] Implementar ISR On-Demand vía Webhook desde Strapi
- [ ] Proteger Webhook con token secreto (`REVALIDATE_SECRET_TOKEN`)

## 🔄 FASE 2 – Redis como caché estratégico

- [ ] Instalar Redis (`sudo apt install redis-server`)
- [ ] Configurar Redis para usar solo 256MB de RAM
  - [ ] `maxmemory 256mb`
  - [ ] `maxmemory-policy allkeys-lru`
  - [ ] `bind 127.0.0.1`
- [ ] Crear lógica de cache para últimas 5 noticias
- [ ] Establecer TTL en Redis (`EX 60`) para esos datos

## 🌐 FASE 3 – NGINX y archivos estáticos

- [X] Activar `gzip` en NGINX
- [X] Agregar `Cache-Control` para JS, CSS, imágenes
- [X] Revisar headers `etag`, `expires`, `immutable`

## 🖼 FASE 4 – Optimización de Imágenes

- [ ] Instalar plugin de Cloudinary en Strapi
- [ ] Configurar `.env` de Strapi con claves Cloudinary
- [ ] Subir imágenes nuevas directamente a Cloudinary
- [ ] Usar `<Image />` de Next.js con URLs de Cloudinary

## 🛠️ FASE 5 – Strapi y PostgreSQL

- [ ] Agregar índices en campos usados frecuentemente (slug, fecha)
- [ ] Usar `_limit` en consultas para evitar carga excesiva
- [ ] Desactivar rutas innecesarias en Strapi
- [ ] Implementar logs para analizar cuellos de botella

## 📊 FASE 6 – Medición y pruebas

- [ ] Instalar `htop`, `iotop`, `redis-cli`
- [ ] Ejecutar pruebas de carga con `autocannon` o `k6`
- [ ] Medir uso de CPU, RAM y disco durante ISR y picos

## 🔐 FASE 7 – Seguridad y backups

- [ ] Asegurar Redis y PostgreSQL solo en localhost
- [ ] Configurar UFW (firewall) para permitir solo puertos necesarios
- [ ] Automatizar backups de PostgreSQL (pg_dump)
- [ ] Guardar copias de `.env`, config de NGINX y Redis

## 🚀 FASE 8 – Escalabilidad futura (En caso de ser posible)

- [ ] Evaluar migrar frontend a Vercel o Cloudflare Pages
- [ ] Separar backend (Strapi + PostgreSQL + Redis) en otra VPS
- [ ] Servir todos los assets a través de un CDN (Cloudflare, etc.)

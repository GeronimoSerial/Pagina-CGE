# Portal Web del Consejo General de Educación (CGE)

## 📋 Descripción General

Este portal es la plataforma oficial del Consejo General de Educación, orientada a la comunidad educativa de Corrientes. Su objetivo es centralizar información institucional, trámites, documentación y recursos útiles para docentes, supervisores, directivos y la ciudadanía en general.

El sitio está diseñado para ser accesible, moderno y adaptable a distintos dispositivos, facilitando la consulta y gestión de información relevante.

## 🎯 Objetivos del Portal

- **Centralizar información** relevante y actualizada sobre trámites, normativas y servicios.
- **Facilitar el acceso** a documentación y recursos institucionales.
- **Promover la transparencia** en la gestión educativa.
- **Mejorar la comunicación** entre el CGE y la comunidad educativa.
- **Impulsar la digitalización** de procesos administrativos.

## 🚀 Funcionalidades Principales

- Consulta de trámites y requisitos para docentes.
- Acceso a documentación oficial y normativa vigente.
- Noticias y novedades institucionales.
- Búsqueda avanzada de contenidos.
- Sección de contacto y canales de comunicación.
- Interfaz responsive y accesible.

## 🛠️ Tecnologías y Herramientas

- **Frontend**:
  - **Next.js 15.3.1** (React, SSR)
  - **TypeScript**
  - **Tailwind CSS**
  - **shadcn/ui**
  - **Markdown** para contenido estático
  - **Gray Matter** y **Remark** para procesamiento de Markdown

- **Backend**:
  - **Strapi CMS** para la gestión de contenidos
  - **API REST** para comunicación frontend-backend
  - **Base de datos** para almacenamiento de contenido dinámico

## 📁 Estructura del Proyecto

```
├── public/                  # Archivos estáticos
│   ├── admin/              # Configuración del panel administrativo
│   ├── carrousel/          # Imágenes del carrusel
│   ├── images/             # Imágenes generales
│   └── organigrama/        # Fotos del personal
├── src/
│   ├── app/                # Páginas y rutas de la aplicación
│   │   ├── api/            # Rutas API para comunicación con Strapi
│   │   ├── noticias/       # Página de noticias (generada desde Strapi)
│   │   ├── tramites/       # Página de trámites (generada desde Strapi)
│   │   ├── accesibilidad/  # Página de accesibilidad
│   │   ├── contacto/       # Página de contacto
│   │   ├── documentacion/  # Sección de documentación
│   │   ├── escuelas/       # Información de escuelas
│   │   ├── institucional/  # Información institucional
│   │   └── terminos/       # Términos y condiciones
│   ├── features/           # Características y módulos específicos
│   ├── shared/             # Código compartido entre módulos
```

## 🔧 Instalación y Puesta en Marcha

1. Clonar el repositorio:

```bash
git clone [https://github.com/GeronimoSerial/Pagina-CGE]
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`.

## 📦 Módulos y Secciones

- **noticias/**: Noticias dinámicas gestionadas a través de Strapi CMS
- **tramites/**: Trámites y procedimientos gestionados a través de Strapi CMS
- **accesibilidad/**: Información sobre accesibilidad web
- **contacto/**: Formulario de contacto
- **documentacion/**: Documentos y recursos institucionales
- **escuelas/**: Información de escuelas
- **institucional/**: Datos institucionales y organigrama
- **terminos/**: Términos y condiciones

## 🔍 Funcionalidades Destacadas

- **Gestión de Contenidos**: Panel administrativo con Strapi para gestionar noticias y trámites
- **Contenido Dinámico**: Las secciones de noticias y trámites se generan automáticamente desde el backend
- **Búsqueda integrada**
- **Componentes UI personalizados**
- **Rendimiento optimizado** con generación estática y renderizado del lado del servidor
- **Tipado fuerte** con TypeScript para mejor mantenibilidad
- Formularios de contacto
- Visualización de documentos
- Interfaz adaptativa para dispositivos móviles

#  Arquitectura y Patrones Críticos

Este portal utiliza **Next.js 15.3.1 (App Router)**, **TypeScript**, **Tailwind CSS** y **Strapi CMS**. Está optimizado para VPS con generación estática, ISR y multi-caché.

##  Estrategia de Caché Multi-Capa

1. **Caché en Memoria Agresivo** (`src/shared/lib/aggressive-cache.ts`)
   - Usa `withCache(noticiasCache, key, fetchFn)` en páginas individuales (`[slug]/page.tsx`).
   - TTL: 24h para noticias, 30d para trámites.
   - No usar en listados.

2. **Next.js ISR + Revalidación On-Demand**
   - Webhook `/api/revalidate` limpia RAM y ejecuta `revalidatePath()`.
   - Intervalos: 1h home, 30d contenido.
   - `revalidatePath()` debe funcionar inmediato y no entrar en conflicto con otros cachés.

3. **Caché HTTP** (`next.config.mjs`)
   - Assets: 1 año immutable.
   - API: 30s-5min según tipo.


## 📂 Estructura Clave

- `src/app/`: Rutas, API, layout principal.
- `src/features/`: Módulos de dominio (noticias, trámites, escuelas, etc).
- `src/shared/`: UI, hooks, caché, utilidades.
- `src/features/*/services/`: Llamadas directas a Strapi (sin caché).
- `src/shared/lib/aggressive-cache.ts`: Lógica de caché en memoria.
- `src/app/api/revalidate/route.ts`: Webhook para invalidación de caché.
- `next.config.mjs`: Headers HTTP y CDN.

## 🖥️ Comandos Clave

```bash
npm run build              # Build producción
npm run format             # Formateo Prettier
```

## 🛡️ Debug y Monitoreo

- `/api/monitoring`: Estadísticas de caché y memoria.
- `DELETE /api/monitoring`: Resetea métricas.

## 🏗️ Convenciones y Buenas Prácticas

- App Router con SSG + ISR para VPS.
- Rutas dinámicas `[slug]` con revalidación 30d.
- `generateStaticParams()` solo retorna slugs conocidos.
- Estado server vía Server Components, client vía hooks.
- Tailwind con `cn()` para clases condicionales.
- Markdown en trámites con frontmatter y gray-matter.
- Circuit breaker en `src/shared/lib/circuit-breaker.ts`.

## 🧪 Ejemplos de Uso

## 🔑 Variables de Entorno

```bash
NEXT_PUBLIC_STRAPI_URL= "strapi link"
REVALIDATE_SECRET_TOKEN= "bearer token"
```

## 📝 Notas y Solución de Problemas

- Usa `/api/monitoring` para debug de caché y rendimiento.
- Todo trámites es markdown con frontmatter.
- La lógica de noticias destacadas (`esImportante`) es crítica para el carousel.
- Circuit breaker para resiliencia API.

---

Para consultas o sugerencias, utiliza la sección de contacto del portal web.

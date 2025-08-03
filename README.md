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
  - **Directus CMS** para la gestión de contenidos
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
│   │   ├── api/            # Rutas API para comunicación con Directus
│   │   ├── noticias/       # Página de noticias (generada desde Directus)
│   │   ├── tramites/       # Página de trámites (generada desde Directus)
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
git clone https://github.com/GeronimoSerial/Pagina-CGE
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

- **noticias/**: Noticias dinámicas gestionadas a través de Directus CMS
- **tramites/**: Trámites y procedimientos gestionados a través de Directus CMS
- **accesibilidad/**: Información sobre accesibilidad web
- **contacto/**: Formulario de contacto
- **documentacion/**: Documentos y recursos institucionales
- **escuelas/**: Información de escuelas
- **institucional/**: Datos institucionales y organigrama
- **terminos/**: Términos y condiciones

## 🔍 Funcionalidades Destacadas

- **Gestión de Contenidos**: Panel administrativo con Directus para gestionar noticias y trámites
- **Contenido Dinámico**: Las secciones de noticias y trámites se generan automáticamente desde el backend
- **Búsqueda integrada**
- **Componentes UI personalizados**
- **Rendimiento optimizado** con generación estática y renderizado del lado del servidor
- **Tipado fuerte** con TypeScript para mejor mantenibilidad
- Formularios de contacto
- Visualización de documentos
- Interfaz adaptativa para dispositivos móviles

# Arquitectura y Patrones Clave

Este portal utiliza **Next.js 15.4.2 (App Router)**, **TypeScript**, **Tailwind CSS** y **Directus CMS**. Está optimizado para VPS con generación estática e ISR.

## Estructura Clave

- `src/app/`: Rutas, API, layout principal.
- `src/features/`: Módulos de dominio (noticias, trámites, escuelas, etc).
- `src/shared/`: UI, hooks, utilidades.
- `src/features/*/services/`: Llamadas directas a Directus.

## 🖥️ Comandos Clave

```bash
npm run build              # Build producción
npm run format             # Formateo Prettier
```

## 🏗️ Convenciones y Buenas Prácticas

- App Router con SSG + ISR para VPS.
- Rutas dinámicas `[slug]` con revalidación 30d.
- `generateStaticParams()` solo retorna slugs conocidos.
- Estado server vía Server Components, client vía hooks.
- Tailwind con `cn()` para clases condicionales.
- Markdown en trámites con frontmatter y gray-matter.

## 🔑 Variables de Entorno

```bash
NEXT_PUBLIC_DIRECTUS_URL= "directus link"
```

---

Para consultas o sugerencias, utiliza la sección de [contacto](https://consejo.mec.gob.ar/contacto) del portal web.

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

- **Next.js 13+** (React, SSR)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Markdown para contenido estático**
- **Gray Matter** y **Remark** para procesamiento de Markdown

## 📁 Estructura del Proyecto

```
├── public/                  # Archivos estáticos
│   ├── admin/              # Configuración del panel administrativo
│   ├── carrousel/          # Imágenes del carrusel
│   ├── content/            # Contenido en Markdown
│   │   ├── noticias/       # Artículos de noticias
│   │   └── tramites/       # Artículos de trámites
│   ├── images/             # Imágenes generales
│   └── organigrama/        # Fotos del personal
├── src/
│   ├── app/                # Páginas y rutas de la aplicación
│   │   ├── [articulo]/     # Rutas dinámicas para artículos
│   │   ├── accesibilidad/  # Página de accesibilidad
│   │   ├── contacto/       # Página de contacto
│   │   ├── documentacion/  # Sección de documentación
│   │   ├── escuelas/       # Información de escuelas
│   │   ├── institucional/  # Información institucional
│   │   ├── supervisores/   # Área de supervisores
│   │   └── terminos/       # Términos y condiciones
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # Hooks personalizados
│   ├── interfaces/         # Definiciones de tipos
│   ├── lib/                # Utilidades y configuraciones
│   ├── modules/            # Módulos específicos de funcionalidad
│   └── styles/             # Estilos globales
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

- **[articulo]/**: Visualización de artículos y trámites
- **accesibilidad/**: Información sobre accesibilidad web
- **contacto/**: Formulario de contacto
- **documentacion/**: Documentos y recursos institucionales
- **escuelas/**: Información de escuelas
- **institucional/**: Datos institucionales y organigrama
- **supervisores/**: Área de supervisores
- **terminos/**: Términos y condiciones

## 🔍 Funcionalidades Destacadas

- Búsqueda integrada
- Componentes UI personalizados
- Formularios de contacto
- Visualización de documentos
- Interfaz adaptativa para dispositivos móviles

## 🤝 ¿Cómo Contribuir?

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/NuevaFuncionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin feature/NuevaFuncionalidad`).
5. Abre un Pull Request.

## 📞 Contacto

Para consultas o sugerencias, utiliza la sección de contacto del portal web.

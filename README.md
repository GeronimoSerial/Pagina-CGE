# Proyecto Web Next.js

## Descripción

Este proyecto es el sitio web del Consejo General de Educación, parte del Ministerio de Educación de la Provincia de Corrientes.

Este proyecto es una aplicación web construida con Next.js y TypeScript, diseñada para ofrecer una experiencia completa y organizada al usuario. La aplicación cuenta con un diseño moderno y funcional, estructurado con un layout principal que incluye un encabezado (header) y un pie de página (footer).

## Características Principales

-   **Layout Principal:**
    -   **Header:** Encabezado principal para la navegación y la identidad del sitio.
    -   **Footer:** Pie de página con información adicional y enlaces relevantes.

-   **Páginas:**
    -   **Contacto:** Formulario o información de contacto para los usuarios.
    -   **Documentación:** Sección donde se puede acceder a diferentes documentos y guías.
    -   **Institucional:** Información sobre la institución u organización.
    -   **Trámites:** Detalles y procedimientos sobre distintos trámites disponibles.

-   **Secciones:**
    -   **Noticias:** Un espacio para las últimas novedades y noticias relevantes.
    -   **Artículos:** Publicaciones más extensas y detalladas sobre temas específicos.
    -   **Documentación:** Una sección dedicada a proporcionar recursos y guías.
    -   **Home:** Página principal con una sección de Hero y accesos rápidos.
    -   **Hero Section:** Presentación visual impactante en la página principal.
    -   **Quick Access:** Enlaces rápidos a secciones importantes del sitio.

-   **Tecnologías:**
    -   **Next.js:** Framework de React para el desarrollo web.
    -   **TypeScript:** Lenguaje de programación que añade tipado estático a JavaScript.

## Estructura del Proyecto

La estructura del proyecto se organiza de la siguiente manera:

-   `public/`: Contiene los archivos estáticos como imágenes y documentos.
-   `src/`:
    -   `app/`: Rutas y páginas de la aplicación.
        -   `contacto/`: Página de contacto.
        -   `documentacion/`: Página de documentación.
        -   `institucional/`: Página institucional.
        -   `tramites/`: Página de trámites.
        -`noticias/[id]` Página de noticias.
        -`tramites/[id]` Página de tramites.
        -   `page.tsx`: Página principal.
    -   `components/ui/`: Contiene los componentes de interfaz de usuario reutilizables.
    -   `modules/`: Componentes modulares específicos para cada sección.
        -   `layout/`: Header y Footer.
        -   `home/`: Componentes de la pagina de inicio.
        -   `documentation/`: Componentes de la sección de documentación.
        - `article/`: Componentes de la sección de noticias y articulos.
    -   `interfaces/`: Definición de interfaces para el tipado de datos.
    -   `lib/`: Funciones utilitarias.
    -   `styles/`: Estilos y fuentes.
    -   `types/`: Definiciones de tipos para Supabase.
    -   `content/`: Contenido markdown para noticias y tramites.

## Instalación y Ejecución

1.  **Clonar el Repositorio:**
```
bash
    git clone [URL del repositorio]
    
```
2.  **Navegar al Directorio del Proyecto:**
```
bash
    cd [nombre del proyecto]
    
```
3.  **Instalar las Dependencias:**
```
bash
    npm install
    
```
4.  **Iniciar el Servidor de Desarrollo:**
```
bash
    npm run dev
    
```
Esto iniciará la aplicación en modo desarrollo. Podrás acceder a ella en `http://localhost:3000`.

5.  **Construir el Proyecto:**
```
bash
    npm run build
    
```
6.  **Iniciar el Proyecto en Producción**
```
bash
    npm start
    
```
## Información Adicional

-   **Dependencias:** Asegúrate de tener Node.js y npm instalados en tu sistema.
-   **Configuración:** Revisa los archivos de configuración como `next.config.js` y `tsconfig.json` para adaptarlos a tus necesidades.
-   **Contribuciones:** Si deseas contribuir al proyecto, sigue las pautas de contribución establecidas.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
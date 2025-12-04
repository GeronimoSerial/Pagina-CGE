# Plan de Reestructuración del Dashboard y UX/UI

Este documento presenta un análisis del estado actual del dashboard y una propuesta integral para mejorar la jerarquía visual, la organización de la navegación y la estructura interna de los componentes.

## 1. Análisis de Jerarquía Visual y Organización Actual

### Estado Actual
El dashboard actual presenta una estructura funcional pero con oportunidades de mejora en la experiencia de usuario (UX) y la jerarquía visual:

*   **Navegación (Sidebar):** Organizada por módulos ("Asistencia CGE", "Escuelas", "Supervisión"). La etiqueta "Asistencia CGE" es redundante (el sistema es del CGE). Algunos ítems críticos pueden estar ocultos dentro de grupos colapsables.
*   **Dashboard Principal (`/dashboard`):**
    *   **Foco Difuso:** Divide la atención entre "Estadísticas generales" e "Información del establecimiento" mediante separadores visuales débiles (`<hr />`).
    *   **Layout Rígido:** Utiliza una grilla simple de 2 columnas para todo (gráficos y listas), lo que no siempre favorece la legibilidad de datos complejos.
    *   **Falta de Jerarquía:** Las tarjetas de métricas (KPIs) compiten en peso visual. No hay una distinción clara entre "lo que necesito saber ahora" (alertas) y "lo que necesito analizar" (tendencias).

### Problemas Identificados
1.  **Sobrecarga Cognitiva:** El usuario debe procesar dos secciones de estadísticas separadas sin un contexto claro de por qué están divididas.
2.  **Navegación Profunda:** Acceder a reportes o auditoría requiere abrir menús colapsables, lo que añade clics a tareas frecuentes.
3.  **Visualización de Datos:** Las listas de "Días con/sin actividad" en tarjetas pequeñas pueden requerir mucho scroll o truncar información valiosa.

---

## 2. Propuesta de Layout Estructurado

Se propone un diseño basado en **"Niveles de Atención"**, donde la información fluye de lo más crítico (arriba) a lo más detallado (abajo).

### Estructura del Dashboard Principal

1.  **Header de Contexto (Nivel 0):**
    *   Saludo personalizado y Fecha (ya existente).
    *   **Nuevo:** Botones de Acción Rápida (ej. "Descargar Reporte Mensual", "Nueva Auditoría").

2.  **Sección de Métricas Clave (Nivel 1 - "El Pulso"):**
    *   Unificar "Estadísticas generales" e "Información del establecimiento" en una sola fila de **Tarjetas KPI (Key Performance Indicators)**.
    *   Destacar métricas de alerta (ej. "Ausentes hoy", "Inconsistencias") con colores semánticos (rojo/naranja).

3.  **Sección de Análisis de Tendencias (Nivel 2 - "El Panorama"):**
    *   **Gráfico Principal:** `AttendanceChart` a ancho completo (Full Width). La asistencia es una serie temporal y se beneficia de más espacio horizontal.
    *   **Gráfico Secundario:** `HoursChart` al lado de un desglose o métrica relacionada, o en una fila secundaria de 2 columnas.

4.  **Sección Operativa y de Alertas (Nivel 3 - "El Detalle"):**
    *   Reemplazar las listas simples por un panel de **"Novedades y Alertas"**.
    *   En lugar de "Días sin actividad" (que puede ser una lista larga), mostrar un resumen: "5 días sin actividad detectados" con un botón "Ver detalles".
    *   Priorizar la tabla de "Incompletas" o "Problemas" directamente en el dashboard para invitar a la acción inmediata.

---

## 3. Reorganización del Sidebar (Navegación)

El objetivo es reducir la fricción y agrupar lógicamente las tareas.

### Propuesta de Estructura

*   **Inicio**
    *   `Panel` (Renombrar a "Inicio" o "Resumen")

*   **Gestión de Personal** (Antes "Asistencia CGE")
    *   *Simplifica el nombre para que sea más directo.*
    *   `Asistencia` (Diaria/Mensual)
    *   `Empleados` (Legajos)
    *   `Novedades` (Agrupar Ausentes/Incompletas aquí si es posible, o mantener separados si son muy usados)
    *   `Auditoría`

*   **Gestión Institucional** (Antes "Escuelas")
    *   `Escuelas` (Listado General)
    *   `Mapa Educativo` (Antes "Geografía")
    *   `Calidad de Datos`

*   **Supervisión**
    *   `Tablero de Control` (General)
    *   `Reportes` (Listado)

*   **Soporte y Configuración** (Footer/Secundario)
    *   `Documentos` (Mover aquí si es referencia)
    *   `Atención`
    *   `Configuración`

### Mejoras de UX en Sidebar
*   **Iconografía:** Asegurar que los iconos de "Gestión de Personal" sean distintos visualmente de "Gestión Institucional" (ej. iconos de personas vs. iconos de edificios).
*   **Badges:** Agregar contadores (badges) en el sidebar para ítems que requieren atención (ej. "Incompletas (3)").

---

## 4. Mejoras en Componentes Internos

### A. Tarjetas de Métricas (KPI Cards)
*   **Diseño:** Usar el patrón `Value` (grande) + `Label` (pequeño) + `Trend` (indicador de cambio vs mes anterior).
*   **Interacción:** Hacer clic en la tarjeta de "Ausentes" debería llevar directamente a la vista detallada de `/dashboard/ausentes`.

### B. Gráficos (Charts)
*   **Interactividad:** Agregar selectores de rango de tiempo rápidos en la cabecera del gráfico (ej. "Últimos 7 días", "Este mes", "Mes pasado").
*   **Contexto:** Agregar tooltips enriquecidos que expliquen picos o caídas (ej. "Feriado Nacional").

### C. Tablas y Listas
*   **Densidad:** Utilizar una densidad "compacta" para listados largos.
*   **Acciones en Línea:** En las tablas de "Incompletas", agregar un botón de acción (ej. "Corregir") en la misma fila (hover action).
*   **Empty States:** Mejorar los estados vacíos. Si no hay "Días sin actividad", mostrar un mensaje positivo con una ilustración ("¡Todo al día!").

### D. Filtros Globales
*   Considerar una barra de filtros global en el top del dashboard si el usuario maneja múltiples escuelas o departamentos, para que todo el dashboard se actualice según la selección.

---

## Resumen de Acciones Inmediatas (Quick Wins)

1.  **Renombrar** "Asistencia CGE" a "Gestión de Personal" en `app-sidebar.tsx`.
2.  **Unificar** las secciones de estadísticas en `page.tsx` eliminando los `<hr />` y creando un grid de KPIs cohesivo.
3.  **Ampliar** el `AttendanceChart` para que ocupe más ancho (`col-span-2` en lg).
4.  **Convertir** las listas de "Días" en componentes más interactivos o resumidos.

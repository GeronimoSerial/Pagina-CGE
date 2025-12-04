# Plan de Implementación: Reestructuración del Dashboard

Este documento detalla la hoja de ruta técnica para implementar las mejoras de UX/UI propuestas en `dashboard-structure-plan.md`, priorizando el rendimiento (Performance) y la estabilidad del sistema.

## Principios Técnicos
*   **Next.js 16 & React Server Components (RSC):** Maximizar el uso de componentes de servidor para reducir el bundle del cliente.
*   **Suspense & Streaming:** Cargar partes críticas (KPIs) primero y diferir gráficos pesados.
*   **Componentización:** Crear componentes pequeños y reutilizables en `@dashboard/components`.
*   **Tailwind CSS:** Utilizar clases de utilidad para el layout y diseño responsive.

---

## Fase 1: Navegación y Sidebar (Quick Wins)

**Objetivo:** Mejorar la encontrabilidad sin alterar la lógica de negocio compleja.

1.  **Refactorizar `app-sidebar.tsx`:**
    *   **Tarea:** Actualizar el objeto `baseData` para reflejar la nueva jerarquía (Gestión de Personal, Gestión Institucional).
    *   **Código:** Renombrar claves y reordenar arrays.
    *   **Impacto:** Bajo riesgo, mejora inmediata de UX.

2.  **Implementar Badges de Estado (Opcional/Fase 1.5):**
    *   **Tarea:** Crear un componente `SidebarBadge` que acepte un número.
    *   **Performance:** Si el conteo de "Incompletas" es costoso, cargar este dato vía un componente asíncrono separado dentro del Sidebar (Server Component) envuelto en Suspense, para no bloquear la renderización del menú principal.

---

## Fase 2: Layout del Dashboard Principal

**Objetivo:** Establecer la nueva estructura visual en `src/app/(panel)/dashboard/page.tsx`.

1.  **Nuevo Componente `DashboardHeader`:**
    *   **Ubicación:** `src/features/dashboard/components/layout/dashboard-header.tsx`
    *   **Props:** `userName`, `dateString`.
    *   **Contenido:** Saludo y botones de acción (placeholders por ahora).

2.  **Reestructuración de la Grilla (Grid):**
    *   **Cambio:** Modificar el contenedor principal en `page.tsx` para usar un layout más flexible.
    *   **CSS:**
        ```tsx
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* KPIs ocupan 1 columna cada uno en LG */}
          <StatsCards />
          
          {/* Gráfico Principal ocupa todo el ancho o 3/4 */}
          <div className="col-span-full lg:col-span-3">
            <AttendanceChart />
          </div>
          
          {/* Panel Lateral / Alertas */}
          <div className="col-span-full lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>
        ```

---

## Fase 3: Refactorización de Componentes de Datos

**Objetivo:** Unificar visualmente y optimizar la carga de datos.

1.  **Unificación de KPIs (`StatsCards`):**
    *   **Tarea:** Combinar `StaticStatsCards` y `DashboardStatsCards` en un solo wrapper `KeyMetricsGrid`.
    *   **Performance:** Asegurar que las llamadas a la DB para estos datos se hagan en paralelo (`Promise.all`) en el componente padre o sean componentes independientes con su propio Suspense.

2.  **Optimización de Gráficos:**
    *   **Tarea:** Modificar `AttendanceChart` para aceptar una prop `className` que permita controlar su altura/ancho desde el padre.
    *   **Mejora:** Asegurar que el componente de cliente (el gráfico en sí) sea ligero. Mover cualquier procesamiento de datos pesado al servidor antes de pasar las props al gráfico.

3.  **Transformación de Listas a Paneles de Alerta:**
    *   **Tarea:** Crear `AlertsSummary.tsx`.
    *   **Lógica:** En lugar de renderizar una tabla completa, hacer un `count` en la base de datos (mucho más rápido) y mostrar solo el número.
    *   **Interacción:** El clic lleva a la página de detalle (`/dashboard/incompletas`). Esto reduce drásticamente el HTML enviado inicialmente.

---

## Fase 4: Performance y Caching (Next.js 16)

1.  **Estrategia de Suspense Granular:**
    *   Evitar un solo `loading.tsx` para toda la página.
    *   Envolver cada sección mayor (KPIs, Gráfico Principal, Alertas) en su propio `<Suspense fallback={<Skeleton />}>`.
    *   Esto permite que el usuario vea la estructura y el saludo inmediatamente mientras los datos cargan.

2.  **Cache Components (`use cache`):**
    *   Si los datos de "Estadísticas Generales" no cambian minuto a minuto, aplicar la directiva `"use cache"` a las funciones de data fetching correspondientes, con un `revalidate` o `cacheTag` apropiado (ej. invalidar cuando se sube una nueva asistencia).

3.  **Optimización de Consultas (Prisma):**
    *   Revisar las consultas de `DaysWithActivity` y `DaysWithoutActivity`. Si usan vistas pesadas, asegurar que solo traigan los campos necesarios (`select: { ... }`).

---

## Plan de Ejecución Paso a Paso

1.  **Paso 1:** Modificar `app-sidebar.tsx` (1 hora).
2.  **Paso 2:** Crear componentes esqueletos (Skeletons) actualizados para el nuevo layout (2 horas).
3.  **Paso 3:** Refactorizar `page.tsx` moviendo componentes a la nueva estructura de Grid (2 horas).
4.  **Paso 4:** Ajustar estilos de `AttendanceChart` y unificar tarjetas de KPIs (3 horas).
5.  **Paso 5:** Pruebas de carga y ajuste de Suspense boundaries (1 hora).

**Tiempo Estimado Total:** ~9-10 horas de desarrollo.

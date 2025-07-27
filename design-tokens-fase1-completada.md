# CGE Design System - Documentación de Design Tokens

## Implementación Completada - Fase 1 ✅

La **Fase 1: Crear Sistema de Design Tokens** ha sido completada exitosamente. Se ha implementado un sistema coherente de layout, espaciado y containers que estandariza la arquitectura visual del proyecto.

## 🎯 Objetivos Cumplidos

### 1. Tokens de Espaciado ✅

Se definieron tokens estandarizados para espaciado vertical y horizontal:

```css
/* Tailwind Config Extensions */
spacing: {
  'section-sm': '2rem',      /* 32px - py-8 */
  'section-md': '3rem',      /* 48px - py-12 */
  'section-lg': '4rem',      /* 64px - py-16 */
  'element-sm': '1.5rem',    /* 24px - mb-6 */
  'element-md': '2rem',      /* 32px - mb-8 */
  'separator': '2rem',       /* 32px - my-8 */
}
```

### 2. Container System ✅

Sistema unificado de 5 tipos de containers para diferentes casos de uso:

```css
/* Container Classes */
.page-container     /* max-w-6xl - Páginas estándar */
.content-container  /* max-w-4xl - Artículos/contenido */
.wide-container     /* max-w-7xl - Páginas amplias */
.form-container     /* max-w-2xl - Formularios */
.institutional      /* max-w-9xl - Solo institucional */
```

### 3. Background System ✅

Tres tipos de backgrounds estandarizados:

```css
.page-bg-default     /* bg-gray-50 min-h-screen */
.page-bg-transparent /* min-h-screen */
.page-bg-gradient    /* gradiente institucional */
```

## 📚 Guía de Uso

### Componente PageLayout

Componente principal para crear layouts consistentes:

```tsx
import { PageLayout } from '@/shared/components/PageLayout';

// Usando presets
<PageLayout
  pageType="content"  // 'homepage' | 'content' | 'article' | 'wide' | 'institutional' | 'form'
  hero={{ title: "...", description: "..." }}
  showFAQ={true}
  faqBasePath="/section"
>
  {children}
</PageLayout>

// Configuración manual
<PageLayout
  containerType="wide"
  background="gradient"
  spacing="large"
  hero={{ title: "...", description: "..." }}
>
  {children}
</PageLayout>
```

### Componentes Especializados

#### ContentPageLayout

Para páginas de contenido estándar:

```tsx
<ContentPageLayout
  title="Título"
  description="Descripción"
  showFAQ={true}
  faqBasePath="/path"
>
  {children}
</ContentPageLayout>
```

#### FormPageLayout

Para páginas con formularios:

```tsx
<FormPageLayout
  title="Formulario"
  description="Descripción"
  showFAQ={true}
  faqBasePath="/path"
>
  <FormComponent />
</FormPageLayout>
```

### Hook useLayoutClasses

Para usar las clases en componentes existentes:

```tsx
import { useLayoutClasses } from '@/shared/components/PageLayout';

function MyComponent() {
  const layout = useLayoutClasses('wide', 'default', 'normal');

  return <div className={layout.container}>{/* contenido */}</div>;
}
```

## 🔄 Páginas Migradas

### ✅ Completadas

- **Escuelas** → ContentPageLayout
- **Contacto** → FormPageLayout
- **Documentación** → ContentPageLayout
- **Términos** → PageLayout (content)
- **Accesibilidad** → PageLayout (content)
- **Noticias** → PageLayout (wide)
- **Institucional** → PageLayout (institutional)

### ⏸️ Sin Modificar (según instrucciones)

- **tramites/[slug]** → Mantiene estructura original
- **noticias/[slug]** → Mantiene estructura original

### 🔄 Pendientes para Fase 2

- **Homepage** → Requiere manejo especial por complejidad
- **Chatbot** → Estructura grid única
- **Trámites (principal)** → Estructura artículo especial

## 📊 Métricas de Estandarización

### Antes de Design Tokens

| Página        | Container                 | Max-Width | Padding        | Background   |
| ------------- | ------------------------- | --------- | -------------- | ------------ |
| Homepage      | `container`               | default   | `px-4 md:px-6` | mixto        |
| Noticias      | `max-w-7xl`               | 7xl       | `px-6`         | ninguno      |
| Trámites      | `max-w-4xl`               | 4xl       | `px-6 lg:px-8` | `bg-gray-50` |
| Escuelas      | `container`               | default   | `px-4`         | `bg-gray-50` |
| Institucional | `container max-w-9xl`     | 9xl       | `px-4 md:px-6` | gradiente    |
| Contacto      | `container` + `max-w-2xl` | mixed     | `px-4 md:px-6` | `bg-gray-50` |

### Después de Design Tokens ✅

| Página        | Container        | Layout Type   | Sistema          |
| ------------- | ---------------- | ------------- | ---------------- |
| Escuelas      | `page-container` | content       | ✅ Estandarizado |
| Contacto      | `form-container` | form          | ✅ Estandarizado |
| Documentación | `page-container` | content       | ✅ Estandarizado |
| Términos      | `page-container` | content       | ✅ Estandarizado |
| Accesibilidad | `page-container` | content       | ✅ Estandarizado |
| Noticias      | `wide-container` | wide          | ✅ Estandarizado |
| Institucional | `institutional`  | institutional | ✅ Estandarizado |

## 🎨 Beneficios Implementados

### 1. Consistencia Visual

- **Espaciado uniforme** entre todas las páginas
- **Containers coherentes** según el tipo de contenido
- **Backgrounds estandarizados** para diferentes contextos

### 2. Mantenibilidad del Código

- **Componentes reutilizables** (PageLayout, ContentPageLayout, FormPageLayout)
- **Tokens centralizados** en `/shared/lib/layout-tokens.ts`
- **Clases CSS utilitarias** en `index.css`

### 3. Escalabilidad

- **Sistema tipo-seguro** con TypeScript
- **Presets configurables** para diferentes tipos de página
- **Fácil extensión** para nuevos casos de uso

### 4. Performance

- **CSS optimizado** con clases reutilizables
- **Menor duplicación** de estilos
- **Build exitoso** confirmado ✅

## 🚀 Próximos Pasos - Fase 2

1. **Refactorizar Homepage** → Estructura compleja con múltiples secciones
2. **Unificar Hero Components** → HeroMain vs HeroSection
3. **Página de Chatbot** → Layout grid especial
4. **Página Trámites Principal** → Estructura artículo
5. **Normalizar Separadores** → Componente único

## 📝 Notas Técnicas

### Compilación

- ✅ Build exitoso con `npm run build`
- ✅ Linting pasado
- ✅ TypeScript validation OK
- ✅ 38 páginas generadas correctamente

### Archivos Modificados

```
src/
├── shared/
│   ├── lib/
│   │   └── layout-tokens.ts (nuevo)
│   └── components/
│       └── PageLayout.tsx (nuevo)
├── app/
│   ├── index.css (extendido)
│   ├── escuelas/page.tsx (refactorizado)
│   ├── contacto/page.tsx (refactorizado)
│   ├── documentacion/page.tsx (refactorizado)
│   ├── terminos/page.tsx (refactorizado)
│   ├── accesibilidad/page.tsx (refactorizado)
│   ├── noticias/page.tsx (refactorizado)
│   └── institucional/page.tsx (refactorizado)
└── tailwind.config.js (extendido)
```

### Clases CSS Agregadas

- Sistema de containers: `.page-container`, `.content-container`, `.wide-container`, `.form-container`
- Sistema de espaciado: `.section-spacing`, `.section-spacing-large`, `.section-separator`, `.element-spacing`
- Sistema de backgrounds: `.page-bg-default`, `.page-bg-transparent`, `.page-bg-gradient`

---

**✅ Fase 1 Completada con Éxito**

El sistema de design tokens está implementado y funcionando. Las páginas migradas ahora tienen una arquitectura coherente y mantenible, cumpliendo con los objetivos de estandarización del análisis arquitectural inicial.

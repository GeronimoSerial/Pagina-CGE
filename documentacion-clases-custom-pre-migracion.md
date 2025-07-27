# Documentación de Clases Custom Pre-Migración Tailwind v4

> **Fecha**: 27 de julio de 2025  
> **Branch**: upgrade/tailwind-v4  
> **Propósito**: Registro completo de todas las clases personalizadas antes de migrar a Tailwind CSS v4

## 📋 Clases Custom Identificadas en src/app/index.css

### 🏗️ Container System
```css
/* Sistema de contenedores para diferentes tipos de layout */

.page-container {
  @apply container mx-auto px-4 md:px-6 max-w-page-content;
  /* Equivale a: max-w-6xl (1152px) */
}

.content-container {
  @apply mx-auto px-6 md:px-8 max-w-article-content;
  /* Equivale a: max-w-4xl (896px) - para artículos */
}

.wide-container {
  @apply container mx-auto px-4 md:px-6 max-w-wide-content;
  /* Equivale a: max-w-7xl (1280px) - páginas amplias */
}

.form-container {
  @apply container mx-auto px-4 md:px-6 max-w-form-content;
  /* Equivale a: max-w-2xl (672px) - formularios */
}
```

### 📏 Spacing System
```css
/* Sistema de espaciado consistente */

.section-spacing {
  @apply py-section-sm md:py-section-md;
  /* Equivale a: py-8 md:py-12 (32px/48px) */
}

.section-spacing-large {
  @apply py-section-lg;
  /* Equivale a: py-16 (64px) */
}

.section-separator {
  @apply my-separator;
  /* Equivale a: my-8 (32px) */
}

.element-spacing {
  @apply mb-element-sm md:mb-element-md;
  /* Equivale a: mb-6 md:mb-8 (24px/32px) */
}
```

### 🎨 Background System
```css
/* Sistema de fondos para diferentes tipos de página */

.page-bg-default {
  @apply bg-gray-50 min-h-screen;
  /* Fondo estándar con altura mínima */
}

.page-bg-transparent {
  @apply min-h-screen;
  /* Solo altura mínima, sin fondo específico */
}

.page-bg-gradient {
  @apply bg-gradient-to-b from-white via-gray-50 to-white min-h-screen;
  /* Gradiente sutil para páginas especiales */
}

.page-bg-white {
  @apply bg-white min-h-screen;
  /* Fondo blanco puro para artículos */
}
```

## 🎯 Design Tokens Customizados

### Variables CSS Raíz
```css
:root {
  /* Shadcn/UI Variables (compatible) */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;

  /* CGE Variables Personalizadas */
  --institutional-green: 115 44% 38%;
  --institutional-green-foreground: 115 44% 38%;
  
  /* Layout System Variables */
  --page-padding-x: 1rem;      /* px-4 base */
  --page-padding-x-md: 1.5rem; /* md:px-6 */
  --page-padding-x-lg: 2rem;   /* lg:px-8 */
  --page-padding-y: 2rem;      /* py-8 base */
  --page-padding-y-md: 3rem;   /* md:py-12 */
  --page-padding-y-lg: 4rem;   /* py-16 especial */
}
```

### Tema Oscuro
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... resto de variables dark mode */
}
```

## 🔧 Utilidades Custom

### Scrollbar Utilities
```css
@layer utilities {
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
}
```

### Estilos Base Globales
```css
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    background-color: #f7faf9; /* Override específico */
  }
  
  h1, h2, h3, h4 {
    font-family: var(--font-lora);
  }
}
```

### Comportamiento de Scroll
```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
  font-size: 90%;
}
```

### Optimizaciones Mobile
```css
/* Skeleton loading optimization */
.group:has(img[src]):not(:has(img[src=''])) .skeleton {
  display: none;
}

/* Desactivar animaciones en móvil */
@media (max-width: 768px) {
  .group:hover img.transition-transform,
  .group:hover img.scale-105,
  .group:active img.scale-105 {
    transform: none !important;
    transition: none !important;
  }
  
  .group img {
    transition: none !important;
  }
}

/* Animaciones solo en desktop con preferencias adecuadas */
@media (prefers-reduced-motion: no-preference) and (min-width: 769px) {
  .group:hover img {
    transform: scale(1.05);
    transition: transform 700ms;
  }
}
```

## 📊 Estadísticas de Uso

### Clases @apply Identificadas
- **Total de clases custom**: 12
- **Uso de @apply**: 12 clases (100%)
- **Variables CSS custom**: 16
- **Media queries custom**: 2
- **Utilidades custom**: 1 (.hide-scrollbar)

### Dependencias de Tailwind Config
```javascript
// Tokens custom definidos en tailwind.config.js
spacing: {
  'section-sm': '2rem',    // 32px - py-8
  'section-md': '3rem',    // 48px - py-12
  'section-lg': '4rem',    // 64px - py-16
  'element-sm': '1.5rem',  // 24px - mb-6
  'element-md': '2rem',    // 32px - mb-8
  'separator': '2rem',     // 32px - my-8
},

maxWidth: {
  'page-content': '72rem',    // 1152px - max-w-6xl
  'article-content': '56rem', // 896px - max-w-4xl
  'wide-content': '80rem',    // 1280px - max-w-7xl
  'form-content': '42rem',    // 672px - max-w-2xl
  'institutional': '96rem',   // 1536px - max-w-9xl
}
```

## 🚨 Impacto de Migración

### Crítico (Requiere Reescritura Completa)
- ✅ **Todas las clases @layer components**: 12 clases
- ✅ **Sistema de containers**: 4 clases principales
- ✅ **Sistema de spacing**: 4 clases de espaciado
- ✅ **Sistema de backgrounds**: 4 clases de fondo

### Compatible (Migración Automática)
- ✅ **Variables CSS shadcn/ui**: Compatible con v4
- ✅ **Variables custom**: Compatible con v4
- ✅ **Utilidades @layer utilities**: Compatible con v4

### Requiere Atención Manual
- ⚠️ **Estilos @layer base**: Verificar compatibilidad
- ⚠️ **Media queries custom**: Verificar comportamiento
- ⚠️ **Override de body background**: Verificar precedencia

## 🎯 Plan de Conversión v4

### Estrategia de Migración
1. **Convertir @layer components a @utility**
2. **Mantener variables CSS existentes**
3. **Verificar comportamiento de media queries**
4. **Testear override de estilos base**

### Prioridad de Migración
1. **Alta**: Container system y spacing system
2. **Media**: Background system
3. **Baja**: Optimizaciones mobile y scroll

---

**Nota**: Este documento sirve como referencia durante la migración. Cualquier cambio debe ser documentado en el proceso de conversión a Tailwind CSS v4.

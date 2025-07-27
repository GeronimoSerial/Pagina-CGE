# Análisis de Tamaños de Fuente - Proyecto CGE

**Fecha de análisis:** 27 de julio de 2025  
**Proyecto:** Portal Web Consejo General de Educación  
**Framework:** Next.js con App Router + Tailwind CSS

---

## Resumen Ejecutivo

Este documento presenta un análisis detallado de todos los tamaños de fuente utilizados en las páginas principales del proyecto CGE. El proyecto utiliza principalmente **Tailwind CSS** para el estilado, con fuentes **Inter** (corpo) y **Lora** (encabezados), y una configuración base de `font-size: 90%` en el HTML.

---

## Configuración Global de Fuentes

### Fuentes Configuradas

- **Fuente principal (body):** Inter (`font-family: Inter, sans-serif`)
- **Fuente de encabezados:** Lora (`font-family: var(--font-lora)`)
- **Tamaño base HTML:** `font-size: 90%` (reducido del 100% estándar)

### Configuración Tailwind

- Utiliza configuración estándar de Tailwind CSS sin modificaciones en la escala de fuentes
- Plugin de tipografía (`@tailwindcss/typography`) habilitado para contenido en prose

---

## Análisis por Página

### 1. Página Principal (`/src/app/page.tsx`)

**Componentes principales:**

- `HeroMain`
- `QuickAccess`
- `LatestNewsStatic`
- `SocialMediaSection`

**Tamaños de fuente identificados:**

#### HeroMain Component

- **Título principal:** `text-3xl md:text-4xl lg:text-5xl`
  - Mobile: 1.875rem (30px)
  - Tablet: 2.25rem (36px)
  - Desktop: 3rem (48px)
- **Subtítulo:** `text-lg md:text-xl`
  - Mobile: 1.125rem (18px)
  - Tablet+: 1.25rem (20px)
- **Botón:** `text-base` → 1rem (16px)

#### QuickAccess Component

- **Título sección:** `text-3xl sm:text-3xl md:text-4xl lg:text-5xl`
  - Mobile: 1.875rem (30px)
  - Small: 1.875rem (30px)
  - Medium: 2.25rem (36px)
  - Large: 3rem (48px)
- **Títulos de tarjetas:** `text-lg` → 1.125rem (18px)
- **Descripciones:** `text-sm` → 0.875rem (14px)

#### LatestNewsStatic Component

- **Título sección:** `text-2xl sm:text-4xl`
  - Mobile: 1.5rem (24px)
  - Small+: 2.25rem (36px)
- **Subtítulo:** `text-xl sm:text-2xl`
  - Mobile: 1.25rem (20px)
  - Small+: 1.5rem (24px)
- **Párrafo descriptivo:** `text-base` → 1rem (16px)
- **Títulos de noticias:** `text-lg` → 1.125rem (18px)
- **Metadatos noticias:** `text-xs` → 0.75rem (12px)
- **Resúmenes:** `text-sm` → 0.875rem (14px)

---

### 2. Página de Noticias (`/src/app/noticias/page.tsx`)

**Componentes principales:**

- `HeroSection`
- `NewsContainer`

**Tamaños de fuente identificados:**

#### HeroSection Component

- **Título:** `text-2xl md:text-4xl`
  - Mobile: 1.5rem (24px)
  - Medium+: 2.25rem (36px)
- **Descripción:** `text-md md:text-lg`
  - Mobile: 1rem (16px)
  - Medium+: 1.125rem (18px)

#### NewsContainer (heredado de RegularNewsCard)

- **Títulos de noticias:** `text-lg` → 1.125rem (18px)
- **Metadatos (fecha/categoría):** `text-xs` → 0.75rem (12px)
- **Resúmenes:** `text-sm` → 0.875rem (14px)
- **Enlaces "Leer más":** `text-sm` → 0.875rem (14px)

---

### 3. Página de Trámites (`/src/app/tramites/page.tsx`)

**Componentes principales:**

- Contenido directo con ReactMarkdown
- `MarkdownComponent`

**Tamaños de fuente identificados:**

- **Categoría badge:** `text-xs` → 0.75rem (12px)
- **Metadatos fecha:** `text-sm` → 0.875rem (14px)
- **Título principal:** `text-4xl` → 2.25rem (36px)
- **Descripción:** `text-xl` → 1.25rem (20px)
- **Contenido artículo:** `prose prose-lg` (Tailwind Typography)
  - Párrafos: 1.125rem (18px)
  - H1: 2.25rem (36px)
  - H2: 1.875rem (30px)
  - H3: 1.5rem (24px)
- **Footer enlaces:** `text-sm` → 0.875rem (14px)

---

### 4. Página de Escuelas (`/src/app/escuelas/page.tsx`)

**Componentes principales:**

- `HeroSection`
- `EscuelasClient`
- `FAQSection`

**Tamaños de fuente identificados:**

#### HeroSection (igual que en noticias)

- **Título:** `text-2xl md:text-4xl`
- **Descripción:** `text-md md:text-lg`

#### FAQSection Component

- **Título sección:** `text-3xl sm:text-3xl md:text-4xl lg:text-5xl`
- **Descripción:** `text-md md:text-lg` → 1rem/1.125rem
- **Preguntas FAQ:** `text-base` → 1rem (16px)
- **Respuestas FAQ:** `text-sm` → 0.875rem (14px)
- **Enlaces FAQ:** `text-sm` → 0.875rem (14px)

---

### 5. Página Institucional (`/src/app/institucional/page.tsx`)

**Componentes principales:**

- `HeroSection`
- Contenido institucional directo
- `ClientCarousel`

**Tamaños de fuente identificados:**

#### Contenido principal

- **Títulos de sección:** `text-2xl md:text-3xl`
  - Mobile: 1.5rem (24px)
  - Medium+: 1.875rem (30px)
- **Párrafos históricos:** `text-base md:text-lg`
  - Mobile: 1rem (16px)
  - Medium+: 1.125rem (18px)
- **Títulos de funciones:** `text-lg` → 1.125rem (18px)
- **Texto de funciones:** `text-base` → 1rem (16px)

#### Sidebar de contacto

- **Título "Presidente":** `text-lg` → 1.125rem (18px)
- **Nombre:** texto normal (1rem)
- **Información de contacto:** texto normal (1rem)

---

### 6. Página de Contacto (`/src/app/contacto/page.tsx`)

**Componentes principales:**

- `HeroSection`
- `ContactForm`
- `FAQSection`
- `SocialMediaSection`

**Tamaños de fuente identificados:**

#### ContactForm Component

- **Labels de formulario:** `text-sm` → 0.875rem (14px)
- **Títulos de alertas:** estándar (1rem)
- **Descripciones de alertas:** estándar (1rem)
- **Placeholders input:** estándar (1rem)

---

### 7. Página de Documentación (`/src/app/documentacion/page.tsx`)

**Componentes principales:**

- `HeroSection`
- `InfoBar`
- `DocumentacionSection`
- `FAQSection`

**Tamaños de fuente identificados:**

- Utiliza los mismos patrones que otras páginas
- `HeroSection`: igual configuración que otras páginas
- `FAQSection`: igual configuración que otras páginas

---

### 8. Página de Chatbot (`/src/app/chatbot/page.tsx`)

**Componentes principales:**

- `HeroSection`
- Contenido informativo personalizado

**Tamaños de fuente identificados:**

#### Contenido específico de chatbot

- **Títulos de sección:** `text-2xl` → 1.5rem (24px)
- **Subtítulos:** `text-xl` → 1.25rem (20px)
- **Párrafos descriptivos:** estándar (1rem)
- **Texto de ejemplos:** estándar (1rem)
- **Texto de advertencias:** estándar (1rem)

---

### 9. Páginas Dinámicas

#### Noticias individuales (`/src/app/noticias/[slug]/page.tsx`)

- **Título de noticia:** tamaños variables según contenido
- **Metadatos:** `text-sm` → 0.875rem (14px)
- **Contenido:** utiliza `ReactMarkdown` con `MarkdownComponent`

#### Trámites individuales (`/src/app/tramites/[slug]/page.tsx`)

- **Títulos:** `text-4xl` → 2.25rem (36px)
- **Descripciones:** `text-xl` → 1.25rem (20px)
- **Contenido:** `prose prose-lg` (Tailwind Typography)

---

## Escalas de Fuente Utilizadas

### Escala Tailwind Estándar (con font-size: 90% base)

| Clase Tailwind | Tamaño Real | Píxeles Equivalentes | Uso Principal          |
| -------------- | ----------- | -------------------- | ---------------------- |
| `text-xs`      | 0.675rem    | ~10.8px              | Metadatos, badges      |
| `text-sm`      | 0.788rem    | ~12.6px              | Descripciones, labels  |
| `text-base`    | 0.9rem      | ~14.4px              | Texto principal        |
| `text-lg`      | 1.013rem    | ~16.2px              | Títulos menores        |
| `text-xl`      | 1.125rem    | ~18px                | Subtítulos             |
| `text-2xl`     | 1.35rem     | ~21.6px              | Títulos sección mobile |
| `text-3xl`     | 1.688rem    | ~27px                | Títulos sección        |
| `text-4xl`     | 2.025rem    | ~32.4px              | Títulos principales    |
| `text-5xl`     | 2.7rem      | ~43.2px              | Hero titles desktop    |

### Prose Typography (prose-lg)

| Elemento | Tamaño   | Uso                              |
| -------- | -------- | -------------------------------- |
| Párrafos | 1.125rem | Contenido de artículos           |
| H1       | 2.25rem  | Títulos principales de artículos |
| H2       | 1.875rem | Subtítulos de sección            |
| H3       | 1.5rem   | Subtítulos menores               |

---

## Patrones Identificados

### 1. Títulos Principales de Página

**Patrón común:** `text-2xl md:text-4xl`

- Usado en: HeroSection de todas las páginas
- Mobile: 21.6px, Desktop: 32.4px

### 2. Títulos de Sección

**Patrón común:** `text-3xl sm:text-3xl md:text-4xl lg:text-5xl`

- Usado en: QuickAccess, FAQSection
- Responsive: 27px → 27px → 32.4px → 43.2px

### 3. Metadatos y Información Secundaria

**Patrón común:** `text-xs` y `text-sm`

- Fechas, categorías, labels: 10.8px - 12.6px

### 4. Contenido Principal

**Patrón común:** `text-base` y `text-lg`

- Párrafos: 14.4px
- Descripciones importantes: 16.2px

---

## Recomendaciones para Estandarización

### 1. Establecer Sistema de Tokens

```typescript
// Sugerencia de tokens consistentes
const fontSizes = {
  // Metadatos y auxiliares
  caption: 'text-xs', // 10.8px
  small: 'text-sm', // 12.6px

  // Contenido principal
  body: 'text-base', // 14.4px
  bodyLarge: 'text-lg', // 16.2px

  // Títulos
  h6: 'text-lg', // 16.2px
  h5: 'text-xl', // 18px
  h4: 'text-2xl', // 21.6px
  h3: 'text-3xl', // 27px
  h2: 'text-4xl', // 32.4px
  h1: 'text-5xl', // 43.2px
};
```

### 2. Patrones Responsive Consistentes

- **Hero Titles:** `text-3xl md:text-4xl lg:text-5xl`
- **Section Titles:** `text-2xl md:text-3xl`
- **Card Titles:** `text-lg`
- **Body Text:** `text-base md:text-lg`

### 3. Áreas de Mejora

1. **Inconsistencias menores** en algunos componentes que usan tamaños fijos
2. **Consolidar patrones** de títulos de sección
3. **Documentar claramente** cuándo usar prose vs. clases utility

### 4. Componentes para Estandarizar

- Crear componentes Typography (`<H1>`, `<H2>`, `<Body>`, etc.)
- Establecer props para variantes responsive
- Implementar design tokens consistentes

---

## Conclusiones

El proyecto muestra un uso **consistente y bien estructurado** de los tamaños de fuente, utilizando principalmente las utilidades de Tailwind CSS. La configuración de `font-size: 90%` en el HTML reduce proporcionalmente todos los tamaños, manteniendo las relaciones tipográficas.

Los patrones responsive están bien implementados, priorizando la legibilidad en dispositivos móviles y escalando apropiadamente para pantallas más grandes. Se recomienda continuar con este enfoque y formalizar los patrones existentes en un sistema de design tokens.

---

## Plan de Acción: Estandarización del Sistema Tipográfico

### **Fase 1: Creación del Sistema de Design Tokens** 📐

_Duración estimada: 2-3 días_

#### 1.1 Crear archivo de tokens tipográficos

- Crear `src/shared/design-tokens/typography.ts`
- Definir escala de fuentes consistente basada en el análisis
- Establecer patrones responsive estandarizados
- Documentar casos de uso para cada token

#### 1.2 Actualizar configuración de Tailwind

- Extender `tailwind.config.js` con tokens personalizados
- Crear utilidades CSS personalizadas si es necesario
- Mantener compatibilidad con el sistema actual

#### 1.3 Crear componentes Typography base

- `<Heading>` con variantes h1-h6
- `<Text>` con variantes body, small, caption
- Props para responsive behavior
- Integración con design tokens

### **Fase 2: Refactorización de Componentes Principales** 🔧

_Duración estimada: 3-4 días_

#### 2.1 Componentes Hero y Headers

- Estandarizar `HeroSection` para usar tokens consistentes
- Unificar patrones `text-2xl md:text-4xl` → componente reutilizable
- Actualizar todos los headers de página

#### 2.2 Componentes de Contenido

- Migrar `QuickAccess` al nuevo sistema
- Actualizar `LatestNewsStatic` y `NewsContainer`
- Estandarizar `FAQSection` typography

#### 2.3 Componentes de UI Específicos

- Actualizar formularios (`ContactForm`)
- Estandarizar cards y metadatos
- Migrar prose typography a tokens consistentes

### **Fase 3: Optimización de Markdown y Contenido Dinámico** 📝

_Duración estimada: 2 días_

#### 3.1 Mejorar MarkdownComponent

- Crear configuración prose personalizada
- Integrar con design tokens
- Mantener compatibilidad con contenido existente

#### 3.2 Páginas dinámicas

- Estandarizar `[slug]` pages de noticias y trámites
- Unificar metadatos y contenido typography
- Optimizar responsive behavior

### **Fase 4: Testing y Validación** ✅

_Duración estimada: 1-2 días_

#### 4.1 Auditoría visual

- Verificar consistencia en todas las páginas
- Testing responsive en diferentes dispositivos
- Validar accesibilidad tipográfica

#### 4.2 Performance testing

- Verificar que no se afecte el rendimiento
- Optimizar bundle size si es necesario
- Testing de cache con nuevos componentes

### **Fase 5: Documentación y Guidelines** 📚

_Duración estimada: 1 día_

#### 5.1 Crear guía de uso

- Documentar cuándo usar cada componente
- Ejemplos de uso correcto e incorrecto
- Guidelines para futuros desarrollos

#### 5.2 Actualizar README técnico

- Incluir nueva arquitectura tipográfica
- Documentar patrones establecidos
- Guía de migración para nuevos componentes

---

## **Implementación Específica**

### **Estructura de Archivos Propuesta:**

```
src/shared/
├── design-tokens/
│   ├── typography.ts          # Tokens de fuentes
│   ├── spacing.ts            # Relacionado con typography
│   └── index.ts              # Export centralizado
├── components/
│   ├── typography/
│   │   ├── Heading.tsx       # Componente base para h1-h6
│   │   ├── Text.tsx          # Componente base para párrafos
│   │   └── index.ts          # Exports
│   └── ui/                   # Componentes existentes
└── lib/
    └── typography-utils.ts    # Utilidades helper
```

### **Design Tokens Basados en el Análisis:**

```typescript
// src/shared/design-tokens/typography.ts
export const typography = {
  // Metadatos y auxiliares
  caption: 'text-xs', // 10.8px - badges, metadatos
  small: 'text-sm', // 12.6px - descripciones, labels

  // Contenido principal
  body: 'text-base', // 14.4px - texto principal
  bodyLarge: 'text-lg', // 16.2px - descripciones importantes

  // Títulos
  h6: 'text-lg', // 16.2px - títulos menores
  h5: 'text-xl', // 18px - subtítulos
  h4: 'text-2xl', // 21.6px - títulos sección mobile
  h3: 'text-3xl', // 27px - títulos sección
  h2: 'text-4xl', // 32.4px - títulos principales
  h1: 'text-5xl', // 43.2px - hero titles desktop

  // Patrones responsive identificados
  responsive: {
    heroTitle: 'text-3xl md:text-4xl lg:text-5xl',
    pageTitle: 'text-2xl md:text-4xl',
    sectionTitle: 'text-3xl sm:text-3xl md:text-4xl lg:text-5xl',
    cardTitle: 'text-lg',
    bodyText: 'text-base md:text-lg',
  },
};
```

### **Componentes Prioritarios a Migrar:**

1. **Alto impacto:** HeroSection, QuickAccess, LatestNewsStatic
2. **Medio impacto:** FAQSection, NewsContainer, ContactForm
3. **Bajo impacto:** Componentes específicos y páginas estáticas

### **Cronograma Sugerido:**

```
Semana 1:
├── Días 1-2: Fase 1 (Design tokens y componentes base)
├── Días 3-4: Fase 2.1 (Heroes y headers)
└── Día 5: Fase 2.2 (Contenido principal)

Semana 2:
├── Días 1-2: Fase 2.3 + Fase 3 (UI específicos + Markdown)
├── Días 3-4: Fase 4 (Testing y validación)
└── Día 5: Fase 5 (Documentación)
```

### **Criterios de Éxito:**

- ✅ Reducción de inconsistencias tipográficas a 0
- ✅ Todos los componentes usando design tokens
- ✅ Performance mantenido o mejorado
- ✅ 100% responsive compatibility
- ✅ Documentación completa para el equipo

### **Beneficios Esperados:**

1. **Consistencia visual:** Eliminación de las inconsistencias menores identificadas
2. **Mantenibilidad:** Cambios tipográficos centralizados en tokens
3. **Performance:** Reducción de CSS redundante
4. **Escalabilidad:** Base sólida para futuros desarrollos
5. **Accesibilidad:** Mejores prácticas tipográficas aplicadas consistentemente

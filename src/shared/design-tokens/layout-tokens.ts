export type ContainerType =
  | 'standard'
  | 'content'
  | 'wide'
  | 'form'
  | 'institutional';
export type BackgroundType = 'default' | 'transparent' | 'gradient' | 'white';
export type SpacingType = 'normal' | 'large';

export const CONTAINER_CLASSES: Record<ContainerType, string> = {
  standard: 'page-container', // max-w-6xl para páginas estándar
  content: 'content-container', // max-w-4xl para artículos/contenido
  wide: 'wide-container', // max-w-7xl para páginas amplias
  form: 'form-container', // max-w-2xl para formularios
  institutional: 'container mx-auto px-4 md:px-6 max-w-institutional', // max-w-9xl solo institucional
};

export const BACKGROUND_CLASSES: Record<BackgroundType, string> = {
  default: 'page-bg-default', // bg-gray-50 min-h-screen
  transparent: 'page-bg-transparent', // min-h-screen
  gradient: 'page-bg-gradient', // gradiente complejo
  white: 'page-bg-white', // bg-white min-h-screen para artículos
};

export const SPACING_CLASSES = {
  section: {
    normal: 'section-spacing', // py-8 md:py-12
    large: 'section-spacing-large', // py-16
  },
  separator: 'section-separator', // my-8
  element: 'element-spacing', // mb-6 md:mb-8
};

// Helper Functions
export function getContainerClass(type: ContainerType): string {
  return CONTAINER_CLASSES[type];
}

export function getBackgroundClass(type: BackgroundType): string {
  return BACKGROUND_CLASSES[type];
}

export function getSectionSpacing(type: SpacingType = 'normal'): string {
  return SPACING_CLASSES.section[type];
}

export function getLayoutClasses({
  container = 'standard',
  background = 'default',
  spacing = 'normal',
}: {
  container?: ContainerType;
  background?: BackgroundType;
  spacing?: SpacingType;
} = {}) {
  return {
    container: getContainerClass(container),
    background: getBackgroundClass(background),
    section: getSectionSpacing(spacing),
    separator: SPACING_CLASSES.separator,
    element: SPACING_CLASSES.element,
  };
}

export const PAGE_LAYOUTS = {
  homepage: {
    container: 'standard' as ContainerType,
    background: 'transparent' as BackgroundType,
    spacing: 'normal' as SpacingType,
  },
  content: {
    container: 'standard' as ContainerType,
    background: 'default' as BackgroundType,
    spacing: 'normal' as SpacingType,
  },
  article: {
    container: 'content' as ContainerType,
    background: 'default' as BackgroundType,
    spacing: 'normal' as SpacingType,
  },
  wide: {
    container: 'wide' as ContainerType,
    background: 'default' as BackgroundType,
    spacing: 'normal' as SpacingType,
  },
  institutional: {
    container: 'institutional' as ContainerType,
    background: 'gradient' as BackgroundType,
    spacing: 'large' as SpacingType,
  },
  form: {
    container: 'form' as ContainerType,
    background: 'default' as BackgroundType,
    spacing: 'normal' as SpacingType,
  },
} as const;

export function getPageLayout(pageType: keyof typeof PAGE_LAYOUTS) {
  const config = PAGE_LAYOUTS[pageType];
  return getLayoutClasses(config);
}

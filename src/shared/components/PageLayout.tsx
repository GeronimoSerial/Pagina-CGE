import React from 'react';
import { Separator } from '@/shared/ui/separator';
import FAQSection from '@/shared/components/FAQSection';
import HeroSection from '@/shared/components/Hero';
import {
  ContainerType,
  BackgroundType,
  SpacingType,
  getLayoutClasses,
  getPageLayout,
} from '@/shared/lib/layout-tokens';
import { cn } from '@/shared/lib/utils';

interface HeroProps {
  title: string;
  description: string;
}

interface PageLayoutProps {
  children: React.ReactNode;

  // Layout configuration
  containerType?: ContainerType;
  background?: BackgroundType;
  spacing?: SpacingType;

  // Quick presets
  pageType?:
    | 'homepage'
    | 'content'
    | 'article'
    | 'wide'
    | 'institutional'
    | 'form';

  // Hero section
  hero?: HeroProps;

  // FAQ section
  showFAQ?: boolean;
  faqBasePath?: string;

  // Additional sections
  showSeparator?: boolean;
  separatorClass?: string;

  // Custom classes
  className?: string;
  sectionClassName?: string;
}

export function PageLayout({
  children,
  containerType,
  background,
  spacing,
  pageType,
  hero,
  showFAQ = false,
  faqBasePath,
  showSeparator = true,
  separatorClass,
  className,
  sectionClassName,
}: PageLayoutProps) {
  // Usar preset de página si está definido, sino usar configuración manual
  const layout = pageType
    ? getPageLayout(pageType)
    : getLayoutClasses({ container: containerType, background, spacing });

  return (
    <main className={cn(layout.background, className)}>
      {hero && (
        <HeroSection title={hero.title} description={hero.description} />
      )}

      <section className={cn(layout.section, sectionClassName)}>
        <div className={layout.container}>{children}</div>
      </section>

      {showFAQ && faqBasePath && <FAQSection basePath={faqBasePath} />}

      {showSeparator && (
        <Separator
          className={cn(layout.separator, 'bg-gray-50', separatorClass)}
        />
      )}
    </main>
  );
}

// Componente especializado para páginas de contenido simple
export function ContentPageLayout({
  children,
  title,
  description,
  showFAQ = false,
  faqBasePath,
  className,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  showFAQ?: boolean;
  faqBasePath?: string;
  className?: string;
}) {
  return (
    <PageLayout
      pageType="content"
      hero={{ title, description }}
      showFAQ={showFAQ}
      faqBasePath={faqBasePath}
      className={className}
    >
      {children}
    </PageLayout>
  );
}

// Componente especializado para formularios
export function FormPageLayout({
  children,
  title,
  description,
  showFAQ = false,
  faqBasePath,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  showFAQ?: boolean;
  faqBasePath?: string;
}) {
  return (
    <PageLayout
      pageType="form"
      hero={{ title, description }}
      showFAQ={showFAQ}
      faqBasePath={faqBasePath}
    >
      {children}
    </PageLayout>
  );
}

// Hook para usar las clases de layout en componentes existentes
export function useLayoutClasses(
  containerType?: ContainerType,
  background?: BackgroundType,
  spacing?: SpacingType,
) {
  return getLayoutClasses({ container: containerType, background, spacing });
}

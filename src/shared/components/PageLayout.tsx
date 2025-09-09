import React from 'react';
import { Separator } from '@/shared/ui/separator';
import dynamic from 'next/dynamic';
import HeroSection from '@/shared/components/Hero';
import {
  ContainerType,
  BackgroundType,
  SpacingType,
  getLayoutClasses,
  getPageLayout,
} from '@/shared/design-tokens/layout-tokens';
import { cn } from '@/shared/lib/utils';
import InfoBar from './InfoBar';
const FAQSection = dynamic(() => import('@/shared/components/FAQSection'));

interface HeroProps {
  title: string;
  description: string;
}

interface PageLayoutProps {
  children: React.ReactNode;

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
  basePath?: string;

  // Additional sections
  showSeparator?: boolean;
  separatorClass?: string;

  // Custom classes
  className?: string;
  sectionClassName?: string;

  // Info bar
  showInfoBar?: boolean;
}

export function PageLayout({
  children,
  containerType,
  background,
  spacing,
  pageType,
  hero,
  showFAQ = false,
  showInfoBar = false,
  basePath,
  showSeparator = true,
  separatorClass,
  className,
  sectionClassName,
}: PageLayoutProps) {
  const layout = pageType
    ? getPageLayout(pageType)
    : getLayoutClasses({ container: containerType, background, spacing });
  const isNoticias = basePath === '/noticias';
  return (
    <main className={cn(layout.background, className)}>
      {hero && !isNoticias && (
        <HeroSection title={hero.title} description={hero.description} />
      )}
      {showInfoBar && !isNoticias && <InfoBar basePath={basePath} />}

      <section className={cn(layout.section, sectionClassName)}>
        <div className={layout.container}>{children}</div>
      </section>

      {showFAQ && basePath && <FAQSection basePath={basePath} />}

      {showSeparator && (
        <Separator
          className={cn(layout.separator, 'bg-gray-50', separatorClass)}
        />
      )}
    </main>
  );
}

export function ContentPageLayout({
  children,
  title,
  description,
  showFAQ = false,
  basePath,
  className,
  showInfoBar = false,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  showFAQ?: boolean;
  showInfoBar?: boolean;
  basePath?: string;
  className?: string;
}) {
  return (
    <PageLayout
      pageType="content"
      hero={{ title, description }}
      showFAQ={showFAQ}
      basePath={basePath}
      className={className}
      showInfoBar={showInfoBar}
    >
      {children}
    </PageLayout>
  );
}

export function FormPageLayout({
  children,
  title,
  description,
  showFAQ = false,
  basePath,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  showFAQ?: boolean;
  basePath?: string;
}) {
  return (
    <PageLayout
      pageType="form"
      hero={{ title, description }}
      showFAQ={showFAQ}
      basePath={basePath}
    >
      {children}
    </PageLayout>
  );
}

export function useLayoutClasses(
  containerType?: ContainerType,
  background?: BackgroundType,
  spacing?: SpacingType,
) {
  return getLayoutClasses({ container: containerType, background, spacing });
}

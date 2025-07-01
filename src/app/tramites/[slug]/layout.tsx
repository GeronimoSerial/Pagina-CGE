import React, { ReactNode } from 'react';
import {
  getTramitesNavigation,
  getTramiteArticleBySlug,
  NavSection,
  Article,
} from '@/features/tramites/services/docs-data';
import { MobileMenu } from '@/features/tramites/navigation/mobile-menu';
import { Sidebar } from '@/features/tramites/navigation/sidebar';
import ModalAvisoDesarrollo from '@/shared/components/ModalAvisoDesarrollo';

export default async function TramitesLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Renderizado server-side para navegación y artículo de introducción
  const navigationSections: NavSection[] = await getTramitesNavigation();
  const article = await getTramiteArticleBySlug('introduccion');

  return (
    <>
      <MobileMenu
        sections={navigationSections}
        currentPageTitle={article?.category || ''}
      />

      {/* Main Grid Layout */}
      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-0 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden overflow-y-auto sticky top-0 h-screen bg-white border-r border-gray-200 lg:block">
          <Sidebar sections={navigationSections} />
        </aside>
        {/* Renderiza el contenido de la página */}
        <div>{children}</div>
      </div>
    </>
  );
}

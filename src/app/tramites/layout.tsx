import React, { ReactNode } from 'react';
import {
  getTramitesNavigation,
  NavSection,
} from '@/features/tramites/services/docs-data';
import { ResponsiveNav } from '@/features/tramites/navigation/responsive-nav';

// ISR: Revalidar cada 7 días - La navegación de trámites es muy estable
export const revalidate = 604800;

export default async function TramitesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const navigationSections: NavSection[] = await getTramitesNavigation();

  return (
    <>
      {/* Main Layout - Grid en desktop, block en móvil/tablet */}
      <div className="block lg:grid lg:grid-cols-[300px_1fr] lg:gap-0 min-h-screen">
        {/* Responsive Navigation - contiene tanto MobileMenu como Sidebar con visibilidad controlada por breakpoints */}
        <ResponsiveNav sections={navigationSections} />
        {/* Contenido de la página - pt-20 para móviles para compensar el header fijo */}
        <div className="w-full   lg:pt-0">{children}</div>
      </div>
    </>
  );
}

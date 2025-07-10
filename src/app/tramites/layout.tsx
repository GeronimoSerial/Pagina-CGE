import React, { ReactNode } from 'react';
import {
  getTramitesNavigation,
  NavSection,
} from '@/features/tramites/services/docs-data';
import { ResponsiveNav } from '@/features/tramites/navigation/responsive-nav';

export default async function TramitesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const navigationSections: NavSection[] = await getTramitesNavigation();

  return (
    <>
      {/* Main Grid Layout */}
      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-0 min-h-screen">
        {/* Responsive Navigation */}
        <ResponsiveNav sections={navigationSections} />
        {/* Renderiza el contenido de la página */}
        <div>{children}</div>
      </div>
    </>
  );
}

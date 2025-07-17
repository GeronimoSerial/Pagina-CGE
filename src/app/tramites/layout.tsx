import React, { ReactNode, Suspense } from 'react';
import { ResponsiveNav } from '@/features/tramites/navigation/responsive-nav';

// ISR: Revalidar cada 7 días - La navegación de trámites es muy estable
export const revalidate = 604800;

// Componente de navegación que se carga de forma diferida
async function NavigationLoader() {
  const { getTramitesNavigation } = await import(
    '@/features/tramites/services/docs-data'
  );
  const { withCache, tramitesCache } = await import(
    '@/shared/lib/aggressive-cache'
  );

  try {
    const navigationSections = await withCache(
      tramitesCache,
      'tramites-navigation',
      getTramitesNavigation,
    );

    return <ResponsiveNav sections={navigationSections} />;
  } catch (error) {
    console.error('Error loading navigation:', error);
    return <ResponsiveNav sections={[]} />;
  }
}

export default function TramitesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Main Layout - Grid en desktop, block en móvil/tablet */}
      <div className="block lg:grid lg:grid-cols-[300px_1fr] lg:gap-0 min-h-screen">
        {/* Responsive Navigation - con Suspense para manejo de carga */}
        <Suspense fallback={<div className="w-[300px] h-screen bg-gray-50" />}>
          <NavigationLoader />
        </Suspense>
        {/* Contenido de la página -  */}
        <div className="w-full lg:pt-0">{children}</div>
      </div>
    </>
  );
}

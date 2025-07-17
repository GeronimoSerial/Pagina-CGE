import React, { ReactNode, Suspense } from 'react';
import { ResponsiveNav } from '@/features/tramites/navigation/responsive-nav';

// ISR ultra-optimizado: Navegación de trámites es ultra-estática
export const revalidate = 86400; //

// Componente de navegación que se carga de forma diferida
async function NavigationLoader() {
  const { getTramitesNavigation } = await import(
    '@/features/tramites/services/docs-data'
  );
  try {
    const navigationSections = await getTramitesNavigation();
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

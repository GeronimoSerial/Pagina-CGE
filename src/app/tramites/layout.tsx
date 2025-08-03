import React, { ReactNode, Suspense } from 'react';
import { ResponsiveNav } from '@/features/tramites/navigation/responsive-nav';

export const revalidate = 2592000; // 30 días

async function NavigationLoader() {
  const { getProceduresNavigation } = await import(
    '@/features/tramites/services/docs-data'
  );

  try {
    const navigationSections = await getProceduresNavigation();

    return <ResponsiveNav sections={navigationSections} />;
  } catch (error) {
    console.error('Error loading navigation:', error);
    return <ResponsiveNav sections={[]} />;
  }
}

export default function TramitesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="block lg:grid lg:grid-cols-[300px_1fr] lg:gap-0 min-h-screen">
        <Suspense fallback={<div className="w-[300px] h-screen " />}>
          <NavigationLoader />
        </Suspense>
        <div className="w-full lg:pt-0">{children}</div>
      </div>
    </>
  );
}

'use client';

import { Sidebar } from './sidebar';
import { MobileMenu } from './mobile-menu';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import type { NavSection } from '../services/docs-data';

export function ResponsiveNav({ sections }: { sections: NavSection[] }) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <MobileMenu sections={sections} />
      ) : (
        // <aside className="hidden overflow-y-auto sticky top-0 h-screen bg-white border-r border-gray-200 lg:block">
        <Sidebar sections={sections} />
        // </aside>
      )}
    </>
  );
}

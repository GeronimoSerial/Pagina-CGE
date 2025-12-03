import '../dashboard.css';

import { AppSidebar } from '@dashboard/components/app-sidebar';
import { SiteHeader } from '@dashboard/components/site-header';
import { SidebarInset, SidebarProvider } from '@dashboard/components/sidebar';
import { getCachedSession } from '@/shared/lib/auth/session-utils';
import { redirect } from 'next/navigation';
import { SessionProvider } from '@/features/dashboard/providers/session-provider';
import { Suspense } from 'react';

// Componente interno que maneja la sesión (dinámico)
async function DashboardContent({ children }: { children: React.ReactNode }) {
  const session = await getCachedSession();
  if (!session) redirect('/login');

  return (
    <SessionProvider session={session}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}

// Componente de loading para el Suspense
function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Cargando...</div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

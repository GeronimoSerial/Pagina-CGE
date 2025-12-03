'use client';

import * as React from 'react';
import {
  IconAlertTriangle,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconReportAnalytics,
  IconSettings,
  IconUsers,
  IconUserSearch,
} from '@tabler/icons-react';

import { useRole } from '../providers/session-provider';

import { NavMain } from '@dashboard/components/nav-main';
import { NavSecondary } from '@dashboard/components/nav-secondary';
import { NavUser } from '@dashboard/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@dashboard/components/sidebar';

const baseData = {
  navMain: [
    {
      title: 'Panel',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Asistencia',
      url: '/dashboard/asistencia',
      icon: IconListDetails,
    },
    {
      title: 'Empleados',
      url: '/dashboard/empleados',
      icon: IconUserSearch,
    },
    {
      title: 'Ausentes',
      url: '/dashboard/ausentes',
      icon: IconUsers,
    },
    {
      title: 'Incompletas',
      url: '/dashboard/incompletas',
      icon: IconFileDescription,
    },
    {
      title: 'Auditoría',
      url: '/dashboard/auditoria',
      icon: IconReport,
    },
    {
      title: 'Reportes',
      url: '/dashboard/reportes',
      icon: IconReportAnalytics,
      requiredRole: ['admin', 'owner'],
    },
  ],
  navSecondary: [
    {
      title: 'Atención',
      url: '/dashboard/atencion',
      icon: IconAlertTriangle,
      requiredRole: ['admin', 'owner'],
    },
    {
      title: 'Configuración',
      url: '/dashboard/configuracion',
      icon: IconSettings,
      requiredRole: ['admin', 'owner'],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userRole = useRole();

  const filteredNavSecondary = baseData.navSecondary.filter((item) => {
    if (item.requiredRole) {
      return item.requiredRole.includes(userRole as string);
    }
    return true;
  });

  const filteredNav = baseData.navMain.filter((item) => {
    if (item.requiredRole) {
      return item.requiredRole.includes(userRole as string);
    }
    return true;
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5"
            >
              <a href="https://consejo.mec.gob.ar">
                <IconInnerShadowTop className="size-5" />
                <span className="text-sm font-semibold">CGE - Corrientes</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNav} />

        <NavSecondary items={filteredNavSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="cursor-pointer ">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

'use client';

import {
  IconAlertTriangle,
  IconDashboard,
  IconFileDescription,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconReportAnalytics,
  IconSettings,
  IconUsers,
  IconUserSearch,
  type Icon,
} from '@tabler/icons-react';
import * as React from 'react';

import { useRole } from '../../providers/session-provider';

import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './sidebar';

type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
  requiredRole?: string[];
  items?: {
    title: string;
    url: string;
    icon?: Icon;
    requiredRole?: string[];
  }[];
};

const baseData: {
  navMain: NavItem[];
  navSecondary: NavItem[];
} = {
  navMain: [
    {
      title: 'Panel',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Asistencia CGE',
      url: '#', // Placeholder URL for the group
      icon: IconListDetails,
      items: [
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

  const filteredNav = baseData.navMain
    .map((item) => {
      // If the item has sub-items, filter them
      if (item.items) {
        const filteredItems = item.items.filter((subItem) => {
          if (subItem.requiredRole) {
            return subItem.requiredRole.includes(userRole as string);
          }
          return true;
        });

        // Return the item with filtered sub-items
        return {
          ...item,
          items: filteredItems,
        };
      }

      // If no sub-items, return as is (will be filtered by the next step if it has a role itself)
      return item;
    })
    .filter((item) => {
      // Filter the top-level item itself
      if (item.requiredRole) {
        return item.requiredRole.includes(userRole as string);
      }
      // If it's a group (has items) and all items were filtered out, maybe we should hide the group?
      // For now, let's keep it if it has no role requirement, or if it has remaining items.
      // If we want to hide empty groups:
      // if (item.items && item.items.length === 0) return false;

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

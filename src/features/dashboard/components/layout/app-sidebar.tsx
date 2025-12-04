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
  IconSchool,
  IconMap,
  IconShieldCheck,
  IconUserCheck,
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
      url: '#',
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
    {
      title: 'Documentos',
      url: '/dashboard/documentos',
      icon: IconFileDescription,
    },
    {
      title: 'Escuelas',
      url: '#',
      icon: IconSchool,
      items: [
        {
          title: 'General',
          url: '/dashboard/escuelas',
          icon: IconDashboard,
        },
        {
          title: 'Buscador',
          url: '/dashboard/escuelas/buscador',
          icon: IconUserSearch,
        },
        {
          title: 'Geografía',
          url: '/dashboard/escuelas/geografia',
          icon: IconMap,
        },
        {
          title: 'Calidad de Datos',
          url: '/dashboard/escuelas/calidad',
          icon: IconShieldCheck,
        },
        {
          title: 'Sin información',
          url: '/dashboard/escuelas/sin-informacion',
          icon: IconAlertTriangle,
        },
      ],
    },
    {
      title: 'Supervisión',
      url: '#',
      icon: IconUserCheck,
      items: [
        {
          title: 'General',
          url: '/dashboard/supervision',
          icon: IconDashboard,
        },
        {
          title: 'Listado',
          url: '/dashboard/supervision/listado',
          icon: IconListDetails,
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
      if (item.items) {
        const filteredItems = item.items.filter((subItem) => {
          if (subItem.requiredRole) {
            return subItem.requiredRole.includes(userRole as string);
          }
          return true;
        });

        return {
          ...item,
          items: filteredItems,
        };
      }

      return item;
    })
    .filter((item) => {
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

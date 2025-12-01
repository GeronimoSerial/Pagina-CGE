"use client";

import * as React from "react";
import {
  IconAlertTriangle,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconReportAnalytics,
  IconSettings,
  IconUsers,
  IconUserSearch,
} from "@tabler/icons-react";

import { NavMain } from "@dashboard/components/nav-main";
import { NavSecondary } from "@dashboard/components/nav-secondary";
import { NavUser } from "@dashboard/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@dashboard/components/sidebar";

const data = {
  user: {
    name: "Geronimo",
    email: "dev@geroserial.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Panel",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Asistencia",
      url: "/dashboard/asistencia",
      icon: IconListDetails,
    },
    {
      title: "Empleados",
      url: "/dashboard/empleados",
      icon: IconUserSearch,
    },
    {
      title: "Marcaciones",
      url: "/dashboard/marcaciones",
      icon: IconChartBar,
    },
    {
      title: "Ausentes",
      url: "/dashboard/ausentes",
      icon: IconUsers,
    },
    {
      title: "Incompletas",
      url: "/dashboard/incompletas",
      icon: IconFileDescription,
    },
    {
      title: "Unificadas",
      url: "/dashboard/unificadas",
      icon: IconDatabase,
    },
    {
      title: "Auditoría",
      url: "/dashboard/auditoria",
      icon: IconReport,
    },
    {
      title: "Reportes",
      url: "/dashboard/reportes",
      icon: IconReportAnalytics,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Atención",
      url: "/dashboard/atencion",
      icon: IconAlertTriangle,
    },
    {
      title: "Configuración",
      url: "/dashboard/configuracion",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import {
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import Link from "next/link";

interface DashboardStatsCardsProps {
  totalActivos: number;
  problematicosMesActual: number;
}

export function DashboardStatsCards({
  totalActivos,
  problematicosMesActual,
}: DashboardStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className=" border-gray-200 dark:border-gray-700">
        <Link href="/dashboard/empleados">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Empleados Activos
            </CardDescription>
            <IconUsers className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
            {totalActivos}
          </CardTitle>
        </Link>
      </Card>

      <Card className=" border-gray-200 dark:border-gray-700">
        <Link href="/dashboard/atencion">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-red-600 dark:text-gray-400">
              Empleados Problemáticos
            </CardDescription>
            <IconUserCheck className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
            {problematicosMesActual}
          </CardTitle>
        </Link>
      </Card>
    </div>
  );
}

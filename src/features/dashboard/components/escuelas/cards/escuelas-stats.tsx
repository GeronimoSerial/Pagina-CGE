import {
  IconSchool,
  IconUserCheck,
  IconCategory,
  IconMapPin,
} from '@tabler/icons-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { getEstadisticasSistema } from '@dashboard/actions/escuelas-actions';

export async function EscuelasStats() {
  const stats = await getEstadisticasSistema();

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Total Escuelas
          </CardDescription>
          <IconSchool className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
          {stats.total_escuelas}
        </CardTitle>
      </Card>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Con Supervisor
          </CardDescription>
          <IconUserCheck className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
          {stats.pct_con_supervisor}%
        </CardTitle>
      </Card>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Con Modalidad
          </CardDescription>
          <IconCategory className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
          {stats.pct_con_modalidad}%
        </CardTitle>
      </Card>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Escuelas Pendientes
          </CardDescription>
          <IconMapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
          {stats.escuelas_pendientes}
        </CardTitle>
      </Card>
    </div>
  );
}

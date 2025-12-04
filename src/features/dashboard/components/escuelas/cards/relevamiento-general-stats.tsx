import { IconChefHat, IconToolsKitchen2 } from '@tabler/icons-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  getPersonalCocinaStats,
  getEscuelasComedorStats,
} from '@dashboard/actions/escuelas/escuelas-relevamiento';

export async function RelevamientoGeneralStats() {
  const [personalStats, comedorStats] = await Promise.all([
    getPersonalCocinaStats(),
    getEscuelasComedorStats(),
  ]);

  if (!personalStats || !comedorStats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Con Comedor
          </CardDescription>
          <IconToolsKitchen2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
          {comedorStats.porcentaje_con_comedor.toFixed(1)}%
        </CardTitle>
      </Card>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Escuelas que cuentan con personal especializado de cocina
          </CardDescription>
          <IconChefHat className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardTitle className="text-3xl font-bold px-6 pb-4 text-gray-900 dark:text-gray-100">
          {((personalStats.escuelas_con_especialistas * 100) / 1305).toFixed(1)}
          %
        </CardTitle>
      </Card>
    </div>
  );
}

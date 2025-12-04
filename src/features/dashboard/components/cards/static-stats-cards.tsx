import {
  IconSchool,
  IconUsers,
  IconClock,
  IconUserMinus,
  IconChalkboard,
  IconMoodKid,
} from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function StaticStatsCards() {
  const stats = [
    {
      title: 'Matrícula Total',
      value: '122.584',
      description: 'alumnos',
      icon: IconSchool,
      color: 'text-blue-600',
    },
    {
      title: 'Docentes Activos',
      value: '13.653',
      description: '77% titulares / 23% interinos',
      icon: IconUsers,
      color: 'text-green-600',
    },
    {
      title: 'Designaciones a Término',
      value: '95',
      description: 'cargos',
      icon: IconClock,
      color: 'text-orange-600',
    },
    {
      title: 'Ajustes de Planta',
      value: '34',
      description: 'desafectaciones | 5 clausuras',
      icon: IconUserMinus,
      color: 'text-red-600',
    },
    {
      title: 'Curso Más Numeroso – Primario',
      value: '5.º grado',
      description: '16.774 alumnos',
      icon: IconChalkboard,
      color: 'text-purple-600',
    },
    {
      title: 'Curso Más Numeroso – Inicial',
      value: 'Sala de 5',
      description: '11.791 alumnos',
      icon: IconMoodKid,
      color: 'text-pink-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

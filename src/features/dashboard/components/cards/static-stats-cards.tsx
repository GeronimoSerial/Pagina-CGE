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
      title: 'Matrícula total',
      value: '122.584',
      description: 'alumnos en toda la provincia',
      icon: IconSchool,
      color: 'text-green-600',
    },
    {
      title: 'Docentes activos',
      value: '13.653',
      description: '77% titulares / 23% interinos',
      icon: IconUsers,
      color: 'text-green-600',
    },
    {
      title: 'Designaciones a término',
      value: '95',
      description: 'cargos',
      icon: IconClock,
      color: 'text-orange-600',
    },
    {
      title: 'Ajustes de planta',
      value: '34',
      description: 'desafectaciones | 5 clausuras',
      icon: IconUserMinus,
      color: 'text-red-600',
    },
    {
      title: 'Curso más numeroso – Nivel primario',
      value: '5.º grado',
      description: '16.774 alumnos',
      icon: IconChalkboard,
      color: 'text-green-600',
    },
    {
      title: 'Curso más numeroso – Nivel inicial',
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

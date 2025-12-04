import { Button } from '@/shared/ui/button';
import { Download, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
  dateString: string;
}

export function DashboardHeader({
  userName = 'Usuario',
  dateString,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-pretty md:text-2xl">
          Hola, <strong className="font-bold">{userName}</strong> 👋
        </h1>
        <p className="text-sm text-muted-foreground">{dateString}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Descargar Reporte
        </Button>
        <Button variant="default" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Auditoría
        </Button>
      </div>
    </div>
  );
}

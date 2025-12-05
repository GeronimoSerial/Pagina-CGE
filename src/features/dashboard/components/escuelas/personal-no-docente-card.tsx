import { PersonalEscuela } from '@dashboard/lib/escuelas-types';
import { Users, UserCog, HardHat } from 'lucide-react';

interface PersonalNoDocenteCardProps {
  personal: PersonalEscuela | null;
}

export function PersonalNoDocenteCard({
  personal,
}: PersonalNoDocenteCardProps) {
  if (!personal) return null;

  return (
    <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="border-b bg-muted/40 px-6 py-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold leading-none tracking-tight">
          Personal No Docente
        </h3>
      </div>
      <div className="grid grid-cols-2 divide-x">
        <div className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <UserCog className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Administrativos
            </span>
          </div>
          <span className="text-3xl font-bold tabular-nums">
            {personal.administrativos}
          </span>
        </div>
        <div className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <HardHat className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Porteros
            </span>
          </div>
          <span className="text-3xl font-bold tabular-nums">
            {personal.porteros}
          </span>
        </div>
      </div>
      <div className="border-t bg-muted/10 px-6 py-3 flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Total Personal
        </span>
        <span className="text-lg font-bold">
          {personal.total_personal_no_docente}
        </span>
      </div>
    </section>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconSchool,
  IconBriefcase,
} from '@tabler/icons-react';
import { EscuelaCompleta, SupervisorDetalle } from '../../lib/escuelas-types';

interface SupervisionSectionProps {
  escuela: EscuelaCompleta;
  supervisor: SupervisorDetalle | null;
}

export function SupervisionSection({
  escuela,
  supervisor,
}: SupervisionSectionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-card rounded-xl border shadow-sm"
    >
      <AccordionItem value="supervision" className="border-none px-2">
        <AccordionTrigger className="hover:no-underline py-4 px-4">
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
              <IconBriefcase className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start text-left flex-1">
              <span className="font-semibold text-lg">Supervisión</span>
              <span className="text-sm text-muted-foreground font-normal">
                {escuela.zona || 'Zona no asignada'}
              </span>
            </div>
            <div className="mr-2">
              {escuela.tiene_supervisor ? (
                <Badge variant="default">Asignado</Badge>
              ) : (
                <Badge variant="destructive">Sin Supervisor</Badge>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-6 pt-2">
          {supervisor ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border shadow-sm bg-muted/30">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="p-3 bg-background rounded-full border shadow-sm">
                    <IconUser className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-lg leading-none">
                      {supervisor.apellido}, {supervisor.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {supervisor.cargo || 'Supervisor'}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {supervisor.escuelas_asignadas} escuelas a cargo
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4 py-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md border">
                    <IconMail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      Email de contacto
                    </p>
                    {supervisor.mail ? (
                      <a
                        href={`mailto:${supervisor.mail}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {supervisor.mail}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No disponible
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md border">
                    <IconPhone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      Teléfono
                    </p>
                    {supervisor.telefono ? (
                      <a
                        href={`tel:${supervisor.telefono}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {supervisor.telefono}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No disponible
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md border">
                    <IconMapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      Zona de Supervisión
                    </p>
                    <p className="text-sm font-medium">
                      {escuela.zona || 'Sin zona definida'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 bg-muted/20 rounded-lg border border-dashed">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full text-orange-600 dark:text-orange-400">
                <IconSchool className="h-8 w-8" />
              </div>
              <div>
                <p className="font-medium">
                  Esta escuela no tiene supervisor asignado
                </p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                  Puede asignar un supervisor desde el panel de gestión de
                  recursos humanos.
                </p>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

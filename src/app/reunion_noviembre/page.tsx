import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface TimelineItemProps {
  time: string;
  title: string;
  details?: React.ReactNode;
  badgeColor?: string;
}

// Componente para una Tarea específica en la línea de tiempo
const TimelineItem: React.FC<TimelineItemProps> = ({
  time,
  title,
  details,
  badgeColor = 'green',
}) => (
  <div className="relative flex items-start group">
    {/* Línea de tiempo vertical y punto */}
    <div className="flex flex-col items-center mr-4">
      <div
        className={`h-full w-0.5 bg-slate-200 absolute top-0 left-2.5 transform translate-y-3.5 group-last:h-0`}
      />
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-current text-green-500 bg-white z-10`}
      >
        <ClockIcon className="w-2.5 h-2.5 stroke-2" />
      </div>
    </div>

    {/* Contenido del evento */}
    <div className="flex-1 pb-8 min-w-0">
      <Badge variant="secondary" className="mb-2">
        {time}
      </Badge>
      <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-1">
        {title}
      </h3>
      {details && (
        <div className="text-sm text-slate-600 space-y-2 mt-2 ml-1">
          {details}
        </div>
      )}
    </div>
  </div>
);

export default function ReunionNoviembrePage() {
  return (
    <div className="min-h-screen bg-slate-50 antialiased py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Elegante */}
        <header className="text-center mb-16 pt-8">
          <Badge
            variant="default"
            className="mb-3 text-lg tracking-wide uppercase"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Noviembre
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
            Agenda Institucional
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">
            Detalle de actividades y reuniones programadas para la semana.
          </p>
          <div className="mt-6 inline-flex items-center text-slate-600 font-medium bg-slate-100/50 px-4 py-2 rounded-lg border border-slate-200">
            <ClockIcon className="w-4 h-4 mr-2 text-slate-500" />
            <span className="text-sm">
              Horario General: <strong>08:30 a 12:00</strong>
            </span>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Martes - 25/11
              </h2>
            </CardHeader>
            <CardContent className="pt-8">
              <TimelineItem
                time="08:30 – 10:30"
                title="Tratamiento de Expedientes"
                details={<p>Revisión y despacho de la mesa de entradas.</p>}
                badgeColor="green"
              />
              <TimelineItem
                time="10:30 – 12:00"
                title="Reunión con Sanidad"
                details={
                  <p>Coordinación de protocolos y recursos sanitarios.</p>
                }
                badgeColor="green"
              />
            </CardContent>
          </Card>

          {/* Miércoles */}
          <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Miércoles - 26/11
              </h2>
            </CardHeader>
            <CardContent className="pt-8">
              <TimelineItem
                time="08:30 – 11:30"
                title="Desayuno de Trabajo en Esteros"
                details={
                  <ul className="list-disc list-inside space-y-1">
                    <li>Coordinación de 4–5 actividades internas.</li>
                    <li>Definición de responsables y tiempos.</li>
                  </ul>
                }
                badgeColor="green"
              />
              <TimelineItem
                time="11:30 – 12:00"
                title="Cierre Operativo"
                details={<p>Balance y planificación de la jornada.</p>}
                badgeColor="green"
              />
            </CardContent>
          </Card>

          {/* Jueves */}
          <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Jueves - 27/11
              </h2>
            </CardHeader>
            <CardContent className="pt-8">
              <TimelineItem
                time="08:30 – 10:00"
                title="Tratamiento de Expedientes"
                details={<p>Seguimiento de casos pendientes.</p>}
                badgeColor="green"
              />
              <TimelineItem
                time="10:00 – 12:00"
                title="Presentación Reglamento Interno"
                details={
                  <p>Versión final del reglamento interno de escuelas.</p>
                }
                badgeColor="green"
              />
            </CardContent>
          </Card>

          {/* Viernes */}
          <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Viernes - 28/11
              </h2>
            </CardHeader>
            <CardContent className="pt-8">
              {/* <TimelineItem
                time="08:30 – 09:30"
                title="Reconocimiento a Docentes Jubilados"
                details={
                  <div className="flex items-center text-sm mt-1">
                    <UsersIcon className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                    <ul className="list-none flex space-x-4">
                      <li>Cristina M.</li>
                      <li>Claudia F.</li>
                    </ul>
                  </div>
                }
                badgeColor="green"
              /> */}
              <TimelineItem
                time="09:00hs."
                title="Reunión con Supervisores"
                details={
                  <p>En la Facultad de Derecho y Ciencias Sociales (UNNE).</p>
                }
                badgeColor="green"
              />
              <TimelineItem
                time="09:30 – 11:00"
                title="Tratamiento de Expedientes"
                details={
                  <p>Cierre de la semana con expedientes prioritarios.</p>
                }
                badgeColor="green"
              />
            </CardContent>
          </Card>
        </div>

        {/* Footer Sobrio */}
        <footer className="mt-20 text-center border-t border-slate-200 pt-8">
          <p className="text-slate-500 text-sm font-light">
            Agenda semanal institucional — <strong>Noviembre 2025</strong>
          </p>
        </footer>
      </div>
    </div>
  );
}

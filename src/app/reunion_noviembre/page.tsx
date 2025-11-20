import React from 'react';
import {
  Clock,
  MapPin,
  Coffee,
  FileText,
  Users,
  Info,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

// Interfaces para el tipado
interface AgendaEvento {
  hora: string;
  titulo: string;
  icon: React.ReactNode;
  tipo: string;
  descripcion?: string;
  link?: string;
  detalles?: string[];
}

interface AgendaDia {
  dia: string;
  eventos: AgendaEvento[];
}

export default function AgendaInstitucional() {
  // Datos estructurados para facilitar la edición
  const agendaData: AgendaDia[] = [
    {
      dia: 'Martes',
      eventos: [
        {
          hora: '08:00 – 08:30',
          titulo: 'Desayuno',
          icon: <Coffee className="w-4 h-4" />,
          tipo: 'break',
        },
        {
          hora: '08:30 – 09:15',
          titulo: 'Reunión con Sanidad Escolar',
          icon: <Users className="w-4 h-4" />,
          tipo: 'reunion',
        },
        {
          hora: '09:15 – 13:00',
          titulo: 'Tratamiento de Expedientes',
          icon: <FileText className="w-4 h-4" />,
          tipo: 'reunion',
        },
      ],
    },
    {
      dia: 'Miércoles',
      eventos: [
        {
          hora: '08:30 – 11:30',
          titulo: 'Desayuno de trabajo en Esteros',
          link: 'https://www.google.com/maps/search/?api=1&query=Hipólito+Yrigoyen+1490+Corrientes+Argentina',
          icon: <Coffee className="w-4 h-4" />,
          detalles: ['Responsables: Vocales', 'Llevar dispositivo (Notebook)'],
          tipo: 'externo',
        },
      ],
    },
    {
      dia: 'Jueves',
      eventos: [
        {
          hora: '08:00 – 08:30',
          titulo: 'Desayuno',
          icon: <Coffee className="w-4 h-4" />,
          tipo: 'break',
        },
        {
          hora: '08:30 – 12:00',
          titulo: 'Presentación Reglamento Interno + Expedientes',
          descripcion:
            'Versión final de reglamento interno y tratamiento de expedientes.',
          icon: <FileText className="w-4 h-4" />,
          tipo: 'trabajo',
        },
      ],
    },
    {
      dia: 'Viernes',
      eventos: [
        {
          hora: '08:30 – 09:30',
          titulo: 'Ceremonial y protocolo',
          descripcion: 'Revisión de versión final.',
          icon: <Info className="w-4 h-4" />,
          tipo: 'trabajo',
        },
        {
          hora: '09:00 – ...',
          titulo: 'Reunión con supervisores y directivos',
          descripcion: 'Lugar: Facultad de Derecho y Cs. Sociales (UNNE)',
          icon: <GraduationCap className="w-4 h-4" />,
          tipo: 'reunion',
        },
        {
          hora: '09:30 – 13:00',
          titulo: 'Tratamiento de expedientes',
          icon: <FileText className="w-4 h-4" />,
          tipo: 'trabajo',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Header Elegante */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-stone-200 -z-10"></div>
          <span className="bg-stone-50 px-4 text-green-800 font-semibold tracking-wider text-sm uppercase">
            Noviembre 2025
          </span>
          <h1 className="mt-4 text-4xl font-bold text-green-900 tracking-tight flex items-center justify-center gap-3">
            {/*<CalendarDays className="w-8 h-8 text-green-700" />*/}
            Agenda Institucional
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-stone-600">
            <Clock className="w-4 h-4" />
            <p className="font-medium">Horario general: 8:00 a 13:00</p>
          </div>
        </div>

        {/* Grid de Agenda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agendaData.map((item, index) => (
            <Card
              key={index}
              className="border-t-4 border-t-green-800 flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-green-900">{item.dia}</h2>
                {/* Indicador visual sutil */}
                <div className="w-2 h-2 rounded-full bg-green-600/40"></div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-6 flex-1">
                {item.eventos.map((evento, i) => (
                  <div key={i} className="relative pl-4 group">
                    {/* Línea vertical decorativa */}
                    <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-stone-200 group-hover:bg-green-400 transition-colors"></div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      {/* Hora Badge */}
                      <div className="flex-shrink-0">
                        <Badge className="bg-green-100 text-green-800 border border-green-200">
                          {evento.hora}
                        </Badge>
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-stone-400">{evento.icon}</span>
                          <h3 className="font-semibold text-slate-800 leading-tight">
                            {evento.titulo}
                          </h3>
                        </div>

                        {evento.descripcion && (
                          <p className="text-sm text-stone-600 ml-6">
                            {evento.descripcion}
                          </p>
                        )}

                        {evento.link && (
                          <div className="ml-6 pt-1">
                            <a
                              href={evento.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs font-medium text-green-700 hover:text-green-900 underline decoration-green-300 hover:decoration-green-900 underline-offset-2 transition-all"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              Ver ubicación
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        )}

                        {evento.detalles && (
                          <ul className="ml-6 mt-2 space-y-1">
                            {evento.detalles.map((detalle, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-stone-500 flex items-center gap-1.5"
                              >
                                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                                {detalle}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-stone-200 pt-8 text-center">
          <p className="text-stone-400 text-sm font-medium">
            CGE 2025 — Documento de uso interno
          </p>
        </div>
      </div>
    </div>
  );
}

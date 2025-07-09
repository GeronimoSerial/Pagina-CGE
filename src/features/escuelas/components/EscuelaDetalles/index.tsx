import React, { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import type { Escuela } from '@/shared/interfaces';
import {
  School,
  MapPin,
  Info,
  Building2,
  Bookmark,
  Calendar,
  Map,
  ArrowRight,
} from 'lucide-react';
import { formatearFecha } from '@/shared/lib/utils';

interface EscuelaDetallesProps {
  escuela: Escuela;
  onClose: () => void;
}

const EscuelaDetalles = memo(({ escuela, onClose }: EscuelaDetallesProps) => {
  if (!escuela) return null;

  const commonBadgeClasses =
    'bg-gray-50 px-2 py-1 rounded-md flex items-center gap-2 border border-gray-200 text-sm';
  const commonIconClasses = 'h-4 w-4 text-gray-600';

  return (
    <Dialog open={!!escuela} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden w-[95vw] rounded-2xl shadow-2xl border-0 max-h-[95vh] flex flex-col">
        <div className="bg-white pt-6 pb-4 px-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
              <School className="h-6 w-6 text-[#217A4B]" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight break-words">
              {escuela.nombre}
            </DialogTitle>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className={commonBadgeClasses}>
              <Building2 className={commonIconClasses} />
              <span className="font-medium text-gray-700">
                CUE: {escuela.cue}
              </span>
            </div>

            <div className={commonBadgeClasses}>
              <MapPin className={commonIconClasses} />
              <span className="font-medium text-gray-700">
                {escuela.departamento}, {escuela.localidad}
              </span>
            </div>

            <div className={commonBadgeClasses}>
              <Bookmark className={commonIconClasses} />
              <span className="font-medium text-gray-700 truncate max-w-[150px]">
                {escuela.tipoEscuela}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto bg-gray-50/50">
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-[#217A4B]" />
                      <h3 className="text-lg font-semibold text-[#205C3B]">
                        Información General
                      </h3>
                    </div>

                    <div className="space-y-2 px-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Fecha de Fundación:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {formatearFecha(
                            escuela.fechaFundacion || 'No especificada',
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Categoría:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {escuela.categoria || 'No especificada'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Zona:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {escuela.zona || 'No especificada'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Turno:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {escuela.turno}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-[#217A4B]" />
                    <h3 className="text-lg font-semibold text-[#205C3B]">
                      Ubicación y Contacto
                    </h3>
                  </div>

                  <div className="space-y-2 px-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Departamento:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {escuela.departamento}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Ubicación:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {escuela.ubicacion}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Director/a:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {escuela.director}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <a
                        href="http://mapa.mec.gob.ar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline text-[#217A4B] hover:text-[#205C3B] flex items-center gap-1.5"
                      >
                        <Map className="h-4 w-4" />
                        Consulte la ubicación exacta en el mapa escolar{' '}
                        <ArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-gray-200 bg-white flex flex-col xs:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-500 order-2 xs:order-1">
            <span className="font-medium">Última actualización:</span>{' '}
            {new Date().toLocaleDateString()}
          </div>
          <DialogClose asChild className="order-1 xs:order-2 w-full xs:w-auto">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-lg font-medium shadow-sm hover:shadow transition-all w-full xs:w-auto"
            >
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

EscuelaDetalles.displayName = 'EscuelaDetalles';

export default EscuelaDetalles;

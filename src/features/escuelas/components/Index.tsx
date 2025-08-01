import React, { useMemo, useState, useCallback } from 'react';
import { Accordion } from '@/shared/ui/accordion';
import SchoolSearch from './SchoolSearch';
import { EscuelaDetalles } from '@/shared/data/dynamic-client';
import AccordionItemUnificado from './Accordion';
import type { School } from '@/shared/interfaces';
import { groupSchoolsByDepartment } from '../utils/escuelas';
import {
  AlertCircle,
  School as SchoolIcon,
  Search,
  Map,
  Users,
  Building2,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/shared/ui/select';
import { useSchools } from '@/features/institucional/hooks/useSchools';

interface SchoolWithMail extends School {
  mail?: string | null;
}

export default function SchoolsClient() {
  const { schools, loading, error } = useSchools();
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const [selectedSchool, setSelectedSchool] = useState<SchoolWithMail | null>(
    null,
  );

  const schoolsByDepartment = useMemo(
    () => groupSchoolsByDepartment(schools),
    [schools],
  );

  const handleSelectSchool = useCallback((school: SchoolWithMail) => {
    setSelectedSchool(school);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedSchool(null);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="rounded-xl border-red-200 bg-red-50 shadow-md w-full max-w-md">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <AlertDescription className="font-medium text-red-800 ml-2">
            Error: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-8 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 sm:p-6 transform transition hover:shadow-xl relative z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="rounded-full bg-emerald-100 p-3 shrink-0">
              <Search className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Búsqueda de Instituciones
              </h2>
              <p className="text-sm text-gray-500">
                Encontrá rápidamente cualquier institución.
              </p>
            </div>
          </div>
          <div className="w-full">
            <SchoolSearch
              schools={schools}
              onSelectSchool={handleSelectSchool}
            />
          </div>
        </div>
        {/* Stats cards with improved responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-linear-to-br from-[#3D8B37] to-[#2D6A27] p-2 mr-3 shadow-md">
              <SchoolIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Total Escuelas
              </p>
              <p className="text-xl font-bold text-gray-800">1131</p>
              <p className="text-sm text-gray-500">en 25 departamentos</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 flex items-center hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-linear-to-br from-[#3D8B37] to-[#2D6A27] p-2 mr-3 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
                Matrícula 2025
              </p>
              <p className="text-xl font-bold text-gray-800">128.003 alumnos</p>
              <p className="text-sm text-gray-500">
                en la provincia de Corrientes
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mb-8 transform transition hover:shadow-xl z-10 relative">
          <div className="bg-linear-to-br from-[#3D8B37] to-[#2D6A27] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-white mr-4" />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Panel por Departamento
                  </h2>
                  <p className="text-white opacity-90 text-sm mt-1">
                    Explore escuelas organizadas por ubicación geográfica
                  </p>
                </div>
              </div>
              <span className="hidden md:flex bg-white text-[#2D6A27] text-sm rounded-full font-bold px-3 py-1">
                25 departamentos
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Departamento
              </label>
              <Select
                value={expanded}
                onValueChange={(value) => setExpanded(value)}
              >
                <SelectTrigger className="w-full bg-white border-gray-200 hover:border-[#3D8B37] transition-colors focus:ring-2 focus:ring-[#3D8B37] focus:ring-opacity-50">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(schoolsByDepartment)
                    .sort((a, b) => a.localeCompare(b))
                    .map((dep) => {
                      const cantidadEscuelas = schoolsByDepartment[dep].length;
                      return (
                        <SelectItem
                          key={dep}
                          value={dep}
                          className="flex items-center justify-between py-2 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900"
                        >
                          <div className="flex items-center space-x-3">
                            <Map className="h-4 w-4 text-[#3D8B37] group-hover:text-[#2D6A27] transition-colors" />
                            <span className="font-medium">{dep}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden mt-6 z-10 relative">
          <div className="p-1">
            {expanded &&
              Object.keys(schoolsByDepartment).map((dep) => (
                <div
                  key={dep}
                  className={expanded === dep ? 'block' : 'hidden'}
                >
                  <Accordion
                    type="single"
                    collapsible
                    value={expanded}
                    onValueChange={setExpanded}
                    className="border-0"
                  >
                    <AccordionItemUnificado
                      agrupador={{ id: dep, nombre: dep }}
                      escuelas={schoolsByDepartment[dep] || []}
                      isExpanded={expanded === dep}
                      onSelectEscuela={handleSelectSchool}
                      tipo="departamento"
                    />
                  </Accordion>
                </div>
              ))}

            {!expanded && (
              <div className="flex flex-col items-center justify-center p-16 text-center animate-fade-in">
                <Map className="h-12 w-12 text-emerald-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Seleccione un departamento
                </h3>
                <p className="text-gray-500 max-w-md">
                  Utilice el selector de arriba para explorar las instituciones
                  educativas por departamento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedSchool && (
        <EscuelaDetalles
          escuela={selectedSchool}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

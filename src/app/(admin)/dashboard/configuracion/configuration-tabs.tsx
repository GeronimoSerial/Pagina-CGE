"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { FeriadosTable } from "@dashboard/components/feriados-table";
import { JornadaConfigTable } from "@dashboard/components/jornada-config-table";
import { ExcepcionesTable } from "@dashboard/components/excepciones-table";
import { WhitelistTable } from "@dashboard/components/whitelist-table";
import { UserManagement } from './user-management';
import {
  IconCalendarEvent,
  IconClock,
  IconBeach,
  IconShieldCheck,
  IconUsers
} from "@tabler/icons-react";
import { TabData } from "./page"; 

interface ConfigurationTabsProps {
  data: TabData;
  currentTab: string;
  currentAnio: number;
  userRole: string;
}

export function ConfigurationTabs({ 
  data, 
  currentTab, 
  currentAnio,
  userRole 
}: ConfigurationTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Función para cambiar de tab empujando la URL
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    // Limpiamos params específicos al cambiar de tab principal
    if (value !== 'feriados') params.delete('anio');
    
    router.push(`?${params.toString()}`);
  };

  // Función específica para cambiar el año (filtro dentro de feriados)
  const handleAnioChange = (anio: number | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (anio) {
      params.set('anio', anio.toString());
    } else {
      params.delete('anio');
    }
    router.push(`?${params.toString()}`);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="px-4 lg:px-6">
      {/* Controlamos el valor de Tabs con la prop currentTab que viene de la URL */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger value="feriados" className="gap-2">
            <IconCalendarEvent className="h-4 w-4" />
            <span className="hidden sm:inline">Feriados</span>
          </TabsTrigger>
          <TabsTrigger value="jornadas" className="gap-2">
            <IconClock className="h-4 w-4" />
            <span className="hidden sm:inline">Jornadas</span>
          </TabsTrigger>
          <TabsTrigger value="excepciones" className="gap-2">
            <IconBeach className="h-4 w-4" />
            <span className="hidden sm:inline">Excepciones</span>
          </TabsTrigger>
          <TabsTrigger value="whitelist" className="gap-2">
            <IconShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Whitelist</span>
          </TabsTrigger>
          {userRole === 'owner' && (
             <TabsTrigger value="usuarios" className="gap-2">
             <IconUsers className="h-4 w-4" />
             <span className="hidden sm:inline">Usuarios</span>
           </TabsTrigger>
          )}
        </TabsList>

        {/* Solo renderizamos el contenido si tenemos datos. 
            Nota: Al usar Tabs de radix/shadcn, los TabsContent "ocultos" 
            no se muestran, pero aqui controlamos renderizado condicional 
            para evitar errores si 'data' es undefined. */}

        <TabsContent value="feriados" className="mt-6">
          {currentTab === 'feriados' && data.feriados && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">Gestión de Feriados</h2>
              <FeriadosTable
                feriados={data.feriados}
                aniosDisponibles={data.aniosFeriados}
                anioSeleccionado={currentAnio}
                onAnioChange={handleAnioChange}
                onDataChange={handleRefresh}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="jornadas" className="mt-6">
          {currentTab === 'jornadas' && data.empleados && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">Configuración de Jornada</h2>
              <JornadaConfigTable
                empleados={data.empleados}
                onDataChange={handleRefresh}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="excepciones" className="mt-6">
          {currentTab === 'excepciones' && data.excepciones && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">Excepciones</h2>
              <ExcepcionesTable
                excepciones={data.excepciones}
                empleados={data.listaEmpleados}
                onDataChange={handleRefresh}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="whitelist" className="mt-6">
            {currentTab === 'whitelist' && data.whitelist && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-1">Whitelist</h2>
              <WhitelistTable
                whitelist={data.whitelist}
                empleados={data.listaEmpleados}
                onDataChange={handleRefresh}
              />
            </div>
            )}
        </TabsContent>
        
        {userRole === 'owner' && (
          <TabsContent value="usuarios" className="mt-6">
             <div className="rounded-lg border bg-card p-6">
                <UserManagement currentUserRole={userRole} />
             </div>
          </TabsContent>
        )}

      </Tabs>
    </div>
  );
}
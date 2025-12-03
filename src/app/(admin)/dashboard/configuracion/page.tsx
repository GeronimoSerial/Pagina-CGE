import { auth } from "@/shared/lib/auth/auth";
import { useSession } from "@/shared/lib/auth/auth-client";
import { redirect } from "next/navigation";
import {
  getFeriados,
  getAniosFeriados,
  getEmpleadosConJornada,
  getExcepciones,
  getWhitelist,
  getListaEmpleados,
} from '@dashboard/actions/actions';
import { getArgentinaYear } from '@dashboard/lib/utils';
import { ConfigurationTabs } from "./configuration-tabs";
import { headers } from "next/headers";
export type TabData = {
  feriados?: any;
  aniosFeriados?: any;
  empleados?: any;
  excepciones?: any;
  whitelist?: any;
  listaEmpleados?: any;
};

export default async function ConfiguracionPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; anio?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect('/login');
  
  const userRole = session.user.role;
  if (userRole !== 'admin' && userRole !== 'owner') redirect('/dashboard');

  // 2. Determinar qué tab y qué filtros están activos
  const params = await searchParams;
  const currentTab = params.tab || 'feriados'; // Default
  const currentAnio = params.anio ? parseInt(params.anio) : getArgentinaYear();

  // 3. CARGA CONDICIONAL: Solo cargamos lo necesario para la tab actual
  const data: TabData = {};

  console.log(`Cargando datos para tab: ${currentTab}`);

  switch (currentTab) {
    case 'feriados':
      // Para feriados necesitamos los feriados del año y la lista de años disponibles
      const [feriadosData, aniosData] = await Promise.all([
        getFeriados(currentAnio),
        getAniosFeriados()
      ]);
      data.feriados = feriadosData;
      data.aniosFeriados = aniosData.length > 0 ? aniosData : [currentAnio];
      break;

    case 'jornadas':
      data.empleados = await getEmpleadosConJornada();
      break;

    case 'excepciones':
      // Excepciones suele necesitar la lista de empleados para el select
      const [excepcionesData, listaParaExcepciones] = await Promise.all([
        getExcepciones(),
        getListaEmpleados()
      ]);
      data.excepciones = excepcionesData;
      data.listaEmpleados = listaParaExcepciones;
      break;

    case 'whitelist':
      const [whitelistData, listaParaWhitelist] = await Promise.all([
        getWhitelist(),
        getListaEmpleados()
      ]);
      data.whitelist = whitelistData;
      data.listaEmpleados = listaParaWhitelist;
      break;
      
    case 'usuarios':
        // No necesita carga de datos iniciales complejos si se maneja internamente
        break;
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administre la configuración del sistema.
        </p>
      </div>

      <ConfigurationTabs 
        data={data} 
        currentTab={currentTab} 
        currentAnio={currentAnio}
        userRole={userRole}
      />
    </div>
  );
}
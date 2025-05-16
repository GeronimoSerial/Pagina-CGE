import escuelas from "../data/escuelas.json";
import type { Escuela } from "@/src/interfaces";

export function getEscuelas(): Escuela[] {
  const processedEscuelas = escuelas.map((escuela) => {
    // Normalizar fechaFundacion2 si existe y es string
    let fechaFundacion2: number | undefined = undefined;
    if (typeof escuela.fechaFundacion2 === "string") {
      const parsed = parseInt(escuela.fechaFundacion2, 10);
      fechaFundacion2 = isNaN(parsed) ? undefined : parsed;
    } else if (typeof escuela.fechaFundacion2 === "number") {
      fechaFundacion2 = escuela.fechaFundacion2;
    }

    // Convert categoria to string if it's a number
    const categoria = escuela.categoria?.toString();

    return {
      ...escuela,
      fechaFundacion2,
      categoria,
    } as Escuela;
  });

  return processedEscuelas;
}
interface SupervisoresClientProps {
  datosSimulados: Escuela[];
}

// Función para crear datos de supervisores
export function getSupervisoresFicticios() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    nombre: `Supervisor/a ${i + 1}`,
  }));
}

// Función para agrupar escuelas por supervisor
export function agruparEscuelasPorDepartamento(escuelas: Escuela[]) {
  const mapa: { [key: string]: Escuela[] } = {};
  escuelas.forEach((escuela) => {
    if (!mapa[escuela.departamento]) mapa[escuela.departamento] = [];
    mapa[escuela.departamento].push(escuela);
  });
  return mapa;
}
export function agruparEscuelasPorSupervisor(escuelas: Escuela[]) {
  const mapa: { [key: number]: Escuela[] } = {};
  escuelas.forEach((escuela) => {
    if (escuela.supervisorID === undefined) return;
    if (!mapa[escuela.supervisorID]) mapa[escuela.supervisorID] = [];
    mapa[escuela.supervisorID].push(escuela);
  });
  return mapa;
}

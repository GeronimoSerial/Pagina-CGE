import escuelas from "../data/escuelas.json";
import type { Escuela } from "@/src/interfaces";

export default function getEscuelas() {
    return escuelas.map((e) => ({
    cue: Number(e.cue),
    nombre: String(e.nombre),
    director: String(e.director || ""),
    matricula2024: Number(e.matricula2024),
    matricula2025: Number(e.matricula2025),
    tipoEscuela: String(e.tipoEscuela || ""),
    departamento: String(e.departamento),
    localidad: String(e.localidad),
    turno: String(e.turno),
    ubicacion: String(e.ubicacion || ""),
    cabecera: String(e.cabecera),
    supervisorID: Number(e.supervisorID),
  }));

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
    if (!mapa[escuela.supervisorID]) mapa[escuela.supervisorID] = [];
    mapa[escuela.supervisorID].push(escuela);
  });
  return mapa;
}
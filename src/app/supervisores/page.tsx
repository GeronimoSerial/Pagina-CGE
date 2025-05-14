import HeroSection from "../../modules/layout/Hero";
import { Metadata } from "next";
import { Suspense } from "react";
import escuelas from "../../modules/supervisores/data/escuelas.json";
import { Loader2 } from "lucide-react";
import { SupervisoresClient } from "../../components/data/dynamic-client";

export const metadata: Metadata = {
  title: "Supervisores",
  description: "Supervisores del CGE Corrientes, y sus escuelas asignadas",
};

// Pre-procesado de datos antes de renderizar
function preprocesarDatos() {
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
    empresaLimpieza: String(e.empresaLimpieza || ""),
    conexionInternet: String(e.conexionInternet || ""),
    programasAcompañamiento: String(e.programasAcompañamiento || ""),
    problematicas: String(e.problematicas || ""),
    supervisorID: Number(e.supervisorID),
  }));
}

export default function Supervisores() {
  const datosProcesados = preprocesarDatos();

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection
        title="Supervisores"
        description="Consulte la lista de supervisores y las escuelas que tienen a su
          cargo. Haga clic en cada supervisor para ver el detalle completo de
          las escuelas asignadas."
      />
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-[#217A4B] animate-spin" />
              <span className="ml-3 text-lg text-gray-600">
                Cargando datos de escuelas...
              </span>
            </div>
          }
        >
          <SupervisoresClient datosSimulados={datosProcesados} />
        </Suspense>
      </div>
    </main>
  );
}

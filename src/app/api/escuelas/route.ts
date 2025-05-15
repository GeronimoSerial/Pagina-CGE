import { NextResponse } from "next/server";
import escuelasOriginales from "@modules/supervisores/data/escuelas.json";
import type { Escuela } from "@src/interfaces";

export async function GET() {
    // Transformar los datos originales con el campo mail incluido
    const escuelas = escuelasOriginales.map((e: any) => ({
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
        mail: e.mail || null, // Incluir el campo mail
    }));
    
    return NextResponse.json(escuelas);
}

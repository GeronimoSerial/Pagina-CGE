import { NextResponse } from "next/server";
import getEscuelas from "@modules/supervisores/utils/escuelas";

export async function GET() {
    const escuelas = getEscuelas();
    return NextResponse.json(escuelas);
}

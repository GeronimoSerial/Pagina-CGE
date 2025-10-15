import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";
import { getEscuelasPorDepartamento } from "@/services/escuelas";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    
    const { id: idDepartamentoString } = await params;
    const id_departamento = parseInt(idDepartamentoString, 10);
    if (isNaN(id_departamento)) {
        return NextResponse.json({
            success: false,
            error: 'ID de departamento inválido',
            message: 'El ID de departamento proporcionado no es un número válido.'
        }, { status: 400 });
    }
    try {
        const data = await getEscuelasPorDepartamento(id_departamento);
        
        // Serializar BigInt a string para JSON
        const jsonString = JSON.stringify(
            data,
            (key, value) => typeof value === 'bigint' ? value.toString() : value
        );
        
        return new NextResponse(jsonString, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error al obtener escuelas por departamento:', error);
        return NextResponse.json({
            success: false,
            error: 'Error al obtener los datos de las escuelas',
            message: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }



}

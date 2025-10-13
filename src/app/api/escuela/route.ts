import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const data = await prisma.escuela.findMany({
            include: {
                categoria: true,
                zona: true,
                modalidad: true,
                turno: true,
                servicio_comida: true,
                ambito_escuela: true,
            },
            take: 20,
        });
        
        // Serializar manualmente con soporte para BigInt
        const jsonString = JSON.stringify(
            {
                success: true,
                count: data.length,
                data: data
            },
            (key, value) => typeof value === 'bigint' ? value.toString() : value
        );
        
        return new NextResponse(jsonString, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    } catch (error) {
        console.error('Error al obtener escuelas:', error);
        return NextResponse.json({
            success: false,
            error: 'Error al obtener los datos de escuelas',
            message: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }
}
import { getEscuelasByCue } from '@/services/escuelas';
import { NextResponse } from 'next/server';


export async function GET(
    request: Request,
    { params }: { params: Promise<{ cue: string }> }
) {
    const { cue: cueString } = await params;
    const cue = BigInt(cueString);

    try {
        const data = await getEscuelasByCue(cue);
        
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
        console.error('Error al obtener escuela por CUE:', error);
        return NextResponse.json({
            success: false,
            error: 'Error al obtener los datos de la escuela',
            message: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });
    }

}


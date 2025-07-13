import { NextResponse } from "next/server";
import { getNoticiasPaginadas } from '@/features/noticias/services/noticias';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    // Construir filtros para la función cached
    const filters: any = {};
    
    if (searchParams.get('q'))
        filters.titulo = { $containsi: searchParams.get('q') };
    if (searchParams.get('categoria'))
        filters.categoria = { $eq: searchParams.get('categoria') };
    if (searchParams.get('desde') && searchParams.get('hasta')) {
        filters.fecha = { $between: [searchParams.get('desde'), searchParams.get('hasta')] };
    }
    else if (searchParams.get('desde')) {
        filters.fecha = { $gte: searchParams.get('desde') };
    }
    else if (searchParams.get('hasta')) {
        filters.fecha = { $lte: searchParams.get('hasta') };
    }

    try {
        // Usar función cached del servidor con revalidate corto para VPS efficiency
        const { noticias, pagination } = await getNoticiasPaginadas(page, limit, filters);
        
        return NextResponse.json({
            noticias,
            totalPages: pagination?.pageCount || 1,
            currentPage: pagination?.page || 1,
            total: pagination?.total || 0
        }, {
            status: 200,
            headers: {
                // Cache optimizado para VPS - balance entre freshness y performance
                'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
                'X-VPS-Optimized': 'cached-service',
            },
        });
    }
    catch (error) {
        console.error('Error fetching noticias:', error);
        return NextResponse.json({ error: "Error al obtener las noticias" }, { status: 500 });
    }
}
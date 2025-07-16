import { NextResponse } from "next/server";
import { getNoticiasPaginadas } from '@/features/noticias/services/noticias';
import { PERFORMANCE_CONFIG } from '@/shared/lib/config';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || PERFORMANCE_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;

    // Construir filtros para Directus
    const filters: any = {};
    
    if (searchParams.get('q'))
        filters.q = searchParams.get('q');
    if (searchParams.get('categoria'))
        filters.categoria = searchParams.get('categoria');
    if (searchParams.get('desde'))
        filters.desde = searchParams.get('desde');
    if (searchParams.get('hasta'))
        filters.hasta = searchParams.get('hasta');

    try {
        // Usar servicio de Directus
        const result = await getNoticiasPaginadas(page, pageSize, filters);
        
        return NextResponse.json({
            noticias: result.noticias,
            pagination: result.pagination
        }, {
            status: 200,
            headers: {
                // Cache coordinado con configuración global
                'Cache-Control': `public, max-age=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_MAX_AGE}, stale-while-revalidate=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_STALE_WHILE_REVALIDATE}`,
                'X-VPS-Optimized': 'coordinated-cache',
                'X-Cache-Strategy': 'performance-config',
                'Vary': 'Accept-Encoding',
            },
        });
    }
    catch (error) {
        console.error('Error fetching noticias:', error);
        return NextResponse.json({ 
            error: "Error al obtener las noticias",
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 });
    }
}
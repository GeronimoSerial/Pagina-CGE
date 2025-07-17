import { NextResponse } from "next/server";
import { getNoticiasPaginadas } from '@/features/noticias/services/noticias';
import { PERFORMANCE_CONFIG } from '@/shared/lib/config';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Math.min(Number(searchParams.get("limit")) || PERFORMANCE_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE, PERFORMANCE_CONFIG.PAGINATION.MAX_PAGE_SIZE);

    // Validación rápida de parámetros
    if (page < 1 || limit < 1) {
        return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const filters: any = {};
    
    // Construcción optimizada de filtros
    const q = searchParams.get('q');
    const categoria = searchParams.get('categoria');
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');

    if (q && q.length >= 2) filters.q = q;
    if (categoria) filters.categoria = categoria;
    if (desde) filters.desde = desde;
    if (hasta) filters.hasta = hasta;

    try {
        const result = await getNoticiasPaginadas(page, limit, filters);
        
        return NextResponse.json({
            noticias: result.noticias,
            totalPages: result.pagination?.pageCount || 1,
            currentPage: result.pagination?.page || 1,
            total: result.pagination?.total || 0
        }, {
            status: 200,
            headers: {
                // Cache más agresivo para VPS
                'Cache-Control': `public, max-age=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_MAX_AGE}, stale-while-revalidate=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_STALE_WHILE_REVALIDATE}, s-maxage=${Math.floor(PERFORMANCE_CONFIG.CACHE.DYNAMIC_MAX_AGE * 0.8)}`,
                'X-Cache-Strategy': 'vps-optimized',
                'Vary': 'Accept-Encoding',
            },
        });
    } catch (error) {
        console.error('API noticias error:', error);
        return NextResponse.json({ 
            error: "Error al obtener las noticias",
            noticias: [],
            totalPages: 1,
            currentPage: 1,
            total: 0
        }, { status: 500 });
    }
}
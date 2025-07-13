import { getNoticiasPaginadas } from "@/features/noticias/services/noticias";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5; // Permitir límite configurable

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
        const data = await getNoticiasPaginadas(page, limit, filters);
        return NextResponse.json({
            noticias: data.noticias,
            totalPages: data.pagination?.pageCount || 1,
            currentPage: data.pagination?.page || 1,
            total: data.pagination?.total || 0
        }, {
            status: 200,
            headers: {
                // Cache agresivo para VPS limitada
                'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600', // 30min cache, 1h stale
            },
        });
    }
    catch {
        return NextResponse.json({ error: "Error al obtener las noticias" }, { status: 500 });
    }
}
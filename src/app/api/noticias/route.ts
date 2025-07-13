import { NextResponse } from "next/server";
import { API_URL } from '@/shared/lib/config';
import qs from 'qs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5; // Permitir límite configurable

    const filters: any = {
        publicado: { $eq: true }, // Solo noticias publicadas
    };
    
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
        // Fetch directo a Strapi sin cache para freshness máximo
        const query = qs.stringify(
            {
                fields: ['titulo', 'resumen', 'fecha', 'categoria', 'esImportante', 'slug', 'createdAt'],
                populate: {
                    portada: {
                        fields: ['url', 'alternativeText']
                    },
                    imagen: {
                        fields: ['url', 'width', 'height', 'alternativeText']
                    }
                },
                sort: ['createdAt:desc', 'fecha:desc', 'id:desc'],
                pagination: { page, pageSize: limit },
                filters,
            },
            { encodeValuesOnly: true },
        );

        const res = await fetch(`${API_URL}/noticias?${query}`, {
            // Sin cache para data fresca
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch from Strapi');
        }

        const { data, meta } = await res.json();
        
        return NextResponse.json({
            noticias: data,
            totalPages: meta.pagination?.pageCount || 1,
            currentPage: meta.pagination?.page || 1,
            total: meta.pagination?.total || 0
        }, {
            status: 200,
            headers: {
                // Cache muy agresivo para noticias frescas
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=120', // 1min cache, 2min stale
                'X-Content-Fresh': 'true',
            },
        });
    }
    catch {
        return NextResponse.json({ error: "Error al obtener las noticias" }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import { getNewsCategories } from '@/features/noticias/services/news';

export async function GET() {
  try {
    const categorias = await getNewsCategories();

    return NextResponse.json(
      {
        categorias,
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'public, max-age=21600, stale-while-revalidate=7200, s-maxage=3600',
          'X-Cache-Strategy': 'categorias-cached',
          Vary: 'Accept-Encoding',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener las categorías',
        categorias: [],
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}

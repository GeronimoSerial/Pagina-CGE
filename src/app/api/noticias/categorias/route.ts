import { NextResponse } from 'next/server';
import { getNoticiasCategorias } from '@/features/noticias/services/noticias';

export async function GET() {
  try {
    const categorias = await getNoticiasCategorias();
    
    return NextResponse.json(
      { 
        categorias: categorias || [],
        success: true 
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5min cache, 10min stale
        },
      }
    );
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener categorías',
        categorias: [],
        success: false 
      },
      { status: 500 }
    );
  }
}

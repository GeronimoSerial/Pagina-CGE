'use server';

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para revalidar cache del dashboard
 *
 * Tags disponibles:
 * - 'dashboard' - Invalida todas las estadísticas del dashboard
 * - 'empleados' - Invalida datos de empleados
 * - 'reportes' - Invalida datos de reportes/liquidación
 *
 * Sub-tags específicos:
 * - 'dashboard-stats', 'estadisticas', 'promedio-horas'
 * - 'empleados-activos', 'empleados-problematicos', 'lista-empleados'
 * - 'liquidacion', 'meses-disponibles'
 *
 * Uso:
 * POST /api/revalidate/dashboard
 * Body: { "tags": ["dashboard"] } o { "tags": ["empleados", "reportes"] }
 * Body con modo: { "tags": ["dashboard"], "mode": "immediate" }
 *
 * Con secret (producción):
 * POST /api/revalidate/dashboard?secret=YOUR_REVALIDATE_SECRET
 *
 * Modos de revalidación:
 * - "stale" (default): Usa stale-while-revalidate (recomendado)
 * - "immediate": Expira inmediatamente (para webhooks externos)
 */

const VALID_TAGS = [
  // Tags principales (invalidan grupo completo)
  'dashboard',
  'empleados',
  'reportes',
  // Sub-tags específicos
  'dashboard-stats',
  'dashboard-charts',
  'estadisticas',
  'promedio-horas',
  'asistencia',
  'ausentes',
  'marcaciones-incompletas',
  'dias-sin-actividad',
  'dias-con-marca',
  'empleados-activos',
  'empleados-problematicos',
  'lista-empleados',
  'areas',
  'liquidacion',
  'meses-disponibles',
] as const;

type ValidTag = (typeof VALID_TAGS)[number];
type RevalidateMode = 'stale' | 'immediate';

export async function POST(request: NextRequest) {
  try {
    // Verificar secret en producción
    const secret = request.nextUrl.searchParams.get('secret');
    if (
      process.env.NODE_ENV === 'production' &&
      secret !== process.env.REVALIDATE_SECRET
    ) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const { tags, mode = 'stale' } = body as {
      tags?: string[];
      mode?: RevalidateMode;
    };

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        {
          error: 'Se requiere un array de tags',
          availableTags: VALID_TAGS,
        },
        { status: 400 },
      );
    }

    // Validar tags
    const invalidTags = tags.filter(
      (tag) => !VALID_TAGS.includes(tag as ValidTag),
    );
    if (invalidTags.length > 0) {
      return NextResponse.json(
        {
          error: `Tags inválidos: ${invalidTags.join(', ')}`,
          availableTags: VALID_TAGS,
        },
        { status: 400 },
      );
    }

    // Revalidar cada tag según el modo
    const revalidated: string[] = [];
    for (const tag of tags) {
      if (mode === 'immediate') {
        // Para webhooks externos que necesitan expiración inmediata
        revalidateTag(tag, { expire: 0 });
      } else {
        // Stale-while-revalidate (recomendado para la mayoría de casos)
        revalidateTag(tag, 'max');
      }
      revalidated.push(tag);
    }

    return NextResponse.json({
      success: true,
      revalidated,
      mode,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en revalidación:', error);
    return NextResponse.json(
      { error: 'Error interno al revalidar' },
      { status: 500 },
    );
  }
}

// GET para verificar tags disponibles
export async function GET() {
  return NextResponse.json({
    availableTags: VALID_TAGS,
    usage: {
      method: 'POST',
      body: '{ "tags": ["dashboard"] }',
      description: 'Enviar array de tags a invalidar',
    },
    tagGroups: {
      dashboard: [
        'dashboard-stats',
        'dashboard-charts',
        'estadisticas',
        'promedio-horas',
        'asistencia',
        'ausentes',
        'marcaciones-incompletas',
        'dias-sin-actividad',
        'dias-con-marca',
        'empleados-activos',
        'empleados-problematicos',
      ],
      empleados: ['empleados-activos', 'lista-empleados', 'areas'],
      reportes: ['liquidacion', 'meses-disponibles'],
    },
  });
}

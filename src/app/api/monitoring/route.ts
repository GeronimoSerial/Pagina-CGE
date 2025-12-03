import { NextRequest, NextResponse } from 'next/server';
import { connection } from 'next/server';
import {
  getWebhookLogs,
  clearWebhookLogs,
  getWebhookLogStats,
  logWebhookEvent,
} from '@/shared/lib/webhook-logger';

interface WebhookLog {
  timestamp: string;
  event: string;
  slug?: string;
  paths: string[];
  success: boolean;
  error?: string;
}

// Middleware para validar token en desarrollo
async function validateToken(request: NextRequest) {
  // Signal that this route needs dynamic rendering
  await connection();

  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;

    if (!authHeader || !expectedToken) {
      return false;
    }

    const token = authHeader.replace('Bearer ', '');
    return token === expectedToken;
  }
  return true;
}

export async function GET(request: NextRequest) {
  if (!(await validateToken(request))) {
    return NextResponse.json(
      { error: 'Token de autorización requerido' },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');

  const logs = getWebhookLogs(limit);
  const stats = getWebhookLogStats();

  return NextResponse.json({
    status: 'Monitoreo de webhook activo',
    logs,
    count: stats.totalLogs,
    lastUpdate: stats.lastUpdate,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    stats,
  });
}

export async function DELETE(request: NextRequest) {
  if (!(await validateToken(request))) {
    return NextResponse.json(
      { error: 'Token de autorización requerido' },
      { status: 401 },
    );
  }

  const previousCount = clearWebhookLogs();

  return NextResponse.json({
    message: 'Logs limpiados exitosamente',
    previousCount,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  if (!(await validateToken(request))) {
    return NextResponse.json(
      { error: 'Token de autorización requerido' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { event, slug, paths, success, error } = body;

    // Usar la función del logger para registrar el evento
    logWebhookEvent(event, slug, paths || [], success !== false, error);

    const stats = getWebhookLogStats();

    return NextResponse.json({
      message: 'Log registrado exitosamente',
      event,
      slug,
      success: success !== false,
      totalLogs: stats.totalLogs,
    });
  } catch (error) {
    console.error('Error registrando log de webhook:', error);
    return NextResponse.json(
      { error: 'Error registrando log' },
      { status: 500 },
    );
  }
}

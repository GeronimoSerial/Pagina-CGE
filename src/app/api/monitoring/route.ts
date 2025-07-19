import { NextResponse } from 'next/server';
import { loadMonitor } from '@/shared/lib/load-monitor';
import { apiCircuitBreaker } from '@/shared/lib/circuit-breaker';
import {
  newsCache,
  tramitesCache,
  relatedCache,
} from '@/shared/lib/aggressive-cache';

export async function GET() {
  try {
    const metrics = loadMonitor.getMetrics();

    const circuitBreakers = {
      'noticias-api': apiCircuitBreaker.getStatus('noticias-api-1-4-0'),
      'noticias-api-filtered':
        apiCircuitBreaker.getStatus('noticias-api-1-4-1'),
    };

    const cacheStats = {
      noticias: newsCache.getStats(),
      tramites: tramitesCache.getStats(),
      related: relatedCache.getStats(),
    };

    let systemInfo = {};
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      systemInfo = {
        memory: {
          heapUsed: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotal: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
          external: Math.round((memUsage.external / 1024 / 1024) * 100) / 100,
        },
        uptime: process.uptime(),
      };
    }

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        loadTest: {
          summary: loadMonitor.getLoadReport(),
          metrics: metrics,
          circuitBreakers: circuitBreakers,
          caches: cacheStats, 
          system: systemInfo,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in monitoring endpoint:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to retrieve monitoring data',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  }
}

export async function DELETE() {
  try {
    loadMonitor.reset();

    newsCache.clear();
    tramitesCache.clear();
    relatedCache.clear();

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Monitoring metrics and caches reset successfully',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to reset metrics',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    );
  }
}

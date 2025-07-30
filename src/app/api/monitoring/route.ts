import { NextResponse } from 'next/server';
import { loadMonitor } from '@/shared/lib/load-monitor';
import { apiCircuitBreaker } from '@/shared/lib/circuit-breaker';
import {
  newsCache,
  tramitesCache,
  relatedCache,
  newsPagesCache,
  featuredNewsCache,
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
      newsPages: newsPagesCache.getStats(),
      featuredNews: featuredNewsCache.getStats(),
    };

    // Métricas específicas para ISR
    const newsPagesStats = newsPagesCache.getStats();
    const isrMetrics = {
      totalPagesInCache: newsPagesStats.size,
      maxPagesCapacity: newsPagesStats.maxSize,
      avgHitsPerPage: newsPagesStats.entries.length > 0 
        ? newsPagesStats.entries.reduce((sum, entry) => sum + entry.hits, 0) / newsPagesStats.entries.length 
        : 0,
      mostAccessedPages: newsPagesStats.entries
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 5)
        .map(entry => ({ page: entry.key, hits: entry.hits, ageMinutes: Math.round(entry.age / 60000) })),
      cacheStrategy: 'TTL diferenciado: 1h para páginas 1-3, 2h para páginas 4-10',
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
          isr: isrMetrics,
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

    newsPagesCache.clear();
    featuredNewsCache.clear();

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

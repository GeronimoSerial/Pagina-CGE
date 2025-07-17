import { NextResponse } from "next/server";
import { loadMonitor } from '@/shared/lib/load-monitor';
import { apiCircuitBreaker } from '@/shared/lib/circuit-breaker';
import { noticiasCache, tramitesCache, relatedCache } from '@/shared/lib/aggressive-cache';

export async function GET() {
    try {
        const metrics = loadMonitor.getMetrics();
        
        // Estado de circuit breakers
        const circuitBreakers = {
            'noticias-api': apiCircuitBreaker.getStatus('noticias-api-1-4-0'),
            'noticias-api-filtered': apiCircuitBreaker.getStatus('noticias-api-1-4-1'),
        };

        // NUEVO: Estado de caches agresivos
        const cacheStats = {
            noticias: noticiasCache.getStats(),
            tramites: tramitesCache.getStats(),
            related: relatedCache.getStats(),
        };

        // Información del sistema (si está disponible)
        let systemInfo = {};
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const memUsage = process.memoryUsage();
            systemInfo = {
                memory: {
                    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100, // MB
                    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100, // MB
                    external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100, // MB
                },
                uptime: process.uptime(),
            };
        }

        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            loadTest: {
                summary: loadMonitor.getLoadReport(),
                metrics: metrics,
                circuitBreakers: circuitBreakers,
                caches: cacheStats, // Nuevas métricas de cache
                system: systemInfo,
            }
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error in monitoring endpoint:', error);
        return NextResponse.json({
            status: 'error',
            error: 'Failed to retrieve monitoring data',
            timestamp: new Date().toISOString(),
        }, {
            status: 500,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            }
        });
    }
}

// Endpoint para reset de métricas (útil entre pruebas)
export async function DELETE() {
    try {
        loadMonitor.reset();
        
        // NUEVO: Reset también los caches agresivos
        noticiasCache.clear();
        tramitesCache.clear();
        relatedCache.clear();
        
        return NextResponse.json({
            status: 'ok',
            message: 'Monitoring metrics and caches reset successfully',
            timestamp: new Date().toISOString(),
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: 'Failed to reset metrics',
            timestamp: new Date().toISOString(),
        }, {
            status: 500,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            }
        });
    }
}

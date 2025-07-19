 

interface MetricSnapshot {
    timestamp: number;
    activeRequests: number;
    errorRate: number;
    avgResponseTime: number;
    memoryUsage?: number;
}

class LoadTestMonitor {
    private metrics: MetricSnapshot[] = [];
    private activeRequests = 0;
    private requestTimes: number[] = [];
    private errorCount = 0;
    private totalRequests = 0;
    private maxMetrics = 100; // Mantener últimas 100 métricas

    startRequest(): string {
        this.activeRequests++;
        this.totalRequests++;
        const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        return requestId;
    }

    endRequest(requestId: string, responseTime: number, isError: boolean = false) {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        this.requestTimes.push(responseTime);

        if (isError) {
            this.errorCount++;
        }

        // Mantener solo las últimas 50 mediciones de tiempo
        if (this.requestTimes.length > 50) {
            this.requestTimes = this.requestTimes.slice(-50);
        }

        // Capturar snapshot cada 10 requests
        if (this.totalRequests % 10 === 0) {
            this.captureSnapshot();
        }
    }

    private captureSnapshot() {
        const avgResponseTime = this.requestTimes.length > 0
            ? this.requestTimes.reduce((a, b) => a + b, 0) / this.requestTimes.length
            : 0;

        const errorRate = this.totalRequests > 0
            ? (this.errorCount / this.totalRequests) * 100
            : 0;

        const snapshot: MetricSnapshot = {
            timestamp: Date.now(),
            activeRequests: this.activeRequests,
            errorRate: Math.round(errorRate * 100) / 100,
            avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        };

        // Agregar memoria si está disponible (Node.js)
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const memUsage = process.memoryUsage();
            snapshot.memoryUsage = Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100; // MB
        }

        this.metrics.push(snapshot);

        // Mantener solo las últimas métricas
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }
    }

    getMetrics() {
        return {
            current: {
                activeRequests: this.activeRequests,
                totalRequests: this.totalRequests,
                errorCount: this.errorCount,
                errorRate: this.totalRequests > 0 ? (this.errorCount / this.totalRequests) * 100 : 0,
            },
            history: this.metrics.slice(-20), // Últimas 20 métricas
        };
    }

    reset() {
        this.metrics = [];
        this.activeRequests = 0;
        this.requestTimes = [];
        this.errorCount = 0;
        this.totalRequests = 0;
    }

    // Obtener reporte simplificado para logs
    getLoadReport() {
        const recent = this.metrics.slice(-5);
        if (recent.length === 0) return 'No metrics available';

        const avgResponseTime = recent.reduce((sum, m) => sum + m.avgResponseTime, 0) / recent.length;
        const maxActiveRequests = Math.max(...recent.map(m => m.activeRequests));
        const currentErrorRate = this.totalRequests > 0 ? (this.errorCount / this.totalRequests) * 100 : 0;

        return `Load: ${maxActiveRequests} concurrent, ${Math.round(avgResponseTime)}ms avg, ${Math.round(currentErrorRate * 100) / 100}% errors (${this.totalRequests} total)`;
    }
}

export const loadMonitor = new LoadTestMonitor();

// Middleware helper para Next.js
export function withLoadMonitoring<T>(operation: () => Promise<T>): Promise<T> {
    const requestId = loadMonitor.startRequest();
    const startTime = Date.now();

    return operation()
        .then(result => {
            const responseTime = Date.now() - startTime;
            loadMonitor.endRequest(requestId, responseTime, false);
            return result;
        })
        .catch(error => {
            const responseTime = Date.now() - startTime;
            loadMonitor.endRequest(requestId, responseTime, true);
            throw error;
        });
}

/**
 * Circuit Breaker para APIs críticas
 * Previene fallas en cascada durante picos de carga
 */

interface CircuitBreakerState {
    failures: number;
    lastFailureTime: number;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    successCount: number;
}

class CircuitBreaker {
    private states = new Map<string, CircuitBreakerState>();

    constructor(
        private failureThreshold: number = 3,
        private recoveryTimeout: number = 30000,
        private successThreshold: number = 2
    ) { }

    private getState(key: string): CircuitBreakerState {
        if (!this.states.has(key)) {
            this.states.set(key, {
                failures: 0,
                lastFailureTime: 0,
                state: 'CLOSED',
                successCount: 0
            });
        }
        return this.states.get(key)!;
    }

    async execute<T>(
        key: string,
        operation: () => Promise<T>,
        fallback?: () => Promise<T>
    ): Promise<T> {
        const state = this.getState(key);
        const now = Date.now();

        // Si está abierto, verificar si es momento de intentar recovery
        if (state.state === 'OPEN') {
            if (now - state.lastFailureTime < this.recoveryTimeout) {
                if (fallback) {
                    console.warn(`Circuit breaker OPEN for ${key}, using fallback`);
                    return fallback();
                }
                throw new Error(`Circuit breaker OPEN for ${key}`);
            }
            // Intentar half-open
            state.state = 'HALF_OPEN';
            state.successCount = 0;
        }

        try {
            const result = await operation();

            // Operación exitosa
            if (state.state === 'HALF_OPEN') {
                state.successCount++;
                if (state.successCount >= this.successThreshold) {
                    state.state = 'CLOSED';
                    state.failures = 0;
                }
            } else if (state.state === 'CLOSED') {
                state.failures = Math.max(0, state.failures - 1); // Recuperación gradual
            }

            return result;
        } catch (error) {
            state.failures++;
            state.lastFailureTime = now;

            if (state.failures >= this.failureThreshold) {
                state.state = 'OPEN';
                console.error(`Circuit breaker OPENED for ${key} after ${state.failures} failures`);
            } else if (state.state === 'HALF_OPEN') {
                state.state = 'OPEN';
            }

            if (fallback && state.state === 'OPEN') {
                console.warn(`Circuit breaker activated for ${key}, using fallback`);
                return fallback();
            }

            throw error;
        }
    }

    getStatus(key: string) {
        const state = this.getState(key);
        return {
            state: state.state,
            failures: state.failures,
            lastFailureTime: state.lastFailureTime
        };
    }
}

// Instancia global del circuit breaker
export const apiCircuitBreaker = new CircuitBreaker(3, 30000, 2);

// Función helper para APIs con fallback
export async function executeWithCircuitBreaker<T>(
    key: string,
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
): Promise<T> {
    return apiCircuitBreaker.execute(key, operation, fallback);
}

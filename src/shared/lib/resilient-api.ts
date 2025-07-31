import { apiCircuitBreaker } from './circuit-breaker';
import { PERFORMANCE_CONFIG } from './config';

export interface ResilientFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  fallbackData?: any;
  cacheKey?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  status: 'success' | 'fallback' | 'error';
  fromCache?: boolean;
  retryCount?: number;
}

type RateLimitState = {
  isThrottled: boolean;
  lastThrottleTime: number;
  throttleCount: number;
  nextRetryTime: number;
};

class ResilientApi {
  private rateLimitStates = new Map<string, RateLimitState>();
  private staleCache = new Map<string, { data: any; timestamp: number }>();

  // Cache stale data por 24 horas
  private readonly STALE_CACHE_TTL = 24 * 60 * 60 * 1000;

  private getEndpointKey(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  private getRateLimitState(endpointKey: string): RateLimitState {
    if (!this.rateLimitStates.has(endpointKey)) {
      this.rateLimitStates.set(endpointKey, {
        isThrottled: false,
        lastThrottleTime: 0,
        throttleCount: 0,
        nextRetryTime: 0,
      });
    }
    return this.rateLimitStates.get(endpointKey)!;
  }

  private updateRateLimitState(endpointKey: string, isError429: boolean): void {
    const state = this.getRateLimitState(endpointKey);
    const now = Date.now();

    if (isError429) {
      state.isThrottled = true;
      state.lastThrottleTime = now;
      state.throttleCount++;

      // Exponential backoff: 2^attempts * 1000ms, max 30 seconds
      const backoffMs = Math.min(
        Math.pow(2, state.throttleCount) * 1000,
        30000,
      );
      state.nextRetryTime = now + backoffMs;

      console.warn(
        `Rate limited for ${endpointKey}. Next retry in ${backoffMs}ms`,
      );
    } else {
      // Successful request - gradually recover
      if (state.throttleCount > 0) {
        state.throttleCount = Math.max(0, state.throttleCount - 1);
      }

      // Clear throttle if no errors for 5 minutes
      if (now - state.lastThrottleTime > 5 * 60 * 1000) {
        state.isThrottled = false;
        state.throttleCount = 0;
      }
    }
  }

  private shouldWaitForRateLimit(endpointKey: string): number {
    const state = this.getRateLimitState(endpointKey);
    const now = Date.now();

    if (state.isThrottled && now < state.nextRetryTime) {
      return state.nextRetryTime - now;
    }

    return 0;
  }

  private async waitForRateLimit(waitMs: number): Promise<void> {
    if (waitMs > 0) {
      console.log(`Waiting ${waitMs}ms before retry due to rate limiting...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  private saveToStaleCache(cacheKey: string, data: any): void {
    if (cacheKey) {
      this.staleCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }
  }

  private getFromStaleCache(cacheKey: string): any | null {
    if (!cacheKey) return null;

    const cached = this.staleCache.get(cacheKey);
    if (!cached) return null;

    // Check if stale cache is still valid (24 hours)
    if (Date.now() - cached.timestamp > this.STALE_CACHE_TTL) {
      this.staleCache.delete(cacheKey);
      return null;
    }

    return cached.data;
  }

  private async makeRequest(
    url: string,
    options: ResilientFetchOptions,
  ): Promise<Response> {
    const timeout = options.timeout || PERFORMANCE_CONFIG.API_TIMEOUT;
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Cache-Control': `max-age=${PERFORMANCE_CONFIG.CACHE.DYNAMIC_MAX_AGE}`,
          Connection: 'keep-alive',
          ...options.headers,
        },
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      return response;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      throw error;
    }
  }

  async fetch<T = any>(
    url: string,
    options: ResilientFetchOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      retries = 3,
      retryDelay = 1000,
      fallbackData,
      cacheKey,
      ...fetchOptions
    } = options;

    const endpointKey = this.getEndpointKey(url);

    // Check if we need to wait due to rate limiting
    const waitMs = this.shouldWaitForRateLimit(endpointKey);
    if (waitMs > 0) {
      await this.waitForRateLimit(waitMs);
    }

    // Define the main operation
    const operation = async (): Promise<ApiResponse<T>> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await this.makeRequest(url, fetchOptions);

          if (response.status === 429) {
            // Rate limited - update state and potentially retry
            this.updateRateLimitState(endpointKey, true);

            if (attempt < retries) {
              const backoffDelay = retryDelay * Math.pow(2, attempt);
              console.warn(
                `Rate limited (429), retrying in ${backoffDelay}ms (attempt ${attempt + 1}/${retries + 1})`,
              );
              await new Promise((resolve) => setTimeout(resolve, backoffDelay));
              continue;
            }

            // Max retries reached for 429
            throw new Error(
              `Rate limited: HTTP 429 after ${retries + 1} attempts`,
            );
          }

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          // Success - update rate limit state
          this.updateRateLimitState(endpointKey, false);

          const data = await response.json();

          // Save successful response to stale cache
          this.saveToStaleCache(cacheKey || '', data);

          return {
            data,
            status: 'success' as const,
            retryCount: attempt,
          };
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          // For rate limiting errors, update state
          if (
            lastError.message.includes('429') ||
            lastError.message.includes('Rate limited')
          ) {
            this.updateRateLimitState(endpointKey, true);
          }

          // If not the last attempt, wait before retrying
          if (attempt < retries) {
            const backoffDelay = retryDelay * Math.pow(2, attempt);
            console.warn(
              `Request failed, retrying in ${backoffDelay}ms (attempt ${attempt + 1}/${retries + 1}):`,
              lastError.message,
            );
            await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          }
        }
      }

      // All retries failed - throw the last error
      throw lastError || new Error('Unknown fetch error');
    };

    // Define fallback operation
    const fallback = async (): Promise<ApiResponse<T>> => {
      console.warn(`Using fallback for ${url}`);

      // Try stale cache first
      const staleData = this.getFromStaleCache(cacheKey || '');
      if (staleData) {
        console.log('Using stale cache data as fallback');
        return {
          data: staleData,
          status: 'fallback' as const,
          fromCache: true,
        };
      }

      // Use provided fallback data
      if (fallbackData !== undefined) {
        return {
          data: fallbackData,
          status: 'fallback' as const,
        };
      }

      // No fallback available
      throw new Error('No fallback data available');
    };

    // Execute with circuit breaker
    try {
      return await apiCircuitBreaker.execute(
        `resilient-api-${endpointKey}`,
        operation,
        fallback,
      );
    } catch (error) {
      console.error(`Resilient API failed for ${url}:`, error);

      // Last resort: try stale cache even if circuit breaker fails
      const staleData = this.getFromStaleCache(cacheKey || '');
      if (staleData) {
        console.log('Using stale cache as last resort');
        return {
          data: staleData,
          status: 'fallback' as const,
          fromCache: true,
        };
      }

      return {
        data: fallbackData || null,
        status: 'error' as const,
      };
    }
  }

  // Utility method to check if an endpoint is currently throttled
  isThrottled(url: string): boolean {
    const endpointKey = this.getEndpointKey(url);
    const state = this.getRateLimitState(endpointKey);
    return state.isThrottled && Date.now() < state.nextRetryTime;
  }

  // Utility method to get wait time for an endpoint
  getWaitTime(url: string): number {
    const endpointKey = this.getEndpointKey(url);
    return this.shouldWaitForRateLimit(endpointKey);
  }

  // Clear rate limit state for an endpoint (useful for testing)
  clearRateLimit(url: string): void {
    const endpointKey = this.getEndpointKey(url);
    this.rateLimitStates.delete(endpointKey);
  }

  // Get circuit breaker status for debugging
  getCircuitBreakerStatus(url: string) {
    const endpointKey = this.getEndpointKey(url);
    return apiCircuitBreaker.getStatus(`resilient-api-${endpointKey}`);
  }
}

// Export singleton instance
export const resilientApi = new ResilientApi();

// Convenience function that matches the existing fetch API
export const resilientFetch = <T = any>(
  url: string,
  options?: ResilientFetchOptions,
): Promise<ApiResponse<T>> => {
  return resilientApi.fetch<T>(url, options);
};

// Export types for external use
export type { RateLimitState };

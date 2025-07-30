'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { resilientApi } from '@/shared/lib/resilient-api';

export type LoadingState =
  | 'initial' // Carga normal
  | 'loading' // Cargando datos
  | 'retrying' // Reintentando tras error
  | 'throttled' // Modo degradado por rate limiting
  | 'success' // Carga exitosa
  | 'error' // Error sin posibilidad de recovery
  | 'offline'; // Fallback completo activo

export interface ResilientLoadingState {
  state: LoadingState;
  message: string;
  progress?: number;
  retryCount: number;
  isFromCache: boolean;
  canRetry: boolean;
  estimatedWaitTime?: number;
}

export interface ResilientLoadingHookOptions {
  maxRetries?: number;
  enableAutoRetry?: boolean;
  persistState?: boolean;
  storageKey?: string;
  onStateChange?: (state: ResilientLoadingState) => void;
}

const DEFAULT_MESSAGES = {
  initial: 'Inicializando...',
  loading: 'Cargando noticias...',
  retrying: 'Reintentando conexión...',
  throttled: 'Se están procesando muchas solicitudes, por favor espera...',
  success: 'Datos cargados correctamente',
  error: 'Error al cargar los datos',
  offline: 'Usando datos guardados localmente',
};

const STORAGE_PREFIX = 'resilient-loading-';

export function useResilientLoading(options: ResilientLoadingHookOptions = {}) {
  const {
    maxRetries = 3,
    enableAutoRetry = true,
    persistState = true,
    storageKey = 'default',
    onStateChange,
  } = options;

  const [loadingState, setLoadingState] = useState<ResilientLoadingState>({
    state: 'initial',
    message: DEFAULT_MESSAGES.initial,
    retryCount: 0,
    isFromCache: false,
    canRetry: true,
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fullStorageKey = `${STORAGE_PREFIX}${storageKey}`;

  // Load persisted state on mount
  useEffect(() => {
    if (!persistState || typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(fullStorageKey);
      if (stored) {
        const parsedState = JSON.parse(stored);
        // Only restore certain states, not loading/retrying states
        if (['throttled', 'offline'].includes(parsedState.state)) {
          setLoadingState((prev) => ({
            ...prev,
            ...parsedState,
            // Reset loading-specific states
            state: parsedState.state === 'throttled' ? 'throttled' : 'initial',
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted loading state:', error);
    }
  }, [fullStorageKey, persistState]);

  // Persist state changes
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(fullStorageKey, JSON.stringify(loadingState));
      } catch (error) {
        console.warn('Failed to persist loading state:', error);
      }
    }

    // Notify state change
    onStateChange?.(loadingState);
  }, [loadingState, fullStorageKey, persistState, onStateChange]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (autoRetryTimeoutRef.current) {
        clearTimeout(autoRetryTimeoutRef.current);
      }
    };
  }, []);

  const updateState = useCallback(
    (newState: Partial<ResilientLoadingState>, customMessage?: string) => {
      setLoadingState((prev) => {
        const state = newState.state || prev.state;
        const message =
          customMessage ||
          newState.message ||
          DEFAULT_MESSAGES[state] ||
          prev.message;

        return {
          ...prev,
          ...newState,
          state,
          message,
        };
      });
    },
    [],
  );

  const setLoading = useCallback(
    (message?: string) => {
      updateState({ state: 'loading' }, message);
    },
    [updateState],
  );

  const setSuccess = useCallback(
    (isFromCache = false, message?: string) => {
      updateState(
        {
          state: 'success',
          isFromCache,
          retryCount: 0,
          canRetry: true,
        },
        message,
      );
    },
    [updateState],
  );

  const setError = useCallback(
    (error: Error | string, canRetry = true, message?: string) => {
      const errorMessage = error instanceof Error ? error.message : error;
      const finalMessage = message || `Error: ${errorMessage}`;

      updateState(
        {
          state: 'error',
          canRetry,
        },
        finalMessage,
      );
    },
    [updateState],
  );

  const setThrottled = useCallback(
    (waitTimeMs = 0) => {
      const estimatedWaitTime = waitTimeMs;
      const waitSeconds = Math.ceil(estimatedWaitTime / 1000);
      const message =
        waitTimeMs > 0
          ? `Se están procesando muchas solicitudes. Reintentando en ${waitSeconds} segundos...`
          : DEFAULT_MESSAGES.throttled;

      updateState(
        {
          state: 'throttled',
          estimatedWaitTime,
        },
        message,
      );

      // Auto-retry after wait time
      if (enableAutoRetry && waitTimeMs > 0) {
        if (autoRetryTimeoutRef.current) {
          clearTimeout(autoRetryTimeoutRef.current);
        }

        autoRetryTimeoutRef.current = setTimeout(() => {
          updateState({
            state: 'retrying',
            retryCount: loadingState.retryCount + 1,
          });
        }, waitTimeMs);
      }
    },
    [updateState, enableAutoRetry, loadingState.retryCount],
  );

  const setRetrying = useCallback(
    (retryCount: number, message?: string) => {
      const retryMessage =
        message || `Reintentando... (${retryCount}/${maxRetries})`;

      updateState(
        {
          state: 'retrying',
          retryCount,
          canRetry: retryCount < maxRetries,
        },
        retryMessage,
      );
    },
    [updateState, maxRetries],
  );

  const setOffline = useCallback(
    (message?: string) => {
      updateState(
        {
          state: 'offline',
          isFromCache: true,
          canRetry: true,
        },
        message,
      );
    },
    [updateState],
  );

  const manualRetry = useCallback(() => {
    if (!loadingState.canRetry) return;

    updateState({
      state: 'retrying',
      retryCount: loadingState.retryCount + 1,
      canRetry: loadingState.retryCount < maxRetries - 1,
    });
  }, [loadingState.canRetry, loadingState.retryCount, maxRetries, updateState]);

  const reset = useCallback(() => {
    // Clear any pending timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (autoRetryTimeoutRef.current) {
      clearTimeout(autoRetryTimeoutRef.current);
      autoRetryTimeoutRef.current = null;
    }

    updateState({
      state: 'initial',
      retryCount: 0,
      isFromCache: false,
      canRetry: true,
      estimatedWaitTime: undefined,
    });

    // Clear persisted state
    if (persistState && typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(fullStorageKey);
      } catch (error) {
        console.warn('Failed to clear persisted state:', error);
      }
    }
  }, [updateState, persistState, fullStorageKey]);

  // Helper to handle API responses
  const handleApiResponse = useCallback(
    <T>(response: any, url?: string) => {
      if (!response) {
        setError('No response received');
        return null;
      }

      switch (response.status) {
        case 'success':
          setSuccess(false, 'Datos actualizados');
          return response.data;

        case 'fallback':
          if (response.fromCache) {
            setOffline('Mostrando datos guardados');
          } else {
            setSuccess(true, 'Usando datos de respaldo');
          }
          return response.data;

        case 'error':
        default:
          // Check if the endpoint is throttled
          if (url && resilientApi.isThrottled(url)) {
            const waitTime = resilientApi.getWaitTime(url);
            setThrottled(waitTime);
          } else {
            setError('Error al cargar los datos', true);
          }
          return response.data || null;
      }
    },
    [setSuccess, setOffline, setError, setThrottled],
  );

  // Helper to check if should show loading spinner
  const isLoading =
    loadingState.state === 'loading' || loadingState.state === 'retrying';

  // Helper to check if in a recoverable error state
  const canRecover = ['retrying', 'throttled', 'offline'].includes(
    loadingState.state,
  );

  // Helper to check if showing fallback data
  const isFallback =
    loadingState.state === 'offline' || loadingState.isFromCache;

  return {
    // State
    loadingState,
    isLoading,
    canRecover,
    isFallback,

    // Actions
    setLoading,
    setSuccess,
    setError,
    setThrottled,
    setRetrying,
    setOffline,
    manualRetry,
    reset,
    handleApiResponse,

    // Utilities
    updateState,
  };
}

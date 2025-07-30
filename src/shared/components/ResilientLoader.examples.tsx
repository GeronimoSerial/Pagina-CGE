// Ejemplo de integración opcional del ResilientLoader en DynamicNewsClient
// Este archivo muestra cómo se podría usar el componente ResilientLoader
// para simplificar aún más el código de DynamicNewsClient

'use client';

import {
  ResilientLoader,
  LoadingPresets,
} from '@/shared/components/ResilientLoader';
import { useResilientLoading } from '@/shared/hooks/use-resilient-loading';

// Ejemplo de uso simplificado en DynamicNewsClient
export function SimplifiedLoadingExample() {
  const { loadingState, isLoading, canRecover, isFallback, manualRetry } =
    useResilientLoading({
      storageKey: 'example-news',
      enableAutoRetry: true,
      maxRetries: 3,
    });

  // En lugar de múltiples condiciones if/else, usamos un solo componente
  if (
    isLoading ||
    loadingState.state === 'error' ||
    loadingState.state === 'throttled'
  ) {
    return (
      <ResilientLoader
        state={loadingState.state}
        message={loadingState.message}
        retryCount={loadingState.retryCount}
        maxRetries={3}
        estimatedWaitTime={loadingState.estimatedWaitTime}
        onRetry={loadingState.canRetry ? manualRetry : undefined}
        showProgress={true}
        size="md"
        variant="default"
      />
    );
  }

  // O usando presets para casos comunes
  if (loadingState.state === 'loading') {
    return (
      <ResilientLoader
        {...LoadingPresets.newsLoading}
        retryCount={loadingState.retryCount}
        onRetry={manualRetry}
      />
    );
  }

  // Resto del componente...
  return <div>Contenido normal</div>;
}

// Ejemplo de loading inline para estados de actualización
export function InlineLoadingExample() {
  const { loadingState, manualRetry } = useResilientLoading();

  return (
    <div className="flex items-center justify-between">
      <div>Noticias encontradas: 25</div>

      {/* Loading inline para actualizaciones */}
      {loadingState.state === 'retrying' && (
        <ResilientLoader
          {...LoadingPresets.inlineLoading}
          message="Actualizando..."
        />
      )}

      {/* Indicador de throttling inline */}
      {loadingState.state === 'throttled' && (
        <ResilientLoader
          state="throttled"
          message="Procesando solicitudes..."
          size="sm"
          variant="inline"
        />
      )}
    </div>
  );
}

// Ejemplo de overlay para operaciones críticas
export function OverlayLoadingExample() {
  const { loadingState, manualRetry } = useResilientLoading();

  if (loadingState.state === 'loading' && loadingState.retryCount > 2) {
    return (
      <ResilientLoader
        state={loadingState.state}
        message="Conectando con el servidor..."
        retryCount={loadingState.retryCount}
        maxRetries={3}
        size="lg"
        variant="overlay"
        onRetry={manualRetry}
      />
    );
  }

  return null;
}

'use client';

import { LoadingState } from '@/shared/hooks/use-resilient-loading';

interface ResilientLoaderProps {
  state: LoadingState;
  message: string;
  retryCount?: number;
  maxRetries?: number;
  estimatedWaitTime?: number;
  onRetry?: () => void;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'inline' | 'overlay';
}

const LoaderSizes = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const LoaderSpinners: Record<LoadingState, string> = {
  initial: 'border-b-2 border-[#3D8B37]',
  loading: 'border-b-2 border-[#3D8B37]',
  retrying: 'border-b-2 border-blue-500',
  throttled: 'border-b-2 border-amber-500',
  success: 'border-b-2 border-green-500',
  error: 'border-b-2 border-red-500',
  offline: 'border-b-2 border-gray-500',
};

export function ResilientLoader({
  state,
  message,
  retryCount = 0,
  maxRetries = 3,
  estimatedWaitTime = 0,
  onRetry,
  showProgress = true,
  size = 'md',
  variant = 'default',
}: ResilientLoaderProps) {
  const formatWaitTime = (timeMs: number): string => {
    const seconds = Math.ceil(timeMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressPercentage = (): number => {
    if (maxRetries === 0) return 0;
    return Math.min((retryCount / maxRetries) * 100, 100);
  };

  const renderSpinner = () => {
    const spinnerClass = LoaderSpinners[state];
    const sizeClass = LoaderSizes[size];

    return (
      <div
        className={`animate-spin rounded-full ${sizeClass} ${spinnerClass}`}
      />
    );
  };

  const renderMessage = () => (
    <div className="text-center space-y-2">
      <div
        className={`text-gray-700 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}
      >
        {message}
      </div>

      {/* Wait time indicator */}
      {estimatedWaitTime > 0 && (
        <div className="text-xs text-gray-500">
          Tiempo estimado: {formatWaitTime(estimatedWaitTime)}
        </div>
      )}

      {/* Retry progress */}
      {showProgress && retryCount > 0 && maxRetries > 0 && (
        <div className="text-xs text-gray-500">
          Intento {retryCount} de {maxRetries}
        </div>
      )}
    </div>
  );

  const renderProgressBar = () => {
    if (!showProgress || retryCount === 0 || maxRetries === 0) return null;

    const percentage = getProgressPercentage();

    return (
      <div className="w-full max-w-xs mx-auto">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-[#3D8B37] h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const renderRetryButton = () => {
    if (!onRetry || !['error', 'offline'].includes(state)) return null;

    return (
      <button
        onClick={onRetry}
        className={`
          px-4 py-2 bg-[#3D8B37] text-white rounded-md hover:bg-[#2d6b29] 
          transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D8B37] focus:ring-offset-2
          ${size === 'sm' ? 'text-sm px-3 py-1' : size === 'lg' ? 'text-lg px-6 py-3' : ''}
        `}
      >
        {state === 'offline' ? 'Reconectar' : 'Reintentar'}
      </button>
    );
  };

  const renderStateIcon = () => {
    const iconClass =
      size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

    switch (state) {
      case 'throttled':
        return (
          <div
            className={`${iconClass} text-amber-500 flex items-center justify-center`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
            </svg>
          </div>
        );
      case 'offline':
        return (
          <div
            className={`${iconClass} text-gray-500 flex items-center justify-center`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M15.5,17L20.5,12L19,10.5L15.5,14L10.5,9L9,10.5L15.5,17Z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div
            className={`${iconClass} text-red-500 flex items-center justify-center`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Variant handling
  const containerClasses = {
    default: 'flex justify-center items-center py-12',
    inline: 'flex items-center gap-3 py-2',
    overlay:
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
  };

  const contentClasses = {
    default: 'flex flex-col items-center space-y-4 max-w-md mx-auto',
    inline: 'flex items-center space-x-3',
    overlay:
      'bg-white rounded-lg p-8 max-w-md mx-4 flex flex-col items-center space-y-4',
  };

  return (
    <div className={containerClasses[variant]}>
      <div className={contentClasses[variant]}>
        {/* State icon for non-loading states */}
        {!['loading', 'initial', 'retrying'].includes(state) &&
          variant !== 'inline' &&
          renderStateIcon()}

        {/* Spinner for loading states */}
        {['loading', 'initial', 'retrying'].includes(state) && renderSpinner()}

        {/* Message */}
        {variant === 'inline' ? (
          <div
            className={`text-gray-700 ${size === 'sm' ? 'text-sm' : 'text-base'}`}
          >
            {message}
          </div>
        ) : (
          renderMessage()
        )}

        {/* Progress bar */}
        {variant !== 'inline' && renderProgressBar()}

        {/* Retry button */}
        {variant !== 'inline' && renderRetryButton()}
      </div>
    </div>
  );
}

// Preset configurations for common use cases
export const LoadingPresets = {
  newsLoading: {
    state: 'loading' as LoadingState,
    message: 'Cargando noticias...',
    size: 'md' as const,
    variant: 'default' as const,
  },

  newsThrottled: {
    state: 'throttled' as LoadingState,
    message: 'Se están procesando muchas solicitudes, por favor espera...',
    size: 'md' as const,
    variant: 'default' as const,
  },

  newsError: {
    state: 'error' as LoadingState,
    message: 'Error al cargar las noticias',
    size: 'md' as const,
    variant: 'default' as const,
  },

  newsOffline: {
    state: 'offline' as LoadingState,
    message: 'Mostrando noticias guardadas localmente',
    size: 'md' as const,
    variant: 'default' as const,
  },

  inlineLoading: {
    state: 'loading' as LoadingState,
    message: 'Actualizando...',
    size: 'sm' as const,
    variant: 'inline' as const,
  },
};

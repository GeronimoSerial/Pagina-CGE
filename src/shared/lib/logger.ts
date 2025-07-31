/**
 * Centralized logging system for the application
 * Provides structured logging with different levels and contexts
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogContext = 'api' | 'cache' | 'component' | 'hook' | 'service' | 'webhook';

interface LogEntry {
  level: LogLevel;
  context: LogContext;
  message: string;
  details?: any;
  timestamp: string;
  environment: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatLog(entry: LogEntry): string {
    const { level, context, message, timestamp } = entry;
    return `[${timestamp}] [${level.toUpperCase()}] [${context.toUpperCase()}] ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    context: LogContext,
    message: string,
    details?: any
  ): LogEntry {
    return {
      level,
      context,
      message,
      details,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
    };
  }

  private log(entry: LogEntry): void {
    const formattedMessage = this.formatLog(entry);

    // Console logging with appropriate method
    switch (entry.level) {
      case 'error':
        console.error(formattedMessage, entry.details || '');
        break;
      case 'warn':
        console.warn(formattedMessage, entry.details || '');
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage, entry.details || '');
        }
        break;
      default:
        console.log(formattedMessage, entry.details || '');
    }

    // In production, you could add external logging here (Sentry, LogRocket, etc.)
    if (this.isProduction && entry.level === 'error') {
      // Example: Sentry.captureException(entry);
      // Example: analytics.track('error', entry);
    }
  }

  // Public API methods
  info(context: LogContext, message: string, details?: any): void {
    this.log(this.createLogEntry('info', context, message, details));
  }

  warn(context: LogContext, message: string, details?: any): void {
    this.log(this.createLogEntry('warn', context, message, details));
  }

  error(context: LogContext, message: string, details?: any): void {
    this.log(this.createLogEntry('error', context, message, details));
  }

  debug(context: LogContext, message: string, details?: any): void {
    this.log(this.createLogEntry('debug', context, message, details));
  }

  // Specialized logging methods for common use cases
  cache = {
    hit: (key: string, source: string) => {
      this.debug('cache', `Cache hit: ${source}:${key}`);
    },
    miss: (key: string, source: string) => {
      this.debug('cache', `Cache miss: ${source}:${key}`);
    },
    clear: (source: string, reason: string) => {
      this.info('cache', `Cache cleared: ${source}`, { reason });
    },
    error: (key: string, source: string, error: Error) => {
      this.error('cache', `Cache error for ${source}:${key}`, { error: error.message });
    },
  };

  api = {
    request: (url: string, method: string = 'GET', duration?: number) => {
      const message = `API ${method} ${url}${duration ? ` - ${duration}ms` : ''}`;
      this.debug('api', message);
    },
    success: (url: string, method: string = 'GET', duration: number) => {
      this.info('api', `API ${method} ${url} - Success in ${duration}ms`);
    },
    error: (url: string, method: string = 'GET', error: Error, duration?: number) => {
      const message = `API ${method} ${url} failed${duration ? ` after ${duration}ms` : ''}`;
      this.error('api', message, { error: error.message, stack: error.stack });
    },
    timeout: (url: string, method: string = 'GET', timeoutMs: number) => {
      this.warn('api', `API ${method} ${url} timed out after ${timeoutMs}ms`);
    },
  };

  component = {
    mount: (componentName: string) => {
      this.debug('component', `${componentName} mounted`);
    },
    unmount: (componentName: string) => {
      this.debug('component', `${componentName} unmounted`);
    },
    error: (componentName: string, error: Error, context?: any) => {
      this.error('component', `${componentName} error`, { error: error.message, context });
    },
    render: (componentName: string, props?: any) => {
      this.debug('component', `${componentName} rendered`, { props });
    },
  };

  webhook = {
    received: (type: string, payload: any) => {
      this.info('webhook', `Webhook received: ${type}`, { payload });
    },
    processed: (type: string, duration: number) => {
      this.info('webhook', `Webhook processed: ${type} in ${duration}ms`);
    },
    error: (type: string, error: Error) => {
      this.error('webhook', `Webhook error: ${type}`, { error: error.message });
    },
  };
}

// Export singleton instance
export const logger = new Logger();

// Export types for external use
export type { LogLevel, LogContext, LogEntry };

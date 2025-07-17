module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/Pagina-CGE',
      instances: 1, // Solo 1 instancia para VPS con recursos limitados
      exec_mode: 'fork', // fork mode es más eficiente para una sola instancia
      
      // Optimizaciones para VPS con recursos limitados
      node_args: [
        '--max-old-space-size=512', // Límite de memoria para Next.js (512MB)
        '--optimize-for-size',       // Optimizar para uso mínimo de memoria
        '--gc-interval=100',         // Garbage collection más frecuente
      ],
      
      // Variables de entorno optimizadas para producción
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: 1, // Desactivar telemetría para ahorrar recursos
      },
      
      // Configuración de logs optimizada
      log_file: '/root/.pm2/logs/frontend-combined.log',
      out_file: '/root/.pm2/logs/frontend-out.log',
      error_file: '/root/.pm2/logs/frontend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Configuración de reinicio automático
      autorestart: true,
      watch: false, // No watch en producción para ahorrar recursos
      max_memory_restart: '400M', // Reiniciar si usa más de 400MB
      
      // Configuración de arranque suave
      min_uptime: '10s', // Tiempo mínimo antes de considerar un restart exitoso
      max_restarts: 3, // Máximo 3 restarts en el interval
      restart_delay: 4000, // 4 segundos entre restarts
      
      // Kill timeout para reinicio suave
      kill_timeout: 5000,
      
      // Monitoreo de recursos
      monitoring: true,
    },
    {
      name: 'directus',
      script: 'npm',
      args: 'start',
      cwd: '/home/Proyecto/backend-directus',
      instances: 1, // Solo 1 instancia para VPS
      exec_mode: 'fork',
      
      // Optimizaciones para Directus
      node_args: [
        '--max-old-space-size=768', // Más memoria para Directus (768MB)
        '--optimize-for-size',
        '--gc-interval=100',
      ],
      
      // Variables de entorno para Directus
      env: {
        NODE_ENV: 'production',
        PORT: 8055,
        HOST: '0.0.0.0',
        // Configuraciones específicas de Directus
        DB_CLIENT: 'sqlite3',
        DB_FILENAME: './data.db',
        KEY: 'replace-with-random-uuid',
        SECRET: 'replace-with-random-string',
        // Optimizaciones de performance
        CACHE_ENABLED: 'true',
        CACHE_TTL: '30m',
        CACHE_AUTO_PURGE: 'true',
        // Rate limiting
        RATE_LIMITER_ENABLED: 'true',
        RATE_LIMITER_POINTS: 50,
        RATE_LIMITER_DURATION: 1,
        // File upload limits
        FILES_MAX_UPLOAD_SIZE: '10MB',
        // Logging optimizado
        LOG_LEVEL: 'warn', // Solo warnings y errores
      },
      
      // Configuración de logs
      log_file: '/root/.pm2/logs/directus-combined.log',
      out_file: '/root/.pm2/logs/directus-out.log',
      error_file: '/root/.pm2/logs/directus-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Configuración de reinicio automático
      autorestart: true,
      watch: false,
      max_memory_restart: '600M', // Más memoria para Directus
      
      // Configuración de arranque suave
      min_uptime: '15s', // Más tiempo para Directus
      max_restarts: 3,
      restart_delay: 5000, // 5 segundos entre restarts
      
      // Kill timeout
      kill_timeout: 10000, // Más tiempo para cerrar Directus
      
      // Monitoreo de recursos
      monitoring: true,
      
      // Configuración específica para bases de datos
      ignore_watch: ['*.db', '*.sqlite', '*.sqlite3', 'uploads/*'],
    }
  ]
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://devcms.geroserial.com/api';
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'https://devcms.geroserial.com';

export const PERFORMANCE_CONFIG = {
  API_TIMEOUT: 5000,
  CRITICAL_API_TIMEOUT: 3000,

  CACHE: {
    STATIC_MAX_AGE: 300,
    STATIC_STALE_WHILE_REVALIDATE: 600,

    DYNAMIC_MAX_AGE: 30,
    DYNAMIC_STALE_WHILE_REVALIDATE: 60,

    ERROR_CACHE: 15,
  },

  CIRCUIT_BREAKER: {
    FAILURE_THRESHOLD: 3,
    RECOVERY_TIMEOUT: 30000,
    SUCCESS_THRESHOLD: 2,
  },

  RATE_LIMITS: {
    PER_IP_PER_MINUTE: 15,
    BURST_ALLOWANCE: 5,
  },
};

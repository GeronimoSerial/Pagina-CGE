/**
 * SQL Sanitization utilities for safe query execution
 * Prevents SQL injection and heavy query attacks
 */

// Dangerous SQL patterns that could indicate injection attempts
const DANGEROUS_PATTERNS = [
  /;\s*(?:insert|update|delete|drop|alter|truncate|create|grant|revoke)/i,
  /\/\*[\s\S]*?\*\//, // Block comments
  /--.*$/m, // Line comments
  /\bexec\s*\(/i,
  /\bexecute\s+/i,
  /\bxp_/i,
  /\bsp_/i,
  /\binto\s+outfile/i,
  /\binto\s+dumpfile/i,
  /\bload_file\s*\(/i,
  /\bunion\s+all\s+select/i,
  /\bsleep\s*\(/i,
  /\bbenchmark\s*\(/i,
  /\bpg_sleep\s*\(/i,
];

// Patterns that indicate potentially heavy/expensive queries
const HEAVY_QUERY_PATTERNS = [
  /cross\s+join/i,
  /\bcount\s*\(\s*\*\s*\)\s*(?!.*\bwhere\b)/i, // COUNT(*) without WHERE
  /select\s+\*\s+from\s+\w+\s*(?!.*\b(?:where|limit)\b)/i, // SELECT * without WHERE/LIMIT
];

export interface SanitizeResult {
  safe: boolean;
  error?: string;
}

/**
 * Validates and sanitizes a SQL query for safe execution
 * @param query - The SQL query to validate
 * @returns Object indicating if query is safe and any error message
 */
export function sanitizeSQL(query: string): SanitizeResult {
  const trimmed = query.trim().toLowerCase();

  // Must start with SELECT
  if (!trimmed.startsWith('select')) {
    return { safe: false, error: 'Solo se permiten consultas SELECT.' };
  }

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(query)) {
      return {
        safe: false,
        error: 'Consulta contiene patrones no permitidos.',
      };
    }
  }

  // Check for heavy queries without LIMIT
  for (const pattern of HEAVY_QUERY_PATTERNS) {
    if (pattern.test(query) && !trimmed.includes('limit')) {
      return {
        safe: false,
        error: 'Consulta potencialmente pesada. Agregá LIMIT o filtros WHERE.',
      };
    }
  }

  // Ensure LIMIT exists (max 100)
  if (!trimmed.includes('limit')) {
    return {
      safe: false,
      error: 'Debés incluir LIMIT en la consulta (máx 100).',
    };
  }

  // Check LIMIT value doesn't exceed maximum
  const limitMatch = trimmed.match(/limit\s+(\d+)/i);
  if (limitMatch && parseInt(limitMatch[1]) > 100) {
    return { safe: false, error: 'LIMIT no puede ser mayor a 100.' };
  }

  return { safe: true };
}

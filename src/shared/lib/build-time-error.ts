import { FAIL_BUILD_ON_API_ERROR } from './config';

/**
 * Handles errors during build-time static generation (e.g., in generateStaticParams()).
 * This is specifically for BUILD TIME, not runtime API errors.
 * 
 * Behavior:
 * - Production (FAIL_BUILD_ON_API_ERROR=true): Throws error → Build fails → Deployment blocked
 * - Development (FAIL_BUILD_ON_API_ERROR=false): Logs warning → Returns fallback → Build continues
 * 
 * @example
 * ```typescript
 * export async function getAllNews() {
 *   try {
 *     const response = await fetch('/api/news');
 *     return await response.json();
 *   } catch (error) {
 *     return handleBuildTimeError(error, 'fetch all news items', []);
 *   }
 * }
 * ```
 * 
 * @param error - The caught error from the API call
 * @param context - Verb phrase describing the action that failed (e.g., "fetch news slugs", "fetch tramites navigation"). Used to complete "Unable to {context}" in error messages.
 * @param fallback - Value to return in development mode when build continues
 * @throws {Error} In production mode to fail the build with a descriptive message
 * @returns The fallback value in development mode
 */
export function handleBuildTimeError<T>(
  error: unknown,
  context: string,
  fallback: T,
): T {
  const errorMessage =
    error instanceof Error ? error.message : 'Unknown error';

  console.error(`Error during ${context}:`, error);

  if (FAIL_BUILD_ON_API_ERROR) {
    throw new Error(
      `Build failed: Unable to ${context} - ${errorMessage}. ` +
        `This prevents deploying a site with incomplete content. ` +
        `Please ensure the API is available during build.`,
    );
  }

  console.warn(
    `⚠️ Continuing build with fallback value for ${context}. ` +
      `Set FAIL_BUILD_ON_API_ERROR=true to fail the build instead.`,
  );

  return fallback;
}

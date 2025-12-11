import { FAIL_BUILD_ON_API_ERROR } from './config';

/**
 * Handles errors during build-time data fetching.
 * In production (or when FAIL_BUILD_ON_API_ERROR=true), throws an error to fail the build.
 * In development (or when FAIL_BUILD_ON_API_ERROR=false), logs error and returns fallback.
 * 
 * @param error - The caught error
 * @param context - Description of what failed (e.g., "fetch news slugs")
 * @param fallback - Value to return in development mode
 * @throws Error in production mode to fail the build
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

# Deployment Guide

## Build-Time Error Handling

### Problem
During the build process, Next.js generates static pages using `generateStaticParams()`. If the Directus API is unavailable or returns errors (like HTTP 502) during this phase, the old behavior would:
- Catch the errors and return empty arrays
- Continue the build successfully  
- Deploy pages with no content or missing dynamic routes
- Result in a broken production site

### Solution
The build now fails explicitly when critical API calls fail during static page generation, preventing deployment of incomplete sites.

## Configuration

### Environment Variable: `FAIL_BUILD_ON_API_ERROR`

Controls build behavior when API calls fail during static generation:

| Value | Behavior | Use Case |
|-------|----------|----------|
| `true` | Build fails on API errors | **Production** (recommended) |
| `false` | Build continues with empty data | Local development |
| _not set_ | Defaults to `true` in production (`NODE_ENV=production`) | Auto-detection |

### Setting in GitHub Actions

In `.github/workflows/webpack.yml`:

```yaml
- name: Build Next.js app
  env:
    NEXT_PUBLIC_API_URL: ${{ vars.NEXT_PUBLIC_API_URL }}
    NEXT_PUBLIC_STRAPI_URL: ${{ vars.NEXT_PUBLIC_STRAPI_URL }}
    FAIL_BUILD_ON_API_ERROR: 'true'  # ← Forces build to fail on API errors
  run: npm run build
```

### Local Development

For local development where the backend might not be available:

```bash
# Build will continue with empty data if API fails
FAIL_BUILD_ON_API_ERROR=false npm run build

# Or for development server (API failures handled gracefully)
npm run dev
```

## How It Works

### Affected Functions

The following functions will throw errors during build if `FAIL_BUILD_ON_API_ERROR=true`:

1. **`getAllNews()`** - Fetches all news slugs for static page generation
2. **`getAllProcedureSlugs()`** - Fetches all tramites slugs
3. **`getProceduresNavigation()`** - Fetches tramites navigation menu

### Error Flow

```
Build Process
    ↓
generateStaticParams() called
    ↓
API call to Directus
    ↓
    ├─ Success: Continue with data
    │
    └─ Error (HTTP 502, timeout, etc.)
        ↓
        ├─ FAIL_BUILD_ON_API_ERROR=true
        │   ↓
        │   Throw error → Build fails
        │   ↓
        │   Deployment blocked ✓
        │
        └─ FAIL_BUILD_ON_API_ERROR=false
            ↓
            Return empty array
            ↓
            Build continues (0 pages generated)
```

## Troubleshooting

### Build Fails with "Failed to fetch news slugs"

**Cause**: Directus API is unavailable or returning errors during the build.

**Solutions**:
1. **Check Directus status**: Verify the backend is running and accessible
2. **Check network connectivity**: Ensure GitHub Actions can reach Directus
3. **Check Directus logs**: Look for server errors or database issues
4. **Verify environment variables**: Ensure `NEXT_PUBLIC_DIRECTUS_URL` is correct

### Build Succeeds but No Content Pages

**Cause**: `FAIL_BUILD_ON_API_ERROR` is set to `false` in production, or API failures are happening in non-critical functions.

**Solutions**:
1. Set `FAIL_BUILD_ON_API_ERROR=true` in the workflow
2. Check build logs for API error messages
3. Verify the API is available during the build

### Development Build Takes Too Long

**Cause**: Build is retrying API calls that fail in local development.

**Solution**:
```bash
# Disable API failure checks for local dev
FAIL_BUILD_ON_API_ERROR=false npm run build
```

## Best Practices

### ✅ Do

- **Always use `FAIL_BUILD_ON_API_ERROR=true` in production** to prevent deploying incomplete sites
- **Monitor build failures** and investigate API issues promptly
- **Test builds locally** with both `true` and `false` settings
- **Keep Directus available** during scheduled deployments

### ❌ Don't

- **Don't disable in production** unless you understand the consequences
- **Don't ignore build failures** - they indicate real problems
- **Don't deploy manually** when automated builds fail
- **Don't skip API health checks** before deployments

## Monitoring

### Check Build Status

GitHub Actions will clearly show when a build fails due to API errors:

```
Error: Failed to fetch news slugs for static generation: HTTP 502
    at getAllNews (src/features/noticias/services/news.ts:25:13)
```

### Expected Logs

**Successful build:**
```
✓ Generating static pages (29/29)
✓ Finalizing page optimization
```

**Failed build (API down):**
```
Error in getAllNews: Error: HTTP 502
Error: Failed to fetch news slugs for static generation: HTTP 502
Build failed
```

## Related Files

- `src/shared/lib/config.ts` - Configuration constants
- `src/features/noticias/services/news.ts` - News data fetching
- `src/features/tramites/services/docs-data.ts` - Tramites data fetching
- `.github/workflows/webpack.yml` - CI/CD pipeline

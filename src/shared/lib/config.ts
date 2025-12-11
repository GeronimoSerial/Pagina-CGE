export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://consejo.mec.gob.ar';
export const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://consejo.geroserial.com';

export const FALLBACK_IMAGE_NEWS = '/public/og-noticias.webp';

export const MAIL_CONTACT =
  'mailto:cge@mec.gob.ar?subject=Consulta&body=Hola, me gustaría realizar una consulta...';
export const WHATSAPP_CONTACT =
  'https://wa.me/5403794424264?text=Hola%2C%20me%20comunico%20con%20el%20Consejo%20para%20realizar%20una%20consulta.%20Agradecer%C3%ADa%20su%20orientaci%C3%B3n.%20Muchas%20gracias.';

// Build-time configuration
// When true, build will fail if critical API calls fail during static generation
// When false, build continues with empty/fallback data (useful for local dev)
// Priority: explicit env var > NODE_ENV=production > default false
export const FAIL_BUILD_ON_API_ERROR = (() => {
  const explicitValue = process.env.FAIL_BUILD_ON_API_ERROR;
  if (explicitValue === 'true') return true;
  if (explicitValue === 'false') return false;
  // Default: fail in production, continue in development
  return process.env.NODE_ENV === 'production';
})();

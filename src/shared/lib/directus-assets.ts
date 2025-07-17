import { DIRECTUS_URL } from './config';

// URL directa de assets de Directus sin optimizaciones
export function getDirectusAssetUrl(assetId: string): string {
  if (!assetId) return '';
  return `${DIRECTUS_URL}/assets/${assetId}`;
}
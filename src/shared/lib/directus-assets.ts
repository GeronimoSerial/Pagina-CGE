import { DIRECTUS_URL } from './config';

// Manejo optimizado de assets de Directus
export class DirectusAssets {
  private static baseUrl = DIRECTUS_URL;
  
  static getAssetUrl(assetId: string, transform?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
  }): string {
    if (!assetId) return '';
    
    const url = new URL(`${this.baseUrl}/assets/${assetId}`);
    
    if (transform) {
      if (transform.width) url.searchParams.set('width', transform.width.toString());
      if (transform.height) url.searchParams.set('height', transform.height.toString());
      if (transform.quality) url.searchParams.set('quality', transform.quality.toString());
      if (transform.format) url.searchParams.set('format', transform.format);
      if (transform.fit) url.searchParams.set('fit', transform.fit);
    }
    
    return url.toString();
  }
  
  static getOptimizedImageUrl(assetId: string, size: 'thumbnail' | 'medium' | 'large' | 'hero' = 'medium'): string {
    const sizeConfigs = {
      thumbnail: { width: 150, height: 150, quality: 80, format: 'webp' as const },
      medium: { width: 400, height: 300, quality: 85, format: 'webp' as const },
      large: { width: 800, height: 600, quality: 90, format: 'webp' as const },
      hero: { width: 1200, height: 800, quality: 95, format: 'webp' as const }
    };
    
    return this.getAssetUrl(assetId, sizeConfigs[size]);
  }
  
  static portada(assetId: string): string {
    return this.getOptimizedImageUrl(assetId, 'hero');
  }
  
  static contenido(assetId: string): string {
    return this.getOptimizedImageUrl(assetId, 'large');
  }
}
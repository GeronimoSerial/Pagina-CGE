import { DIRECTUS_URL } from "./config";

export const cfImages = (assetId: string, width: number = 800, format: string = 'auto') => {
    if (!assetId) return '';
    
    // Construir la URL optimizada con Cloudflare para assets de Directus
    return `${DIRECTUS_URL}/cdn-cgi/image/width=${width},format=${format}/assets/${assetId}`;
};


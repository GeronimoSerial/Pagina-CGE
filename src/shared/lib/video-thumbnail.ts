// Cache global para thumbnails generados
const thumbnailCache = new Map<string, string>();

/**
 * Genera un thumbnail del primer frame de un video
 * @param videoUrl URL del video
 * @returns Promise que resuelve a una data URL del thumbnail o null si falla
 */
export async function generateVideoThumbnail(videoUrl: string): Promise<string | null> {
  try {
    // Verificar cache primero
    const cached = thumbnailCache.get(videoUrl);
    if (cached) return cached;

    // Crear elemento video temporal
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    // Promesa para esperar que el video cargue
    const loadVideo = new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error('Error loading video'));
      video.src = videoUrl;
    });

    await loadVideo;

    // Buscar un frame que no sea negro
    video.currentTime = 1; // Intentar en el segundo 1 primero

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });

    // Crear canvas para capturar el frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame del video en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Verificar si el frame no es completamente negro
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let isBlack = true;
    
    // Verificar algunos píxeles para ver si hay contenido
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (r > 30 || g > 30 || b > 30) { // Umbral para determinar si no es negro
        isBlack = false;
        break;
      }
    }

    // Si el frame es negro, intentar en diferentes momentos
    if (isBlack) {
      const timePoints = [0.5, 2, 3, 5]; // Diferentes puntos en segundos
      
      for (const time of timePoints) {
        video.currentTime = time;
        
        await new Promise<void>((resolve) => {
          video.onseeked = () => resolve();
        });

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Verificar si este frame tiene contenido
        const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newData = newImageData.data;
        let hasContent = false;
        
        for (let i = 0; i < newData.length; i += 4) {
          const r = newData[i];
          const g = newData[i + 1];
          const b = newData[i + 2];
          
          if (r > 30 || g > 30 || b > 30) {
            hasContent = true;
            break;
          }
        }
        
        if (hasContent) break;
      }
    }

    // Convertir canvas a data URL
    const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Guardar en cache
    thumbnailCache.set(videoUrl, thumbnailDataUrl);

    // Limpiar
    video.remove();

    return thumbnailDataUrl;

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}

/**
 * Obtiene un thumbnail del cache si existe
 * @param videoUrl URL del video
 * @returns Thumbnail del cache o null si no existe
 */
export function getCachedThumbnail(videoUrl: string): string | null {
  return thumbnailCache.get(videoUrl) || null;
}

/**
 * Limpia el cache de thumbnails
 */
export function clearThumbnailCache(): void {
  thumbnailCache.clear();
}

/**
 * Obtiene el tamaño actual del cache
 * @returns Número de thumbnails en cache
 */
export function getThumbnailCacheSize(): number {
  return thumbnailCache.size;
}
const thumbnailCache = new Map<string, string>();

export async function generateVideoThumbnail(videoUrl: string): Promise<string | null> {
  try {
    const cached = thumbnailCache.get(videoUrl);
    if (cached) return cached;

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    const loadVideo = new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error('Error loading video'));
      video.src = videoUrl;
    });

    await loadVideo;

    video.currentTime = 1; 

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let isBlack = true;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      if (r > 30 || g > 30 || b > 30) { 
        isBlack = false;
        break;
      }
    }

    if (isBlack) {
      const timePoints = [0.5, 2, 3, 5]; 
      
      for (const time of timePoints) {
        video.currentTime = time;
        
        await new Promise<void>((resolve) => {
          video.onseeked = () => resolve();
        });

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
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

    const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    thumbnailCache.set(videoUrl, thumbnailDataUrl);

    video.remove();

    return thumbnailDataUrl;

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}

export function getCachedThumbnail(videoUrl: string): string | null {
  return thumbnailCache.get(videoUrl) || null;
}


export function clearThumbnailCache(): void {
  thumbnailCache.clear();
}


export function getThumbnailCacheSize(): number {
  return thumbnailCache.size;
}
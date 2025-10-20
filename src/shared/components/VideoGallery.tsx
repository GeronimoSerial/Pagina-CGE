'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NewsItem } from '../interfaces';
import { getVideos } from '@/features/noticias/services/news';
import {
  generateVideoThumbnail,
  getCachedThumbnail,
} from '@/shared/lib/video-thumbnail';
import { useIsMobile } from '@/shared/hooks/use-mobile';

interface VideoGalleryProps {
  noticia: NewsItem;
}

interface VideoThumbnailProps {
  video: any;
  index: number;
  onPlay: (index: number) => void;
  noticiaTitulo: string;
}

function VideoThumbnail({
  video,
  index,
  onPlay,
  noticiaTitulo,
}: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadThumbnail = async () => {
      setLoading(true);
      const generatedThumbnail = await generateVideoThumbnail(video.url);
      setThumbnail(generatedThumbnail);
      setLoading(false);
    };

    loadThumbnail();
  }, [video.url]);

  const displayThumbnail =
    thumbnail || video.thumbnail || '/images/video-placeholder.jpg';

  const handleClick = () => {
    if (isMobile) {
      onPlay(index);
    } else {
      onPlay(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="cursor-pointer block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="relative aspect-video bg-gray-100">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 5v10l8-5-8-5z" />
            </svg>
          </div>
        ) : (
          <img
            src={displayThumbnail}
            alt={`Video de ${noticiaTitulo}`}
            className="w-full h-full object-cover relative z-0"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/video-placeholder.jpg';
            }}
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center hover:backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-full p-3 transition-all duration-300 shadow-lg">
            <svg
              className="w-8 h-8 text-gray-800"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M8 5v10l8-5-8-5z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
          Video de la noticia {noticiaTitulo}
        </h3>
      </div>
    </div>
  );
}

export default function VideoGallery({ noticia }: VideoGalleryProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(
    null,
  );
  const [isClient, setIsClient] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const videos = getVideos(noticia);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentVideoIndex === null) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    if (currentVideoIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentVideoIndex]);

  useEffect(() => {
    if (isMobile && currentVideoIndex !== null && videoRef.current) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.log('Autoplay failed:', error);
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMobile, currentVideoIndex]);

  const openVideo = useCallback((index: number) => {
    setCurrentVideoIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentVideoIndex(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const goToPrevious = useCallback(() => {
    if (currentVideoIndex === null || videos.length === 0) return;
    const newIndex =
      currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1;
    setCurrentVideoIndex(newIndex);
  }, [currentVideoIndex, videos.length]);

  const goToNext = useCallback(() => {
    if (currentVideoIndex === null || videos.length === 0) return;
    const newIndex =
      currentVideoIndex < videos.length - 1 ? currentVideoIndex + 1 : 0;
    setCurrentVideoIndex(newIndex);
  }, [currentVideoIndex, videos.length]);

  const handleModalClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current) {
        closeModal();
      }
    },
    [closeModal],
  );

  if (!isClient || !videos || videos.length === 0) {
    return null;
  }

  const currentVideo =
    currentVideoIndex !== null ? videos[currentVideoIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {videos.map((video, index) => (
          <VideoThumbnail
            key={`video-${index}`}
            video={video}
            index={index}
            onPlay={openVideo}
            noticiaTitulo={noticia.titulo}
          />
        ))}
      </div>

      {currentVideoIndex !== null && currentVideo && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={handleModalClick}
        >
          <div
            className={`relative w-full ${isMobile ? 'h-full' : 'max-w-4xl mx-4'}`}
          >
            <button
              onClick={closeModal}
              className={`absolute ${isMobile ? 'top-4 right-4' : '-top-12 right-0'} text-white hover:text-gray-300 transition-colors z-10`}
              aria-label="Cerrar video"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!isMobile && (
              <div className="absolute -top-12 left-0 text-white text-sm">
                {currentVideoIndex + 1} / {videos.length}
              </div>
            )}

            <div
              className={`relative bg-black ${isMobile ? 'h-full' : 'rounded-lg'} overflow-hidden`}
            >
              <video
                ref={videoRef}
                src={currentVideo.url}
                poster={
                  currentVideo.thumbnail || '/images/video-placeholder.jpg'
                }
                controls
                autoPlay={isMobile}
                muted={isMobile}
                playsInline={!isMobile}
                className={`w-full ${isMobile ? 'h-full object-contain' : 'aspect-video'}`}
                onError={(e) => {
                  console.error('Error loading video:', e);
                }}
                onCanPlay={() => {
                  // Intentar reproducir cuando esté listo (especialmente en móvil)
                  if (isMobile && videoRef.current) {
                    videoRef.current.play().catch((error) => {
                      console.log('Autoplay failed:', error);
                    });
                  }
                }}
              >
                Tu navegador no soporta el elemento de video.
              </video>

              {!isMobile && videos.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                    aria-label="Video anterior"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                    aria-label="Video siguiente"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {!isMobile && videos.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
                {videos.map((video, index) => {
                  const cachedThumbnail = getCachedThumbnail(video.url);
                  const displayThumbnail =
                    cachedThumbnail ||
                    video.thumbnail ||
                    '/images/video-placeholder.jpg';

                  return (
                    <button
                      key={`thumb-${index}`}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                        index === currentVideoIndex
                          ? 'border-white'
                          : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={displayThumbnail}
                        alt={`Video ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

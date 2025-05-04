"use client";
import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { type AutoplayType } from "embla-carousel-autoplay";
import { cn } from "../../lib/utils";

import { Button } from "./button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = AutoplayType;

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  currentIndex?: number;
  onCurrentIndexChange?: (index: number) => void;
  autoplay?: boolean;
  autoplayInterval?: number;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const MOBILE_BREAKPOINT = "(max-width: 768px)" as const;

type CarouselState = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
  current: number;
  slideCount: number;
  isPaused: boolean;
  isTabVisible: boolean;
  isMobile: boolean;
};

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      currentIndex,
      onCurrentIndexChange,
      autoplay = true,
      autoplayInterval = 5000,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins as any
    );

    const [state, setState] = React.useState<CarouselState>({
      canScrollPrev: false,
      canScrollNext: false,
      current: 0,
      slideCount: 0,
      isPaused: false,
      isTabVisible: true,
      isMobile: false,
    });

    const handleSelect = React.useCallback(() => {
      if (!api) return;

      setState((prev) => ({
        ...prev,
        canScrollPrev: api.canScrollPrev(),
        canScrollNext: api.canScrollNext(),
        current: api.selectedScrollSnap(),
      }));

      onCurrentIndexChange?.(api.selectedScrollSnap());
    }, [api, onCurrentIndexChange]);

    const handleMobileChange = React.useCallback(
      (e: MediaQueryListEvent | MediaQueryList) => {
        setState((prev) => ({
          ...prev,
          isMobile: e.matches,
        }));
      },
      []
    );

    const handleVisibilityChange = React.useCallback(() => {
      setState((prev) => ({
        ...prev,
        isTabVisible: !document.hidden,
      }));
    }, []);

    const handleMouseEnter = React.useCallback(() => {
      setState((prev) => ({ ...prev, isPaused: true }));
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      setState((prev) => ({ ...prev, isPaused: false }));
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    // Inicialización y limpieza de MediaQuery
    React.useEffect(() => {
      const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
      handleMobileChange(mediaQuery);
      mediaQuery.addEventListener("change", handleMobileChange);
      return () => mediaQuery.removeEventListener("change", handleMobileChange);
    }, [handleMobileChange]);

    // Inicialización y limpieza de visibilidad
    React.useEffect(() => {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
    }, [handleVisibilityChange]);

    // Inicialización del carrusel
    React.useEffect(() => {
      if (!api) return;

      const updateSlideCount = () => {
        setState((prev) => ({ ...prev, slideCount: api.slideNodes().length }));
      };

      updateSlideCount();
      api.on("select", handleSelect);
      handleSelect();

      return () => {
        api.off("select", handleSelect);
      };
    }, [api, handleSelect]);

    // Manejo del autoplay
    React.useEffect(() => {
      if (
        !api ||
        !autoplay ||
        state.isPaused ||
        !state.isTabVisible ||
        state.isMobile
      )
        return;

      const interval = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, autoplayInterval);

      return () => clearInterval(interval);
    }, [
      api,
      autoplay,
      autoplayInterval,
      state.isPaused,
      state.isTabVisible,
      state.isMobile,
    ]);

    // Sincronización del API
    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    const contextValue = React.useMemo(
      () => ({
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev: state.canScrollPrev,
        canScrollNext: state.canScrollNext,
      }),
      [
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        state.canScrollPrev,
        state.canScrollNext,
      ]
    );

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          <div className="relative">
            {children}
            <CarouselPrevious className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-transparent text-white/70 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-300 ease-out z-30 border-none shadow-none" />
            <CarouselNext className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-transparent text-white/70 hover:bg-white/10 hover:text-white hover:scale-110 transition-all duration-300 ease-out z-30 border-none shadow-none" />
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4 pb-2">
            {Array.from({ length: state.slideCount }).map((_, idx) => (
              <button
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  state.current === idx
                    ? "bg-green-500 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => api && api.scrollTo(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "ghost", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className="h-8 w-8" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "ghost", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className="h-8 w-8" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};

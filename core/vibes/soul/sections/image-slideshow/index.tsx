'use client';

import { clsx } from 'clsx';
import { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentPropsWithoutRef, useCallback, useEffect, useState } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';

type ButtonLinkProps = ComponentPropsWithoutRef<typeof ButtonLink>;

export interface ImageSlide {
  /** Image rendered in place of a text heading. Alt text should match the visible heading copy. */
  titleImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  description?: string;
  showDescription?: boolean;
  /** Background image for the slide. */
  image?: { alt: string; blurDataUrl?: string; src: string };
  /**
   * Controls which part of the background image stays visible when it is cropped.
   * Both `x` and `y` are percentages (0–100). Defaults to `{ x: 50, y: 50 }` (center).
   */
  focalPoint?: { x: number; y: number };
  cta?: {
    label: string;
    href: string;
    variant?: ButtonLinkProps['variant'];
    size?: ButtonLinkProps['size'];
    shape?: ButtonLinkProps['shape'];
  };
  showCta?: boolean;
  /**
   * Controls `align-items` and `text-align` of the content column (title image + description + CTA).
   * Defaults to `'left'`.
   */
  contentAlign?: 'left' | 'center' | 'right';
}

interface Props {
  slides: ImageSlide[];
  playOnInit?: boolean;
  interval?: number;
  className?: string;
}

interface UseProgressButtonType {
  selectedIndex: number;
  scrollSnaps: number[];
  onProgressButtonClick: (index: number) => void;
}

const useProgressButton = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void,
): UseProgressButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onProgressButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.goTo(index);
      if (onButtonClick) onButtonClick(emblaApi);
    },
    [emblaApi, onButtonClick],
  );

  const onInit = useCallback((emblaAPI: EmblaCarouselType) => {
    setScrollSnaps(emblaAPI.snapList());
  }, []);

  const onSelect = useCallback((emblaAPI: EmblaCarouselType) => {
    setSelectedIndex(emblaAPI.selectedSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on('reinit', onInit).on('reinit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onProgressButtonClick,
  };
};

const contentAlignClass: Record<NonNullable<ImageSlide['contentAlign']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

// eslint-disable-next-line valid-jsdoc
/**
 * A variant of the ImageSlideshow component where each slide's heading is provided as an image
 * (e.g. a custom-typography SVG or PNG) rather than plain text.
 *
 * **Accessibility note:** Always supply `titleImage.alt` text that exactly matches the
 * visible copy in the image. For maximum screen-reader fidelity you can also render a
 * visually-hidden `<h1>` alongside the title image.
 *
 * This component supports the same CSS variables as ImageSlideshow for theming:
 *
 * ```css
 * :root {
 *   --slideshow-focus: hsl(var(--primary));
 *   --slideshow-mask: hsl(var(--foreground) / 80%);
 *   --slideshow-background: color-mix(in oklab, hsl(var(--primary)), black 75%);
 *   --slideshow-description: hsl(var(--background) / 80%);
 *   --slideshow-description-font-family: var(--font-family-body);
 *   --slideshow-pagination: hsl(var(--background));
 *   --slideshow-play-border: hsl(var(--contrast-300) / 50%);
 *   --slideshow-play-border-hover: hsl(var(--contrast-300) / 80%);
 *   --slideshow-play-text: hsl(var(--background));
 *   --slideshow-number: hsl(var(--background));
 *   --slideshow-number-font-family: var(--font-family-mono);
 * }
 * ```
 */
export function ImageSlideshow({ slides, playOnInit = true, interval = 5000, className }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 }, [
    Autoplay({ delay: interval, active: playOnInit, defaultInteraction: true }),
    Fade(),
  ]);
  const { selectedIndex, scrollSnaps, onProgressButtonClick } = useProgressButton(emblaApi);
  const [isPlaying, setIsPlaying] = useState(playOnInit);
  const [playCount, setPlayCount] = useState(0);

  const resetAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    autoplay.reset();
  }, [emblaApi]);

  const goToPrevious = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.goToPrev();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const goToNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.goToNext();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    emblaApi
      .on('autoplay:play', () => {
        setIsPlaying(true);
        setPlayCount(playCount + 1);
      })
      .on('autoplay:stop', () => {
        setIsPlaying(false);
      })
      .on('reinit', () => {
        setIsPlaying(autoplay.isPlaying());
      });
  }, [emblaApi, playCount]);

  useEffect(() => {
    if (!emblaApi || !playOnInit) return;

    const autoplay = emblaApi.plugins().autoplay;

    autoplay.play();
  }, [emblaApi, playOnInit]);

  return (
    <section
      className={clsx(
        'relative h-[60vh] bg-[var(--slideshow-background,color-mix(in_oklab,hsl(var(--primary)),black_75%))] @container',
        className,
      )}
    >
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map(
            (
              {
                titleImage,
                description,
                showDescription = true,
                image,
                focalPoint = { x: 50, y: 50 },
                cta,
                showCta = true,
                contentAlign = 'left',
              },
              idx,
            ) => {
              return (
                <div
                  className="relative h-full w-full min-w-0 shrink-0 grow-0 basis-full"
                  key={idx}
                >
                  {image?.src != null && image.src !== '' && (
                    <Image
                      alt={image.alt}
                      blurDataURL={image.blurDataUrl}
                      className="relative z-10 block h-20 w-full object-cover"
                      fill
                      placeholder={
                        image.blurDataUrl != null && image.blurDataUrl !== '' ? 'blur' : 'empty'
                      }
                      preload={idx === 0}
                      sizes="100vw"
                      src={image.src}
                      style={{ objectPosition: `${focalPoint.x}% ${focalPoint.y}%` }}
                    />
                  )}
                  {/* <div className="absolute inset-0 z-20 bg-gradient-to-tr from-black/40 to-black/20" /> */}

                  <div className="absolute inset-0 z-30 flex h-full select-none flex-col justify-center bg-gradient-to-t from-[var(--slideshow-mask,hsl(var(--foreground)/80%))] to-transparent">
                    <div
                      className={clsx(
                        'mx-auto flex w-full max-w-screen-2xl flex-col px-4 pb-16 pt-12 @xl:px-6 @xl:pb-20 @xl:pt-16 @4xl:px-8 @4xl:pt-20',
                        contentAlignClass[contentAlign],
                      )}
                    >
                      {/* Title image — use SVG for best quality at any resolution */}
                      <Image
                        alt={titleImage.alt}
                        className="max-w-full"
                        height={titleImage.height}
                        src={titleImage.src}
                        width={titleImage.width}
                      />

                      {showDescription && description != null && description !== '' && (
                        <p className="mt-2 max-w-xl font-[family-name:var(--slideshow-description-font-family,var(--font-family-body))] text-base leading-normal text-[var(--slideshow-description,hsl(var(--background)/80%))] @xl:mt-3 @xl:text-lg">
                          {description}
                        </p>
                      )}

                      {showCta && (
                        <ButtonLink
                          className="mt-6 @xl:mt-8"
                          href={cta?.href ?? '#'}
                          shape={cta?.shape ?? 'pill'}
                          size={cta?.size ?? 'large'}
                          variant={cta?.variant ?? 'tertiary'}
                        >
                          {cta?.label ?? 'Learn more'}
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 flex w-full max-w-screen-2xl -translate-x-1/2 flex-wrap items-center px-4 @xl:bottom-6 @xl:px-6 @4xl:px-8">
        {/* Progress Buttons */}
        {scrollSnaps.map((_: number, index: number) => {
          return (
            <button
              aria-label={`View image number ${index + 1}`}
              className="rounded-lg px-1.5 py-2 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-[var(--slideshow-focus,hsl(var(--primary)))]"
              key={index}
              onClick={() => {
                onProgressButtonClick(index);
                resetAutoplay();
              }}
            >
              <div className="relative overflow-hidden">
                {/* White Bar - Current Index Indicator / Progress Bar */}
                <div
                  className={clsx(
                    'absolute h-0.5 bg-[var(--slideshow-pagination,hsl(var(--background)))]',
                    'opacity-0 fill-mode-forwards',
                    isPlaying ? 'running' : 'paused',
                    index === selectedIndex
                      ? 'opacity-100 ease-linear animate-in slide-in-from-left'
                      : 'ease-out animate-out fade-out',
                  )}
                  key={`progress-${playCount}`}
                  style={{
                    animationDuration: index === selectedIndex ? `${interval}ms` : '200ms',
                    width: `${150 / slides.length}px`,
                  }}
                />
                {/* Grey Bar BG */}
                <div
                  className="h-0.5 bg-[var(--slideshow-pagination,hsl(var(--background)))] opacity-30"
                  style={{ width: `${150 / slides.length}px` }}
                />
              </div>
            </button>
          );
        })}

        {/* Carousel Count - "01/03" */}
        <span className="ml-auto mr-3 mt-px font-[family-name:var(--slideshow-number-font-family,var(--font-family-mono))] text-sm text-[var(--slideshow-number,hsl(var(--background)))]">
          {selectedIndex + 1 < 10 ? `0${selectedIndex + 1}` : selectedIndex + 1}/
          {slides.length < 10 ? `0${slides.length}` : slides.length}
        </span>

        {/* Previous Button */}
        <button
          aria-label="Previous slide"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--slideshow-play-border,hsl(var(--contrast-300)/50%))] text-[var(--slideshow-play-text,hsl(var(--background)))] ring-[var(--slideshow-focus)] transition-opacity duration-300 hover:border-[var(--slideshow-play-border-hover,hsl(var(--contrast-300)/80%))] focus-visible:outline-0 focus-visible:ring-2"
          onClick={goToPrevious}
          type="button"
        >
          <ChevronLeft className="pointer-events-none" size={16} strokeWidth={1.5} />
        </button>

        {/* Next Button */}
        <button
          aria-label="Next slide"
          className="ml-2 flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--slideshow-play-border,hsl(var(--contrast-300)/50%))] text-[var(--slideshow-play-text,hsl(var(--background)))] ring-[var(--slideshow-focus)] transition-opacity duration-300 hover:border-[var(--slideshow-play-border-hover,hsl(var(--contrast-300)/80%))] focus-visible:outline-0 focus-visible:ring-2"
          onClick={goToNext}
          type="button"
        >
          <ChevronRight className="pointer-events-none" size={16} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}

'use client';

import { clsx } from 'clsx';
import { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';

import CanadaBanner from '../../_images/Slideshow/canada-banner.png';
import MallardBanner from '../../_images/Slideshow/mallard-banner.png';
import PigeonBanner from '../../_images/Slideshow/pigeon-banner.png';

const INTERVAL = 5000;

const SLIDES = [
  {
    image: CanadaBanner,
    alt: 'Canada geese decoy spread',
    cta: { label: 'Shop Geese', href: '/shop' },
  },
  {
    image: MallardBanner,
    alt: 'Mallard duck decoys',
    cta: { label: 'Shop Ducks', href: '/shop' },
  },
  {
    image: PigeonBanner,
    alt: 'Pigeon decoys',
    cta: { label: 'Shop Pigeons', href: '/shop' },
  },
];

export function ImageSlideshow() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 }, [
    Autoplay({ delay: INTERVAL, active: true, defaultInteraction: true }),
    Fade(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = (api: EmblaCarouselType) => setSelectedIndex(api.selectedSnap());

    emblaApi.on('select', onSelect).on('reinit', onSelect);
    onSelect(emblaApi);
  }, [emblaApi]);

  useEffect(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());

    emblaApi
      .on('autoplay:play', () => {
        setIsPlaying(true);
        setPlayCount((c) => c + 1);
      })
      .on('autoplay:stop', () => setIsPlaying(false))
      .on('reinit', () => setIsPlaying(autoplay.isPlaying()));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.plugins().autoplay.play();
  }, [emblaApi]);

  const resetAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    autoplay.reset();
  }, [emblaApi]);

  const goToPrev = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.goToPrev();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const goToNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.goToNext();
    resetAutoplay();
  }, [emblaApi, resetAutoplay]);

  const pauseAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    autoplay.stop();
  }, [emblaApi]);

  const resumeAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins().autoplay;

    if (!autoplay) return;

    autoplay.play();
  }, [emblaApi]);

  const currentCta = SLIDES[selectedIndex]?.cta;
  // All banner images share the same dimensions; use the first for aspect-ratio.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { width, height } = SLIDES[0]!.image;

  return (
    <div className="relative">
      <div
        className="bg-[var(--banner-background,hsl(var(--primary)))]" // Fallback background color for before images load; also adds a subtle overlay to improve text contrast
      >
        <section className="relative mx-auto w-full max-w-screen-2xl">
          {/* Carousel - aspect-ratio keeps height proportional to the natural image dimensions */}
          <div
            className="max-w-screen overflow-hidden"
            ref={emblaRef}
            style={{ aspectRatio: `${width} / ${height}` }}
          >
            <div className="flex h-full">
              {SLIDES.map(({ image, alt }, idx) => (
                <div className="relative h-full w-full min-w-0 shrink-0 basis-full" key={idx}>
                  <Image
                    alt={alt}
                    blurDataURL={image.blurDataURL}
                    fill
                    placeholder="blur"
                    preload={idx === 0}
                    sizes="100vw"
                    src={image.src}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Prev button - transparent, icon-only, far left */}
          <button
            aria-label="Previous slide"
            className="absolute left-0 top-1/2 z-10 flex w-14 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            onClick={goToPrev}
            type="button"
          >
            <ChevronLeft className="pointer-events-none" size={32} strokeWidth={1.5} />
          </button>

          {/* Next button - transparent, icon-only, far right */}
          <button
            aria-label="Next slide"
            className="absolute right-0 top-1/2 z-10 flex w-14 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            onClick={goToNext}
            type="button"
          >
            <ChevronRight className="pointer-events-none" size={32} strokeWidth={1.5} />
          </button>

          {/* Progress bars - paused only when CTA is hovered */}
        </section>
      </div>
      <div className="absolute inset-x-0 top-0 z-10 grid grid-cols-1 grid-rows-1">
        {SLIDES.map((_, index) => (
          <button
            aria-label={`Go to slide ${index + 1}`}
            className="pointer-events-none col-start-1 row-start-1 grow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            key={index}
            // onClick={() => {
            //   if (!emblaApi) return;

            //   emblaApi.goTo(index);
            //   resetAutoplay();
            // }}
          >
            <div className="relative w-full overflow-hidden">
              <div
                className={clsx(
                  'absolute h-1 w-full bg-primary/40 opacity-0 fill-mode-forwards',
                  isPlaying ? 'running' : 'paused',
                  index === selectedIndex
                    ? 'opacity-100 ease-linear animate-in slide-in-from-left'
                    : 'ease-out animate-out fade-out',
                )}
                key={`progress-${playCount}-${index}`}
                style={{
                  animationDuration: index === selectedIndex ? `${INTERVAL}ms` : '200ms',
                }}
              />
              <div className="h-1 w-full bg-primary/10" />
            </div>
          </button>
        ))}
      </div>

      {/* CTA - overflows the bottom of the section by 50% of its own height */}
      {currentCta && (
        <div className="bg-primary" onMouseEnter={pauseAutoplay} onMouseLeave={resumeAutoplay}>
          <ButtonLink
            className="w-full"
            href={currentCta.href}
            shape="square"
            variant="primary"
            size="small"
          >
            {currentCta.label}
          </ButtonLink>
        </div>
      )}
    </div>
  );
}

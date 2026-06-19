import { useTranslations } from 'next-intl';

import {
  ImageSlide,
  ImageSlideshow as SlideshowSection,
} from '~/vibes/soul/sections/image-slideshow';

import SlideText01 from '../../_images/Slideshow/spread-text.png';
import SlideBg01 from '../../_images/Slideshow/spread.png';

export function ImageSlideshow() {
  const t = useTranslations('Home.Slideshow');

  const slides: ImageSlide[] = [
    {
      titleImage: {
        src: SlideText01.src,
        alt: t('Slide01.title'),
        height: 300,
        width: 800,
      },
      image: {
        src: SlideBg01.src,
        alt: t('Slide01.alt'),
        blurDataUrl: SlideBg01.blurDataURL,
      },
      description: t('Slide01.description'),
      cta: {
        href: '/shop',
        label: t('Slide01.cta'),
        variant: 'primary' as const,
        shape: 'square' as const,
      },
      contentAlign: 'center' as const,
      focalPoint: { x: 0, y: 0.5 },
    },
  ];

  return (
    <SlideshowSection
      // pass props
      interval={5000}
      playOnInit={true}
      slides={slides}
    />
  );
}

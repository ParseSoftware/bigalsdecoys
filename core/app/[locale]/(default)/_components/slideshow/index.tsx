import { useTranslations } from 'next-intl';

import { Slideshow as SlideshowSection } from '~/vibes/soul/sections/slideshow';

import SlideBg03 from '../../_images/Slideshow/spread.png';
import SlideBg01 from '../../_images/Slideshow/mallard.png';
import SlideBg02 from '../../_images/Slideshow/pigeon.png';

export function Slideshow() {
  const t = useTranslations('Home.Slideshow');

  const slides = [
    {
      overline: t('Slide01.overline'),
      title: t('Slide01.title'),
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
    },
    {
      overline: t('Slide02.overline'),
      title: t('Slide02.title'),
      image: {
        src: SlideBg02.src,
        alt: t('Slide02.alt'),
        blurDataUrl: SlideBg02.blurDataURL,
      },
      description: t('Slide02.description'),
      cta: {
        href: '/shop',
        label: t('Slide02.cta'),
        variant: 'primary' as const,
        shape: 'square' as const,
      },
    },
    {
      overline: t('Slide03.overline'),
      title: t('Slide03.title'),
      image: {
        src: SlideBg03.src,
        alt: t('Slide03.alt'),
        blurDataUrl: SlideBg03.blurDataURL,
      },
      description: t('Slide03.description'),
      cta: {
        href: '/about-us',
        label: t('Slide03.cta'),
        variant: 'primary' as const,
        shape: 'square' as const,
      },
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

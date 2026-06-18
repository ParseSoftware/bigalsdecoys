import { useTranslations } from 'next-intl';

import { Slideshow as SlideshowSection } from '~/vibes/soul/sections/slideshow';

import SlideBg03 from '../../_images/Brant Lifestyle/654634402_18061550219410823_31687899643549827_n.jpg';
import SlideBg01 from '../../_images/Canada Lifestyle/instagram_C_glxEkS2kR.jpg';
import SlideBg02 from '../../_images/Canada Lifestyle/instagram_DCmR-9tpx9_.jpg';

export function Slideshow() {
  const t = useTranslations('Home.Slideshow');

  const slides = [
    {
      title: t('Slide01.title'),
      image: {
        src: SlideBg01.src,
        alt: t('Slide01.alt'),
        blurDataUrl: SlideBg01.blurDataURL,
      },
      description: t('Slide01.description'),
      cta: {
        href: '/shop-all',
        label: t('Slide01.cta'),
        variant: 'primary' as const,
        shape: 'square' as const,
      },
    },
    {
      title: t('Slide02.title'),
      image: {
        src: SlideBg02.src,
        alt: t('Slide02.alt'),
        blurDataUrl: SlideBg02.blurDataURL,
      },
      description: t('Slide02.description'),
      cta: {
        href: '/shop-all',
        label: t('Slide02.cta'),
        variant: 'primary' as const,
        shape: 'square' as const,
      },
    },
    {
      title: t('Slide03.title'),
      image: {
        src: SlideBg03.src,
        alt: t('Slide03.alt'),
        blurDataUrl: SlideBg03.blurDataURL,
      },
      description: t('Slide03.description'),
      cta: {
        href: '/about',
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

import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';

interface Props {
  image?: {
    src: string;
    alt: string;
    blurDataUrl?: string;
  };
}

const POINT_KEYS = ['finish', 'madeInUSA', 'fieldTested', 'value'] as const;

export async function BrandStory({ image }: Props) {
  const t = await getTranslations('Home.BrandStory');

  return (
    <section className="border-y bg-white">
      <div className="mx-auto grid max-w-screen-2xl items-stretch gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Image */}
        <div className="relative order-1 min-h-[420px] overflow-hidden rounded-sm shadow-lg lg:min-h-0">
          {image ? (
            <Image
              alt={image.alt}
              blurDataURL={image.blurDataUrl}
              className="object-cover"
              fill
              placeholder={image.blurDataUrl ? 'blur' : 'empty'}
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={image.src}
            />
          ) : (
            <div className="h-full w-full bg-contrast-100" />
          )}
          <div className="absolute bottom-4 left-4 rounded-sm bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-white">
            {t('badge')}
          </div>
        </div>

        {/* Copy */}
        <div className="order-2 flex flex-col justify-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-4xl uppercase leading-[0.9] sm:text-5xl lg:text-6xl">
            {t('title')}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-contrast-500">
            {t('paragraph1')}
          </p>
          <ul className="mt-8 space-y-3.5">
            {POINT_KEYS.map((key) => (
              <li className="flex items-start gap-3 text-sm text-contrast-500" key={key}>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                {t(`points.${key}`)}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/about" variant="secondary">
              {t('cta')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

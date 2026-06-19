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

export async function BrandStory({ image }: Props) {
  const t = await getTranslations('Home.BrandStory');

  return (
    <section className="border-y bg-white">
      <div className="mx-auto grid max-w-screen-2xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t('eyebrow')}
          </p>
          <h2 className="font-heading text-4xl font-bold uppercase leading-[0.95] @2xl:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-contrast-500 sm:text-lg">
            {t('paragraph1')}
          </p>
          <p className="mt-4 text-base leading-relaxed text-contrast-400">{t('paragraph2')}</p>
          <div className="mt-8">
            <ButtonLink href="/about" variant="secondary">
              {t('cta')}
            </ButtonLink>
          </div>
        </div>

        {/* Image */}
        <div className="relative order-1 lg:order-2">
          {image ? (
            <Image
              alt={image.alt}
              blurDataURL={image.blurDataUrl}
              className="aspect-[5/4] w-full rounded-sm object-cover shadow-lg"
              height={800}
              placeholder={image.blurDataUrl ? 'blur' : 'empty'}
              src={image.src}
              width={1000}
            />
          ) : (
            <div className="aspect-[5/4] w-full rounded-sm bg-contrast-100" />
          )}
          <div className="absolute -bottom-4 -left-4 hidden rounded-sm bg-primary px-5 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white sm:block">
            {t('badge')}
          </div>
        </div>
      </div>
    </section>
  );
}

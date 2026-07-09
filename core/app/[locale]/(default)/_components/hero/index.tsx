import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

import HeroImage from '../../_images/Canada Lifestyle/instagram_CxInqEuu6Hz.jpg';

const SALE_HREF = '/shop?attr_Sale=Yes';

export async function Hero() {
  const t = await getTranslations('Home.Hero');

  const stats = [
    t('stats.freeShipping'),
    t('stats.fastShipping'),
    t('stats.returns'),
    t('stats.madeInUSA'),
  ];

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="relative max-h-[800px] min-h-[540px] w-full" style={{ height: '72vh' }}>
        <Image
          alt={t('imageAlt')}
          className="object-cover object-center"
          fill
          placeholder="blur"
          preload
          sizes="100vw"
          src={HeroImage}
        />

        {/* Legibility gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

        <div className="absolute inset-0 z-[8] flex flex-col justify-end">
          <div className="mx-auto w-full max-w-screen-2xl px-5 pb-8 pt-20 sm:px-8 sm:pb-16 sm:pt-0 lg:px-12">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/50 sm:mb-6 sm:text-[11px]">
              {t('eyebrow')}
            </p>
            <h1 className="font-display mb-4 uppercase leading-[0.87] text-white [font-size:clamp(3.5rem,7vw,6rem)] sm:mb-6">
              {t('headlineLine1')}
              <br />
              {t('headlineLine2')}
            </h1>
            <p className="mb-5 max-w-xl text-sm leading-relaxed text-white/70 sm:mb-8 sm:text-base">
              {t('subtitle')}
            </p>
            <div className="mb-5 flex flex-wrap gap-2 sm:mb-10 sm:gap-3">
              <Link
                className="flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary/90 sm:px-9 sm:py-4 sm:text-sm"
                href="/shop"
              >
                {t('primaryCta')} <ArrowRight size={14} />
              </Link>
              <Link
                className="border border-white/30 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-9 sm:py-4 sm:text-sm"
                href={SALE_HREF}
              >
                {t('secondaryCta')}
              </Link>
            </div>
            <div className="hidden flex-wrap gap-x-8 gap-y-2 sm:flex">
              {stats.map((stat) => (
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40"
                  key={stat}
                >
                  <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

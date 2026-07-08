import { clsx } from 'clsx';
import { Award, Lock, LucideIcon, RotateCcw, Shield, Tag, Truck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

type TrustBadgeVariant = 'grid' | 'inline' | 'marquee';

interface Props {
  /**
   * - `grid`: 4-up card section (homepage).
   * - `inline`: compact bordered row for listing / product pages.
   * - `marquee`: continuously scrolling bar of all badges.
   */
  variant?: TrustBadgeVariant;
  className?: string;
}

type BadgeKey =
  | 'madeInUSA'
  | 'freeShipping'
  | 'builtToLast'
  | 'returns'
  | 'secureCheckout'
  | 'bulkPricing';

const VARIANT_KEYS: Record<TrustBadgeVariant, BadgeKey[]> = {
  grid: ['madeInUSA', 'freeShipping', 'builtToLast', 'secureCheckout'],
  inline: ['madeInUSA', 'freeShipping', 'builtToLast', 'bulkPricing'],
  marquee: ['madeInUSA', 'freeShipping', 'builtToLast', 'returns', 'secureCheckout', 'bulkPricing'],
};

export async function TrustBadges({ variant = 'grid', className }: Props) {
  const t = await getTranslations('Components.TrustBadges');

  const badges: Record<BadgeKey, { Icon: LucideIcon; title: string; subtitle: string }> = {
    madeInUSA: { Icon: Shield, title: t('madeInUSA.title'), subtitle: t('madeInUSA.subtitle') },
    freeShipping: {
      Icon: Truck,
      title: t('freeShipping.title'),
      subtitle: t('freeShipping.subtitle'),
    },
    builtToLast: {
      Icon: Award,
      title: t('builtToLast.title'),
      subtitle: t('builtToLast.subtitle'),
    },
    returns: { Icon: RotateCcw, title: t('returns.title'), subtitle: t('returns.subtitle') },
    secureCheckout: {
      Icon: Lock,
      title: t('secureCheckout.title'),
      subtitle: t('secureCheckout.subtitle'),
    },
    bulkPricing: { Icon: Tag, title: t('bulkPricing.title'), subtitle: t('bulkPricing.subtitle') },
  };

  const items = VARIANT_KEYS[variant].map((key) => badges[key]);

  if (variant === 'marquee') {
    const track = [...items, ...items];

    return (
      <section
        className={clsx('flex overflow-hidden bg-ink text-background @container', className)}
      >
        <ul className="animate-ticker flex shrink-0 items-center whitespace-nowrap hover:[animation-play-state:paused]">
          {track.map(({ Icon, title }, index) => (
            <li className="flex items-center" key={`${title}-${index}`}>
              <span className="flex items-center gap-2 px-6 py-2.5">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span className="font-heading text-xs font-medium uppercase tracking-widest">
                  {title}
                </span>
              </span>
              <span aria-hidden className="text-primary">
                &#9670;
              </span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (variant === 'inline') {
    return (
      <section className={clsx('px-4 py-6 sm:px-6 lg:px-8', className)}>
        <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {items.map(({ Icon, title, subtitle }) => (
            <div
              className="flex items-center gap-3 border border-contrast-100 bg-contrast-100/40 px-4 py-3.5"
              key={title}
            >
              <Icon className="h-4 w-4 shrink-0 text-contrast-500" strokeWidth={1.5} />
              <div>
                <p className="font-heading text-[11px] font-bold uppercase leading-tight tracking-widest">
                  {title}
                </p>
                <p className="mt-0.5 text-[11px] text-contrast-400">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={clsx('border-t bg-background px-4 py-10 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-6 md:grid-cols-4">
        {items.map(({ Icon, title, subtitle }) => (
          <div className="flex items-start gap-3" key={title}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-contrast-100 text-primary">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-heading text-sm font-bold uppercase tracking-wide">{title}</p>
              <p className="mt-0.5 text-xs text-contrast-400">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

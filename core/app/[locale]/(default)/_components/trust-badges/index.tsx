import { Lock, RotateCcw, Shield, Truck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function TrustBadges() {
  const t = await getTranslations('Home.TrustBadges');

  const badges = [
    {
      Icon: Shield,
      title: t('madeInUSA.title'),
      subtitle: t('madeInUSA.subtitle'),
    },
    {
      Icon: Truck,
      title: t('freeShipping.title'),
      subtitle: t('freeShipping.subtitle'),
    },
    {
      Icon: RotateCcw,
      title: t('returns.title'),
      subtitle: t('returns.subtitle'),
    },
    {
      Icon: Lock,
      title: t('secureCheckout.title'),
      subtitle: t('secureCheckout.subtitle'),
    },
  ] as const;

  return (
    <section className="border-t bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-6 md:grid-cols-4">
        {badges.map(({ Icon, title, subtitle }) => (
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

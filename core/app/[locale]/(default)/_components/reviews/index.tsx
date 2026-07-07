import { Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const TESTIMONIAL_KEYS = ['jake', 'chris', 'dave'] as const;

export async function Reviews() {
  const t = await getTranslations('Home.Testimonials');

  const testimonials = TESTIMONIAL_KEYS.map((key) => ({
    name: t(`items.${key}.name`),
    location: t(`items.${key}.location`),
    quote: t(`items.${key}.quote`),
  }));

  return (
    <section className="border-b bg-[hsl(var(--contrast-100))]/40 py-16 sm:py-20">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display mb-10 text-center uppercase leading-none text-foreground [font-size:clamp(1.8rem,3.5vw,3rem)] sm:mb-14">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {testimonials.map(({ name, location, quote }) => (
            <figure className="border-t-2 border-foreground pt-6" key={name}>
              <div className="mb-4 flex gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((index) => (
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" key={index} />
                ))}
              </div>
              <blockquote className="mb-6 text-sm leading-relaxed text-contrast-500">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center bg-ink text-xs font-bold text-white">
                  {name.charAt(0)}
                </span>
                <span>
                  <span className="block font-heading text-sm font-bold text-foreground">
                    {name}
                  </span>
                  <span className="block text-xs text-contrast-400">{location}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Award, MapPin, Phone, Shield, Smile, Star } from 'lucide-react';
import { type Metadata } from 'next';

import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { BRAND_PHONE, BRAND_PHONE_HREF } from '~/lib/brand';

import StoryImage from '../_images/Canada Lifestyle/instagram_C4frZ_ZOCFg.jpg';
import HeroImage from '../_images/Canada Lifestyle/instagram_DS2e6LSDWqb.jpg';
import CraftsmanshipImage from '../_images/Duck Lifestyle/instagram_CvucfnKOrOj.jpg';

export const metadata: Metadata = {
  title: 'About Big Al’s',
  description:
    'Big Al’s has handcrafted premium waterfowl silhouette decoys in the USA since the early 1970s. Learn the story behind the brand and the team carrying it forward.',
};

const values = [
  {
    Icon: Shield,
    title: 'Made in the USA',
    copy: 'Every decoy designed, printed, and assembled on American soil — no exceptions.',
  },
  {
    Icon: Award,
    title: 'Built to Last',
    copy: 'Heavy-duty, ultra-durable material engineered for multi-season performance in any condition.',
  },
  {
    Icon: Star,
    title: 'Field-Proven Performance',
    copy: 'Ultra-matte finish calibrated for the way birds actually see your spread at dawn.',
  },
  {
    Icon: Smile,
    title: 'People-First Service',
    copy: 'Real hunters answer the phone — before and after every purchase.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="relative min-h-[500px] w-full" style={{ height: '70vh' }}>
          <Image
            alt="Hunter setting up goose decoys in snowfall"
            className="object-cover opacity-70"
            fill
            placeholder="blur"
            priority
            sizes="100vw"
            src={HeroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-screen-xl px-4 pb-14 sm:px-6 lg:px-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                From the Blind to the Bench
              </p>
              <h1 className="font-display uppercase leading-[0.87] text-white [font-size:clamp(2.8rem,8vw,7rem)]">
                A Heritage
                <br />
                of the Hunt.
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Origin story */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-screen-xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              Est. Early 1970s
            </p>
            <h2 className="font-display uppercase leading-[0.9] text-foreground [font-size:clamp(2rem,4vw,3.5rem)]">
              Built for the
              <br />
              Next Generation.
            </h2>
            <p className="mt-7 text-base leading-relaxed text-contrast-500">
              Big Al’s started in the early 1970s, rooted in waterfowl hunting. The brand combined
              an artist’s background with a family printing legacy to produce silhouette decoys with
              precise color, detail, and an ultra-matte finish.
            </p>
            <p className="mt-6 text-base leading-relaxed text-contrast-500">
              One goal drove every decision: give hunters a premium silhouette decoy that actually
              performs. New ownership carries that same standard forward — modernizing fulfillment
              and availability while preserving the brand’s hands-on quality and personal service.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl" style={{ height: '480px' }}>
            <Image
              alt="Canada goose coming into a decoy spread"
              className="object-cover"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={StoryImage}
            />
          </div>
        </div>
      </section>

      {/* Full-width quote */}
      <section className="bg-ink text-background">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mb-6 text-6xl leading-none text-primary">“</div>
          <blockquote className="font-display uppercase leading-[0.9] text-white [font-size:clamp(1.8rem,4vw,3.5rem)]">
            Quality and affordability — you can have both. And don’t forget: take a youth along on
            your next hunt.
          </blockquote>
          <cite className="mt-8 block text-[11px] font-bold uppercase not-italic tracking-widest text-primary">
            — Big Al &amp; Family
          </cite>
          <div className="mt-10 border-t border-white/10 pt-10">
            <p className="text-sm italic text-contrast-300">
              “The only opinion that matters in the field.”
            </p>
          </div>
        </div>
      </section>

      {/* Four pillars */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="font-display mb-14 text-center uppercase text-foreground [font-size:clamp(2rem,4vw,3rem)]">
            What We Stand For.
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, copy }) => (
              <div
                className="border border-contrast-100 p-7 transition hover:shadow-lg"
                key={title}
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center bg-ink">
                  <Icon className="h-[18px] w-[18px] text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display mb-3 text-lg uppercase leading-tight text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-contrast-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Same craftsmanship */}
      <section className="border-b bg-background">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[400px] overflow-hidden">
            <Image
              alt="Duck hunter setting up a decoy spread"
              className="object-cover"
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 50vw, 100vw"
              src={CraftsmanshipImage}
            />
          </div>
          <div className="flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-12">
            <h2 className="font-display uppercase leading-[0.9] text-foreground [font-size:clamp(2rem,4vw,3rem)]">
              Same Craftsmanship,
              <br />
              Sharper Than Ever.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-contrast-500">
              The decoys are the same. The commitment is the same. New ownership is focused on
              modernizing fulfillment and availability while preserving the hands-on quality and
              personal service Big Al’s has always been known for.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                className="flex items-center gap-2 bg-primary px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary/90"
                href="/shop"
              >
                Shop Decoys
              </Link>
              <Link
                className="border-2 border-foreground px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
                href="/contact"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-4 py-12 sm:px-6 md:flex-row lg:px-8">
          <div className="flex flex-wrap gap-8 text-sm text-contrast-500">
            <span className="flex items-center gap-2">
              <MapPin className="h-[13px] w-[13px] text-primary" />
              1043 Roosevelt Trail, Kalispell, MT 59901
            </span>
            <a className="flex items-center gap-2 hover:text-primary" href={BRAND_PHONE_HREF}>
              <Phone className="h-[13px] w-[13px] text-primary" />
              {BRAND_PHONE}
            </a>
          </div>
          <Link
            className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            href="/contact"
          >
            Send Us a Message
          </Link>
        </div>
      </section>
    </>
  );
}

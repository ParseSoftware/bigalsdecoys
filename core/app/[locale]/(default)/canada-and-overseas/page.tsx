import { Globe2, Mail, MapPin, Package, Phone, Truck } from 'lucide-react';
import { type Metadata } from 'next';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

export const metadata: Metadata = {
  title: 'Canada & Overseas Shipping',
  description:
    'Big Al’s ships premium American-made silhouette decoys to Canada, Europe, and beyond. Find an authorized distributor near you or arrange direct international shipping.',
};

const SUPPORT_EMAIL = 'info@bigalsdecoys.com';

const distributors = [
  {
    region: 'Canada — West',
    name: 'Flight Control Decoys & More',
    location: 'Lethbridge, AB',
    contact: 'Dale Isherwood',
    phone: '403-634-7088',
    phoneHref: 'tel:+14036347088',
    website: 'www.flightcontroldecoys.ca',
    websiteHref: 'https://www.flightcontroldecoys.ca',
  },
  {
    region: 'Canada — East',
    name: 'Canadian Waterfowl Supplies',
    location: 'Paris, ON',
    contact: 'Pat Heinrichs',
    phone: '855-209-9116',
    phoneHref: 'tel:+18552099116',
    website: 'www.canadianwaterfowlsupplies.com',
    websiteHref: 'https://www.canadianwaterfowlsupplies.com',
  },
  {
    region: 'Europe',
    name: 'DANgate',
    location: 'Serving customers across Europe',
    contact: 'Authorized European distributor',
    phone: null,
    phoneHref: null,
    website: 'www.dangate.dk',
    websiteHref: 'https://www.dangate.dk',
  },
];

const steps = [
  {
    Icon: Mail,
    title: 'Reach out first',
    copy: 'Email us before placing an international order so we can confirm the best route and rate for your destination.',
  },
  {
    Icon: Package,
    title: 'Check local stock',
    copy: 'Our authorized distributors stock many popular items — buying local often saves you both time and money.',
  },
  {
    Icon: Truck,
    title: 'We ship direct',
    copy: 'If your items are out of stock locally, we’ll ship them straight to you, typically via USPS for the best value.',
  },
];

export default function CanadaAndOverseas() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-primary-shadow opacity-90" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex items-center gap-2 text-primary-highlight">
            <Globe2 className="h-5 w-5" strokeWidth={1.5} />
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">International Orders</p>
          </div>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
            Big Al’s ships beyond the border
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-contrast-200 sm:text-lg">
            Hunters in Canada, Europe, and around the world trust Big Al’s American-made silhouette
            decoys. We’ve built a network of authorized distributors and dependable shipping options
            to get our products to you affordably.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={`mailto:${SUPPORT_EMAIL}`} size="large" variant="primary">
              Email Before You Order
            </ButtonLink>
            <ButtonLink href="/shipping-and-returns" size="large" variant="tertiary">
              Shipping &amp; Returns
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              How International Ordering Works
            </p>
            <h2 className="font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
              Three simple steps to your door
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ Icon, title, copy }, index) => (
              <div className="rounded-2xl border bg-background p-8" key={title}>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="font-heading text-4xl font-bold text-contrast-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-contrast-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distributors */}
      <section className="bg-background">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Authorized Distributors
            </p>
            <h2 className="font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
              Find a partner near you
            </h2>
            <p className="mt-4 text-base leading-relaxed text-contrast-500 lg:text-lg">
              Several of our most popular items are stocked locally. Contact a distributor directly
              to save on shipping and get your gear faster.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {distributors.map((d) => (
              <div
                className="flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
                key={d.name}
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                  {d.region}
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold uppercase">{d.name}</h3>
                <p className="mt-1 text-sm text-contrast-400">{d.location}</p>

                <div className="mt-6 space-y-3 border-t pt-6 text-sm">
                  <p className="font-medium text-foreground">{d.contact}</p>
                  {d.phoneHref ? (
                    <a
                      className="flex items-center gap-2 text-contrast-500 transition hover:text-primary"
                      href={d.phoneHref}
                    >
                      <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {d.phone}
                    </a>
                  ) : null}
                  <a
                    className="flex items-center gap-2 text-contrast-500 transition hover:text-primary"
                    href={d.websiteHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Globe2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {d.website}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct shipping note */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="grid items-center gap-8 rounded-2xl border bg-background p-8 lg:grid-cols-3 lg:p-12">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold uppercase leading-tight lg:text-3xl">
                Shipping direct to Canada &amp; overseas
              </h2>
              <p className="mt-4 text-base leading-relaxed text-contrast-500">
                When local stock runs out, we’ll ship directly to you. USPS has proven to be our
                most economical and dependable carrier for international orders. Please note that
                international destinations aren’t eligible for free shipping — even on
                5-dozen-and-up orders — so reach out before checkout and we’ll arrange the best
                option together.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonLink href={`mailto:${SUPPORT_EMAIL}`} size="large" variant="primary">
                Email Our Team
              </ButtonLink>
              <ButtonLink href="/contact" size="large" variant="secondary">
                More Ways to Reach Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

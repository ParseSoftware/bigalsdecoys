import {
  Banknote,
  Clock3,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
  Weight,
} from 'lucide-react';
import { type Metadata } from 'next';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description:
    'Fast, reliable shipping across the USA and Canada, plus a hassle-free 30-day return policy. Here’s everything you need to know about ordering from Big Al’s.',
};

const promises = [
  {
    Icon: RotateCcw,
    title: '30-Day Returns',
    copy: 'Unused items in original packaging can be returned within 30 days for a full refund.',
  },
  {
    Icon: ShieldCheck,
    title: 'We Cover Our Mistakes',
    copy: 'If a return is the result of our error, we’ll pay the return shipping — no questions asked.',
  },
  {
    Icon: Truck,
    title: 'Trusted Carriers',
    copy: 'Orders ship via UPS or FedEx for dependable, trackable delivery to your door.',
  },
  {
    Icon: PackageCheck,
    title: 'Careful Fulfillment',
    copy: 'Every order is packed at our own facility so it arrives ready for the field.',
  },
];

const refundTimeline = [
  {
    Icon: Truck,
    title: 'In transit to us',
    detail: '5–10 business days',
    copy: 'Time for your return to reach us via your chosen shipper.',
  },
  {
    Icon: PackageCheck,
    title: 'Processing your return',
    detail: '3–5 business days',
    copy: 'We inspect and process your return once it arrives.',
  },
  {
    Icon: Banknote,
    title: 'Refund to your bank',
    detail: '5–10 business days',
    copy: 'Your bank finalizes the refund back to your account.',
  },
];

export default function ShippingAndReturns() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-primary-shadow opacity-90" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-highlight">
            Order With Confidence
          </p>
          <h1 className="max-w-3xl font-heading text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
            Shipping &amp; Returns
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-contrast-200 sm:text-lg">
            We want you fully satisfied with your purchase and successful in the field. That starts
            with fast, dependable shipping and a straightforward return policy you can count on.
          </p>
        </div>
      </section>

      {/* Promise cards */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ Icon, title, copy }) => (
              <div className="flex items-start gap-3" key={title}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold uppercase tracking-wide">{title}</p>
                  <p className="mt-1 text-sm text-contrast-500">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Returns */}
      <section className="bg-background">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Returns
              </p>
              <h2 className="font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
                Easy, no-pressure returns
              </h2>
              <p className="mt-6 text-base leading-relaxed text-contrast-500 lg:text-lg">
                You may return unused items in their original packaging within 30 days of delivery
                for a full refund. If the return is the result of our error, we’ll also cover the
                return shipping cost.
              </p>
              <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold uppercase">How to start a return</h3>
                <ol className="mt-4 space-y-3 text-sm text-contrast-500">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-background">
                      1
                    </span>
                    Log in to your account and open the order under “Complete Orders.”
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-background">
                      2
                    </span>
                    Click “Return Item(s)” and follow the prompts.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-background">
                      3
                    </span>
                    Ship it back — we’ll email you once your refund is processed.
                  </li>
                </ol>
                <div className="mt-6">
                  <ButtonLink href="/contact" size="medium" variant="secondary">
                    Need a Hand? Contact Us
                  </ButtonLink>
                </div>
              </div>
            </div>

            {/* Refund timeline */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border bg-white p-8 shadow-sm lg:p-10">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  <h3 className="font-heading text-xl font-bold uppercase">Refund timeline</h3>
                </div>
                <p className="mt-3 text-sm text-contrast-500">
                  Most refunds are completed within about four weeks of handing your package to the
                  shipper — and often sooner. Here’s how that time breaks down:
                </p>
                <div className="mt-8 space-y-6">
                  {refundTimeline.map(({ Icon, title, detail, copy }, index) => (
                    <div className="relative flex gap-5" key={title}>
                      <div className="flex flex-col items-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        {index < refundTimeline.length - 1 ? (
                          <span className="mt-2 w-px flex-1 bg-contrast-200" />
                        ) : null}
                      </div>
                      <div className="pb-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="font-heading text-base font-bold uppercase">{title}</p>
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {detail}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-contrast-500">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Shipping
            </p>
            <h2 className="font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
              Reliable delivery, every order
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border bg-background p-8">
              <MapPin className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 font-heading text-lg font-bold uppercase">Where we ship</h3>
              <p className="mt-3 text-base leading-relaxed text-contrast-500">
                We ship to any address in the USA and Canada. We’re unable to ship to PO Boxes
                unless arranged in advance by phone.
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-8">
              <Clock3 className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 font-heading text-lg font-bold uppercase">Delivery estimates</h3>
              <p className="mt-3 text-base leading-relaxed text-contrast-500">
                At checkout we’ll estimate shipping and delivery dates based on item availability
                and the shipping option you choose. We ship via UPS or FedEx.
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-8">
              <Weight className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <h3 className="mt-5 font-heading text-lg font-bold uppercase">Weight-based rates</h3>
              <p className="mt-3 text-base leading-relaxed text-contrast-500">
                Shipping rates are weight-based. You’ll find each item’s weight on its detail page;
                weights are rounded up to the next full pound.
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 lg:p-8">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
            <div>
              <p className="font-heading text-base font-bold uppercase">Have a unique situation?</p>
              <p className="mt-2 text-sm leading-relaxed text-contrast-500">
                Contact us before ordering and we’ll do our best to work with you and find a
                solution. Earning your business — and keeping it — is what we’re here for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-background">
        <div className="mx-auto max-w-screen-xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
            Questions about an order?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-contrast-200 lg:text-lg">
            Our team is glad to help with shipping, returns, or anything else. Reach out and we’ll
            take care of you.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/contact" size="large" variant="primary">
              Contact Us
            </ButtonLink>
            <ButtonLink href="/" size="large" variant="tertiary">
              Keep Shopping
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

import { Clock, Globe2, Headphones, Mail, MapPin, Phone, Truck } from 'lucide-react';
import { type Metadata } from 'next';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Link } from '~/components/link';

export const metadata: Metadata = {
  title: 'Contact Big Al’s',
  description:
    'Get in touch with the Big Al’s team. Call, email, or reach out about international orders — real people, ready to help you have a successful season.',
};

const SUPPORT_EMAIL = 'info@bigalsdecoys.com';
const SUPPORT_PHONE_DISPLAY = '605-956-4818';
const SUPPORT_PHONE_HREF = 'tel:+16059564818';

const channels = [
  {
    Icon: Phone,
    label: 'Call Us',
    value: SUPPORT_PHONE_DISPLAY,
    href: SUPPORT_PHONE_HREF,
    helper: 'Mon–Fri, 8am–5pm CST',
  },
  {
    Icon: Mail,
    label: 'Email Us',
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    helper: 'We reply quickly on business days',
  },
];

const hours = [
  { day: 'Monday – Friday', time: '8:00am – 5:00pm CST' },
  { day: 'Lunch break', time: 'Closed 12:00pm – 1:00pm' },
  { day: 'Saturday – Sunday', time: 'Closed' },
];

const quickLinks = [
  {
    Icon: Truck,
    title: 'Shipping & Returns',
    copy: 'Delivery timelines, return policy, and how refunds work.',
    href: '/shipping-and-returns',
  },
  {
    Icon: Globe2,
    title: 'Canada & Overseas',
    copy: 'Authorized distributors and direct international shipping.',
    href: '/canada-and-overseas',
  },
  {
    Icon: Headphones,
    title: 'About Big Al’s',
    copy: 'Our story, our craft, and the team behind the decoys.',
    href: '/about',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-primary-shadow opacity-90" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-highlight">
            We’re Here to Help
          </p>
          <h1 className="max-w-3xl font-heading text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
            Talk to a real person
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-contrast-200 sm:text-lg">
            Questions before you buy? Need a hand with an order? The Big Al’s team is ready to help
            you gear up and make the most of your season. Reach out — we’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {channels.map(({ Icon, label, value, href, helper }) => (
              <a
                className="group flex items-center gap-5 rounded-2xl border bg-background p-8 transition hover:border-primary hover:shadow-lg"
                href={href}
                key={label}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-background">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-contrast-400">
                    {label}
                  </p>
                  <p className="mt-1 font-heading text-xl font-bold uppercase text-foreground">
                    {value}
                  </p>
                  <p className="mt-1 text-sm text-contrast-500">{helper}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Hours + quick links */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-screen-xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-24">
          {/* Hours */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <h2 className="font-heading text-2xl font-bold uppercase">Hours of Operation</h2>
              </div>
              <dl className="mt-6 divide-y">
                {hours.map(({ day, time }) => (
                  <div className="flex items-center justify-between py-3" key={day}>
                    <dt className="text-sm font-medium text-foreground">{day}</dt>
                    <dd className="text-sm text-contrast-500">{time}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-start gap-2 rounded-lg bg-background p-4 text-sm text-contrast-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                <span>All times listed are Central Standard Time (CST).</span>
              </div>
              <div className="mt-6">
                <ButtonLink href={SUPPORT_PHONE_HREF} variant="primary" size="medium">
                  Call {SUPPORT_PHONE_DISPLAY}
                </ButtonLink>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Looking for Something Specific?
            </p>
            <h2 className="font-heading text-2xl font-bold uppercase leading-tight lg:text-3xl">
              Quick answers, fast
            </h2>
            <div className="mt-8 space-y-4">
              {quickLinks.map(({ Icon, title, copy, href }) => (
                <Link
                  className="group flex items-center gap-4 rounded-2xl border bg-white px-6 py-5 transition hover:border-primary hover:shadow-lg"
                  href={href}
                  key={title}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-background">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-heading text-base font-bold uppercase text-foreground">
                      {title}
                    </span>
                    <span className="mt-0.5 text-sm text-contrast-500">{copy}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* Original migrated copy retained for reference.
 * M-F 8am-5pm Central Standard Time
Closed from 12pm-1pm for lunch

Phone: 605-956-4818

info@bigalsdecoys.com
 */

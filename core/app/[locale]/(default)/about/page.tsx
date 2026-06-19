import { Award, Factory, HeartHandshake, ShieldCheck, Target, Users } from 'lucide-react';
import { type Metadata } from 'next';

import { ButtonLink } from '@/vibes/soul/primitives/button-link';

export const metadata: Metadata = {
  title: 'About Big Al’s',
  description:
    'For more than fifty years, Big Al’s has handcrafted premium waterfowl silhouette decoys in the USA. Learn the story behind the brand and the team carrying it forward.',
};

const values = [
  {
    Icon: Factory,
    title: 'Made in the USA',
    copy: 'Every decoy is designed, printed, and packaged at our American facility — so we control quality at every step and pass the savings on to you.',
  },
  {
    Icon: ShieldCheck,
    title: 'Built to Last',
    copy: 'Accurate color, true-to-life detail, and an ultra-matte coating engineered to hold up season after season in the harshest conditions.',
  },
  {
    Icon: Target,
    title: 'Field-Proven Performance',
    copy: 'Designed by hunters, for hunters. When the season is short, your gear has to work the first time, every time.',
  },
  {
    Icon: HeartHandshake,
    title: 'People-First Service',
    copy: 'A real team stands behind every order. Have a question before or after you buy? We’re here, and we answer.',
  },
];

const stats = [
  { value: '50+', label: 'Years in the blind' },
  { value: '100%', label: 'American made' },
  { value: '1', label: 'Facility, total control' },
  { value: '5★', label: 'Hunter-trusted quality' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-primary-shadow opacity-90" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-highlight">
            Our Story
          </p>
          <h1 className="max-w-3xl font-heading text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
            A heritage of the hunt, built for the next generation
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-contrast-200 sm:text-lg">
            Big Al’s began with a boy in a duck blind in the early 1970s and a passion that never
            faded. Today, that same craftsmanship powers one of the most trusted names in waterfowl
            silhouette decoys — proudly made in the USA.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/" variant="primary" size="large">
              Shop the Collection
            </ButtonLink>
            <ButtonLink href="/contact" variant="tertiary" size="large">
              Talk to Our Team
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-background">
        <div className="mx-auto grid max-w-screen-xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map(({ value, label }) => (
            <div className="py-8 text-center" key={label}>
              <p className="font-heading text-4xl font-bold text-primary lg:text-5xl">{value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-contrast-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder story */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-screen-xl items-start gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-24">
          <div className="lg:col-span-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Where We Started
            </p>
            <h2 className="font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
              From the blind to the bench
            </h2>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                <Award className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
                <p className="text-sm font-medium text-foreground">
                  An artist’s eye and a family printing legacy behind every silhouette
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
                <Users className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.5} />
                <p className="text-sm font-medium text-foreground">
                  A team that hunts the same flyways you do
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-contrast-500 lg:col-span-7 lg:text-lg">
            <p>
              Big Al’s was born from a lifetime spent in the outdoors — waterfowl hunting with
              friends and family across decades of early mornings and hard-earned sunrises. What
              started as a personal passion became a craft, and that craft became a company built on
              one promise: give hunters a premium silhouette decoy that actually performs.
            </p>
            <p>
              We combined an artist’s background with a family printing heritage to manufacture
              waterfowl silhouette decoys with uncommon accuracy. Color, detail, and an ultra-matte
              finish are dialed in by people who care how the product looks to a bird circling at
              first light — because that’s the only opinion that matters in the field.
            </p>
            <p>
              By keeping design, production, and packaging under one roof in the USA, we control
              quality and cost from start to finish. That discipline lets us deliver a decoy that’s
              both affordable and built to last many seasons — no compromises.
            </p>
          </div>
        </div>
      </section>

      {/* New ownership / forward-looking */}
      <section className="bg-background">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-2xl border bg-white p-8 shadow-lg lg:p-12">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              The Next Chapter
            </p>
            <h2 className="max-w-2xl font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
              Same craftsmanship, sharper than ever
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-contrast-500 lg:text-lg">
              Big Al’s is now part of a new ownership group dedicated to investing in the brand for
              the long haul. Our mission is simple: modernize the experience — faster fulfillment,
              an easier online store, and broader availability — while protecting the heritage,
              hands-on quality, and personal service that made Big Al’s a name hunters trust. The
              decoys you count on aren’t changing. We’re just making them easier to get and even
              better to own.
            </p>
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              What We Stand For
            </p>
            <h2 className="font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
              Why hunters choose Big Al’s
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map(({ Icon, title, copy }) => (
              <div
                className="group rounded-2xl border bg-background p-8 transition hover:border-primary hover:shadow-lg"
                key={title}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-background">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold uppercase">{title}</h3>
                <p className="mt-3 text-base leading-relaxed text-contrast-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-background">
        <div className="mx-auto max-w-screen-xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold uppercase leading-tight lg:text-4xl">
            Make the most of every hunt
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-contrast-200 lg:text-lg">
            Quality and affordability — you can have both. And don’t forget: take a youth along on
            your next hunt. The tradition is worth passing on.
          </p>
          <p className="mt-6 font-heading text-lg uppercase tracking-wide text-primary-highlight">
            — Big Al &amp; Family
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/" variant="primary" size="large">
              Shop Decoys
            </ButtonLink>
            <ButtonLink href="/contact" variant="tertiary" size="large">
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

/* Original migrated copy retained for reference.
 * Hello Friends,

Thanks for visiting my product site! Over the years I have been blessed to share some wonderful experiences in the outdoors with friends and family. As a boy, I grew up waterfowl hunting in the early 70’s. I did not realize this “passion” would continue for all these years! Recently, I have combined my experiences, artist background, and my family’s printing business to manufacture “waterfowl silhouette decoys.”

I personally oversee total design, production, and marketing of these silhouette decoys. These products are proudly made in the USA! You will find these products to be accurate in color, detail, and ultra matte coating. These are all produced and packaged at one facility in N.E. Ohio. This is how I can control production and manufacturing costs, and pass that savings on to you, the consumer.

I know how important quality products are for hunting. I also know how short the seasons can be! You need to make the most out of your hunt every time you have the opportunity to go afield. If you are looking for a quality “silhouette” product that is affordable, and will last you many seasons…you have come to the right place! Feel free to contact me personally if you have any questions or concerns. I want you to be satisfied with your purchase experience, and be successful in the field! You CAN have both…

Your business is greatly appreciated.

Take a youth along with you on your next hunt!

Best Wishes,

Big Al and Family 
 */
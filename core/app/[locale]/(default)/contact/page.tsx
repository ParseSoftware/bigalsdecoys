import { Clock, Globe2, Headphones, MapPin, Phone, Truck } from 'lucide-react';
import { type Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DynamicForm } from '@/vibes/soul/form/dynamic-form';
import type { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { getRecaptchaSiteKey } from '~/lib/recaptcha';

import HeroImage from '../_images/Brant Lifestyle/656007067_18154288486450860_3908759907720317253_n.jpg';
import { submitContactForm } from '../webpages/[id]/contact/_actions/submit-contact-form';

import { getContactPageData } from './page-data';

export const metadata: Metadata = {
  title: 'Contact Big Al’s',
  description:
    'Reach the Big Al’s team for order support, product questions, wholesale, and overseas inquiries. Retail orders are placed through the online store.',
};

const SUPPORT_EMAIL = 'info@bigalsdecoys.com';
const SUPPORT_PHONE_DISPLAY = '605-956-4818';
const SUPPORT_PHONE_HREF = 'tel:+16059564818';

const CONTACT_PATH = '/contact';

const fieldMapping = {
  fullname: 'fullName',
  companyname: 'companyName',
  phone: 'phone',
  orderno: 'orderNo',
  rma: 'rma',
} as const;

type ContactField = keyof typeof fieldMapping;

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

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string }>;
}

function toGroupsOfTwo(fields: Field[]) {
  return fields.reduce<Array<FieldGroup<Field>>>((acc, _, i) => {
    if (i % 2 === 0) {
      acc.push(fields.slice(i, i + 2));
    }

    return acc;
  }, []);
}

function buildContactFields(
  entityId: number,
  contactFields: string[],
  t: Awaited<ReturnType<typeof getTranslations<'WebPages.ContactUs.Form'>>>,
): Array<Field | FieldGroup<Field>> {
  const emailField: Field = {
    id: 'email',
    name: 'email',
    label: `${t('email')} *`,
    type: 'email',
    required: true,
  };

  const commentsField: Field = {
    id: 'comments',
    name: 'comments',
    label: `${t('comments')} *`,
    type: 'textarea',
    required: true,
  };

  const optionalFields = contactFields
    .filter((field): field is ContactField => Object.hasOwn(fieldMapping, field))
    .map<Field>((field) => ({
      id: field,
      name: field,
      label: t(fieldMapping[field]),
      type: 'text',
      required: false,
    }));

  const pageIdField: Field = {
    id: 'pageId',
    name: 'pageId',
    type: 'hidden',
    label: 'Page ID',
    defaultValue: String(entityId),
  };

  const pagePathField: Field = {
    id: 'pagePath',
    name: 'pagePath',
    type: 'hidden',
    label: 'Page Path',
    defaultValue: CONTACT_PATH,
  };

  return [
    ...toGroupsOfTwo([emailField, ...optionalFields]),
    commentsField,
    pageIdField,
    pagePathField,
  ];
}

function PhoneSupportCallout() {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Phone className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div>
          <p className="font-heading text-base font-bold uppercase text-foreground">
            Need immediate assistance?
          </p>
          <p className="mt-1 text-sm text-contrast-500">
            Call{' '}
            <a className="font-semibold text-primary hover:underline" href={SUPPORT_PHONE_HREF}>
              {SUPPORT_PHONE_DISPLAY}
            </a>{' '}
            for existing-order support, wholesale, or overseas inquiries. Individual retail orders
            must be placed through the online store.
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { success } = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations('WebPages.ContactUs.Form');
  const [contactPage, recaptchaSiteKey] = await Promise.all([
    getContactPageData(CONTACT_PATH),
    getRecaptchaSiteKey(),
  ]);

  const isSuccess = success === 'true';

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="absolute inset-0">
          <Image
            alt=""
            className="object-cover object-center"
            fill
            placeholder="blur"
            preload
            sizes="100vw"
            src={HeroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-highlight">
            We’re Here to Help
          </p>
          <h1 className="max-w-3xl font-heading text-4xl font-bold uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
            Support, Wholesale &amp; Overseas Orders
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-contrast-200 sm:text-lg">
            Need help with an existing order, have a product question, or want to talk wholesale or
            international shipping? Send us a message below. Standard retail orders are placed
            through the online store.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {isSuccess ? (
            <div className="mx-auto max-w-2xl rounded-2xl border bg-background p-8 text-center">
              <h2 className="font-heading text-2xl font-bold uppercase">Message sent</h2>
              <p className="mt-3 text-contrast-500">{t('success')}</p>
              <div className="mt-6 flex justify-center">
                <ButtonLink href="/" size="medium" variant="primary">
                  {t('successCta')}
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Form */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-contrast-500">
                  <p>
                    <span className="font-semibold text-foreground">Placing a retail order?</span>{' '}
                    Please order directly through the online store for the fastest service. Use this
                    form for order support, product questions, wholesale, and overseas inquiries.
                  </p>
                </div>

                <h2 className="mt-10 font-heading text-2xl font-bold uppercase">
                  Send us a message
                </h2>

                {contactPage ? (
                  <div className="mt-6">
                    <DynamicForm
                      action={submitContactForm}
                      fields={buildContactFields(
                        contactPage.entityId,
                        contactPage.contactFields,
                        t,
                      )}
                      recaptchaSiteKey={recaptchaSiteKey}
                      submitLabel={t('cta')}
                    />
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border bg-background p-8">
                    <p className="text-contrast-500">
                      Prefer email? Reach us anytime at{' '}
                      <a
                        className="font-semibold text-primary hover:underline"
                        href={`mailto:${SUPPORT_EMAIL}`}
                      >
                        {SUPPORT_EMAIL}
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>

              {/* Supporting info */}
              <aside className="lg:col-span-5">
                <div className="space-y-6 lg:sticky lg:top-24">
                  <PhoneSupportCallout />

                  {/* Hours */}
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" strokeWidth={1.5} />
                      <h2 className="font-heading text-lg font-bold uppercase">
                        Hours of Operation
                      </h2>
                    </div>
                    <dl className="mt-4 divide-y">
                      {hours.map(({ day, time }) => (
                        <div className="flex items-center justify-between py-3" key={day}>
                          <dt className="text-sm font-medium text-foreground">{day}</dt>
                          <dd className="text-sm text-contrast-500">{time}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-background p-3 text-xs text-contrast-500">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                      <span>All times listed are Central Standard Time (CST).</span>
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                      Looking for Something Specific?
                    </p>
                    <div className="space-y-2">
                      {quickLinks.map(({ Icon, title, copy, href }) => (
                        <Link
                          className="group flex items-center gap-4 rounded-xl border border-transparent px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                          href={href}
                          key={title}
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-background">
                            <Icon className="h-5 w-5" strokeWidth={1.5} />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-heading text-sm font-bold uppercase text-foreground">
                              {title}
                            </span>
                            <span className="mt-0.5 text-xs text-contrast-500">{copy}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

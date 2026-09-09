import { Award, Camera, MapPin, ShieldCheck } from 'lucide-react';
import { type Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DynamicForm } from '@/vibes/soul/form/dynamic-form';
import type { Field, FieldGroup } from '@/vibes/soul/form/dynamic-form/schema';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Image } from '~/components/image';
import { getRecaptchaSiteKey } from '~/lib/recaptcha';

import HeroImage from '../_images/Canada Lifestyle/instagram_DS2e6LSDWqb.jpg';
import { submitContactForm } from '../webpages/[id]/contact/_actions/submit-contact-form';

import { getContactPageData } from '../contact/page-data';

export const metadata: Metadata = {
  title: 'Big Al’s Pro Staff Program',
  description:
    'Apply to represent Big Al’s Decoys in the field and share practical waterfowl hunting content with our community.',
};

const PROGRAM_PATH = '/prostaff-program';

const fieldMapping = {
  fullname: 'fullName',
  companyname: 'companyName',
  phone: 'phone',
  orderno: 'orderNo',
  rma: 'rma',
} as const;

type ContactField = keyof typeof fieldMapping;

const programBenefits = [
  {
    Icon: Award,
    title: 'Early Access',
    copy: 'Be among the first to hear about new decoy releases and field-ready updates.',
  },
  {
    Icon: Camera,
    title: 'Share the Hunt',
    copy: 'Create honest photos, stories, and field reports that help other hunters build better spreads.',
  },
  {
    Icon: ShieldCheck,
    title: 'Represent the Standard',
    copy: 'Join a team that values practical knowledge, respect for the resource, and gear that earns its place in the field.',
  },
];

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string }>;
}

function toGroupsOfTwo(fields: Field[]) {
  return fields.reduce<Array<FieldGroup<Field>>>((groups, _, index) => {
    if (index % 2 === 0) {
      groups.push(fields.slice(index, index + 2));
    }

    return groups;
  }, []);
}

function buildApplicationFields(
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
    label:
      'Tell us about your hunting experience, where you hunt, and how you would represent Big Al’s. *',
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

  return [
    ...toGroupsOfTwo([emailField, ...optionalFields]),
    commentsField,
    {
      id: 'pageId',
      name: 'pageId',
      type: 'hidden',
      label: 'Page ID',
      defaultValue: String(entityId),
    },
    {
      id: 'pagePath',
      name: 'pagePath',
      type: 'hidden',
      label: 'Page Path',
      defaultValue: PROGRAM_PATH,
    },
  ];
}

export default async function ProStaffProgramPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { success } = await searchParams;

  setRequestLocale(locale);

  const t = await getTranslations('WebPages.ContactUs.Form');
  const [contactPage, recaptchaSiteKey] = await Promise.all([
    getContactPageData(PROGRAM_PATH),
    getRecaptchaSiteKey(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-background">
        <div className="relative min-h-[500px] w-full" style={{ height: '70vh' }}>
          <Image
            alt="Waterfowl hunters setting a decoy spread in the field"
            className="object-cover opacity-70"
            fill
            placeholder="blur"
            preload
            sizes="100vw"
            src={HeroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-screen-xl px-4 pb-14 sm:px-6 lg:px-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                Big Al’s Pro Staff
              </p>
              <h1 className="max-w-4xl font-display uppercase leading-[0.87] text-white [font-size:clamp(2.8rem,8vw,7rem)]">
                Built in the Field.
                <br />
                Shared with the Flock.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-screen-xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              The Program
            </p>
            <h2 className="mt-5 font-display uppercase leading-[0.9] text-foreground [font-size:clamp(2rem,4vw,3.5rem)]">
              Real hunters.
              <br />
              Real spreads.
            </h2>
            <p className="mt-7 text-base leading-relaxed text-contrast-500">
              Big Al’s Pro Staff is for waterfowl hunters who put time in before sunrise and want to
              share what they learn. We are looking for people who know their flyways, respect the
              hunt, and can show how dependable decoys perform where it counts.
            </p>
            <p className="mt-5 text-base leading-relaxed text-contrast-500">
              This is not about follower counts alone. It is about honest field experience,
              practical content, and helping more hunters get better results from their spreads.
            </p>
            <div className="mt-10 divide-y border-y border-contrast-100">
              {programBenefits.map(({ Icon, title, copy }) => (
                <div className="flex gap-4 py-5" key={title}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold uppercase text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-contrast-500">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-start gap-3 border-l-2 border-primary pl-4 text-sm leading-relaxed text-contrast-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              <p>
                Applications are reviewed by the Big Al’s team. We will reach out when there is a
                fit.
              </p>
            </div>
          </div>

          <div className="border border-contrast-100 bg-background p-6 sm:p-9">
            {success === 'true' ? (
              <div className="py-12 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                  Application Received
                </p>
                <h2 className="mt-5 font-display text-3xl uppercase text-foreground">
                  Thanks for putting your name in the spread.
                </h2>
                <p className="mx-auto mt-5 max-w-md text-contrast-500">{t('success')}</p>
                <div className="mt-8">
                  <ButtonLink href="/shop" size="medium" variant="primary">
                    {t('successCta')}
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                  Apply Now
                </p>
                <h2 className="mt-4 font-display text-3xl uppercase text-foreground">
                  Join the Pro Staff.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-contrast-500">
                  Tell us what you hunt, where you spend your season, and how you show up for the
                  waterfowl community.
                </p>
                {contactPage ? (
                  <div className="mt-8">
                    <DynamicForm
                      action={submitContactForm}
                      fields={buildApplicationFields(
                        contactPage.entityId,
                        contactPage.contactFields,
                        t,
                      )}
                      recaptchaSiteKey={recaptchaSiteKey}
                      submitLabel="Submit Application"
                    />
                  </div>
                ) : (
                  <p className="mt-8 border-l-2 border-primary pl-4 text-sm text-contrast-500">
                    The application form is being prepared. Please check back shortly.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

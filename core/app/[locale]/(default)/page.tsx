import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { FeaturedProductCarousel } from '@/vibes/soul/sections/featured-product-carousel';
import { getSessionCustomerAccessToken } from '~/auth';
import { Subscribe } from '~/components/subscribe';
import { TrustBadges } from '~/components/trust-badges';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { getMetadataAlternates } from '~/lib/seo/canonical';

import { BrandStory } from './_components/brand-story';
import { CategoryGrid } from './_components/category-grid';
import { Hero } from './_components/hero';
import { Reviews } from './_components/reviews';
import { getPageData } from './page-data';
import BrandStoryImage from './_images/Canada Lifestyle/instagram_DM7rh5pORvi.jpg';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: await getMetadataAlternates({ path: '/', locale }),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const format = await getFormatter();

  const streamablePageData = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const currencyCode = await getPreferredCurrencyCode();

    return getPageData(currencyCode, customerAccessToken);
  });

  const streamableNewestProducts = Streamable.from(async () => {
    const data = await streamablePageData;

    const newestProducts = removeEdgesAndNodes(data.site.featuredProducts);

    const { defaultOutOfStockMessage, showOutOfStockMessage, showBackorderMessage } =
      data.site.settings?.inventory ?? {};

    return productCardTransformer(
      newestProducts,
      format,
      showOutOfStockMessage ? defaultOutOfStockMessage : undefined,
      showBackorderMessage,
    );
  });

  const streamableShowNewsletterSignup = Streamable.from(async () => {
    const data = await streamablePageData;

    const { showNewsletterSignup } = data.site.settings?.newsletter ?? {};

    return showNewsletterSignup;
  });

  return (
    <>
      <Hero />

      <FeaturedProductCarousel
        cta={{ label: t('NewestProducts.cta'), href: '/shop/?sort=newest' }}
        description={t('NewestProducts.description')}
        emptyStateSubtitle={t('NewestProducts.emptyStateSubtitle')}
        emptyStateTitle={t('NewestProducts.emptyStateTitle')}
        nextLabel={t('NewestProducts.nextProducts')}
        previousLabel={t('NewestProducts.previousProducts')}
        products={streamableNewestProducts}
        title={t('NewestProducts.title')}
      />

      <CategoryGrid />

      <TrustBadges />

      <BrandStory
        image={{
          src: BrandStoryImage.src,
          alt: 'Our Story',
          blurDataUrl: BrandStoryImage.blurDataURL,
        }}
      />

      {/* <Reviews /> */}

      <Stream fallback={null} value={streamableShowNewsletterSignup}>
        {(showNewsletterSignup) => showNewsletterSignup && <Subscribe />}
      </Stream>
    </>
  );
}

import { getTranslations } from 'next-intl/server';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

import { getCategoryTree } from '../../page-data';

export async function CategoryGrid() {
  const t = await getTranslations('Home.CategoryGrid');
  const categoryTree = await getCategoryTree();
  const categories = categoryTree.slice(0, 4);

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-screen-2xl px-4 py-14 @container sm:px-6 lg:px-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {t('eyebrow')}
          </p>
          <h2 className="font-heading text-3xl font-bold uppercase leading-none @2xl:text-4xl">
            {t('title')}
          </h2>
        </div>
        <Link
          className="hidden border-b-2 border-primary pb-0.5 font-heading text-sm font-semibold uppercase tracking-wider hover:text-primary sm:inline-block"
          href="/shop-all"
        >
          {t('cta')}
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            className="group relative block overflow-hidden rounded-sm bg-contrast-100"
            href={category.path}
            key={category.path}
          >
            <div className="aspect-[4/5] overflow-hidden">
              {category.image ? (
                <Image
                  alt={category.image.altText}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  height={640}
                  src={category.image.urlTemplate}
                  width={512}
                />
              ) : (
                <div className="h-full w-full bg-ink/10" />
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5">
              <h3 className="font-heading text-xl font-bold uppercase leading-tight text-white @xl:text-2xl">
                {category.name}
              </h3>
              <span className="mt-2 inline-block border-b-2 border-primary pb-0.5 font-heading text-xs font-semibold uppercase tracking-wider text-white">
                {t('viewAll')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

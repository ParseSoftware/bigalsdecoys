import * as Skeleton from '@/vibes/soul/primitives/skeleton';

const ROW_PLACEHOLDERS = Array.from({ length: 8 });

export function ByosBuilderSkeleton() {
  return (
    <Skeleton.Root pending>
      <section className="pb-28 lg:pb-10">
        <header className="bg-foreground text-white">
          <div className="mx-auto grid min-h-56 max-w-screen-2xl gap-8 px-4 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end lg:px-8 lg:py-11">
            <div className="space-y-3">
              <Skeleton.Box className="h-3 w-52 bg-white/20" />
              <Skeleton.Box className="sm:h-15 h-12 w-full max-w-xl bg-white/20" />
              <Skeleton.Box className="h-4 w-full max-w-2xl bg-white/15" />
              <Skeleton.Box className="h-4 w-2/3 max-w-xl bg-white/15" />
            </div>
            <div className="border-l-2 border-primary pl-4">
              <div className="flex justify-between gap-4">
                <Skeleton.Box className="h-4 w-36 bg-white/20" />
                <Skeleton.Box className="h-4 w-16 bg-white/20" />
              </div>
              <Skeleton.Box className="mt-3 h-1.5 w-full bg-white/20" />
              <Skeleton.Box className="mt-3 h-4 w-4/5 bg-white/15" />
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start lg:px-8">
          <div>
            <header className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-4">
              <div className="space-y-2">
                <Skeleton.Box className="h-3 w-28" />
                <Skeleton.Box className="h-8 w-64" />
              </div>
              <Skeleton.Box className="h-4 w-16" />
            </header>

            <div className="mt-8">
              <Skeleton.Box className="h-5 w-32" />
              <div className="mt-2 divide-y divide-contrast-200">
                {ROW_PLACEHOLDERS.map((_, index) => (
                  <div
                    className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-x-5"
                    key={index}
                  >
                    <Skeleton.Box className="row-span-2 aspect-square" />
                    <div className="space-y-3 pt-1">
                      <Skeleton.Box className="h-5 w-3/5" />
                      <Skeleton.Box className="h-4 w-28" />
                    </div>
                    <Skeleton.Box className="hidden h-5 w-14 sm:block" />
                    <div className="col-span-2 mt-3 flex justify-end sm:col-span-1 sm:col-start-2">
                      <Skeleton.Box className="w-34 h-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-foreground bg-white p-4 shadow-[0_-8px_24px_rgb(0_0_0_/_0.12)] lg:sticky lg:top-6 lg:border lg:border-contrast-200 lg:p-5 lg:shadow-none">
            <div className="hidden space-y-5 lg:block">
              <div className="flex items-center justify-between border-b border-contrast-200 pb-4">
                <Skeleton.Box className="h-7 w-32" />
                <Skeleton.Box className="h-4 w-12" />
              </div>
              <Skeleton.Box className="h-14 w-full" />
              <Skeleton.Box className="h-14 w-full" />
            </div>
            <div className="lg:mt-5 lg:border-t-2 lg:border-foreground lg:pt-4">
              <div className="hidden justify-between lg:flex">
                <Skeleton.Box className="h-4 w-28" />
                <Skeleton.Box className="h-4 w-16" />
              </div>
              <div className="mt-4 flex justify-between">
                <Skeleton.Box className="h-6 w-28" />
                <Skeleton.Box className="h-6 w-20" />
              </div>
              <Skeleton.Box className="mt-3 h-12 w-full bg-primary/40 lg:mt-5" />
            </div>
          </aside>
        </div>
      </section>
    </Skeleton.Root>
  );
}

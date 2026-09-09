import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { TAGS } from '~/client/tags';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line valid-jsdoc
/**
 * On-demand purge for the cached BigCommerce promotions map used to render bulk
 * pricing callouts (see `~/lib/promotions`). The promotions fetch is stored in
 * the Next.js Data Cache with a time-based `revalidate` fallback, so without
 * this endpoint a toggled promotion can linger on the storefront until the
 * window elapses.
 *
 * Trigger it from a BigCommerce webhook (e.g. `store/promotion/*`) or manually:
 *
 *   curl -X POST https://<host>/api/revalidate/promotions \
 *     -H "Authorization: Bearer $PROMOTIONS_REVALIDATE_SECRET"
 */
export function POST(request: NextRequest) {
  const secret = process.env.PROMOTIONS_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: 'PROMOTIONS_REVALIDATE_SECRET is not configured.' },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ revalidated: false, message: 'Unauthorized.' }, { status: 401 });
  }

  revalidateTag(TAGS.promotions, { expire: 0 });

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

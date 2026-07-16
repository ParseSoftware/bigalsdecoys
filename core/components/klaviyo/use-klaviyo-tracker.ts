/* eslint-disable valid-jsdoc */
/* eslint-disable no-underscore-dangle */
'use client';

import { useConsentManager } from '@c15t/nextjs/client';
import { useCallback } from 'react';

type KlaviyoEvent = [string, ...unknown[]];

/**
 * Returns a guarded `track` function for pushing events to Klaviyo's `_learnq`
 * queue. Events are only sent when the visitor has granted marketing consent
 * (when cookie consent is disabled at the store level, c15t auto-grants all
 * categories, so tracking fires freely — matching the GA integration).
 */
export function useKlaviyoTracker() {
  const { hasConsentFor } = useConsentManager();

  return useCallback(
    (...events: KlaviyoEvent[]) => {
      if (!hasConsentFor('marketing')) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (typeof window === 'undefined' || !window._learnq) {
        return;
      }

      events.forEach((event) => window._learnq.push(event));
    },
    [hasConsentFor],
  );
}

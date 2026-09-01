/**
 * Big Al's Decoys brand configuration.
 *
 * Central place for hardcoded marketing constants and copy used across the
 * storefront design updates (ticker tape, trust indicators, free-shipping
 * progress, bulk-pricing callouts, etc.). Keeping these here means non-i18n
 * brand values live in one file rather than being scattered through components.
 */

/** Order subtotal (in the store's default currency) that unlocks free shipping. */
export const FREE_SHIPPING_THRESHOLD = 199;

/** Primary contact phone number, used in bulk-pricing CTAs and the footer. */
export const BRAND_PHONE = '406-609-2452';
export const BRAND_PHONE_HREF = 'tel:+14066092452';

/**
 * Trust badge definitions reused by the shared TrustBadges component across the
 * homepage, PDP, and collection pages. `icon` maps to a lucide-react icon name
 * resolved by the consuming component.
 */
export const TRUST_BADGES = [
  { icon: 'Shield', title: 'Made in USA', subtitle: 'Printed & assembled in the USA' },
  { icon: 'Truck', title: 'Free Shipping $199+', subtitle: 'Ships within 2 business days' },
  { icon: 'Award', title: 'Built to Last', subtitle: 'Heavy-duty ultra-durable material' },
  { icon: 'Tag', title: 'Bulk Pricing Available', subtitle: 'Contact us for custom quotes' },
] as const;

export type TrustBadge = (typeof TRUST_BADGES)[number];

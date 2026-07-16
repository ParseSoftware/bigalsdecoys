import { routing } from '~/i18n/routing';
import messages from '~/messages/en.json';

declare global {
  interface Window {
    _learnq: Array<[string, ...unknown[]]>;
  }
}

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

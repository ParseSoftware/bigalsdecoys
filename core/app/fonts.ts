import { Anton, Inter, Oswald, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-family-body',
});

const oswald = Oswald({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-family-heading',
});

// Big Al's brand display font — used for large hero/price/marquee headlines.
const anton = Anton({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-family-display',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-family-mono',
});

export const fonts = [inter, oswald, anton, robotoMono];

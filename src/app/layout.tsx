import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import { SvgDefs } from '@/components/art/SvgDefs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EnquiryProvider } from '@/lib/enquiry';
import './globals.css';

const sans = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Gleam Architectural Hardware',
    template: '%s | Gleam Architectural Hardware',
  },
  description:
    'Mortise handles, digital locks, hinges, door closers and cabinet hardware in solid brass and stainless steel. Browse the Gleam catalogue with drawings, dimensions and finishes.',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <SvgDefs />
        <EnquiryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </EnquiryProvider>
      </body>
    </html>
  );
}
